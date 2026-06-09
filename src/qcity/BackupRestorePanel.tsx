import React from 'react';

export default function BackupRestorePanel(): JSX.Element {
  return (
    <div className="backup-restore-panel" style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
      <h3>Backup & Restore</h3>
      <p>Backup and restore functionality is available for QCity configuration and data.</p>
      <button type="button">Create Backup</button>
      <button type="button">Restore Backup</button>
    </div>
  );
}
