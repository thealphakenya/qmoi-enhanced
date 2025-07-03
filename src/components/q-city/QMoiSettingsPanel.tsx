import React, { useRef } from 'react';

export const QMoiSettingsPanel: React.FC = () => {
  // Settings state (stubbed for now)
  const [settings, setSettings] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('qmoi-settings') || '{}'); } catch { return {}; }
  });
  const fileInput = useRef<HTMLInputElement>(null);

  function saveSettings(newSettings: any) {
    setSettings(newSettings);
    localStorage.setItem('qmoi-settings', JSON.stringify(newSettings));
  }
  function exportSettings() {
    const data = {
      settings,
      cmdHistory: JSON.parse(localStorage.getItem('qcity-cmd-history') || '[]'),
      pinned: JSON.parse(localStorage.getItem('qcity-cmd-pinned') || '[]'),
      qavatar: JSON.parse(localStorage.getItem('qavatar-settings') || '{}'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'qmoi-settings-export.json'; a.click();
    URL.revokeObjectURL(url);
  }
  function importSettings(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.settings) saveSettings(data.settings);
        if (data.cmdHistory) localStorage.setItem('qcity-cmd-history', JSON.stringify(data.cmdHistory));
        if (data.pinned) localStorage.setItem('qcity-cmd-pinned', JSON.stringify(data.pinned));
        if (data.qavatar) localStorage.setItem('qavatar-settings', JSON.stringify(data.qavatar));
        alert('Settings imported!');
      } catch {
        alert('Invalid settings file.');
      }
    };
    reader.readAsText(file);
  }
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">QMOI Settings Panel</h2>
      <div className="mb-4">
        <label className="block mb-2">Autonomy Level
          <select value={settings.autonomy || 'manual'} onChange={e => saveSettings({ ...settings, autonomy: e.target.value })} className="ml-2 bg-gray-800 text-white">
            <option value="manual">Manual</option>
            <option value="semi-auto">Semi-Auto</option>
            <option value="full-auto">Full Auto</option>
          </select>
        </label>
        <label className="block mb-2">Allowed Actions
          <input type="text" value={settings.allowedActions || ''} onChange={e => saveSettings({ ...settings, allowedActions: e.target.value })} className="ml-2 bg-gray-800 text-white" placeholder="e.g. build,deploy,test" />
        </label>
        <label className="block mb-2">Media/Project Permissions
          <input type="text" value={settings.mediaPerms || ''} onChange={e => saveSettings({ ...settings, mediaPerms: e.target.value })} className="ml-2 bg-gray-800 text-white" placeholder="e.g. images,docs,code" />
        </label>
      </div>
      <div className="mb-4">
        <button onClick={exportSettings} className="px-3 py-1 bg-cyan-700 rounded text-white mr-2">Export Settings</button>
        <button onClick={() => fileInput.current?.click()} className="px-3 py-1 bg-cyan-700 rounded text-white">Import Settings</button>
        <input type="file" ref={fileInput} style={{ display: 'none' }} accept="application/json" onChange={importSettings} />
      </div>
      <div className="text-gray-300">Settings are stored locally and can be exported/imported for backup or transfer.</div>
    </div>
  );
}; 