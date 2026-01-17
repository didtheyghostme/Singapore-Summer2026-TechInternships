import fs from "node:fs/promises";
import { execSync } from "node:child_process";

const JOBS_TABLE_START = "<!-- JOBS_TABLE_START -->";
const JOBS_TABLE_END = "<!-- JOBS_TABLE_END -->";

const EXPECTED_HEADER = ["company", "role", "track", "application", "date added"];

function error(message) {
  console.error(`::error::${message}`);
}

function fail(message) {
  error(message);
  process.exit(1);
}

function failAtRow(row, message) {
  fail(`Row ${row.rowNumberInBlock}: ${message}\n${row.line}`);
}

function isTableRow(line) {
  const t = line.trim();
  // don’t use t.split("|") (breaks on \|)
  return t.startsWith("|") && t.endsWith("|") && t.length >= 2;
}

function isEscapedPipe(s, pipeIndex) {
  // A pipe is escaped when it has an odd number of backslashes immediately before it.
  let backslashes = 0;
  for (let i = pipeIndex - 1; i >= 0 && s[i] === "\\"; i--) backslashes++;
  return backslashes % 2 === 1; // odd number means the pipe is escaped: \|
}

function splitCells(line) {
  const inner = line.trim().slice(1, -1); // remove the outer pipes

  const cells = [];
  let current = "";

  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i] ?? "";

    if (ch === "|" && !isEscapedPipe(inner, i)) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += ch;
  }

  cells.push(current.trim());
  return cells;
}

function isSeparatorRow(cells) {
  return cells.every((c) => /^:?-+:?$/.test(c) || c === "---");
}

function extractAnchoredBlock(readme) {
  const startIdx = readme.indexOf(JOBS_TABLE_START);
  const endIdx = readme.indexOf(JOBS_TABLE_END);

  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error(`Missing anchors. README must contain ${JOBS_TABLE_START} and ${JOBS_TABLE_END}.`);
  }

  return readme.slice(startIdx + JOBS_TABLE_START.length, endIdx);
}

function parseTable(readme) {
  const block = extractAnchoredBlock(readme);
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const tableLines = lines.filter(isTableRow);
  if (tableLines.length < 2) throw new Error("Jobs table must include a header row and a separator row.");

  const headerCells = splitCells(tableLines[0]).map((c) => c.toLowerCase());
  if (headerCells.length !== EXPECTED_HEADER.length || headerCells.some((c, i) => c !== EXPECTED_HEADER[i])) {
    throw new Error(`Header must be exactly: | Company | Role | Track | Application | Date Added |`);
  }

  const sepCells = splitCells(tableLines[1]);
  if (!isSeparatorRow(sepCells)) throw new Error("Second row must be a markdown separator row like |---|---|:---:|:---:|:---:|");

  const rows = [];
  for (let i = 2; i < tableLines.length; i++) {
    const line = tableLines[i];
    const cells = splitCells(line);
    rows.push({ line, cells, rowNumberInBlock: i + 1 }); // 1-based within anchored block tableLines
  }

  return { rows };
}

function extractDbJobId(trackCell) {
  const m = trackCell.match(/\/job\/([0-9a-fA-F-]{36})/);
  return m?.[1] ?? null;
}

function isPlainHttpUrl(value) {
  return /^https?:\/\/\S+$/i.test(value.trim());
}

function isValidIsoDate(value) {
  const v = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return false;
  return d.toISOString().slice(0, 10) === v;
}

function parseCompanyMarkdownLink(companyCell) {
  // Require: [Name](https://...)
  const m = companyCell.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
  if (!m) return null;
  return { text: m[1], url: m[2] };
}

async function getBaseReadmeFromGit(baseRef) {
  execSync(`git fetch origin ${baseRef}`, { stdio: "ignore" });
  return execSync(`git show origin/${baseRef}:README.md`, { encoding: "utf8" });
}

function cell(cells, idx) {
  return (cells[idx] ?? "").trim();
}

function assertNoDuplicateCommunityRows(rows) {
  const seen = new Set();

  for (const r of rows) {
    const id = extractDbJobId(cell(r.cells, 2));
    if (id) continue; // only community

    const normalized = r.line.replace(/\s+/g, " ").trim();
    if (seen.has(normalized)) failAtRow(r, "Duplicate community row (exact duplicate line).");
    seen.add(normalized);
  }
}

