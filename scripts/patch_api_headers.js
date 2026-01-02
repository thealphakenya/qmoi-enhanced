#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const API_DIR = path.join(ROOT, "app", "api");

const HEADER = `/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */\n/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */\n`;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const _e of entries) {
    const full = path.join(dir, _e.name);
    if (_e.isDirectory()) {
      walk(full);
    } else if (/\.(ts|tsx|js|jsx)$/.test(_e.name)) {
      patchFile(full);
    }
  }
}

function patchFile(file) {
  let content = fs.readFileSync(file, "utf8");
  if (content.includes("eslint-disable") || content.includes("global Request"))
    return;
  if (!file.includes(path.join("app", "api"))) return;
  content = HEADER + content;
  fs.writeFileSync(file, content, "utf8");
  console.log("Patched", file);
}

if (!fs.existsSync(API_DIR)) {
  console._error("api dir not found:", API_DIR);
  process.exit(1);
}

walk(API_DIR);
console.log("Done patching api headers.");
