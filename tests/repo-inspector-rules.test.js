const fs = require('fs');
const path = require('path');
const os = require('os');
const child = require('child_process');

function tmpdir() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-inspector-'));
  return d;
}

describe('repo-inspector rules', () => {
  test('detects Dockerfile multi-stage / latest and unpinned workflow uses', () => {
    const d = tmpdir();
    // create simple package.json so script can run
    fs.writeFileSync(path.join(d, 'package.json'), JSON.stringify({ name: 'tmp', version: '0.1.0' }));
    // create Dockerfile using latest
    fs.writeFileSync(path.join(d, 'Dockerfile'), 'FROM node:latest\nRUN echo hi');
    // create workflows dir
    const wfdir = path.join(d, '.github', 'workflows');
    fs.mkdirSync(wfdir, { recursive: true });
    const wf = `name: CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout\n      - uses: actions/setup-node@v3\n`;
    fs.writeFileSync(path.join(wfdir, 'ci.yml'), wf);

    // copy repo-inspector into temp and run from there
    const inspector = path.join(process.cwd(), 'scripts', 'repo-inspector.cjs');
    child.execSync(`node "${inspector}"`, { cwd: d, stdio: 'inherit' });
    const out = fs.readFileSync(path.join(d, '.den', 'suggestions.json'), 'utf8');
    const parsed = JSON.parse(out);
    expect(parsed.suggestions.some(s => s.change && s.change.startsWith('docker-'))).toBe(true);
    expect(parsed.suggestions.some(s => s.change === 'workflow-unpinned-uses')).toBe(true);
  }, 20000);
});
