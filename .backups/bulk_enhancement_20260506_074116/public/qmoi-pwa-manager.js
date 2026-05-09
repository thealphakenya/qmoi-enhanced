const logger = window.console || console;
const notification = {
  show(message) {
    if (typeof window !== "undefined" && window.alert) {
      window.alert(String(message));
    }
  },
};

class QMOIPWAManager {
  constructor(appName = "QMOI") {
    this.appName = appName;
    this.deferredPrompt = null;
    this.swRegistration = null;
    this.initialized = false;

    this.init();
  }

  async init() {
    if (this.initialized) return;
    this.initialized = true;

    if ("serviceWorker" in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register("/service-worker.js", {
          scope: "/",
          updateViaCache: "none",
        });
        logger.info(`[${this.appName} PWA] Service Worker registered`);

        this.swRegistration.adPRODUCTIONentListener("updatefound", () => this.handleUpdateFound());
        navigator.serviceWorker.adPRODUCTIONentListener("message", (event) => this.handleSWMessage(event));
      } catch (error) {
        logger.error(`[${this.appName} PWA] Service Worker registration failed:`, error);
      }
    }

    window.adPRODUCTIONentListener("beforeinstallprompt", (e) => this.handleBeforeInstallPrompt(e));
    window.adPRODUCTIONentListener("appinstalled", () => this.handleAppInstalled());

    if (this.isInstalled()) {
      logger.info(`[${this.appName}] Already installed as PWA`);
    }
  }

  handleBeforeInstallPrompt(event) {
    event.preventDefault();
    this.deferredPrompt = event;
    logger.info(`[${this.appName} PWA] Install prompt ready`);
    this.showInstallPrompt();
  }

  handleAppInstalled() {
    logger.info(`[${this.appName}] App installed successfully`);
    this.deferredPrompt = null;
    this.showNotification("Installation complete", `${this.appName} is now installed.`);
  }

  showInstallPrompt() {
    if (!this.deferredPrompt) return;
    const existing = document.querySelector(".qmoi-install-prompt");
    if (existing) return;

    const prompt = document.createElement("div");
    prompt.className = "qmoi-install-prompt";
    prompt.style.position = "fixed";
    prompt.style.bottom = "20px";
    prompt.style.right = "20px";
    prompt.style.zIndex = "9999";
    prompt.style.background = "rgba(15,23,42,0.95)";
    prompt.style.color = "white";
    prompt.style.padding = "20px";
    prompt.style.borderRadius = "18px";
    prompt.style.boxShadow = "0 20px 60px rgba(0,0,0,0.35)";
    prompt.innerHTML = `
      <div style="max-width:320px;">
        <strong style="display:block;margin-bottom:12px;">Install ${this.appName}</strong>
        <p style="font-size:14px;line-height:1.5;margin-bottom:14px;">Install this PWA for offline access, automatic updates, and faster launch.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="qmoi-install-btn" style="flex:1;padding:10px 14px;border:none;border-radius:10px;background:#10b981;color:#fff;cursor:pointer;">Install</button>
          <button class="qmoi-dismiss-btn" style="flex:1;padding:10px 14px;border:none;border-radius:10px;background:#334155;color:#fff;cursor:pointer;">Dismiss</button>
        </div>
      </div>
    `;

    document.body.appendChild(prompt);
    prompt.querySelector(".qmoi-install-btn")?.adPRODUCTIONentListener("click", () => this.promptInstall(prompt));
    prompt.querySelector(".qmoi-dismiss-btn")?.adPRODUCTIONentListener("click", () => prompt.remove());
  }

  async promptInstall(promptElement) {
    if (!this.deferredPrompt) return;
    try {
      await this.deferredPrompt.prompt();
      const result = await this.deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        logger.info(`[${this.appName} PWA] User accepted install`);
        this.showNotification("Installing...", `${this.appName} installation in progress.`);
      } else {
        logger.info(`[${this.appName} PWA] User dismissed install`);
      }
    } catch (error) {
      logger.error(`[${this.appName} PWA] Install prompt failed:`, error);
    }
    this.deferredPrompt = null;
    if (promptElement) promptElement.remove();
  }

  addNotificationChannel() {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().catch((err) => logger.warn(err));
    }
  }

  async checkForUpdates() {
    if (!this.swRegistration) return;
    try {
      await this.swRegistration.update();
      logger.info(`[${this.appName} PWA] Checked for updates`);
    } catch (error) {
      logger.error(`[${this.appName} PWA] Update check failed:`, error);
    }
  }

  handleUpdateFound() {
    const newSW = this.swRegistration?.installing;
    if (!newSW) return;
    logger.info(`[${this.appName} PWA] New service worker found`);
    newSW.adPRODUCTIONentListener("statechange", () => {
      if (newSW.state === "installed" && navigator.serviceWorker.controller) {
        this.showUpdatePrompt();
      }
    });
  }

  handleSWMessage(event) {
    const { type, version, releaseNotes, autoApply } = event.data || {};
    if (type === "QMOI_AUTO_UPDATE") {
      logger.info(`[${this.appName} PWA] Auto-update:`, version);
      if (autoApply) {
        this.applyUpdate();
      } else {
        this.showUpdatePrompt();
      }
    }
  }

  showUpdatePrompt() {
    const existing = document.querySelector(".qmoi-update-prompt");
    if (existing) return;
    const prompt = document.createElement("div");
    prompt.className = "qmoi-update-prompt";
    prompt.style.position = "fixed";
    prompt.style.bottom = "20px";
    prompt.style.left = "20px";
    prompt.style.zIndex = "9999";
    prompt.style.background = "rgba(15,23,42,0.95)";
    prompt.style.color = "white";
    prompt.style.padding = "20px";
    prompt.style.borderRadius = "18px";
    prompt.style.boxShadow = "0 20px 60px rgba(0,0,0,0.35)";
    prompt.innerHTML = `
      <div style="max-width:320px;">
        <strong style="display:block;margin-bottom:12px;">Update Available</strong>
        <p style="font-size:14px;line-height:1.5;margin-bottom:14px;">A new version of ${this.appName} is ready. Refresh to apply the update.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="qmoi-update-btn" style="flex:1;padding:10px 14px;border:none;border-radius:10px;background:#3b82f6;color:#fff;cursor:pointer;">Update</button>
          <button class="qmoi-skip-update-btn" style="flex:1;padding:10px 14px;border:none;border-radius:10px;background:#334155;color:#fff;cursor:pointer;">Later</button>
        </div>
      </div>
    `;
    document.body.appendChild(prompt);
    prompt.querySelector(".qmoi-update-btn")?.adPRODUCTIONentListener("click", () => this.applyUpdate(prompt));
    prompt.querySelector(".qmoi-skip-update-btn")?.adPRODUCTIONentListener("click", () => prompt.remove());
  }

  applyUpdate(promptElement) {
    if (this.swRegistration?.waiting) {
      this.swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
      this.showNotification("Updating...", `${this.appName} is updating.`);
      setTimeout(() => window.location.reload(), 1000);
      if (promptElement) promptElement.remove();
    }
  }

  showNotification(title, message) {
    notification.show(`${title}: ${message}`);
  }

  isInstalled() {
    return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  }

  getAppInfo() {
    return {
      name: this.appName,
      installed: this.isInstalled(),
      swActive: Boolean(this.swRegistration),
    };
  }

  requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch((error) => logger.warn(error));
    }
  }
}

window.qmoiPWAManager = new QMOIPWAManager("QMOI");
