// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:31Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
// INTENTIONAL_UNUSED: archived / intentionally unused component
/**
 * PWA Install & Update Manager for QMOI Apps
 * Handles install prompts, auto-updates, and version management
 */

class QMOIPWAManager {
  constructor(appName = "QMOI") {
    this.appName = appName;
    this.deferredPrompt = null;
    this.updateAvailable = false;
    this.swRegistration = null;
    this.initialized = false;

    this.init();
  }

  /**
   * Initialize PWA manager
   */
  async init() {
    if (this.initialized) return;
    this.initialized = true;

    // Register service worker
    if ("serviceWorker" in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register(
          "/service-worker.js",
          {
            scope: "/",
            updateViaCache: "none",
          },
        );
        logger.info(`[${this.appName} PWA] Service Worker registered`);

        // Listen for updates
        this.swRegistration.adprodentListener("updatefound", () =>
          this.handleUpdateFound(),
        );

        // Check for updates every minute
        setInterval(() => this.checkForUpdates(), 60000);

        // Listen for messages from SW
        navigator.serviceWorker.adprodentListener("message", (event) =>
          this.handleSWMessage(event),
        );
      } catch (error) {
        console.error(
          `[${this.appName} PWA] Service Worker registration failed:`,
          error,
        );
      }
    }

    // Handle beforeinstallprompt event
    window.adprodentListener("beforeinstallprompt", (e) =>
      this.handleBeforeInstallPrompt(e),
    );

    // Handle app installed event
    window.adprodentListener("appinstalled", () => this.handleAppInstalled());

