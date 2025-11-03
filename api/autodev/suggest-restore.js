const { spawnSync } = require('child_process');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    const { path } = req.body || {};
    if (!path) return res.status(400).json({ error: 'missing path' });

    const py = spawnSync('python3', [
      './scripts/autodev_manager.py',
      'suggest-restore',
      '--path',
      path,
    ], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });

    const out = (py.stdout || '').trim();
    const err = (py.stderr || '').trim();
    if (err) console.error('autodev suggest stderr:', err);

    return res.status(200).json({ ok: true, stdout: out, stderr: err });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
};
