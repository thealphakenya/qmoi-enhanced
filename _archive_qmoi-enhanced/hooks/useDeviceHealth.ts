import { useState, useEffect } from "react";

interface DeviceHealth {
  status: "healthy" | "degraded" | "critical";
  lastCheck: number;
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkStatus: "connected" | "disconnected";
    batteryLevel?: number;
    performance: {
      fps: number;
      loadTime: number;
      responseTime: number;
    };
  };
  warnings: string[];
}

// Browser-based performance monitoring
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private fpsCounter = 0;
  private lastFpsTime = Date.now();
  private fps = 60;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  updateFPS() {
    this.fpsCounter++;
    const now = Date.now();
    if (now - this.lastFpsTime >= 1000) {
      this.fps = this.fpsCounter;
      this.fpsCounter = 0;
      this.lastFpsTime = now;
    }
  }

  getFPS(): number {
    return this.fps;
  }

  getLoadTime(): number {
    if (typeof performance !== "undefined") {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      return navigation
        ? navigation.loadEventEnd - navigation.loadEventStart
        : 0;
    }
    return 0;
  }

  getResponseTime(): number {
    if (typeof performance !== "undefined") {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      return navigation ? navigation.responseEnd - navigation.requestStart : 0;
    }
    return 0;
  }
}

// Memory monitoring using Performance API
function getMemoryInfo() {
  if (typeof performance !== "undefined" && "memory" in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
    };
  }
  return null;
}

// Network monitoring
function getNetworkInfo() {
  if (typeof navigator !== "undefined" && "connection" in navigator) {
    const connection = (navigator as any).connection;
    return {
      effectiveType: connection?.effectiveType || "unknown",
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
    };
  }
  return null;
}

// Battery monitoring
function getBatteryInfo(): Promise<number | null> {
  return new Promise((resolve) => {
    if (typeof navigator !== "undefined" && "getBattery" in navigator) {
      (navigator as any)
        .getBattery()
        .then((battery: any) => {
          resolve(battery.level * 100);
        })
        .catch(() => resolve(null));
    } else {
      resolve(null);
    }
  });
}

export function useDeviceHealth(): DeviceHealth {
  const [health, setHealth] = useState<DeviceHealth>({
    status: "healthy",
    lastCheck: Date.now(),
    metrics: {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      networkStatus: "connected",
      batteryLevel: 100,
      performance: {
        fps: 60,
        loadTime: 0,
        responseTime: 0,
      },
    },
    warnings: [],
  });

  useEffect(() => {
    const performanceMonitor = PerformanceMonitor.getInstance();
    const warnings: string[] = [];

    const check = async () => {
      try {
        // Update FPS counter
        performanceMonitor.updateFPS();

        // Get memory information
        const memoryInfo = getMemoryInfo();
        let memoryUsage = 0;
        if (memoryInfo) {
          memoryUsage = (memoryInfo.used / memoryInfo.limit) * 100;
          if (memoryUsage > 80) {
            warnings.push("High memory usage detected");
          }
        }

        // Get network information
        const networkInfo = getNetworkInfo();
        let networkStatus: "connected" | "disconnected" = "connected";
        if (networkInfo) {
          if (
            networkInfo.effectiveType === "slow-2g" ||
            networkInfo.effectiveType === "2g"
          ) {
            warnings.push("Slow network connection detected");
          }
        }

        // Get battery information
        const batteryLevel = await getBatteryInfo();
        if (batteryLevel !== null && batteryLevel < 20) {
          warnings.push("Low battery level detected");
        }

        // Simulate CPU usage based on performance metrics
        const fps = performanceMonitor.getFPS();
        const loadTime = performanceMonitor.getLoadTime();
        const responseTime = performanceMonitor.getResponseTime();

        let cpuUsage = 0;
        if (fps < 30) {
          cpuUsage = 80 + Math.random() * 20; // High CPU usage
          warnings.push("Low FPS detected - possible performance issues");
        } else if (fps < 50) {
          cpuUsage = 50 + Math.random() * 30; // Medium CPU usage
        } else {
          cpuUsage = Math.random() * 50; // Low CPU usage
        }

        // Determine overall status
        let status: "healthy" | "degraded" | "critical" = "healthy";
        if (warnings.length > 2 || cpuUsage > 90 || memoryUsage > 90) {
          status = "critical";
        } else if (warnings.length > 0 || cpuUsage > 70 || memoryUsage > 70) {
          status = "degraded";
        }

        // Simulate disk usage (not available in browser)
        const diskUsage = Math.random() * 100;

        setHealth({
          status,
          lastCheck: Date.now(),
          metrics: {
            cpuUsage: Math.round(cpuUsage),
            memoryUsage: Math.round(memoryUsage),
            diskUsage: Math.round(diskUsage),
            networkStatus,
            batteryLevel: batteryLevel || 100,
            performance: {
              fps: Math.round(fps),
              loadTime: Math.round(loadTime),
              responseTime: Math.round(responseTime),
            },
          },
          warnings,
        });
      } catch (error) {
        console.error("Device health check failed:", error);
        setHealth({
          status: "degraded",
          lastCheck: Date.now(),
          metrics: {
            cpuUsage: 0,
            memoryUsage: 0,
            diskUsage: 0,
            networkStatus: "disconnected",
            batteryLevel: 0,
            performance: {
              fps: 0,
              loadTime: 0,
              responseTime: 0,
            },
          },
          warnings: ["Device health check failed"],
        });
      }
    };

    check();
    const interval = setInterval(check, 30000); // Check every 30 seconds

    // Also check on visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        check();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return health;
}
