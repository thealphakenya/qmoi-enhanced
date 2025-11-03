const { spawnSync } = require('child_process');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    const { snapshot, path, confirm } = req.body || {};
    if (!snapshot || !path) return res.status(400).json({ error: 'missing snapshot or path' });

    // Only perform actual restores when PRODUCTION_CONFIRMED=true and confirm=true
    const production = process.env.PRODUCTION_CONFIRMED === 'true' && confirm === true;
    const args = ['./scripts/autodev_manager.py', 'restore', '--snapshot', String(snapshot), '--path', String(path)];
    if (production) args.push('--confirm');

    const py = spawnSync('python3', args, { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const out = (py.stdout || '').trim();
    const err = (py.stderr || '').trim();
    if (err) console.error('autodev restore stderr:', err);

    return res.status(200).json({ ok: true, stdout: out, stderr: err, production });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
};
