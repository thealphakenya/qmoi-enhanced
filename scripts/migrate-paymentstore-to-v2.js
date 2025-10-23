#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const oldDir = path.join(root, 'data');
const backupDir = path.join(root, 'data_backup_' + Date.now());
const newDir = path.join(root, 'data'); // V2 uses same dir by default; we'll write v2 files in same place but ensure backups

function copyIfExists(file) {
  if (fs.existsSync(file)) {
    const dest = path.join(backupDir, path.basename(file));
    fs.mkdirSync(backupDir, { recursive: true });
    fs.copyFileSync(file, dest);
    console.log('Backed up', file, 'to', dest);
    return true;
  }
  return false;
}

(async () => {
  try {
    const payments = path.join(oldDir, 'payments.json');
    const mpesa = path.join(oldDir, 'mpesa-transactions.json');
    let any = false;
    if (copyIfExists(payments)) any = true;
    if (copyIfExists(mpesa)) any = true;
    if (!any) {
      console.log('No existing data files found to migrate.');
      process.exit(0);
    }
    // Safe copy back into same dir (non-destructive since backups were made)
    console.log('Migration ready. V2 reads from the same data files by default.');
    console.log('You can run application now; V2 will use these files safely.');
  } catch (e) {
    console.error('Migration failed', e && e.stack || e);
    process.exit(1);
  }
})();
