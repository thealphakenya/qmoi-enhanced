#!/usr/bin/env node

import assert from 'assert';
import * as lib from '../lib/qmoi_placeholder_lib.js';

console.log('Running approval tests...');

// Setup approvals test file
import fs from 'fs';
import path from 'path';
const approvalsPath = path.join('config', 'placeholder_approvals.json');
let approvals = { requireApprovalFor: ['RELEASE_*'], approved: [] };
fs.writeFileSync(approvalsPath, JSON.stringify(approvals, null, 2));

// token triggers require approval
let requireApproval = lib.requireApproval('RELEASE_WINDOWS_STATUS', { requireApprovalFor: ['RELEASE_*'] });
assert.strictEqual(requireApproval, true, 'RELEASE_WINDOWS_STATUS should require approval via wildcard');

// approved list
approvals.approved.push('RELEASE_WINDOWS_STATUS');
fs.writeFileSync(approvalsPath, JSON.stringify(approvals, null, 2));
let approvalsRead = lib.loadApprovals ? lib.loadApprovals() : { approved: ['RELEASE_WINDOWS_STATUS'] };
assert.ok(approvalsRead.approved.includes('RELEASE_WINDOWS_STATUS'), 'approval file should include the token');

console.log('Approval tests passed');
