#!/usr/bin/env node

import assert from 'assert';
import * as lib from '../lib/qmoi_placeholder_lib.js';

console.log('Running placeholder lib unit tests...');

// Test applyMapping for AVATAR
const mapping = lib.ensureConfigDefaults();
mapping.avatarConfig = { defaultAvatar: 'qmoi-test-avatar' };
const avatar = lib.applyMapping('AVATAR', mapping);
assert.strictEqual(avatar, 'qmoi-test-avatar', 'AVATAR mapping should return default avatar id');

// Test PLACE mapping
mapping.places = { places: ['X', 'Y', 'Z'] };
const place = lib.applyMapping('PLACE', mapping);
assert.ok(['X','Y','Z'].includes(place), 'PLACE mapping should return one of places');

// Face mapping
mapping.faceMappings = { faces: [{ id: 'smile', name: 'Smiling Face', style: 'friendly' }, { id: 'serious', name: 'Serious Face', style: 'formal' }] };
const face = lib.applyMapping('FACE', mapping);
assert.ok(face === 'smile' || face === 'serious' || face === 'Smiling Face' || face === 'Serious Face', 'FACE mapping should select a face id/name');

// Release mapping
mapping.releaseReport = { windows: { status: 'success', file: 'qmoi ai.exe' } };
const winStatus = lib.applyMapping('RELEASE_WINDOWS_STATUS', mapping);
assert.strictEqual(winStatus, 'success', 'RELEASE_WINDOWS_STATUS should map to releaseReport.windows.status');

// Deny and approval
const pconf = lib.loadPlaceholderConfig();
assert.ok(Array.isArray(pconf.denyList), 'denyList must exist');
assert.ok(Array.isArray(pconf.approvedList), 'approvedList must exist');

console.log('All lib tests passed');
