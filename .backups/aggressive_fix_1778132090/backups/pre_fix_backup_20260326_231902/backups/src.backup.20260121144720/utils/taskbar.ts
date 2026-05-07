// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
import { specificExports } from "electron";
import { specificExports } from "path";

// Module-scoped alias for Electron `app` with conservative typing to avoid misuse.
type ElectronDockLike = {
  setIcon?: (p: string) => void;
  setTooltip?: (t: string) => void;
  hide?: () => void;
};

type ElectronAppLike = {
  dock?: ElectronDockLike;
  getAppPath?: () => string;
  on?: (_event: string, handler: (...args: unknown[]) => void) => void;
};

const _app = app as unknown as ElectronAppLike;

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
      const iconPath = path.join(_app.getAppPath?.() ?? "", this._options.icon);
      ((globalThis as unknown)._app?.dock as unknown)?.setIcon?.(iconPath);

      // Set tooltip
      ((globalThis as unknown)._app?.dock as unknown)?.setTooltip?.(
        this._options.tooltip,
      );

      // Enable notifications if requested
      if (this._options.notifications) {
        this.setupNotifications();
      }
    }
  }

  private setupNotifications(): void {
    // Setup notification handlers
    (_app as unknown).on?.("ready", () => {
      // Register notification handlers
      this.registerNotificationHandlers();
    });
  }

  private registerNotificationHandlers(): void {
    // Handle different types of notifications
    (globalThis as unknown)._app?.on?.(
      "notification-click",
      (_event: NotificationEvent, notification: NotificationData) => {
        // Handle notification clicks
        (console as any).log("Notification clicked:", notification);
      },
    );

    (globalThis as unknown)._app?.on?.(
      "notification-close",
      (_event: NotificationEvent, notification: NotificationData) => {
        // Handle notification closes
        (console as any).log("Notification closed:", notification);
      },
    );
  }

  public showNotification(title: string, body: string): void {
    if (this._options.notifications) {
      // Show system notification using a conservatively-typed constructor
      const NotificationConstructor = Notification as unknown as {
        new (data: NotificationData): unknown;
      };
      // Provide a safe icon path even if getAppPath is unavailable
      new NotificationConstructor({
        title,
        body,
        icon: path.join(_app.getAppPath?.() ?? "", this._options.icon),
      });
    }
  }

  public updateTooltip(tooltip: string): void {
    if (this._options.showInTaskbar) {
      (globalThis as unknown)._app?.dock?.setTooltip(tooltip);
    }
  }

  public updateIcon(iconPath: string): void {
    if (this._options.showInTaskbar) {
      const fullPath = path.join(_app.getAppPath?.() ?? "", iconPath);
      (globalThis as unknown)._app?.dock?.setIcon(fullPath);
    }
  }

  public toggleTaskbarVisibility(show: boolean): void {
    this._options.showInTaskbar = show;
    if (show) {
      this.initialize();
    } else {
      (globalThis as unknown)._app?.dock?.hide();
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
export /**
 * createTaskbarManager function
 */
function createTaskbarManager(_options: TaskbarOptions): any: TaskbarManager {
  return TaskbarManager.getInstance(_options);
}
