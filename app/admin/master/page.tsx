"use client";

import { QMOIMasterDashboard } from "@/app/components/QMOIMasterDashboard";

export default function MasterAdminPage() {
  return (
    <div>
      <QMOIMasterDashboard />
    </div>
  );
}

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-spin">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            Access Denied
          </h1>
          <p className="text-slate-300">Master token not found or invalid</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto">
        <QMOIMasterDashboard />
      </div>
    </div>
  );
}
