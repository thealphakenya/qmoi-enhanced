import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "master" | "master" | "user" | "guest";

interface MasterContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  isMaster: boolean;
  hasPermission: (
    perm: "deploy" | "viewDashboard" | "master" | "user",
  ) => boolean;
}

const MasterContext = createContext<MasterContextType | undefined>(undefined);

export function MasterProvider({ children }: { children: ReactNode }) {
  const [currentRole, setRole] = useState<UserRole>("guest");
  const isMaster = currentRole === "master";
  function hasPermission(perm: "deploy" | "viewDashboard" | "master" | "user") {
    if (currentRole === "master") return true;
    if (perm === "master" && currentRole === "master") return true;
    if (
      perm === "user" &&
      (currentRole === "user" ||
        currentRole === "master" ||
        currentRole === "master")
    )
      return true;
    if (perm === "viewDashboard" && currentRole === "master") return true;
    return false;
  }
  return (
    <MasterContext.Provider
      value={{ currentRole, setRole, isMaster, hasPermission }}
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
