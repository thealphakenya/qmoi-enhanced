import React, { createContext, useContext, useState } from "react";

interface PluginNotification {
  id: number;
  message: string;
  type?: "info" | "success" | "warning" | "error";
}

const PluginNotificationsContext = createContext<{
  notify: (message: string, type?: PluginNotification["type"]) => void;
  notifications: PluginNotification[];
  remove: (id: number) => void;
}>({ notify: () => {}, notifications: [], remove: () => {} });

export const usePluginNotifications = () => useContext(PluginNotificationsContext);

export const PluginNotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<PluginNotification[]>([]);
  const notify = (message: string, type: PluginNotification["type"] = "info") => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), 4000);
  };
  const remove = (id: number) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  return (
    <PluginNotificationsContext.Provider value={{ notify, notifications, remove }}>
      {children}
      <PluginNotifications notifications={notifications} remove={remove} />
    </PluginNotificationsContext.Provider>
  );
};

export const PluginNotifications: React.FC<{ notifications: PluginNotification[]; remove: (id: number) => void }> = ({ notifications, remove }) => (
  <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
    {notifications.map((n) => (
      <div key={n.id} style={{ marginBottom: 8, padding: 12, borderRadius: 6, background: n.type === "error" ? "#fee" : n.type === "success" ? "#efe" : n.type === "warning" ? "#ffe" : "#eef", color: "#222", boxShadow: "0 2px 8px #0002" }}>
        {n.message}
        <button style={{ marginLeft: 12 }} onClick={() => remove(n.id)}>×</button>
      </div>
    ))}
  </div>
); 