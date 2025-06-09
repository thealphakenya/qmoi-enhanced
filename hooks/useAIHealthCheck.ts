import { useState, useEffect } from "react";

export function useAIHealthCheck() {
  const [health, setHealth] = useState<{ status: string; lastCheck: string; error?: string }>({ status: "unknown", lastCheck: new Date().toISOString() });

  useEffect(() => {
    const check = async () => {
      try {
        // TODO: Replace with real health check endpoint
        const res = await fetch("/api/ai-health");
        const data = await res.json();
        setHealth({ status: data.status, lastCheck: new Date().toISOString() });
      } catch (e: any) {
        setHealth({ status: "error", lastCheck: new Date().toISOString(), error: e.message });
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  return health;
}
