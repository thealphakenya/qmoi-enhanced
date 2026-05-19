import React from 'react';

export default function BackupRestoreManager() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Backup & Restore Manager</h3>
      <p className="text-slate-400 mb-4">Data backup and restoration management tools.</p>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300">Last Backup</span>
            <span className="text-green-400 text-sm">2 hours ago</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">1.2GB</div>
              <div className="text-xs text-slate-400">Backup Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">98%</div>
              <div className="text-xs text-slate-400">Success Rate</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Backup Schedule</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Daily Backup</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-xs">Active</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Weekly Full Backup</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-xs">Active</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Monthly Archive</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-400 text-xs">Scheduled</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
            Create Backup
          </button>
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
            Restore
          </button>
        </div>
      </div>
    </div>
  );
}
