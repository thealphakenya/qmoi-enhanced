const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const sourceDir = 'data';
const backupDir = 'backups';
const maxBackups = 7;

if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(backupDir, `backup-${timestamp}.zip`);

const output = fs.createWriteStream(backupFile);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`[Backup] Created: ${backupFile} (${archive.pointer()} bytes)`);
  // Cleanup old backups
  const files = fs.readdirSync(backupDir)
    .filter(f => f.endsWith('.zip'))
    .map(f => ({ f, t: fs.statSync(path.join(backupDir, f)).mtime.getTime() }))
    .sort((a, b) => b.t - a.t);
  files.slice(maxBackups).forEach(({ f }) => {
    fs.unlinkSync(path.join(backupDir, f));
    console.log(`[Backup] Deleted old backup: ${f}`);
  });
});

archive.on('error', err => { throw err; });
archive.pipe(output);
archive.directory(sourceDir, false);
archive.finalize(); 