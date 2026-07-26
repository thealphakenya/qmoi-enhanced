#!/usr/bin/env node

/**
 * QMOI Enhanced Documentation Verifier
 * Verifies, lints, and auto-updates all .md documentation files for completeness, accuracy, and consistency.
 */

const fs = require('fs');
const path = require('path');
    
const DOC_DIR = process.cwd();
const REQUIRED_SECTIONS = [
  'Overview',
  'Key Features',
  'Integration',
  'Optimization',
  'Security',
  'Accessibility',
  'Auto-Enhancement',
  'Auto-Upgrade',
  'Registry',
  'Audit',
  'Extensibility',
  'Future Enhancements',
  'Conclusion'
];

function getMarkdownFiles(dir) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(dir, f));
    }
    
function lintMarkdown(content) {
  // Simple linter: check for headings, section order, and basic formatting
  const issues = [];
  for (const section of REQUIRED_SECTIONS) {
    if (!content.match(new RegExp(`^#+\s*${section}`, 'im'))) {
      issues.push(`Missing section: ${section}`);
    }
  }
  if (!content.match(/\n---\n/)) {
    issues.push('Missing horizontal rule (---) at end');
  }
  return issues;
}

function autoUpdateMarkdown(content) {
  // Auto-add missing sections at the end
  let updated = content.trim();
  for (const section of REQUIRED_SECTIONS) {
    if (!updated.match(new RegExp(`^#+\s*${section}`, 'im'))) {
      updated += `\n\n## ${section}\n\n*Section to be completed.*`;
    }
  }
  if (!updated.match(/\n---\n/)) {
    updated += '\n\n---\n';
  }
  return updated;
}

function verifyDocs() {
  const files = getMarkdownFiles(DOC_DIR);
  let allPassed = true;
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const issues = lintMarkdown(content);
    if (issues.length > 0) {
      allPassed = false;
      console.log(`\n[!] Issues in ${file}:`);
      for (const issue of issues) {
        console.log('  -', issue);
      }
      // Auto-update file
      const updated = autoUpdateMarkdown(content);
      fs.writeFileSync(file, updated, 'utf8');
      console.log(`[+] Auto-updated ${file}`);
    } else {
      console.log(`[OK] ${file} passed verification.`);
    }
  }
  if (allPassed) {
    console.log('\nAll documentation files are complete and up-to-date.');
  } else {
    console.log('\nSome files were auto-updated. Please review and complete any placeholder sections.');
  }
}

if (require.main === module) {
  verifyDocs();
}
 
// AUTOFIXED by Ollama at 2026-07-26T18:54:39.765003Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:32.912917Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.288360Z
