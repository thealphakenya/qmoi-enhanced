async function fetchQCityConfig() {
  try {
    const res = await fetch('/api/qcity/config');
    if (!res.ok) throw new Error('Failed to fetch config');
    return await res.json();
  } catch (e) {
    return {};
  }
}

async function startQCity() {
  try {
    const res = await fetch('/api/qcity/start', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to start QCity');
    return await res.json();
  } catch (e) {
    return { error: e.message };
  }
}

async function stopQCity() {
  try {
    const res = await fetch('/api/qcity/stop', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to stop QCity');
    return await res.json();
  } catch (e) {
    return { error: e.message };
  }
}
async function fetchQCityResources() {
  try {
    const res = await fetch('/api/qcity/resources');
    if (!res.ok) throw new Error('Failed to fetch resources');
    return await res.json();
  } catch (e) {
    return {};
  }
}
async function fetchQCityTasks() {
  try {
    const res = await fetch('/api/qcity/tasks');
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return await res.json();
  } catch (e) {
    return [];
  }
}
// dashboard.js: Live QCity dashboard widgets
// Fetches live data from backend and updates UI


async function fetchQCityStatus() {
  try {
    const res = await fetch('/api/qcity/status');
    if (!res.ok) throw new Error('Failed to fetch status');
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function fetchQCityLogs() {
  try {
    const res = await fetch('/api/qcity/logs');
    if (!res.ok) throw new Error('Failed to fetch logs');
    return await res.json();
  } catch (e) {
    return [];
  }
}

async function fetchQCityNotifications() {
  try {
    const res = await fetch('/api/qcity/notifications');
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return await res.json();
  } catch (e) {
    return [];
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}


async function updateQCityDashboard() {
  const status = await fetchQCityStatus();
  if (status) {
    setText('device-status', status.running ? 'Online' : 'Offline');
    setText('controls-status', status.platforms.local ? 'Ready' : 'Unavailable');
  }

  // QMOI Memory
  const resources = await fetchQCityResources();
  let memorySummary = '';
  if (resources && (resources.memory || resources.cpu)) {
    memorySummary = `Memory: ${resources.memory || 'N/A'}% | CPU: ${resources.cpu || 'N/A'}%`;
    if (resources.history && Array.isArray(resources.history) && resources.history.length > 0) {
      memorySummary += ` | History: ${resources.history.slice(-3).join(', ')}`;
    }
  } else {
    memorySummary = 'No resource data';
  }
  setText('memory-status', memorySummary);

  // Automation & Self-Healing
  const tasks = await fetchQCityTasks();
  let automationSummary = '';
  if (Array.isArray(tasks) && tasks.length > 0) {
    const running = tasks.filter(t => t.status === 'running').length;
    const failed = tasks.filter(t => t.status === 'failed').length;
    automationSummary = `Active: ${running}, Failed: ${failed}, Total: ${tasks.length}`;
    const lastTask = tasks[tasks.length - 1];
    if (lastTask && lastTask.name) automationSummary += ` | Last: ${lastTask.name}`;
  } else {
    automationSummary = 'No active tasks';
  }
  setText('automation-status', automationSummary);

  // Logs & Notifications
  const [logs, notifications] = await Promise.all([
    fetchQCityLogs(),
    fetchQCityNotifications()
  ]);
  let logsSummary = '';
  if (Array.isArray(logs) && logs.length > 0) {
    logsSummary += `Logs: ${logs.length}`;
    const lastLog = logs[logs.length - 1];
    if (typeof lastLog === 'string') logsSummary += ` | Last: ${lastLog.slice(0, 40)}`;
    else if (lastLog && lastLog.message) logsSummary += ` | Last: ${lastLog.message.slice(0, 40)}`;
  } else {
    logsSummary += 'No logs';
  }
  if (Array.isArray(notifications) && notifications.length > 0) {
    logsSummary += ` | Notifications: ${notifications.length}`;
    const lastNote = notifications[notifications.length - 1];
    if (lastNote && lastNote.title) logsSummary += ` | Last: ${lastNote.title}`;
  }
  setText('logs-status', logsSummary);
}

document.addEventListener('DOMContentLoaded', () => {
  updateQCityDashboard();
  setInterval(updateQCityDashboard, 10000);

  // System Controls wiring
  const startBtn = document.getElementById('start-qcity');
  const stopBtn = document.getElementById('stop-qcity');
  const configBtn = document.getElementById('refresh-config');
  const configStatus = document.getElementById('config-status');
  if (startBtn) {
    startBtn.onclick = async () => {
      const result = await startQCity();
      configStatus.textContent = result.message || result.error || 'Started';
      updateQCityDashboard();
    };
  }
  if (stopBtn) {
    stopBtn.onclick = async () => {
      const result = await stopQCity();
      configStatus.textContent = result.message || result.error || 'Stopped';
      updateQCityDashboard();
    };
  }
  if (configBtn) {
    configBtn.onclick = async () => {
      const config = await fetchQCityConfig();
      configStatus.textContent = JSON.stringify(config, null, 2);
    };
  }
});
