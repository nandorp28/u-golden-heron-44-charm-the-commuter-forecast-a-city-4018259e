// Charm the Commuter: Forecast a City That Isn't
// Writes the entry — one line of weather forecast, at most 140
// characters, for a city that does not exist — to /output/entry.txt
// (or $MAKEFUN_OUTPUT_DIR/entry.txt when the grader sets it).
// Node 22 standard library only; no network, no dependencies.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Forecast for Mizzlewick: sunny intervals, 19°C, and a 90% chance the train is cancelled — pack patience, it counts as carry-on.";

const MAX_CHARS = 140;

function fail(message) {
  console.error(`entry invalid: ${message}`);
  process.exit(1);
}

// The gate counts characters by code points, not UTF-16 units, so
// measure the same way: spread the string into code points.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > MAX_CHARS) {
  fail(`entry is ${chars.length} characters, must be 1-${MAX_CHARS}`);
}
if (ENTRY !== ENTRY.trim()) {
  fail("entry has leading or trailing whitespace");
}
if (/[\r\n]/.test(ENTRY)) {
  fail("entry must be a single line with no newline");
}
if (/\s{2,}/.test(ENTRY)) {
  fail("entry has a double space; every word must earn its place");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read the file back and confirm it is byte-identical to the entry:
// the grader reads exactly what is on disk, so a silent write failure
// or an added trailing newline must be caught here, not in grading.
const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== ENTRY) {
  fail("read-back mismatch: entry.txt does not match the entry text");
}
console.log(`wrote ${chars.length} characters to ${outPath}`);
