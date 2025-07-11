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
  private options: TaskbarOptions;

  private constructor(options: TaskbarOptions) {
    this.options = options;
    this.initialize();
  }

  public static getInstance(options: TaskbarOptions): TaskbarManager {
    if (!TaskbarManager.instance) {
      TaskbarManager.instance = new TaskbarManager(options);
    }
    return TaskbarManager.instance;
  }

  private initialize(): void {
    if (this.options.showInTaskbar) {
      // Set application icon
      const iconPath = path.join(app.getAppPath(), this.options.icon);
      app.dock?.setIcon(iconPath);

      // Set tooltip
      app.dock?.setTooltip(this.options.tooltip);

      // Enable notifications if requested
      if (this.options.notifications) {
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
      (event: NotificationEvent, notification: NotificationData) => {
        // Handle notification clicks
        console.log("Notification clicked:", notification);
      },
    );

    app.on(
      "notification-close",
      (event: NotificationEvent, notification: NotificationData) => {
        // Handle notification closes
        console.log("Notification closed:", notification);
      },
    );
  }

  public showNotification(title: string, body: string): void {
    if (this.options.notifications) {
      // Show system notification
      new Notification({
        title,
        body,
        icon: path.join(app.getAppPath(), this.options.icon),
      });
    }
  }

  public updateTooltip(tooltip: string): void {
    if (this.options.showInTaskbar) {
      app.dock?.setTooltip(tooltip);
    }
  }

  public updateIcon(iconPath: string): void {
    if (this.options.showInTaskbar) {
      const fullPath = path.join(app.getAppPath(), iconPath);
      app.dock?.setIcon(fullPath);
    }
  }

  public toggleTaskbarVisibility(show: boolean): void {
    this.options.showInTaskbar = show;
    if (show) {
      this.initialize();
    } else {
      app.dock?.hide();
    }
  }

  public toggleNotifications(enable: boolean): void {
    this.options.notifications = enable;
    if (enable) {
      this.setupNotifications();
    }
  }
}

// Export a function to create the taskbar manager
export function createTaskbarManager(options: TaskbarOptions): TaskbarManager {
  return TaskbarManager.getInstance(options);
}
