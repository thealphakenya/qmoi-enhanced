import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "master" | "admin" | "user" | "sponsored" | "guest";

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
  updateQMOIMemory: (memory: Partial<QMOIMemory>) => void;
  hasPermission: (
    perm: "deploy" | "viewDashboard" | "admin" | "user",
  ) => boolean;
}

const MasterContext = createContext<MasterContextType | undefined>(undefined);

export function MasterProvider({ children }: { children: ReactNode }) {
  const [currentRole, setRole] = useState<UserRole>("guest");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [qmoiMemory, setQMOIMemory] = useState<QMOIMemory>({
    conversations: 0,
    lastInteraction: new Date(),
    preferences: {},
    contextHistory: [],
  });

  const isMaster = currentRole === "master";

  const updateQMOIMemory = (memory: Partial<QMOIMemory>) => {
    setQMOIMemory((prev) => ({
      ...prev,
      ...memory,
      lastInteraction: new Date(),
    }));
  };

  function hasPermission(perm: "deploy" | "viewDashboard" | "admin" | "user" | "sponsored") {
    if (currentRole === "master") return true;
    if (perm === "admin" && currentRole === "admin") return true;
    if (perm === "user" && (currentRole === "user" || currentRole === "admin"))
      return true;
    if (perm === "viewDashboard" && currentRole === "admin") return true;
    if (perm === "sponsored" && currentRole === "sponsored") return true;
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
        hasPermission,
      }}
    >
      {children}
    </MasterContext.Provider>
  );
}

export default MasterProvider;

export function useMaster() {
  const ctx = useContext(MasterContext);
  if (!ctx) throw new Error("useMaster must be used within a MasterProvider");
  return ctx;
}
