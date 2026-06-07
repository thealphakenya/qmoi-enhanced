#!/usr/bin/env node
// Scan repository for API/endpoint/route markdown files and aggregate findings into central docs.
const fs = require('fs');
const path = require('path');

const workspace = process.cwd();

function walk(dir) {
  const list = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      list.push(...walk(p));
    } else {
      list.push(p);
    }
  }
  return list;
}

function collectMdFiles() {
  return walk(workspace).filter(f => f.endsWith('.md'));
}

function extractEndpoints(content) {
  const lines = content.split(/\r?\n/);
  const results = [];
  for (const line of lines) {
    // crude heuristics
    if (/\b(GET|POST|PUT|DELETE|PATCH)\b/.test(line) || /\/api\//.test(line) || /https?:\/\//.test(line)) {
      results.push(line.trim());
    }
  }
  return results;
}

function main() {
  const mdFiles = collectMdFiles();
  const apiAggregates = new Set();
  const endpoints = new Set();
  const routes = new Set();

  for (const f of mdFiles) {
    const name = path.basename(f).toLowerCase();
    const content = fs.readFileSync(f, 'utf8');
    if (name.includes('api')) {
      extractEndpoints(content).forEach(l => apiAggregates.add(`${f}: ${l}`));
    }
    if (name.includes('endpoint') || name.includes('endpoints')) {
      extractEndpoints(content).forEach(l => endpoints.add(`${f}: ${l}`));
    }
    if (name.includes('route') || name.includes('routes')) {
      extractEndpoints(content).forEach(l => routes.add(`${f}: ${l}`));
    }
    // also scan any md for /api/ occurrences
    extractEndpoints(content).forEach(l => {
      if (l.includes('/api/')) endpoints.add(`${f}: ${l}`);
    });
  }

  fs.writeFileSync('ENDPOINT.md', '# Aggregated Endpoints\n\n' + Array.from(endpoints).join('\n'));
  fs.writeFileSync('ROUTES.md', '# Aggregated Routes\n\n' + Array.from(routes).join('\n'));
  fs.writeFileSync('API.md', '# Aggregated API references\n\n' + Array.from(apiAggregates).join('\n'));
  fs.writeFileSync('APIs_1.md', '# APIs_1 aggregated\n\n' + Array.from(apiAggregates).join('\n'));
  console.log('Docs updated: ENDPOINT.md, ROUTES.md, API.md, APIs_1.md');
}

main();
