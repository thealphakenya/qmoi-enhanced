"use client";
import React from "react";
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

export default function EmploymentDashboard() {
  return (
    <MasterAccessRequired>
      <div className="p-4">Employment dashboard temporarily unavailable (auth fixed)</div>
    </MasterAccessRequired>
  );
}
