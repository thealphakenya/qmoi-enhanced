// QMOI Space Main Application
// Version: 2.0.0
// Date: 2025-01-22

class QMOISpaceApp {
  constructor() {
    this.currentTab = "dashboard";
    this.isOnline = navigator.onLine;
    this.cache = new Map();
    this.observers = new Map();

    this.init();
  }

  async init() {
    console.log("QMOI Space: Initializing application...");

    try {
      // Initialize components
      await this.initializeComponents();

      // Setup event listeners
      this.setupEventListeners();

      // Initialize PWA features
      this.initializePWA();

      // Load initial data
      await this.loadInitialData();

      // Start background processes
      this.startBackgroundProcesses();

      // Hide loading screen
      this.hideLoadingScreen();

      console.log("QMOI Space: Application initialized successfully");
    } catch (error) {
      console.error("QMOI Space: Initialization failed:", error);
      this.showError("Failed to initialize application");
    }
  }

  async initializeComponents() {
    // Initialize charts
    this.charts = new QMOICharts();

    // Initialize chat
    this.chat = new QMOIChat();

    // Initialize notifications
    this.notifications = new QMOINotifications();

    // Initialize analytics
    this.analytics = new QMOIAnalytics();

    // Initialize revenue tracker
    this.revenue = new QMOIRevenue();

    // Initialize project manager
    this.projects = new QMOIProjects();

    // Initialize gaming hub
    this.gaming = new QMOIGaming();
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Settings modal
    document.getElementById("settings-btn").addEventListener("click", () => {
      this.openSettings();
    });

    // Notifications
    document
      .getElementById("notifications-btn")
      .addEventListener("click", () => {
        this.openNotifications();
      });

    // User menu
    document.getElementById("user-menu-btn").addEventListener("click", () => {
      this.toggleUserMenu();
    });

    // Online/offline status
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.handleOnlineStatus();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.handleOfflineStatus();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Window events
    window.addEventListener("beforeunload", () => {
      this.saveAppState();
    });

    window.addEventListener("load", () => {
      this.restoreAppState();
    });
  }

