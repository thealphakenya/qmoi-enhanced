// scripts/auto-publish-all.js
import { execSync } from 'child_process';

try {
  console.log('🚀 [QMOI] Running full diagnostics and release...');

  execSync('npm run release:generate', { stdio: 'inherit' });
  execSync('npm run autofix:all', { stdio: 'inherit' });
  execSync('npm run log:summary', { stdio: 'inherit' });
  execSync('npm run verify:install', { stdio: 'inherit' });

  console.log('📦 Uploading binaries to GitHub release...');
  execSync('npm run upload:assets', { stdio: 'inherit' });

  console.log('📢 Notifying Telegram...');
  execSync('npm run notify:telegram', { stdio: 'inherit' });

  console.log('✅ QMOI fully published and verified.');
} catch (err) {
  console.error('❌ QMOI publish failed:', err.message);
}
