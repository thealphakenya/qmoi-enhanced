import React from 'react';

export default function HelpPanel() {
  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Help & Onboarding</h2>
      <div className="text-xs text-gray-300 mb-2">
        <div>Welcome to the QMOI/QCity Dashboard!</div>
        <ul className="list-disc ml-6 mt-2">
          <li>Manage devices, schedules, plugins, and sessions</li>
          <li>View system metrics and audit logs</li>
          <li>Enable 2FA for enhanced security</li>
          <li>Use the floating Q-Avatar for quick access</li>
          <li>All actions are logged for security and compliance</li>
        </ul>
        <div className="mt-2">For full documentation, see <a href="/docs" className="text-cyan-400 underline">/docs</a></div>
      </div>
      <div className="text-xs text-gray-400 mt-4">
        Need more help? Contact your admin or see the <a href="/docs" className="text-cyan-400 underline">documentation</a>.
      </div>
    </div>
  );
} 