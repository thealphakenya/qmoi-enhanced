import { useState, useEffect } from "react";

export function useDeviceHealth() {
  const [health, setHealth] = useState({
    cpu: null as number | null,
    memory: null as number | null,
    battery: null as number | null,
    online: navigator.onLine,
  });

  useEffect(() => {
    // Web APIs for CPU/memory (limited)
    setHealth((h) => ({
      ...h,
      cpu: navigator.hardwareConcurrency || null,
      memory: (navigator as any).deviceMemory || null,
    }));
    // Battery API
    if ((navigator as any).getBattery) {
      (navigator as any).getBattery().then((b: any) => {
        setHealth((h) => ({ ...h, battery: b.level * 100 }));
      });
    }
    // Online/offline
    const updateOnline = () => setHealth((h) => ({ ...h, online: navigator.onLine }));
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, []);

  return health;
}
