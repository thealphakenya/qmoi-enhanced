#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/revoke_placeholder.js <TOKEN> [<TOKEN>...]');
  process.exit(1);
}

const approvalsPath = path.join('config', 'placeholder_approvals.json');
let approvals = { requireApprovalFor: [], approved: [] };
try { approvals = JSON.parse(fs.readFileSync(approvalsPath, 'utf8')); } catch {};

if (!approvals.approved) approvals.approved = [];
let removed = 0;
for (const token of args) {
  const t = String(token).toUpperCase();
  const i = approvals.approved.indexOf(t);
  if (i !== -1) {
    approvals.approved.splice(i, 1);
    removed += 1;
    console.log('Revoked:', t);
  } else {
    console.log('Not present in approvals:', t);
  }
}

fs.writeFileSync(approvalsPath, JSON.stringify(approvals, null, 2));
console.log(`Removed ${removed} approvals from ${approvalsPath}`);
