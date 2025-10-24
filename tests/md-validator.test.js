const fs = require('fs');
const path = require('path');

describe('md-validator', () => {
  const tmp = path.join(__dirname, 'tmp-md');
  const sample = path.join(tmp, 'sample.md');
  beforeAll(() => {
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true });
    fs.writeFileSync(sample, '# Sample Title\n\nThis is a sample markdown file used for testing the md-validator. It has enough content to pass the heuristic.');
    // ensure .den cleaned
    const den = path.join(tmp, '.den');
    if (fs.existsSync(den)) fs.rmSync(den, { recursive: true, force: true });
  });
  afterAll(() => {
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {}
  });

  test('validates and marks markdown files', () => {
    const cwd = process.cwd();
    process.chdir(tmp);
    const validator = require('../scripts/md-validator.cjs');
    return new Promise((resolve, reject) => {
      try {
        validator.validateAll();
        const out = path.join(process.cwd(), '.den', 'md-validation.json');
        expect(fs.existsSync(out)).toBe(true);
        const data = JSON.parse(fs.readFileSync(out, 'utf8'));
        expect(Array.isArray(data.results)).toBe(true);
        const marked = fs.readFileSync('sample.md','utf8');
        expect(marked.includes('**Lion** ✅')).toBe(true);
        process.chdir(cwd);
        resolve();
      } catch (e) { process.chdir(cwd); reject(e); }
    });
  });
});
// (kept single test suite above)
