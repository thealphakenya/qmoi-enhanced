"use client";
import React, { useEffect, useState } from "react";
import { readPersistedUser } from "@/app/lib/auth/persistence";
import { log } from "@/lib/logger";

const MasterAccessRequired = ({ children }: { children: React.ReactNode }) => {
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    const persisted = readPersistedUser();
    if (!persisted) {
      log.warn("FinancialManager auth check failed: persisted user unavailable");
      return;
    }
    setIsMaster(persisted.role === "master");
  }, []);

  if (!isMaster) {
    return <div className="p-4 text-red-600">Access denied: Master users only</div>;
  }

  return <>{children}</>;
};

const FinancialManager: React.FC = () => {
  return (
    <MasterAccessRequired>
      <div className="rounded-lg border border-slate-300 bg-white/90 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Financial Manager</h1>
        <p className="mt-3 text-sm text-slate-600">
          Master users can manage critical financial settings and review secure trading data.
        </p>
      </div>
    </MasterAccessRequired>
  );
};

export default FinancialManager;
export { FinancialManager };
