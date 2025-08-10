#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import glob from 'glob';

const WORKFLOW_GLOB = '.github/workflows/*.yml';
const MD_GLOB = '*.md';
const ARTIFACT_REGEX = /actions\/upload-artifact@v\d+/g;
const ARTIFACT_REPLACEMENT = 'actions/upload-artifact@v4';

function updateFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = original.replace(ARTIFACT_REGEX, ARTIFACT_REPLACEMENT);
  if (original !== updated) {
    fs.writeFileSync(filePath, updated, 'utf8');
    return true;
  }
  return false;
}

function updateFiles(globPattern, description) {
  const files = glob.sync(globPattern, { absolute: true });
  let changed = 0;
  files.forEach(file => {
    if (updateFile(file)) {
      console.log(`[UPDATED] ${description}: ${file}`);
      changed++;
    }
  });
  return changed;
}

function main() {
  console.log('--- QMOI Artifact Action Updater ---');
  const workflowChanged = updateFiles(WORKFLOW_GLOB, 'Workflow');
  const mdChanged = updateFiles(MD_GLOB, 'Markdown');
  if (workflowChanged === 0 && mdChanged === 0) {
    console.log('No updates needed. All files are up to date.');
  } else {
    console.log(`\nSummary: Updated ${workflowChanged} workflow(s) and ${mdChanged} markdown file(s).`);
    console.log('Please review changes and commit them.');
  }
}

main(); 