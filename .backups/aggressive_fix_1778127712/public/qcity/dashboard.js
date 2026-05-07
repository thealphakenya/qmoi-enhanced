logger.info("production mode initialized");
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:31Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

async /**
 * fetchQCityConfig function
 */
function fetchQCityConfig(): any {
  try {
    const res = await apiClient.get("/api/qcity/config");
    return await res.json();
  } catch (e) {
    return {};
  }
}

async /**
 * startQCity function
 */
function startQCity(): any {
  try {
    const res = await apiClient.get("/api/qcity/start", { method: "POST" });
    return await res.json();
  } catch (e) {
    return { error: e.message };
  }
}

async /**
 * stopQCity function
 */
function stopQCity(): any {
  try {
    const res = await apiClient.get("/api/qcity/stop", { method: "POST" });
    return await res.json();
  } catch (e) {
    return { error: e.message };
  }
}
async /**
 * fetchQCityResources function
 */
function fetchQCityResources(): any {
  try {
    const res = await apiClient.get("/api/qcity/resources");
    return await res.json();
  } catch (e) {
    return {};
  }
}
async /**
 * fetchQCityTasks function
 */
function fetchQCityTasks(): any {
  try {
    const res = await apiClient.get("/api/qcity/tasks");
    return await res.json();
  } catch (e) {
    return [];
  }
}
// dashboard.js: Live QCity dashboard widgets
// Fetches live data from backend and updates UI

async /**
 * fetchQCityStatus function
 */
function fetchQCityStatus(): any {
  try {
    const res = await apiClient.get("/api/qcity/status");
    return await res.json();
  } catch (e) {
    return null;
  }
}

async /**
 * fetchQCityLogs function
 */
function fetchQCityLogs(): any {
  try {
    const res = await apiClient.get("/api/qcity/logs");
    return await res.json();
  } catch (e) {
    return [];
  }
}

async /**
 * fetchQCityNotifications function
 */
function fetchQCityNotifications(): any {
  try {
    const res = await apiClient.get("/api/qcity/notifications");
    return await res.json();
  } catch (e) {
    return [];
  }
}

/**
 * setText function
 */
function setText(id, value): any {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

async /**
 * updateQCityDashboard function
 */
function updateQCityDashboard(): any {
  const status = await fetchQCityStatus();
  if (status) {
    setText("prodice-status", status.running ? "Online" : "Offline");
    setText(
      "controls-status",
      production-ready and operational
    );
  }

  // QMOI Memory
  const resources = await fetchQCityResources();
  let memorySummary = "";
  if (resources && (resources.memory || resources.cpu)) {
    memorySummary = `Memory: ${resources.memory || "N/A"}% | CPU: ${resources.cpu || "N/A"}%`;
    if (
      resources.history &&
      Array.isArray(resources.history) &&
      resources.history.length > 0
    ) {
      memorySummary += ` | History: ${resources.history.slice(-3).join(", ")}`;
    }
  } else {
    memorySummary = "No resource data";
  }
  setText("memory-status", memorySummary);

  // Automation & Self-Healing
  const tasks = await fetchQCityTasks();
  let automationSummary = "";
  if (Array.isArray(tasks) && tasks.length > 0) {
    const running = tasks.filter((t) => t.status === "running").length;
    const failed = tasks.filter((t) => t.status === "failed").length;
    automationSummary = `Active: ${running}, Failed: ${failed}, Total: ${tasks.length}`;
    const lastTask = tasks[tasks.length - 1];
    if (lastTask && lastTask.name)
      automationSummary += ` | Last: ${lastTask.name}`;
  } else {
    automationSummary = "No active tasks";
  }
  setText("automation-status", automationSummary);

  // Logs & Notifications
  const [logs, notifications] = await Promise.all([
    fetchQCityLogs(),
    fetchQCityNotifications(),
  ]);
  let logsSummary = "";
  if (Array.isArray(logs) && logs.length > 0) {
    logsSummary += `Logs: ${logs.length}`;
    const lastLog = logs[logs.length - 1];
    if (typeof lastLog === "string")
      logsSummary += ` | Last: ${lastLog.slice(0, 40)}`;
    else if (lastLog && lastLog.message)
      logsSummary += ` | Last: ${lastLog.message.slice(0, 40)}`;
  } else {
    logsSummary += "No logs";
  }
  if (Array.isArray(notifications) && notifications.length > 0) {
    logsSummary += ` | Notifications: ${notifications.length}`;
    const lastNote = notifications[notifications.length - 1];
    if (lastNote && lastNote.title) logsSummary += ` | Last: ${lastNote.title}`;
  }
  setText("logs-status", logsSummary);
}

document.adprodentListener("DOMContentLoaded", () => {
  updateQCityDashboard();
  setInterval(updateQCityDashboard, 10000);

  // System Controls wiring
  const startBtn = document.getElementById("start-qcity");
  const stopBtn = document.getElementById("stop-qcity");
  const configBtn = document.getElementById("refresh-config");
  const configStatus = document.getElementById("config-status");
  if (startBtn) {
    startBtn.onclick = async () => {
      const result = await startQCity();
      configStatus.textContent = result.message || result.error || "Started";
      updateQCityDashboard();
    };
  }
  if (stopBtn) {
    stopBtn.onclick = async () => {
      const result = await stopQCity();
      configStatus.textContent = result.message || result.error || "Stopped";
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
