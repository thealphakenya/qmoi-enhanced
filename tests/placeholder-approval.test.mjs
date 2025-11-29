import * as lib from '../lib/qmoi_placeholder_lib.js';
import fs from 'fs';
import path from 'path';

describe('Approval tests', () => {
  test('requireApproval wildcard works', () => {
    const approvals = { requireApprovalFor: ['RELEASE_*'], approved: [] };
    // write to file
    fs.writeFileSync(path.join('config','placeholder_approvals.json'), JSON.stringify(approvals, null, 2));
    const loaded = lib.loadApprovals();
    expect(loaded.requireApprovalFor).toContain('RELEASE_*');
  });

  test('approve placeholder via helper', () => {
    const approvalsPath = path.join('config','placeholder_approvals.json');
    const approvals = JSON.parse(fs.readFileSync(approvalsPath, 'utf8'));
    approvals.approved = approvals.approved || [];
    approvals.approved.push('RELEASE_WINDOWS_STATUS');
    fs.writeFileSync(approvalsPath, JSON.stringify(approvals, null, 2));
    const loaded = lib.loadApprovals();
    expect(loaded.approved).toContain('RELEASE_WINDOWS_STATUS');
  });
});
