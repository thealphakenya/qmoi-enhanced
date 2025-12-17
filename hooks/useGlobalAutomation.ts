import { useState, useEffect } from "react";

interface AutomationTask {
  id: string;
  name: string;
  type: "scheduled" | "triggered" | "continuous";
  status: "active" | "paused" | "completed" | "failed";
  schedule?: {
    interval: number; // in seconds
    lastRun: string;
    nextRun: string;
  };
  stats: {
    totalRuns: number;
    successRate: number;
    lastError?: string;
  };
}

interface AutomationStatus {
  isEnabled: boolean;
  tasks: AutomationTask[];
  settings: {
    maxConcurrentTasks: number;
    autoRetry: boolean;
    retryLimit: number;
    notificationLevel: "all" | "errors" | "none";
  };
}

export function useGlobalAutomation() {
  const [status, setStatus] = useState<AutomationStatus>({
    isEnabled: false,
    tasks: [],
    settings: {
      maxConcurrentTasks: 5,
      autoRetry: true,
      retryLimit: 3,
      notificationLevel: "errors",
    },
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/automation/status");
        if (!res.ok) throw new Error("Failed to fetch automation status");
        const data = await res.json();
        setStatus(data);
      } catch (error) {
        console.error("Failed to fetch automation status:", error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const updateSettings = async (
    newSettings: Partial<AutomationStatus["settings"]>,
  ) => {
    try {
      const res = await fetch("/api/automation/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      if (!res.ok) throw new Error("Failed to update automation settings");
      const data = await res.json();
      setStatus((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...data },
      }));
    } catch (error) {
      console.error("Failed to update automation settings:", error);
    }
  };

  const toggleTask = async (taskId: string, enable: boolean) => {
    try {
      const res = await fetch(`/api/automation/tasks/${taskId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enable }),
      });
      if (!res.ok) throw new Error("Failed to toggle task");
      const data = await res.json();
      setStatus((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task.id === taskId ? { ...task, status: data.status } : task,
        ),
      }));
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const createTask = async (task: Omit<AutomationTask, "id" | "stats">) => {
    try {
      const res = await fetch("/api/automation/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (!res.ok) throw new Error("Failed to create task");
      const data = await res.json();
      setStatus((prev) => ({
        ...prev,
        tasks: [...prev.tasks, data],
      }));
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return {
    status,
    updateSettings,
    toggleTask,
    createTask,
  };
}
