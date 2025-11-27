#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/approve_placeholder.js <TOKEN> [<TOKEN>...]');
  process.exit(1);
}

const approvalsPath = path.join('config', 'placeholder_approvals.json');
let approvals = { requireApprovalFor: [], approved: [] };
try { approvals = JSON.parse(fs.readFileSync(approvalsPath, 'utf8')); } catch {};

if (!approvals.approved) approvals.approved = [];
let added = 0;
for (const token of args) {
  const t = String(token).toUpperCase();
  if (!approvals.approved.includes(t)) {
    approvals.approved.push(t);
    added += 1;
    console.log('Approved:', t);
  } else {
    console.log('Already approved:', t);
  }
}

fs.writeFileSync(approvalsPath, JSON.stringify(approvals, null, 2));
console.log(`Added ${added} approvals to ${approvalsPath}`);
