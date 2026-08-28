"use client";

import { QMOIMasterDashboard } from "@/app/components/QMOIMasterDashboard";

export default function MasterAdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto">
        <QMOIMasterDashboard />
      </div>
    </div>
  );
}
