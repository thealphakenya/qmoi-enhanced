#!/usr/bin/env node
import { applyMapping, ensureConfigDefaults, loadFaceMappings, loadApprovals } from '../lib/placeholder_utils.js';
import fs from 'fs';

console.log('Test applyMapping for AVATAR');
const mapping = ensureConfigDefaults();
mapping.faceMappings = loadFaceMappings();
mapping.approvals = loadApprovals();
console.log('Mapping defaultAvatar: ', mapping.avatarConfig.defaultAvatar);
const avatar = applyMapping('AVATAR', mapping);
console.log('AVATAR mapping result:', avatar);

console.log('Check PLACE mapping:');
const place = applyMapping('PLACE', mapping);
console.log('PLACE mapping sample:', place);

console.log('Check face mapping:');
const faceId = applyMapping('FACE', mapping);
console.log('FACE mapping sample:', faceId);

console.log('Check release mapping (using file):');
mapping.releaseReport = JSON.parse(fs.readFileSync('scripts/qmoi_release_report.json', 'utf8'));
console.log('RELEASE_WINDOWS_STATUS', applyMapping('RELEASE_WINDOWS_STATUS', mapping));
console.log('RELEASE_ANDROID_FILE', applyMapping('RELEASE_ANDROID_FILE', mapping));

console.log('All placeholder utils tests completed');
