import React, { useState } from 'react';
import SchedulePanel from './SchedulePanel';
import DevicePanel from './DevicePanel';
import PluginPanel from './PluginPanel';
import MetricsPanel from './MetricsPanel';
import SessionPanel from './SessionPanel';
import HelpPanel from './HelpPanel';
import { QMoiState } from './QMoiState';
import QAvatar from './QAvatar';
import CommandPanel from './CommandPanel';
import AuditLogPanel from './AuditLogPanel';

export default function Dashboard() {
  const [theme, setTheme] = useState('dark');
  const [panel, setPanel] = useState('schedules');
  React.useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-gray-950' : 'bg-white';
  }, [theme]);
  return (
    <div className={theme === 'dark' ? 'text-white bg-gray-950 min-h-screen' : 'text-gray-900 bg-white min-h-screen'}>
      <nav className="flex gap-2 p-4 border-b border-gray-700">
        <button onClick={() => setPanel('schedules')} className="px-3 py-1 rounded bg-cyan-700 text-white">Schedules</button>
        <button onClick={() => setPanel('devices')} className="px-3 py-1 rounded bg-cyan-700 text-white">Devices</button>
        <button onClick={() => setPanel('plugins')} className="px-3 py-1 rounded bg-cyan-700 text-white">Plugins</button>
        <button onClick={() => setPanel('metrics')} className="px-3 py-1 rounded bg-cyan-700 text-white">Metrics</button>
        <button onClick={() => setPanel('sessions')} className="px-3 py-1 rounded bg-cyan-700 text-white">Sessions</button>
        <button onClick={() => setPanel('command')} className="px-3 py-1 rounded bg-cyan-700 text-white">Command</button>
        <button onClick={() => setPanel('auditlog')} className="px-3 py-1 rounded bg-cyan-700 text-white">Audit Log</button>
        <button onClick={() => setPanel('help')} className="px-3 py-1 rounded bg-cyan-700 text-white">Help</button>
        <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="ml-auto px-3 py-1 rounded bg-gray-700 text-white">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</button>
      </nav>
      <main className="p-6 max-w-5xl mx-auto">
        {panel === 'schedules' && <SchedulePanel />}
        {panel === 'devices' && <DevicePanel />}
        {panel === 'plugins' && <PluginPanel />}
        {panel === 'metrics' && <MetricsPanel />}
        {panel === 'sessions' && <SessionPanel />}
        {panel === 'command' && <CommandPanel />}
        {panel === 'auditlog' && <AuditLogPanel />}
        {panel === 'help' && <HelpPanel />}
      </main>
      <div className="fixed bottom-4 right-4 z-50">
        <QMoiState minimized={false} isMaster={true} />
      </div>
      <QAvatar />
    </div>
  );
} 