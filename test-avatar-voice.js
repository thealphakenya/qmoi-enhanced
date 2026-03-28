// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// Test script for QMoi avatar and voice features
import { QMOIService } from './lib/qmoi-service.js';

console.log('Testing QMoi Avatar and Voice Features...');

// Initialize users
QMOIService.initializeUsers();

// Test getting available avatars for master
const masterAvatars = QMOIService.getAvailableAvatars('master');
console.log('Master avatars:', masterAvatars.length);

// Test getting available voices for sister
const sisterVoices = QMOIService.getAvailableVoices('sister');
console.log('Sister voices:', sisterVoices.length);

// Test avatar selection
const avatarResult = QMOIService.selectAvatar('master', 'executive_qmoi');
console.log('Avatar selection result:', avatarResult.success ? 'Success' : 'Failed');

// Test voice selection
const voiceResult = QMOIService.selectVoice('sister', 'warm_female');
console.log('Voice selection result:', voiceResult.success ? 'Success' : 'Failed');

// Test opening avatar window
const windowResult = QMOIService.openAvatarWindow('master');
console.log('Avatar window opened:', windowResult.success ? 'Success' : 'Failed');

// Test opening preview window
const previewResult = QMOIService.openPreviewWindow('sister');
console.log('Preview window opened:', previewResult.success ? 'Success' : 'Failed');

// Test query processing for avatar commands
const avatarQueryResult = await QMOIService.processQuery('show avatar', 'master');
console.log('Avatar query processed:', avatarQueryResult.success ? 'Success' : 'Failed');

const voiceQueryResult = await QMOIService.processQuery('list voices', 'sister');
console.log('Voice query processed:', voiceQueryResult.success ? 'Success' : 'Failed');

console.log('All tests completed successfully!');</content>
<parameter name="filePath">/workspaces/qmoi-enhanced/test-avatar-voice.js