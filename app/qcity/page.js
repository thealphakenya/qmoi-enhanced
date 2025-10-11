import React from "react";

export default function QCityDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-8 text-cyan-300 drop-shadow-lg">QCity Device Management & Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white/10 rounded-xl p-6 border border-cyan-400/30 shadow-lg">
            <h2 className="text-2xl font-semibold mb-2 text-cyan-200">Device Status</h2>
            <p className="opacity-80">Live device health, compatibility, and resource usage.</p>
            <DeviceStatusWidget />
          </div>
          <div className="bg-white/10 rounded-xl p-6 border border-cyan-400/30 shadow-lg">
            <h2 className="text-2xl font-semibold mb-2 text-cyan-200">Logs & Notifications</h2>
            <p className="opacity-80">Real-time logs, error tracking, and system notifications.</p>
            <LogsNotificationsWidget />
          </div>
          <div className="bg-white/10 rounded-xl p-6 border border-cyan-400/30 shadow-lg">
            <h2 className="text-2xl font-semibold mb-2 text-cyan-200">Automation & Self-Healing</h2>
            <p className="opacity-80">Automated fixes, self-healing, and background tasks.</p>
            <AutomationWidget />
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/10 rounded-xl p-6 border border-cyan-400/30 shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-cyan-200">QMOI Memory</h2>
            <p className="opacity-80">Persistent memory, context, and correction history.</p>
            <MemoryWidget />
          </div>
          <div className="bg-white/10 rounded-xl p-6 border border-cyan-400/30 shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-cyan-200">System Controls</h2>
            <p className="opacity-80">Start/stop services, manage devices, and advanced settings.</p>
            <SystemControlsWidget />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

function DeviceStatusWidget() {
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    fetch("/api/qcity/resources").then(r => r.json()).then(data => setDevices(data.devices || []));
  }, []);
  return (
    <div>
      {devices.length === 0 ? <div className="text-gray-400">No devices found.</div> : (
        <ul className="divide-y divide-cyan-800">
          {devices.map((d, i) => (
            <li key={i} className="py-2 flex justify-between items-center">
              <span>{d.name || d.id}</span>
              <span className={"ml-2 px-2 py-1 rounded text-xs " + (d.status === "online" ? "bg-green-700" : "bg-red-700")}>{d.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LogsNotificationsWidget() {
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    fetch("/api/qcity/logs").then(r => r.json()).then(setLogs);
    fetch("/api/qcity/notifications").then(r => r.json()).then(setNotifications);
  }, []);
  return (
    <div>
      <div className="mb-2 font-bold text-cyan-300">Notifications</div>
      <ul className="mb-4 text-sm max-h-32 overflow-y-auto">
        {notifications.map((n, i) => <li key={i} className="mb-1">{n.title || n.message}</li>)}
      </ul>
      <div className="mb-2 font-bold text-cyan-300">Logs</div>
      <ul className="text-xs max-h-32 overflow-y-auto">
        {logs.map((l, i) => <li key={i} className="mb-1">{l.timestamp}: {l.message || l}</li>)}
      </ul>
    </div>
  );
}

function AutomationWidget() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetch("/api/qcity/tasks").then(r => r.json()).then(setTasks);
  }, []);
  return (
    <div>
      <ul className="text-sm max-h-32 overflow-y-auto">
        {tasks.map((t, i) => <li key={i} className="mb-1">{t.name || t.id}: {t.status}</li>)}
      </ul>
    </div>
  );
}

function MemoryWidget() {
  const [memory, setMemory] = useState(null);
  useEffect(() => {
    fetch("/api/qcity/config").then(r => r.json()).then(data => setMemory(data.memory || data));
  }, []);
  return (
    <div>
      {memory ? <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(memory, null, 2)}</pre> : <span className="text-gray-400">Loading memory...</span>}
    </div>
  );
}

function SystemControlsWidget() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch("/api/qcity/status").then(r => r.json()).then(setStatus);
  }, []);
  const handle = async (action) => {
    setLoading(true);
    await fetch(`/api/qcity/${action}`, { method: "POST" });
    setLoading(false);
    fetch("/api/qcity/status").then(r => r.json()).then(setStatus);
  };
  return (
    <div>
      <div className="mb-2">System: <span className="font-bold">{status?.enabled ? "Online" : "Offline"}</span></div>
      <div className="flex gap-2">
        <button className="bg-green-700 px-3 py-1 rounded" disabled={loading} onClick={() => handle("start")}>Start</button>
        <button className="bg-red-700 px-3 py-1 rounded" disabled={loading} onClick={() => handle("stop")}>Stop</button>
      </div>
    </div>
  );
}
