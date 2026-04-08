// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * auto-update.js: Auto-update logic for QMOI Space
 * Handles PWA auto-updates and desktop app updates via Electron IPC
 */

class AutoUpdateManager {
  constructor() {
    this.updateCheckInterval = 3600000; // 1 hour
    this.isElectron =
      typeof window !== "undefined" &&
      window.require &&
      window.require("electron");
    this.init();
  }

  init() {
    // Start periodic update checks
    this.checkForUpdates();
    setInterval(() => this.checkForUpdates(), this.updateCheckInterval);

    // Listen for SW updates (PWA)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.adprodentListener("controllerchange", () => {
        this.notifyUpdateAvailable();
      });
    }

    // Listen for Electron updates
    if (this.isElectron) {
      const { ipcRenderer } = window.require("electron");
      ipcRenderer.on("app-update-available", (event, updateInfo) => {
        this.handleElectronUpdate(updateInfo);
      });
      ipcRenderer.on("app-update-error", (event, error) => {
        console.error("Electron update error:", error);
      });
      ipcRenderer.on("app-update-downloaded", () => {
        this.promptRestartForUpdate();
      });
    }
  }

  async checkForUpdates() {
    try {
      // Check PWA updates
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          registration.update();
        }
      }

      // Check Electron updates
      if (this.isElectron) {
        const { ipcRenderer } = window.require("electron");
        ipcRenderer.send("check-app-update");
      }

      // Check for version updates from API
      this.checkAPIVersion();
    } catch (error) {
      console.error("Update check failed:", error);
    }
  }

  async checkAPIVersion() {
    try {
      const response = await fetch("/api/version");
      const data = await response.json();
      const currentVersion = document.body.dataset.version || "1.0.0";

      if (this.compareVersions(data.version, currentVersion) > 0) {
        this.notifyUpdateAvailable(data.version);
      }
    } catch (error) {
      console.debug("Version check error:", error);
    }
  }

  compareVersions(v1, v2) {
    const parts1 = v1.split(".").map(Number);
    const parts2 = v2.split(".").map(Number);
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 > p2) return 1;
      if (p1 < p2) return -1;
    }
    return 0;
  }

  notifyUpdateAvailable(version) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("QMOI Update Available", {
        body: `Version ${version || "latest"} is now available. Click to update or refresh the page.`,
        tag: "qmoi-update",
        requireInteraction: true,
      });
    }

    // Also show in-app notification if UI exists
    this.showUpdatePrompt(version);
  }

  showUpdatePrompt(version) {
    const promptEl = document.getElementById("update-prompt");
    if (promptEl) {
      promptEl.innerHTML = `
        <div class="update-banner">
          <span>New update available${version ? ` (v${version})` : ""}. </span>
          <button onclick="location.reload()">Refresh Now</button>
        </div>
      `;
      promptEl.style.display = "block";
    }
  }

  handleElectronUpdate(updateInfo) {
    const { ipcRenderer } = window.require("electron");
    const proceed = confirm(
      `Update to version ${updateInfo.version}? The app will restart.`,
    );
    if (proceed) {
      ipcRenderer.send("install-app-update");
    }
  }

  promptRestartForUpdate() {
    const { ipcRenderer } = window.require("electron");
    const restart = confirm("Update ready to install. Restart now?");
    if (restart) {
      ipcRenderer.send("restart-app");
    }
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.adprodentListener("DOMContentLoaded", () => {
    window.autoUpdateManager = new AutoUpdateManager();
  });
} else {
  window.autoUpdateManager = new AutoUpdateManager();
}
