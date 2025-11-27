#!/usr/bin/env node

import assert from 'assert';
import * as lib from '../lib/qmoi_placeholder_lib.js';

console.log('Running placeholder detection tests...');

const pconf = lib.loadPlaceholderConfig ? lib.loadPlaceholderConfig() : { denyList: ['TODO'] };
assert.ok(lib.isDenied('TODO', pconf), 'TODO should be denied');
assert.ok(!lib.isDenied('PLACE', pconf), 'PLACE should not be denied by default');

const approvals = lib.loadApprovals();
// requireApproval for RELEASE_* default
assert.ok(approvals.requireApprovalFor.includes('RELEASE_*'), 'RELEASE_* should be in requireApprovalFor by default');

console.log('Placeholder detection tests passed');
