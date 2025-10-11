const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const MEDIA_DIR = path.join(__dirname, '../public/media');
const ADMIN_KEY = process.env.QMOI_ADMIN_KEY || 'qmoi-master-key';
const AUDIT_LOG = path.join(__dirname, '../logs/media_api_audit.log');

if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, MEDIA_DIR),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

function logAudit(action, user = 'QMOI') {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(AUDIT_LOG, `[${timestamp}] [${user}] ${action}\n`);
}

function requireAdmin(req, res, next) {
  const key = req.headers['x-qmoi-admin'] || req.query.admin_key;
  if (key !== ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });
  next();
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.post('/api/media', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const mediaItem = {
    id: req.file.filename,
    name: req.file.originalname,
    type: req.file.mimetype.startsWith('image') ? 'image' : req.file.mimetype.startsWith('video') ? 'video' : req.file.mimetype.startsWith('audio') ? 'audio' : 'document',
    size: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
    url: `/media/${req.file.filename}`,
    createdAt: new Date().toISOString().slice(0, 10),
    tags: []
  };
  logAudit(`UPLOAD ${mediaItem.name}`);
  res.json(mediaItem);
});

app.delete('/api/media/:id', requireAdmin, (req, res) => {
  const file = path.join(MEDIA_DIR, req.params.id);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'Not found' });
  fs.unlinkSync(file);
  logAudit(`DELETE ${req.params.id}`);
  res.json({ success: true });
});

app.patch('/api/media/:id', requireAdmin, express.json(), (req, res) => {
  // For [PRODUCTION IMPLEMENTATION REQUIRED]: just log the tag update
  logAudit(`TAG ${req.params.id} -> ${JSON.stringify(req.body.tags)}`);
  res.json({ success: true });
});

app.get('/api/media/logs', requireAdmin, (req, res) => {
  if (!fs.existsSync(AUDIT_LOG)) return res.json({ logs: [] });
  const logs = fs.readFileSync(AUDIT_LOG, 'utf-8').split('\n').filter(Boolean);
  res.json({ logs });
});

app.get('/api/media', (req, res) => {
  const files = fs.readdirSync(MEDIA_DIR).map(filename => {
    const stats = fs.statSync(path.join(MEDIA_DIR, filename));
    return {
      id: filename,
      name: filename,
      type: filename.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : filename.match(/\.(mp4|avi|mov)$/i) ? 'video' : filename.match(/\.(mp3|wav)$/i) ? 'audio' : 'document',
      size: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
      url: `/media/${filename}`,
      createdAt: stats.birthtime.toISOString().slice(0, 10),
      tags: []
    };
  });
  res.json({ media: files });
});

app.use('/media', express.static(MEDIA_DIR));

app.listen(PORT, () => console.log(`Media API running on http://localhost:${PORT}`)); 