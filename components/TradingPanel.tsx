"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { readPersistedUser } from "@/app/lib/auth/persistence";

const MasterAccessRequired = ({ children }: { children: React.ReactNode }) => {
  const [isMaster, setIsMaster] = React.useState(false);

  React.useEffect(() => {
    const user = readPersistedUser();
    if (user?.role === "master") {
      setIsMaster(true);
    }
  }, []);

  if (!isMaster) {
    return (
      <div className="p-4 text-red-600">Access denied: Master users only</div>
    );
  }

  return <>{children}</>;
};

export default function TradingPanel() {
  return (
    <MasterAccessRequired>
      <div className="p-4">Trading panel temporarily unavailable (auth fixed)</div>
    </MasterAccessRequired>
  );
}
