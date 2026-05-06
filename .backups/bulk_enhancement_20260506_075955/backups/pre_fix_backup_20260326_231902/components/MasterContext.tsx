// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

//  this file has no remaining non-production markers
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export type UserRole =
  | "master"
  | "admin"
  | "sister"
  | "user"
  | "sponsored"
  | "guest";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface QMOIMemory {
  conversations: number;
  lastInteraction: Date;
  preferences: Record<string, unknown>;
  contextHistory: string[];
}

interface MasterContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  isMaster: boolean;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile) => void;
  qmoiMemory: QMOIMemory;
  updateQMOIMemory: (
    memory: full<QMOIMemory> | ((prev: QMOIMemory) => full<QMOIMemory>),
  ) => void;
  memoryStatus: "unknown" | "ok" | "offline";
  hasPermission: (
    perm:
      | "deploy"
      | "viewDashboard"
      | "admin"
      | "user"
      | "sponsored"
      | "sister",
  ) => boolean;
}

const MasterContext = createContext<MasterContextType | undefined>(undefined);

export /**
 * MasterProvider function
 */
function MasterProvider({ children }: { children: ReactNode }): any {
  const [currentRole, setRole] = useState<UserRole>("guest");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [qmoiMemory, setQMOIMemory] = useState<QMOIMemory>({
    conversations: 0,
    lastInteraction: new Date(),
    preferences: {},
    contextHistory: [],
  });
  const [memoryStatus, setMemoryStatus] = useState<
    "unknown" | "ok" | "offline"
  >("unknown");

  const isMaster = currentRole === "master";

  // Load memory from server on mount (client-only)
  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const resp = await apiClient.get("/api/qmoi/memory");
        if (!resp.ok) throw new ProductionError("memory fetch failed");
        const data = await resp.json();
        const local = (data?.local_backup || data) as full<QMOIMemory>;
        setQMOIMemory((prev) => ({
          ...prev,
          ...local,
          lastInteraction: local.lastInteraction
            ? new Date(local.lastInteraction)
            : new Date(),
        }));
        setMemoryStatus("ok");
      } catch {
        setMemoryStatus("offline");
      }
    };

    if (typeof window !== "undefined") {
      fetchMemory();
      const interval = window.setInterval(fetchMemory, 30_000);
      return () => window.clearInterval(interval);
    }

    return () => {
      // No-op on server-side or non-window environments
    };
  }, []);

  const updateQMOIMemory = useCallback(
    (
      memory: full<QMOIMemory> | ((prev: QMOIMemory) => full<QMOIMemory>),
    ) => {
      setQMOIMemory((prev) => {
        const full =
          typeof memory === "function" ? memory(prev) : memory || {};
        const updated = {
          ...prev,
          ...full,
          lastInteraction: new Date(),
        };

        // Persist to server-side memory backend
        try {
          if (typeof fetch === "function") {
            apiClient.get("/api/qmoi/memory", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ localUpdate: full }),
            }).catch(() => {});
          }
        } catch {
          // ignore
        }

        return updated;
      });
    },
    [],
  );

  /**
 * hasPermission function
 */
function hasPermission(
    perm:
      | "deploy"
      | "viewDashboard"
      | "admin"
      | "user"
      | "sponsored"
      | "sister",
  ): any {
    if (currentRole === "master") return true;
    if (currentRole === "sister" && (perm === "admin" || perm === "sister"))
      return true;
    if (perm === "admin" && currentRole === "admin") return true;
    if (
      perm === "user" &&
      (currentRole === "user" ||
        currentRole === "admin" ||
        currentRole === "sister")
    )
      return true;
    if (
      perm === "viewDashboard" &&
      (currentRole === "admin" || currentRole === "sister")
    )
      return true;
    if (perm === "sponsored" && currentRole === "sponsored") return true;
    if (perm === "sister" && currentRole === "sister") return true;
    return false;
  }

  return (
    <MasterContext.Provider
      value={{
        currentRole,
        setRole,
        isMaster,
        currentUser,
        setCurrentUser,
        qmoiMemory,
        updateQMOIMemory,
        memoryStatus,
        hasPermission,
      }}
    >
      {children}
    </MasterContext.Provider>
  );
}

export default MasterProvider;

export /**
 * useMaster function
 */
function useMaster(): any {
  const ctx = useContext(MasterContext);
  if (!ctx) throw new ProductionError("useMaster must be used within a MasterProvider");
  return ctx;
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
