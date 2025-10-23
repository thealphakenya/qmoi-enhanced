#!/usr/bin/env node
// Scaffold: clone and set up a repository for autodev operations.
const { execSync } = require('child_process');
const repo = process.argv[2] || null;
if (!repo) {
  console.error('Usage: node autoclone.js <git-url>');
  process.exit(2);
}
console.log('Cloning', repo);
execSync(`git clone ${repo} repo-clone`, { stdio: 'inherit' });
console.log('Done.');
