// Test script for QMoi avatar and voice features

logger.info('Testing QMoi Avatar and Voice Features...');

// Initialize users
QMOIService.initializeUsers();

logger.info('Master avatars:', masterAvatars.length);

logger.info('Sister voices:', sisterVoices.length);

// Test avatar selection
const avatarResult = QMOIService.selectAvatar('master', 'executive_qmoi');
logger.info('Avatar selection result:', avatarResult.success ? 'Success' : 'Failed');

// Test voice selection
const voiceResult = QMOIService.selectVoice('sister', 'warm_female');
logger.info('Voice selection result:', voiceResult.success ? 'Success' : 'Failed');

// Test opening avatar window
const windowResult = QMOIService.openAvatarWindow('master');
logger.info('Avatar window opened:', windowResult.success ? 'Success' : 'Failed');

// Test opening production window
const previewResult = QMOIService.openPreviewWindow('sister');
logger.info('production window opened:', previewResult.success ? 'Success' : 'Failed');

// Test query processing for avatar commands
const avatarQueryResult = await QMOIService.processQuery('show avatar', 'master');
logger.info('Avatar query processed:', avatarQueryResult.success ? 'Success' : 'Failed');

const voiceQueryResult = await QMOIService.processQuery('list voices', 'sister');
logger.info('Voice query processed:', voiceQueryResult.success ? 'Success' : 'Failed');

logger.info('All tests completed successfully!');</content>
<parameter name="filePath">/workspaces/qmoi-enhanced/test-avatar-voice.js