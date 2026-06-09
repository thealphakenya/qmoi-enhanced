"use client";
import React, { useEffect, useState } from "react";
import { readPersistedUser } from "@/app/lib/auth/persistence";
import { log } from "@/lib/logger";

const MasterAccessRequired = ({ children }: { children: React.ReactNode }) => {
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    const persisted = readPersistedUser();
    if (!persisted) {
      log.warn("AITradingRules access check failed: persisted user unavailable");
      return;
    }
    setIsMaster(persisted.role === "master");
  }, []);

  if (!isMaster) {
    return <div className="p-4 text-red-600">Access denied: Master users only</div>;
  }

  return <>{children}</>;
};

const AITradingRules = () => {
  return (
    <MasterAccessRequired>
      <section className="rounded-lg border border-slate-300 bg-white/90 p-4 shadow-sm">
        <h2 className="text-xl font-semibold">AI Trading Rules</h2>
        <p className="mt-2 text-sm text-slate-600">
          Master users can view and manage AI trading rule settings here.
        </p>
      </section>
    </MasterAccessRequired>
  );
};

export default AITradingRules;
export { AITradingRules };
