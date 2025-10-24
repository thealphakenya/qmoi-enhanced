const fs = require('fs');
const path = require('path');
const child = require('child_process');

describe('repo-inspector', () => {
  const repo = process.cwd();
  test('generates suggestions.json', () => {
    // run the inspector
    child.execSync('node scripts/repo-inspector.cjs', { cwd: repo, stdio: 'inherit' });
    const s = fs.readFileSync(path.join(repo, '.den', 'suggestions.json'), 'utf8');
    const parsed = JSON.parse(s);
    expect(parsed).toHaveProperty('suggestions');
  }, 20000);
});
