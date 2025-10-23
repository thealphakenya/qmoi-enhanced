const fs = require('fs');
const path = require('path');
const child = require('child_process');

describe('ensure-env script', () => {
  const cwd = process.cwd();
  const tmpdir = path.join(cwd, 'tmp_test_env');
  beforeAll(() => {
    if (!fs.existsSync(tmpdir)) fs.mkdirSync(tmpdir);
  });
  afterAll(() => {
    try { fs.rmSync(tmpdir, { recursive: true }); } catch (e) {}
  });

  test('writes .env and vercel.env.example with defaults', () => {
    const script = path.join(__dirname, '..', 'scripts', 'ensure-env.cjs');
    child.execSync(`node ${script} --dry`, { cwd: tmpdir });
    // dry run should not create files
    expect(fs.existsSync(path.join(tmpdir, '.env'))).toBe(false);
    // Run actual
    child.execSync(`node ${script}`, { cwd: tmpdir });
    expect(fs.existsSync(path.join(tmpdir, '.env'))).toBe(true);
    expect(fs.existsSync(path.join(tmpdir, 'vercel.env.example'))).toBe(true);
    const env = fs.readFileSync(path.join(tmpdir, '.env'), 'utf8');
    expect(env).toMatch(/NODE_ENV=/);
  });
});
