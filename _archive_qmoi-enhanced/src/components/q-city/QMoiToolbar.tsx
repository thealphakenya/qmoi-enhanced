import React, { useState, useEffect } from "react";

type Notification = {
  type: "info" | "warning" | "error" | "success";
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  timestamp: number;
};

const initialApps = [
  { name: "QBrowser", icon: "🌐", status: "online", tooltip: "Web Browser" },
  {
    name: "QFileManager",
    icon: "🗂️",
    status: "synced",
    tooltip: "File Manager",
  },
  { name: "QClock", icon: "🕰️", status: "", tooltip: "Clock" },
  { name: "QMap", icon: "🗺️", status: "locating", tooltip: "Map" },
  { name: "QSearch", icon: "🔍", status: "ready", tooltip: "Search" },
  { name: "QWhatsApp", icon: "💬", status: "", tooltip: "WhatsApp" },
  { name: "QAutoDev", icon: "⚡", status: "", tooltip: "Auto-Dev" },
  { name: "QDevice", icon: "📱", status: "", tooltip: "Device Health" },
  { name: "QWifi", icon: "📶", status: "", tooltip: "WiFi" },
  { name: "QBluetooth", icon: "🔵", status: "", tooltip: "Bluetooth" },
  { name: "QNews", icon: "📰", status: "", tooltip: "News & Updates" },
];

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default function QMoiToolbar() {
  const [visible, setVisible] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [apps, setApps] = useState(initialApps);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [notificationHistory, setNotificationHistory] = useState<
    Notification[]
  >([]);
  const [showHistory, setShowHistory] = useState(false);

  // Real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setApps((prev) =>
        prev.map((app) => {
          if (app.name === "QClock") {
            return { ...app, status: new Date().toLocaleTimeString() };
          }
          if (app.name === "QWhatsApp") {
            // Simulate unread count
            return { ...app, status: `${getRandomInt(0, 5)} unread` };
          }
          if (app.name === "QAutoDev") {
            // Simulate health status
            const health = ["healthy", "warning", "error"][getRandomInt(0, 2)];
            return { ...app, status: health };
          }
          if (app.name === "QWifi") {
            // Simulate WiFi status
            const wifi = ["connected", "disconnected", "connecting"][
              getRandomInt(0, 2)
            ];
            return { ...app, status: wifi };
          }
          if (app.name === "QBluetooth") {
            // Simulate Bluetooth status
            const bt = ["on", "off", "pairing"][getRandomInt(0, 2)];
            return { ...app, status: bt };
          }
          if (app.name === "QDevice") {
            // Simulate device health
            const health = ["optimized", "needs attention", "updating"][
              getRandomInt(0, 2)
            ];
            return { ...app, status: health };
          }
          return app;
        }),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate advanced notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const n = getRandomInt(0, 10);
      if (n > 8) {
        const types: Notification["type"][] = [
          "info",
          "warning",
          "error",
          "success",
        ];
        const type = types[getRandomInt(0, 3)];
        let message = "";
        let actionLabel;
        let onAction;
        if (type === "error") {
          message = "QMOI: System error detected!";
          actionLabel = "Auto-Fix";
          onAction = () =>
            setNotification({
              type: "success",
              message: "QMOI: Error auto-fixed!",
              timestamp: Date.now(),
            });
        } else if (type === "warning") {
          message = "QMOI: Device needs optimization.";
          actionLabel = "Optimize";
          onAction = () => handleDeviceOptimization();
        } else if (type === "success") {
          message = "QMOI: Update completed successfully!";
        } else {
          message = "QMOI: New message received.";
        }
        const notif: Notification = {
          type,
          message,
          actionLabel,
          onAction,
          timestamp: Date.now(),
        };
        setNotification(notif);
        setNotificationHistory((h) => [notif, ...h].slice(0, 20));
        setTimeout(() => setNotification(null), 4000);
      }
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  function openApp(appName: string) {
    const notif: Notification = {
      type: "info",
      message: `Opening ${appName}...`,
      timestamp: Date.now(),
    };
    setNotification(notif);
    setNotificationHistory((h) => [notif, ...h].slice(0, 20));
    setTimeout(() => setNotification(null), 2000);
  }

  function showContextMenu(e: React.MouseEvent, appName: string) {
    e.preventDefault();
    if (appName === "QWifi") {
      setNotification({
        type: "info",
        message: "WiFi: Connect/Disconnect/Scan",
        actionLabel: "Connect",
        onAction: () => handleWifiConnect(),
        timestamp: Date.now(),
      });
      return;
    }
    if (appName === "QBluetooth") {
      setNotification({
        type: "info",
        message: "Bluetooth: Connect/Disconnect/Scan",
        actionLabel: "Connect",
        onAction: () => handleBluetoothConnect(),
        timestamp: Date.now(),
      });
      return;
    }
    if (appName === "QDevice") {
      setNotification({
        type: "info",
        message: "Device: Optimize/Update/Health",
        actionLabel: "Optimize",
        onAction: () => handleDeviceOptimization(),
        timestamp: Date.now(),
      });
      return;
    }
    if (appName === "QWhatsApp") {
      setNotification({
        type: "info",
        message: "WhatsApp: Quick Reply, Smart Reply, Schedule, Media",
        actionLabel: "Quick Reply",
        onAction: () => handleWhatsAppQuickReply(),
        timestamp: Date.now(),
      });
      return;
    }
    if (appName === "QMap") {
      setNotification({
        type: "info",
        message: "QMap: Live Location, Search, Directions, Share",
        actionLabel: "Show Map",
        onAction: () => handleMapShow(),
        timestamp: Date.now(),
      });
      return;
    }
    setNotification({
      type: "info",
      message: `Quick actions for ${appName}`,
      timestamp: Date.now(),
    });
    setTimeout(() => setNotification(null), 2000);
  }

  function handleAction(notif: Notification) {
    if (notif.onAction) notif.onAction();
  }

  // Simulate WiFi connect
  function handleWifiConnect() {
    setNotification({
      type: "success",
      message: "WiFi connected!",
      timestamp: Date.now(),
    });
    setTimeout(() => setNotification(null), 2000);
  }

  // Simulate Bluetooth connect
  function handleBluetoothConnect() {
    setNotification({
      type: "success",
      message: "Bluetooth connected!",
      timestamp: Date.now(),
    });
    setTimeout(() => setNotification(null), 2000);
  }

  // Simulate device optimization
  function handleDeviceOptimization() {
    setNotification({
      type: "success",
      message: "Device optimized!",
      timestamp: Date.now(),
    });
    setTimeout(() => setNotification(null), 2000);
  }

  // WhatsApp quick reply
  function handleWhatsAppQuickReply() {
    setNotification({
      type: "success",
      message: 'Smart reply sent: "On my way!" (Meta AI)',
      timestamp: Date.now(),
    });
    setTimeout(() => setNotification(null), 2000);
  }

  // QMap show map
  function handleMapShow() {
    setNotification({
      type: "success",
      message: "QMap opened: Showing live location and traffic.",
      timestamp: Date.now(),
    });
    setTimeout(() => setNotification(null), 2000);
  }

  return visible ? (
    <>
      {notification && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            left: 32,
            zIndex: 1100,
            background:
              notification.type === "error"
                ? "#f44336"
                : notification.type === "warning"
                  ? "#ff9800"
                  : notification.type === "success"
                    ? "#4caf50"
                    : "#333",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 10,
            boxShadow: "0 2px 8px #0008",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span>{notification.message}</span>
          {notification.actionLabel && (
            <button
              onClick={() => handleAction(notification)}
              style={{
                marginLeft: 8,
                background: "#fff",
                color: "#222",
                border: "none",
                borderRadius: 6,
                padding: "2px 10px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {notification.actionLabel}
            </button>
          )}
        </div>
      )}
      {showHistory && (
        <div
          style={{
            position: "fixed",
            bottom: 120,
            left: 32,
            zIndex: 1100,
            background: "#222",
            color: "#e0ffe0",
            padding: 16,
            borderRadius: 12,
            boxShadow: "0 2px 8px #0008",
            maxHeight: 300,
            overflowY: "auto",
            minWidth: 320,
          }}
        >
          <h4 style={{ margin: 0, marginBottom: 8 }}>Notification Center</h4>
          <button
            onClick={() => setShowHistory(false)}
            style={{
              position: "absolute",
              top: 8,
              right: 12,
              background: "none",
              border: "none",
              color: "#e0ffe0",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ✖
          </button>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {notificationHistory.map((n, i) => (
              <li
                key={i}
                style={{
                  marginBottom: 8,
                  borderBottom: "1px solid #444",
                  paddingBottom: 4,
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color:
                      n.type === "error"
                        ? "#f44336"
                        : n.type === "warning"
                          ? "#ff9800"
                          : n.type === "success"
                            ? "#4caf50"
                            : "#e0ffe0",
                  }}
                >
                  {n.message}
                </span>
                <span style={{ marginLeft: 8, fontSize: 12, color: "#aaa" }}>
                  {new Date(n.timestamp).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 1000,
          background: theme === "dark" ? "#222" : "#fff",
          color: theme === "dark" ? "#e0ffe0" : "#222",
          borderRadius: 16,
          boxShadow: "0 4px 24px #0008",
          padding: 8,
          display: "flex",
          gap: 16,
          alignItems: "center",
          minHeight: 56,
          minWidth: 56,
          userSelect: "none",
        }}
      >
        {apps.map((app) => (
          <div
            key={app.name}
            title={app.tooltip}
            style={{
              position: "relative",
              cursor: "pointer",
              fontSize: 28,
              padding: 4,
            }}
            onClick={() => openApp(app.name)}
            onContextMenu={(e) => showContextMenu(e, app.name)}
          >
            <span>{app.icon}</span>
            <span
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                fontSize: 10,
                background:
                  app.status === "error"
                    ? "#f00"
                    : app.status === "warning"
                      ? "#ff0"
                      : "#0f0",
                color: "#111",
                borderRadius: 8,
                padding: "0 4px",
                minWidth: 16,
                textAlign: "center",
                display: app.status ? "inline-block" : "none",
              }}
            >
              {app.status}
            </span>
          </div>
        ))}
        <button
          onClick={() => setVisible(false)}
          style={{
            marginLeft: 12,
            background: "none",
            border: "none",
            color: "inherit",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ✖
        </button>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{
            marginLeft: 4,
            background: "none",
            border: "none",
            color: "inherit",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          🌓
        </button>
        <button
          onClick={() => setShowHistory((h) => !h)}
          style={{
            marginLeft: 4,
            background: "none",
            border: "none",
            color: "inherit",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          🔔
        </button>
      </div>
    </>
  ) : (
    <button
      onClick={() => setVisible(true)}
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 1000,
        fontSize: 28,
        borderRadius: 16,
        background: "#222",
        color: "#e0ffe0",
        border: "none",
        padding: 8,
        boxShadow: "0 4px 24px #0008",
      }}
    >
      ☰
    </button>
  );
}
