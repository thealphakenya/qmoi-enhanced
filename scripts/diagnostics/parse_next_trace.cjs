#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const TRACE_PATH =
  process.argv[2] || path.join(process.cwd(), ".next", "trace");
const TOP_N = parseInt(process.argv[3], 10) || 20;

function loadTrace(file) {
  if (!fs.existsSync(file)) {
    console.error("Trace file not found:", file);
    process.exitCode = 2;
    return [];
  }
  const txt = fs.readFileSync(file, "utf8");
  const lines = txt.split(/\n+/).filter(Boolean);
  const entries = [];
  for (const ln of lines) {
    try {
      const arr = JSON.parse(ln);
      if (Array.isArray(arr)) entries.push(...arr);
    } catch (err) {
      // ignore unparsable lines
    }
  }
  return entries;
}

function summarize(entries) {
  const byModule = new Map();
  for (const e of entries) {
    const name = (e.tags && e.tags.name) || e.name || "<unknown>";
    const duration = Number(e.duration) || 0;
    const layer = (e.tags && e.tags.layer) || e.layer || "unknown";
    const key = `${name}`;
    const prev = byModule.get(key) || { name, total: 0, count: 0, layer };
    prev.total += duration;
    prev.count += 1;
    byModule.set(key, prev);
  }
  const arr = Array.from(byModule.values());
  arr.sort((a, b) => b.total - a.total);
  return arr;
}

function main() {
  const entries = loadTrace(TRACE_PATH);
  if (!entries.length) {
    console.error("No entries parsed from trace.");
    process.exitCode = 1;
    return;
  }
  const summarized = summarize(entries);
  console.log("\nTop modules by total compile duration (ms):\n");
  const top = summarized.slice(0, TOP_N);
  for (const item of top) {
    console.log(
      `${item.total.toString().padStart(8)} ms  | ${item.count
        .toString()
        .padStart(4)} hits  | ${item.layer.padEnd(8)} | ${item.name}`,
    );
  }
  // also show layer totals
  const byLayer = entries.reduce((acc, e) => {
    const layer = (e.tags && e.tags.layer) || e.layer || "unknown";
    acc[layer] = (acc[layer] || 0) + Number(e.duration || 0);
    return acc;
  }, {});
  console.log("\nTotals by layer:");
  Object.entries(byLayer)
    .sort((a, b) => b[1] - a[1])
    .forEach(([k, v]) => {
      console.log(`${v.toString().padStart(8)} ms  | ${k}`);
    });
}

main();
