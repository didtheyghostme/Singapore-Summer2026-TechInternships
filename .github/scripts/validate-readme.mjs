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

function isTableRow(line) {
  const t = line.trim();
  return t.startsWith("|") && t.endsWith("|") && t.split("|").length >= 3;
}

function splitCells(line) {
  return line
    .trim()
    .slice(1, -1)
    .split("|")
    .map((c) => c.trim());
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
  // Ensure base ref exists locally
  execSync(`git fetch origin ${baseRef}:${baseRef}`, { stdio: "ignore" });
  return execSync(`git show ${baseRef}:README.md`, { encoding: "utf8" });
}

function cell(cells, idx) {
  return (cells[idx] ?? "").trim();
}

async function main() {
  const baseRef = process.env.BASE_REF || "main";

  const headReadme = await fs.readFile("README.md", "utf8");
  const baseReadme = await getBaseReadmeFromGit(baseRef);

  const base = parseTable(baseReadme);
  const head = parseTable(headReadme);

  const baseDbById = new Map();
  const headDbById = new Map();

  // Index DB rows by job id
  for (const r of base.rows) {
    const id = extractDbJobId(cell(r.cells, 2));
    if (id) baseDbById.set(id, r);
  }
  for (const r of head.rows) {
    const id = extractDbJobId(cell(r.cells, 2));
    if (id) headDbById.set(id, r);
  }

  // Rule: DB rows cannot be ADDED in PR
  for (const [id, r] of headDbById.entries()) {
    if (!baseDbById.has(id)) {
      fail(`DB row added in PR is not allowed (job id ${id}). Only community rows may be added.`);
    }
  }

  // Rule: For DB rows that still exist, Track and Date Added cannot be edited
  for (const [id, headRow] of headDbById.entries()) {
    const baseRow = baseDbById.get(id);
    if (!baseRow) continue;

    const baseTrack = cell(baseRow.cells, 2);
    const headTrack = cell(headRow.cells, 2);
    if (baseTrack !== headTrack) {
      fail(`DB row (job id ${id}) Track column was edited. Track edits are not allowed.`);
    }

    const baseDate = cell(baseRow.cells, 4);
    const headDate = cell(headRow.cells, 4);
    if (baseDate !== headDate) {
      fail(`DB row (job id ${id}) Date Added column was edited. Date Added edits are not allowed.`);
    }


  }

  // Community row rules (after-state only, because edits/removes/adds are all allowed)
  for (const r of head.rows) {
    const track = cell(r.cells, 2);
    const isDb = extractDbJobId(track) !== null;
    if (isDb) continue;

    if (r.cells.length !== 5) fail(`Community row must have exactly 5 columns: ${r.line}`);

    const company = cell(r.cells, 0);
    const role = cell(r.cells, 1);
    const application = cell(r.cells, 3);
    const dateAdded = cell(r.cells, 4);

    if (!company) fail(`Community row: Company cannot be empty. Row: ${r.line}`);
    if (!role) fail(`Community row: Role cannot be empty. Row: ${r.line}`);

    // Track: must be exactly "-"
    if (track !== "-") fail(`Community row Track must be "-" (exact). Found: "${track}". Row: ${r.line}`);

    // Company URL mandatory: must be markdown link [Name](https://...)
    const companyLink = parseCompanyMarkdownLink(company);
    if (!companyLink) fail(`Community row Company must be a markdown link: [Name](https://...). Found: "${company}".`);
    if (!isPlainHttpUrl(companyLink.url)) fail(`Community row Company URL must be http(s). Found: "${companyLink.url}".`);

    // Application required and must be plain URL (no HTML/buttons)
    if (!application) fail(`Community row Application is required (must be a URL). Row: ${r.line}`);
    if (!isPlainHttpUrl(application)) fail(`Community row Application must be a plain http(s) URL. Found: "${application}".`);
    if (application.includes("<") || application.includes(">")) fail(`Community row Application must not contain HTML. Paste a URL only.`);

    // Date Added: must be ISO
    if (!isValidIsoDate(dateAdded)) fail(`Community row Date Added must be a real YYYY-MM-DD date. Found: "${dateAdded}".`);
  }

  console.log("README jobs table validation passed.");
}

main().catch((e) => {
  fail(e?.message || String(e));
});