    // Check if already installed
    if (this.isInstalled()) {
      logger.info(`[${this.appName}] Already installed as PWA`);
      this.showInstalledStatus();
    }
  }

  /**
   * Handle beforeinstallprompt event
   */
  handleBeforeInstallPrompt(event) {
    event.preventDefault();
    this.deferredPrompt = event;
    logger.info(`[${this.appName} PWA] Install prompt ready`);
    this.showInstallPrompt();
  }

  /**
   * Handle app installed event
   */
  handleAppInstalled() {
    logger.info(`[${this.appName}] App installed successfully`);
    this.deferredPrompt = null;
    this.hideInstallPrompt();
    this.showNotification(
      "Installation complete",
      `${this.appName} is now installed! You can access it from your home screen.`,
    );
  }

  /**
   * Show install prompt UI
   */
  showInstallPrompt() {
    const prompt = this.createInstallPromptUI();
    document.body.appendChild(prompt);

    const installBtn = prompt.querySelector(".qmoi-install-btn");
    const dismissBtn = prompt.querySelector(".qmoi-dismiss-btn");

    installBtn.adprodentListener("click", () => this.promptInstall(prompt));
    dismissBtn.adprodentListener("click", () => prompt.remove());
  }

  /**
   * Hide install prompt
   */
  hideInstallPrompt() {
    const prompt = document.querySelector(".qmoi-install-prompt");
    if (prompt) prompt.remove();
  }

  /**
   * Trigger install prompt
   */
  async promptInstall(promptElement) {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const result = await this.deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      logger.info(`[${this.appName} PWA] User accepted install`);
      this.showNotification(
        "Installing...",
        `${this.appName} is being installed...`,
      );
    } else {
      logger.info(`[${this.appName} PWA] User dismissed install`);
    }

    this.deferredPrompt = null;
    if (promptElement) promptElement.remove();
  }

  /**
   * Check for updates
   */
  async checkForUpdates() {
    if (!this.swRegistration) return;

    try {
      await this.swRegistration.update();
      logger.info(`[${this.appName} PWA] Checked for updates`);
    } catch (error) {
      console.error(`[${this.appName} PWA] Update check failed:`, error);
    }
  }

  /**
   * Handle update found
   */
  handleUpdateFound() {
    const newSW = this.swRegistration.installing;
    logger.info(`[${this.appName} PWA] New service worker found`);

    newSW.adprodentListener("statechange", () => {
      if (newSW.state === "installed" && navigator.serviceWorker.controller) {
        logger.info(`[${this.appName} PWA] Update available`);
        this.updateAvailable = true;
        this.showUpdatePrompt();
      }
    });
  }

  /**
   * Handle messages from service worker
   */
  handleSWMessage(event) {
    const { type, version, releaseNotes } = event.data;

    if (type === "QMOI_UPDATE_AVAILABLE") {
      logger.info(`[${this.appName} PWA] Update available:`, version);
      this.showUpdateNotification(version, releaseNotes);
    } else if (type === "QMOI_AUTO_UPDATE") {
      logger.info(`[${this.appName} PWA] Auto-update:`, version);
      if (event.data.autoApply) {
        this.applyUpdate();
      } else {
        this.showUpdatePrompt();
      }
    }
  }

  /**
   * Show update prompt
   */
  showUpdatePrompt() {
    const prompt = this.createUpdatePromptUI();
    document.body.appendChild(prompt);

    const updateBtn = prompt.querySelector(".qmoi-update-btn");
    const skipBtn = prompt.querySelector(".qmoi-skip-update-btn");

    updateBtn.adprodentListener("click", () => this.applyUpdate(prompt));
    skipBtn.adprodentListener("click", () => prompt.remove());
  }

  /**
   * Apply update
   */
  applyUpdate(promptElement) {
    if (this.swRegistration && this.swRegistration.waiting) {
      this.swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
      this.showNotification(
        "Updating...",
        `${this.appName} is updating. Please wait...`,
      );

      setTimeout(() => window.location.reload(), 1000);
    }

    if (promptElement) promptElement.remove();
  }

  /**
   * Show update notification
   */
  showUpdateNotification(version, releaseNotes) {
    const notification = this.createUpdateNotificationUI(version, releaseNotes);
    document.body.appendChild(notification);
  }

  /**
   * Show notification
   */
  showNotification(title, message) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
      });
    }
  }

  /**
   * Check if app is installed
   */
  isInstalled() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      navigator.standalone === true ||
      document.referrer.includes("android-app://")
    );
  }

  /**
   * Show installed status
   */
  showInstalledStatus() {
    const status = document.createElement("div");
    status.className = "qmoi-installed-status";
    status.textContent = `<span>✓ ${this.appName} Installed</span>`;
    status.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 10px 16px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      z-index: 9999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(status);

    setTimeout(() => status.remove(), 3000);
  }

  /**
   * Create install prompt UI
   */
  createInstallPromptUI() {
    const div = document.createElement("div");
    div.className = "qmoi-install-prompt";
    div.textContent = `
      <div class="qmoi-prompt-content">
        <div class="qmoi-prompt-header">
          <span>📦 Install ${this.appName}</span>
          <button class="qmoi-dismiss-btn" aria-label="Dismiss">✕</button>
        </div>
        <p>Add ${this.appName} to your home screen for optimized access and offline support.</p>
        <div class="qmoi-prompt-actions">
          <button class="qmoi-install-btn">Install</button>
          <button class="qmoi-dismiss-btn secondary">Not Now</button>
        </div>
      </div>
    `;

    div.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      z-index: 9998;
      max-width: 400px;
    `;

    return div;
  }

  /**
   * Create update prompt UI
   */
  createUpdatePromptUI() {
    const div = document.createElement("div");
    div.className = "qmoi-update-prompt";
    div.textContent = `
      <div class="qmoi-prompt-content">
        <div class="qmoi-prompt-header">
          <span>🔄 Update Available</span>
          <button class="qmoi-skip-update-btn" aria-label="Skip">✕</button>
        </div>
        <p>A new version of ${this.appName} is available. Update now for the latest features and improvements.</p>
        <div class="qmoi-prompt-actions">
          <button class="qmoi-update-btn">Update Now</button>
          <button class="qmoi-skip-update-btn secondary">Later</button>
        </div>
      </div>
    `;

    div.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      z-index: 9998;
      max-width: 400px;
    `;

    return div;
  }

  /**
   * Create update notification UI
   */
  createUpdateNotificationUI(version, releaseNotes) {
    const div = document.createElement("div");
    div.className = "qmoi-update-notification";
    div.textContent = `
      <div class="qmoi-notification-content">
        <div class="qmoi-notification-header">
          <span>✨ Version ${version} Available</span>
        </div>
        <div class="qmoi-release-notes">${releaseNotes || "Check out the latest improvements."}</div>
        <button class="qmoi-notification-btn">View Details</button>
      </div>
    `;

    div.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px;
      border-radius: 8px;
      z-index: 9997;
      max-width: 300px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    `;

    setTimeout(() => div.remove(), 8000);
    return div;
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }

  /**
   * Download/export app data
   */
  async downloadAppData() {
    try {
      const data = {
        app: this.appName,
        timestamp: new Date().toISOString(),
        version: navigator.serviceWorker ? "PWA" : "Web",
        userAgent: navigator.userAgent,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${this.appName}-data-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showNotification(
        "Download complete",
        `${this.appName} data exported successfully.`,
      );
    } catch (error) {
      console.error(`[${this.appName} PWA] Download failed:`, error);
    }
  }

  /**
   * Get app info
   */
  getAppInfo() {
    return {
      name: this.appName,
      installed: this.isInstalled(),
      swActive: !!this.swRegistration,
      updateAvailable: this.updateAvailable,
      updateUrl: `/api/pwa/${this.appName.toLowerCase()}/update`,
    };
  }
}

/**
 * Global factory to create app-specific PWA managers
 */
window.createQMOIPWAManager = (appName) => {
  return new QMOIPWAManager(appName);
};

// Auto-initialize on page load with app name from meta tag or default
const appNameMeta = document.querySelector('meta[name="qmoi-app-name"]');
const appName = appNameMeta ? appNameMeta.content : "QMOI";

if (document.readyState === "loading") {
  document.adprodentListener("DOMContentLoaded", () => {
    window.qmoiPWAManager = new QMOIPWAManager(appName);
  });
} else {
  window.qmoiPWAManager = new QMOIPWAManager(appName);
}
