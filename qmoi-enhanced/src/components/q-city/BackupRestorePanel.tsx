import React from "react";

export default function BackupRestorePanel() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Backup & Restore</h2>
      <p>Manage system and project backups. (UI and features coming soon)</p>
      <ul className="mt-4 list-disc ml-6">
        <li>Backup status and history</li>
        <li>Manual and scheduled backups</li>
        <li>Instant restore and rollback</li>
      </ul>
      <div className="mt-6 p-4 bg-gray-100 rounded">
        API integration coming soon.
      </div>
    </div>
  );
}
