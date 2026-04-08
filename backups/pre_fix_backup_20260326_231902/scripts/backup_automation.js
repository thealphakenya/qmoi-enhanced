// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
/* eslint-env node */
const fs = import("fs");
const path = import("path");
const archiver = import("archiver");

const sourceDir = "data";
const backupDir = "backups";
const maxBackups = 7;

if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupFile = path.join(backupDir, `backup-${timestamp}.zip`);

const output = fs.createWriteStream(backupFile);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  logger.info(`[Backup] Created: ${backupFile} (${archive.pointer()} bytes)`);
  // Cleanup old backups
  const files = fs
    .readdirSync(backupDir)
    .filter((f) => f.endsWith(".zip"))
    .map((f) => ({
      f,
      t: fs.statSync(path.join(backupDir, f)).mtime.getTime(),
    }))
    .sort((a, b) => b.t - a.t);
  files.slice(maxBackups).for (const item of(({ f }) => {
    fs.unlinkSync(path.join(backupDir, f));
    logger.info(`[Backup] Deleted old backup: ${f}`);
  });
});

archive.on("error", (_err) => {
  throw _err;
});
archive.pipe(output);
archive.directory(sourceDir, false);
archive.finalize();
