import fs from "node:fs/promises";

const JOBS_TABLE_START = "<!-- JOBS_TABLE_START -->";
const JOBS_TABLE_END = "<!-- JOBS_TABLE_END -->";

function fail(message) {
  console.error(`::error::${message}`);
  process.exit(1);
}

function splitCells(line) {
  return line
    .trim()
    .slice(1, -1)
    .split("|")
    .map((c) => c.trim());
}

function isTableRow(line) {
  const t = line.trim();
  return t.startsWith("|") && t.endsWith("|") && t.split("|").length >= 3;
}

function isSeparatorRow(cells) {
  return cells.every((c) => /^:?-+:?$/.test(c) || c === "---");
}

function isUuidInTrackCell(trackCell) {
  return /\/job\/[0-9a-fA-F-]{36}/.test(trackCell);
}

function isPlainHttpUrl(value) {
  return /^https?:\/\/\S+$/i.test(value.trim());
}

function isValidIsoDate(value) {
  const v = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return false;
  // ensure it didn't overflow (e.g. 2026-02-31)
  return d.toISOString().slice(0, 10) === v;
}

async function main() {
  const readme = await fs.readFile("README.md", "utf8");

  const startIdx = readme.indexOf(JOBS_TABLE_START);
  const endIdx = readme.indexOf(JOBS_TABLE_END);

  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    fail(`Missing anchors. README must contain ${JOBS_TABLE_START} and ${JOBS_TABLE_END}.`);
  }

  const block = readme.slice(startIdx + JOBS_TABLE_START.length, endIdx);
  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

  const tableLines = lines.filter(isTableRow);
  if (tableLines.length < 2) fail("Jobs table must include a header row and a separator row.");

  const headerCells = splitCells(tableLines[0]).map((c) => c.toLowerCase());
  const expected = ["company", "role", "track", "application", "date added"];
  if (headerCells.length !== expected.length || headerCells.some((c, i) => c !== expected[i])) {
    fail(`Header must be exactly: | Company | Role | Track | Application | Date Added |`);
  }

  const sepCells = splitCells(tableLines[1]);
  if (!isSeparatorRow(sepCells)) fail("Second row must be a markdown separator row like |---|---|:---:|:---:|:---:|");

  for (let i = 2; i < tableLines.length; i++) {
    const line = tableLines[i];
    const cells = splitCells(line);

    if (cells.length !== 5) fail(`Row ${i + 1} must have 5 columns: ${line}`);

    const [company, role, track, application, dateAdded] = cells;

    if (!company.trim()) fail(`Row ${i + 1}: Company cannot be empty.`);
    if (!role.trim()) fail(`Row ${i + 1}: Role cannot be empty.`);

    const isDbRow = isUuidInTrackCell(track);

    if (!isDbRow) {
      // Community row rules (strict)
      if (track.trim() !== "-") fail(`Row ${i + 1}: Community Track must be '-' (no HTML/buttons).`);

      const app = application.trim();
      if (app !== "-" && !isPlainHttpUrl(app)) fail(`Row ${i + 1}: Application must be '-' or a plain http(s) URL.`);

      if (application.includes("<") || application.includes(">")) {
        fail(`Row ${i + 1}: Do not paste HTML in Application. Paste a plain URL only.`);
      }

      if (!isValidIsoDate(dateAdded)) fail(`Row ${i + 1}: Date Added must be a real YYYY-MM-DD date.`);
    }
  }

  console.log("README jobs table validation passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});