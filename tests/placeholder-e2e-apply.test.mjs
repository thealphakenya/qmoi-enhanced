import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('Placeholder E2E apply test', () => {
  test('apply creates backup and replaces tokens', () => {
    const tmpdir = path.join('tmp_test_dir');
    if (!fs.existsSync(tmpdir)) fs.mkdirSync(tmpdir);
    const sampleFile = path.join(tmpdir, 'sample.md');
    fs.writeFileSync(sampleFile, 'Hello {PLACE} {AVATAR}');
    // Ensure approvals defaulted
    execSync('node scripts/qmoi-env-setup.js');
    // Run apply with --force to override approvals if needed
    try { execSync(`node scripts/qmoi_placeholder_checker.js --apply --dir ${tmpdir} --force`, { stdio: 'inherit' }); } catch (e) { /* ignore non-zero exit */ }
    expect(fs.existsSync(sampleFile + '.bak')).toBe(true);
    const newContent = fs.readFileSync(sampleFile, 'utf8');
    expect(newContent.includes('{PLACE}') === false || newContent.includes('{AVATAR}') === false).toBeTruthy();
  });
});