  initializePWA() {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("QMOI Space: Service Worker registered");

          // Check for updates
          registration.addEventListener("updatefound", () => {
            this.handleServiceWorkerUpdate(registration);
          });
        })
        .catch((error) => {
          console.error(
            "QMOI Space: Service Worker registration failed:",
            error,
          );
        });
    }

    // Install prompt
    let deferredPrompt;
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      this.showInstallPrompt(deferredPrompt);
    });

    // App installed
    window.addEventListener("appinstalled", () => {
      console.log("QMOI Space: App installed");
      this.trackEvent("app_installed");
    });
  }

  async loadInitialData() {
    try {
      // Load dashboard data
      await this.loadDashboardData();

      // Load user preferences
      await this.loadUserPreferences();

      // Load notifications
      await this.loadNotifications();

      // Initialize charts
      this.initializeCharts();
    } catch (error) {
      console.error("QMOI Space: Failed to load initial data:", error);
    }
  }

  startBackgroundProcesses() {
    // Update system status every 30 seconds
    setInterval(() => {
      this.updateSystemStatus();
    }, 30000);

    // Sync data every 5 minutes
    setInterval(() => {
      this.syncData();
    }, 300000);

    // Update revenue data every minute
    setInterval(() => {
      this.updateRevenueData();
    }, 60000);

    // Check for updates every hour
    setInterval(() => {
      this.checkForUpdates();
    }, 3600000);
  }

  switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

    // Update active tab content
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });
    document.getElementById(`${tabName}-tab`).classList.add("active");

    this.currentTab = tabName;

    // Load tab-specific data
    this.loadTabData(tabName);

    // Track tab switch
    this.trackEvent("tab_switch", { tab: tabName });
  }

  async loadTabData(tabName) {
    try {
      switch (tabName) {
        case "dashboard":
          await this.loadDashboardData();
          break;
        case "ai-chat":
          await this.chat.initialize();
          break;
        case "gaming":
          await this.gaming.loadGames();
          break;
        case "development":
          await this.projects.loadProjects();
          break;
        case "revenue":
          await this.revenue.loadRevenueData();
          break;
        case "analytics":
          await this.analytics.loadAnalyticsData();
          break;
      }
    } catch (error) {
      console.error(`QMOI Space: Failed to load ${tabName} data:`, error);
    }
  }

  async loadDashboardData() {
    try {
      // Load revenue data
      const revenueData = await this.fetchData("/api/revenue/overview");
      this.updateRevenueDisplay(revenueData);

      // Load system status
      const systemStatus = await this.fetchData("/api/system/status");
      this.updateSystemStatusDisplay(systemStatus);

      // Load projects
      const projects = await this.fetchData("/api/projects/active");
      this.updateProjectsDisplay(projects);

      // Load recent activity
      const activity = await this.fetchData("/api/activity/recent");
      this.updateActivityDisplay(activity);
    } catch (error) {
      console.error("QMOI Space: Failed to load dashboard data:", error);
      this.showOfflineMessage();
    }
  }

  async fetchData(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("QMOI Space: Fetch error:", error);

      // Try to get from cache
      const cachedData = this.getCachedData(url);
      if (cachedData) {
        return cachedData;
      }

      throw error;
    }
  }

  getCachedData(key) {
    return this.cache.get(key);
  }

  setCachedData(key, data, ttl = 300000) {
    // 5 minutes default TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  updateRevenueDisplay(data) {
    // Update revenue cards
    document.querySelectorAll(".revenue-amount").forEach((element, index) => {
      if (data.amounts && data.amounts[index]) {
        element.textContent = `KSH ${data.amounts[index].toLocaleString()}`;
      }
    });

    // Update revenue chart
    if (this.charts && data.chartData) {
      this.charts.updateRevenueChart(data.chartData);
    }
  }

  updateSystemStatusDisplay(data) {
    // Update CPU usage
    const cpuElement = document.querySelector(".status-item:nth-child(1) span");
    if (cpuElement && data.cpu) {
      cpuElement.textContent = `CPU: ${data.cpu}%`;
    }

    // Update memory usage
    const memoryElement = document.querySelector(
      ".status-item:nth-child(2) span",
    );
    if (memoryElement && data.memory) {
      memoryElement.textContent = `Memory: ${data.memory}%`;
    }

    // Update storage usage
    const storageElement = document.querySelector(
      ".status-item:nth-child(3) span",
    );
    if (storageElement && data.storage) {
      storageElement.textContent = `Storage: ${data.storage}%`;
    }

    // Update network latency
    const networkElement = document.querySelector(
      ".status-item:nth-child(4) span",
    );
    if (networkElement && data.network) {
      networkElement.textContent = `Network: ${data.network}ms`;
    }
  }

  updateProjectsDisplay(projects) {
    const projectList = document.querySelector(".project-list");
    if (!projectList) return;

    projectList.innerHTML = "";

    projects.forEach((project) => {
      const projectElement = document.createElement("div");
      projectElement.className = "project-item";
      projectElement.innerHTML = `
                <div class="project-info">
                    <h4>${project.name}</h4>
                    <p>${project.description}</p>
                </div>
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress}%"></div>
                    </div>
                    <span>${project.progress}%</span>
                </div>
            `;
      projectList.appendChild(projectElement);
    });
  }

  updateActivityDisplay(activities) {
    const activityList = document.querySelector(".activity-list");
    if (!activityList) return;

    activityList.innerHTML = "";

    activities.forEach((activity) => {
      const activityElement = document.createElement("div");
      activityElement.className = "activity-item";
      activityElement.innerHTML = `
                <div class="activity-icon">
                    <i class="icon-${activity.type}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.message}</p>
                    <span class="activity-time">${this.formatTime(activity.timestamp)}</span>
                </div>
            `;
      activityList.appendChild(activityElement);
    });
  }

  initializeCharts() {
    if (this.charts) {
      this.charts.initializeAllCharts();
    }
  }

  updateSystemStatus() {
    // This would typically fetch real system status
    const status = {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      storage: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 50),
    };

    this.updateSystemStatusDisplay(status);
  }

  async syncData() {
    if (!this.isOnline) return;

    try {
      // Sync offline data
      await this.syncOfflineData();

      // Update cache
      await this.updateCache();
    } catch (error) {
      console.error("QMOI Space: Sync failed:", error);
    }
  }

  async updateRevenueData() {
    try {
      const revenueData = await this.fetchData("/api/revenue/current");
      this.updateRevenueDisplay(revenueData);
    } catch (error) {
      console.error("QMOI Space: Failed to update revenue data:", error);
    }
  }

  async checkForUpdates() {
    try {
      const response = await fetch("/api/version");
      const version = await response.json();

      if (version.latest !== this.getAppVersion()) {
        this.showUpdateAvailable(version.latest);
      }
    } catch (error) {
      console.error("QMOI Space: Failed to check for updates:", error);
    }
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + number keys for tab switching
    if ((e.ctrlKey || e.metaKey) && e.key >= "1" && e.key <= "6") {
      e.preventDefault();
      const tabs = [
        "dashboard",
        "ai-chat",
        "gaming",
        "development",
        "revenue",
        "analytics",
      ];
      const tabIndex = parseInt(e.key) - 1;
      if (tabs[tabIndex]) {
        this.switchTab(tabs[tabIndex]);
      }
    }

    // Escape key to close modals
    if (e.key === "Escape") {
      this.closeAllModals();
    }
  }

  handleOnlineStatus() {
    this.showNotification("Connection restored", "success");
    this.syncData();
  }

  handleOfflineStatus() {
    this.showNotification("Working offline", "warning");
  }

  showInstallPrompt(deferredPrompt) {
    // Create install button
    const installBtn = document.createElement("button");
    installBtn.className = "install-btn";
    installBtn.innerHTML = "Install QMOI Space";
    installBtn.addEventListener("click", () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("QMOI Space: User accepted install prompt");
        }
        deferredPrompt = null;
      });
    });

    // Add to header
    const headerActions = document.querySelector(".header-actions");
    headerActions.insertBefore(installBtn, headerActions.firstChild);
  }

  showUpdateAvailable(version) {
    const updateNotification = document.createElement("div");
    updateNotification.className = "update-notification";
    updateNotification.innerHTML = `
            <div class="update-content">
                <h4>Update Available</h4>
                <p>QMOI Space v${version} is available</p>
                <button class="btn-primary" onclick="location.reload()">Update Now</button>
                <button class="btn-secondary" onclick="this.parentElement.parentElement.remove()">Later</button>
            </div>
        `;

    document.body.appendChild(updateNotification);
  }

  openSettings() {
    const modal = document.getElementById("settings-modal");
    modal.style.display = "block";
  }

  openNotifications() {
    // Implementation for notifications panel
    console.log("QMOI Space: Opening notifications");
  }

  toggleUserMenu() {
    // Implementation for user menu
    console.log("QMOI Space: Toggling user menu");
  }

  closeAllModals() {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.style.display = "none";
    });
  }

  showNotification(message, type = "info") {
    if (this.notifications) {
      this.notifications.show(message, type);
    }
  }

  showError(message) {
    this.showNotification(message, "error");
  }

  showOfflineMessage() {
    this.showNotification(
      "Working offline - Some features may be limited",
      "warning",
    );
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    const app = document.getElementById("app");

    loadingScreen.style.opacity = "0";
    setTimeout(() => {
      loadingScreen.style.display = "none";
      app.style.display = "block";
    }, 500);
  }

  formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) {
      // Less than 1 minute
      return "Just now";
    } else if (diff < 3600000) {
      // Less than 1 hour
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) {
      // Less than 1 day
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return `${Math.floor(diff / 86400000)}d ago`;
    }
  }

  getAppVersion() {
    return "2.0.0";
  }

  trackEvent(eventName, data = {}) {
    if (this.analytics) {
      this.analytics.track(eventName, data);
    }
  }

  saveAppState() {
    const state = {
      currentTab: this.currentTab,
      timestamp: Date.now(),
    };

    localStorage.setItem("qmoi-space-state", JSON.stringify(state));
  }

  restoreAppState() {
    try {
      const state = JSON.parse(localStorage.getItem("qmoi-space-state"));
      if (state && state.currentTab) {
        this.switchTab(state.currentTab);
      }
    } catch (error) {
      console.error("QMOI Space: Failed to restore app state:", error);
    }
  }

  async syncOfflineData() {
    // Implementation for syncing offline data
    console.log("QMOI Space: Syncing offline data");
  }

  async updateCache() {
    // Implementation for updating cache
    console.log("QMOI Space: Updating cache");
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.qmoiApp = new QMOISpaceApp();
});

// Export for use in other modules
window.QMOISpaceApp = QMOISpaceApp;
