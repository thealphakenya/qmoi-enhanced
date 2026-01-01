import { app, Notification } from "electron";
import path from "path";

interface TaskbarOptions {
  icon: string;
  tooltip: string;
  showInTaskbar: boolean;
  notifications: boolean;
}

interface NotificationEvent {
  preventDefault: () => void;
}

interface NotificationData {
  title: string;
  body: string;
  icon?: string;
}

export class TaskbarManager {
  private static instance: TaskbarManager;
  private _options: TaskbarOptions;

  private constructor(_options: TaskbarOptions) {
    this._options = _options;
    this.initialize();
  }

  public static getInstance(_options: TaskbarOptions): TaskbarManager {
    if (!TaskbarManager.instance) {
      TaskbarManager.instance = new TaskbarManager(_options);
    }
    return TaskbarManager.instance;
  }

  private initialize(): void {
    if (this._options.showInTaskbar) {
      // Set application icon
      const iconPath = path.join(app.getAppPath(), this._options.icon);
      app.dock?.setIcon(iconPath);

      // Set tooltip
      app.dock?.setTooltip(this._options.tooltip);

      // Enable notifications if requested
      if (this._options.notifications) {
        this.setupNotifications();
      }
    }
  }

  private setupNotifications(): void {
    // Setup notification handlers
    app.on("ready", () => {
      // Register notification handlers
      this.registerNotificationHandlers();
    });
  }

  private registerNotificationHandlers(): void {
    // Handle different types of notifications
    app.on(
      "notification-click",
      (_event: NotificationEvent, notification: NotificationData) => {
        // Handle notification clicks
        console.log("Notification clicked:", notification);
      }
    );

    app.on(
      "notification-close",
      (_event: NotificationEvent, notification: NotificationData) => {
        // Handle notification closes
        console.log("Notification closed:", notification);
      }
    );
  }

  public showNotification(title: string, body: string): void {
    if (this._options.notifications) {
      // Show system notification
      new Notification({
        title,
        body,
        icon: path.join(app.getAppPath(), this._options.icon),
      });
    }
  }

  public updateTooltip(tooltip: string): void {
    if (this._options.showInTaskbar) {
      app.dock?.setTooltip(tooltip);
    }
  }

  public updateIcon(iconPath: string): void {
    if (this._options.showInTaskbar) {
      const fullPath = path.join(app.getAppPath(), iconPath);
      app.dock?.setIcon(fullPath);
    }
  }

  public toggleTaskbarVisibility(show: boolean): void {
    this._options.showInTaskbar = show;
    if (show) {
      this.initialize();
    } else {
      app.dock?.hide();
    }
  }

  public toggleNotifications(enable: boolean): void {
    this._options.notifications = enable;
    if (enable) {
      this.setupNotifications();
    }
  }
}

// Export a function to create the taskbar manager
export function createTaskbarManager(_options: TaskbarOptions): TaskbarManager {
  return TaskbarManager.getInstance(_options);
}
