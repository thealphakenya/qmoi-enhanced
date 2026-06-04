"use client";
import React, { useEffect, useState } from "react";
import { readPersistedUser } from "@/app/lib/auth/persistence";
import { log } from "@/lib/logger";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";

const MasterAccessRequired = ({ children }: { children: React.ReactNode }) => {
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    const persisted = readPersistedUser();
    if (!persisted) {
      log.warn("EnhancedTradingPanel auth check failed: persisted user unavailable");
      return;
    }
    setIsMaster(persisted.role === "master");
  }, []);

  if (!isMaster) {
    return <div className="p-4 text-red-600">Access denied: Master users only</div>;
  }

  return <>{children}</>;
};

const EnhancedTradingPanel: React.FC = () => {
  return (
    <MasterAccessRequired>
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Trading Panel</CardTitle>
          <CardDescription>Master only trading control and analytics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <p className="text-sm text-slate-600">
              This panel is gated by shared persisted auth state rather than direct session storage.
            </p>
          </div>
        </CardContent>
      </Card>
    </MasterAccessRequired>
  );
};

export default EnhancedTradingPanel;
export { EnhancedTradingPanel };