async function main() {
  const baseRef = process.env.BASE_REF || "main";

  const headReadme = await fs.readFile("README.md", "utf8");
  const baseReadme = await getBaseReadmeFromGit(baseRef);

  const base = parseTable(baseReadme);
  const head = parseTable(headReadme);

  // Basic shape checks on PR table
  for (const r of head.rows) {
    if (r.cells.length !== 5) failAtRow(r, "Row must have exactly 5 columns. 'If you used a pipe `|` inside a cell, use `\\|` for text, and `%7C` inside URLs.'");    
    if (!cell(r.cells, 0)) failAtRow(r, "Company cannot be empty.");
    if (!cell(r.cells, 1)) failAtRow(r, "Role cannot be empty.");
  }

  // Prevent exact-duplicate community rows
  assertNoDuplicateCommunityRows(head.rows);

  // Index DB rows on base (and ensure base itself has no duplicate DB ids)
  const baseDbRowById = new Map();
  for (const r of base.rows) {
    const id = extractDbJobId(cell(r.cells, 2));
    if (!id) continue;

    if (baseDbRowById.has(id)) {
      failAtRow(r, `Base README has duplicate DB job id ${id}. Fix base table first.`);
    }

    baseDbRowById.set(id, r);
  }

  // Gather DB rows on PR head: id -> rows[]
  const headDbRowsById = new Map();
  for (const r of head.rows) {
    const id = extractDbJobId(cell(r.cells, 2));
    if (!id) continue;

    const list = headDbRowsById.get(id) ?? [];
    list.push(r);
    headDbRowsById.set(id, list);
  }

  // FIRST: fail fast on any DB-row ADDITIONS / DUPLICATES in the PR
  for (const [id, rowsForId] of headDbRowsById.entries()) {
    if (!baseDbRowById.has(id)) {
      failAtRow(
        rowsForId[0],
        `Invalid new row — only community rows may be added in PRs. Track must be "-" (no /job/<uuid> links). Detected job id: ${id}`,
      );
    }

    if (rowsForId.length > 1) {
      // show the 2nd occurrence — it’s most likely the “newly added” copy
      failAtRow(
        rowsForId[1],
        `DB rows cannot be duplicated/added in PRs. Job id ${id} appears multiple times. If you meant to add a community row, Track must be "-" (no /job/<uuid> links).`,
      );
    }
  }

  // Now that we know PR has no new/duplicate DB rows, build a simple head DB map
  const headDbRowById = new Map();
  for (const [id, rowsForId] of headDbRowsById.entries()) {
    headDbRowById.set(id, rowsForId[0]);
  }

  // DB row rules: existing DB rows may be edited/removed, but Track + Date Added immutable
  for (const [id, headRow] of headDbRowById.entries()) {
    const baseRow = baseDbRowById.get(id);
    if (!baseRow) continue;

    const baseTrack = cell(baseRow.cells, 2);
    const headTrack = cell(headRow.cells, 2);
    if (baseTrack !== headTrack) {
      failAtRow(headRow, `DB row (job id ${id}) Track column was edited. Track edits are not allowed.`);
    }

    const baseDate = cell(baseRow.cells, 4);
    const headDate = cell(headRow.cells, 4);
    if (baseDate !== headDate) {
      failAtRow(headRow, `DB row (job id ${id}) Date Added column was edited. Date Added edits are not allowed.`);
    }
  }

  // Community row rules: add/edit/remove allowed, but must be valid
  for (const r of head.rows) {
    const track = cell(r.cells, 2);
    const isDb = extractDbJobId(track) !== null;
    if (isDb) continue;

    const company = cell(r.cells, 0);
    const role = cell(r.cells, 1);
    const application = cell(r.cells, 3);
    const dateAdded = cell(r.cells, 4);

    if (!company) failAtRow(r, "Community row: Company cannot be empty.");
    if (!role) failAtRow(r, "Community row: Role cannot be empty.");

    // Track: must be exactly "-"
    if (track !== "-") failAtRow(r, `Community row Track must be "-" (exact). Found: "${track}".`);

    // Company URL mandatory
    const companyLink = parseCompanyMarkdownLink(company);
    if (!companyLink) failAtRow(r, `Community row Company must be a markdown link: [Name](https://...). Found: "${company}".`);
    if (!isPlainHttpUrl(companyLink.url)) failAtRow(r, `Community row Company URL must be http(s). Found: "${companyLink.url}".`);
    if (companyLink.url.includes("|")) failAtRow(r, 'Community row Company URL must not contain `|` (don’t use `\\|` in URLs). Use `%7C` instead.');

    // Application required and must be plain URL
    if (!application) failAtRow(r, "Community row Application is required (must be a URL).");
    if (!isPlainHttpUrl(application)) failAtRow(r, `Community row Application must be a plain http(s) URL. Found: "${application}".`);
    if (application.includes("<") || application.includes(">")) failAtRow(r, "Community row Application must not contain HTML. Paste a URL only.");
    if (application.includes("|")) failAtRow(r, 'Community row Application URL must not contain `|` (don’t use `\\|` in URLs). Use `%7C` instead.');

    // Date Added: must be ISO
    if (!isValidIsoDate(dateAdded)) failAtRow(r, `Community row Date Added must be a real YYYY-MM-DD date. Found: "${dateAdded}".`);
  }

  console.log("README jobs table validation passed.");
}

main().catch((e) => {
  fail(e?.message || String(e));
});
