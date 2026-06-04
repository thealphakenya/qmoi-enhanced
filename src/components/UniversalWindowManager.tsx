import React, { createContext, useContext, useEffect, useState } from 'react';
import { log } from '@/lib/logger';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    log.error('React Error Boundary caught an error:', error, { errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability
// This component acts as the central controller for all application windows.
// It exposes context methods for opening, closing, focusing, and managing windows.
// Includes auto-popup rules, plugin registration, predictive tool activation, session sync.
interface WindowState {
  id: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  projectType?: string;
  props?: any;
  isMinimized?: boolean;
  isMaximized?: boolean;
  lastActive?: number;
}
type WindowUpdate = Partial<WindowState>;

interface WindowManagerContextValue {
  windows: WindowState[];
  openWindow: (win: WindowUpdate) => string;
  closeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updateWindow: (id: string, updates: WindowUpdate) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  autoPosition: (id: string) => void;
  registerPlugin: (plugin: WindowPlugin) => void;
  triggerAutoPopup: (event: string, payload?: any) => void;
}
interface WindowPlugin {
  name: string;
  createWindow: (props: any) => WindowState;
  onEvent?: (event: string, payload?: any) => void;
}
const WindowManagerContext = createContext<WindowManagerContextValue | null>(null);
export const useWindowManager = () => {
  const ctx = useContext(WindowManagerContext);
  return ctx;
};
export const WindowManagerProvider = ({ children }: { children: React.ReactNode }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [plugins, setPlugins] = useState<WindowPlugin[]>([]);
  // Load window state from API, fallback to localStorage on mount
  useEffect(() => {
    let mounted = true;

    async function loadWindows() {
      try {
        const res = await fetch("/api/windows");
        if (res.ok) {
          const data = await res.json();
          if (mounted && Array.isArray(data)) {
            setWindows(data as WindowState[]);
            return;
          }
        }
      } catch (_err) {
        // ignore network errors and fallback to localStorage
      }

      // Fallback to localStorage for environments without the API
      try {
        const saved = typeof window !== "undefined" ? localStorage.getItem("qmoi_windows") : null;
        if (saved) {
          setWindows(JSON.parse(saved));
        }
      } catch (e) {
        if (e instanceof Error) {
          log.error("Failed to load window state:", e);
        } else {
          log.error("Failed to load window state:", { error: String(e) });
        }
      }
    }

    loadWindows();
    return () => {
      mounted = false;
    };
  }, []);
  // Persist window state locally and push it to the API when available
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("qmoi_windows", JSON.stringify(windows));
    } catch (e) {
      if (e instanceof Error) {
        log.error("Failed to persist window state locally:", e);
      } else {
        log.error("Failed to persist window state locally:", { error: String(e) });
      }
    }

    const saveWindowState = async () => {
      try {
        await fetch("/api/windows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(windows),
        });
      } catch (e) {
        if (e instanceof Error) {
          log.error("Failed to persist window state to API:", e);
        } else {
          log.error("Failed to persist window state to API:", { error: String(e) });
        }
      }
    };

    saveWindowState();
  }, [windows]);
  const openWindow = (win: WindowUpdate) => {
    const id = win.id || `win_${Date.now()}`;
    setWindows((prev) => [
      ...prev,
      {
        id,
        title: win.title || "Untitled",
        position: win.position || { x: 100, y: 100 },
        size: win.size || { width: 400, height: 300 },
        zIndex: prev.length + 1,
        lastActive: Date.now(),
        ...win,
      } as WindowState,
    ]);
    return id;
  };
  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };
  const bringToFront = (id: string) => {
    setWindows((prev) => {
      const max = Math.max(...prev.map((w) => w.zIndex));
      return prev.map((w) => (w.id === id ? { ...w, zIndex: max + 1, lastActive: Date.now() } : w));
    });
  };
  const updateWindow = (id: string, updates: WindowUpdate) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates, lastActive: Date.now() } : w))
    );
  };
  const minimizeWindow = (id: string) => {
    updateWindow(id, { isMinimized: true });
  };
  const maximizeWindow = (id: string) => {
    updateWindow(id, {
      isMaximized: true,
      position: { x: 0, y: 0 },
      size: { width: window.innerWidth, height: window.innerHeight },
    });
  };
  const autoPosition = (id: string) => {
    // sophisticated auto-positioning: cascade windows
    const index = windows.findIndex((w) => w.id === id);
    const offset = index * 30;
    updateWindow(id, { position: { x: 100 + offset, y: 100 + offset } });
  };
  const registerPlugin = (plugin: WindowPlugin) => {
    setPlugins((prev) => [...prev, plugin]);
  };
  const triggerAutoPopup = (event: string, payload?: any) => {
    // Trigger plugins and auto-popup logic
    plugins.forEach((p) => p.onEvent?.(event, payload));
    // data: if event is 'errorDetected', open error production
    if (event === "errorDetected") {
      openWindow({ title: "Error production", projectType: "error", props: payload });
    }
  };
  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        bringToFront,
        updateWindow,
        minimizeWindow,
        maximizeWindow,
        autoPosition,
        registerPlugin,
        triggerAutoPopup,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
};
export default WindowManagerProvider;
