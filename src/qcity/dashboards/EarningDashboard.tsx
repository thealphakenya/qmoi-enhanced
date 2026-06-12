"use client";

import React, { useEffect, useState } from "react";
import { readPersistedUser } from "@/app/lib/auth/persistence";
import { log as logger } from "@/lib/logger";

interface RevenueMetric {
  label: string;
  value: string;
  change: string;
}

const revenueMetrics: RevenueMetric[] = [
  { label: "Monthly Revenue", value: "$1.24M", change: "+8.9%" },
  { label: "Gross Margin", value: "62%", change: "+2.4%" },
  { label: "Forecast Accuracy", value: "93%", change: "+1.1%" },
];

const EarningDashboard: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    try {
      const persistedUser = readPersistedUser();
      setIsMaster(persistedUser?.role === "master");
      setUserName(persistedUser?.displayName ?? "Guest");
    } catch (error) {
      logger.warn(
        "EarningDashboard failed to read persisted auth state",
        error instanceof Error ? { message: error.message, stack: error.stack } : { error: String(error) }
      );
    } finally {
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-200">
        <h2 className="text-lg font-semibold">Earning Dashboard</h2>
        <p className="mt-2 text-sm text-slate-400">Loading user access...</p>
      </div>
    );
  }

  if (!isMaster) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
        <h2 className="text-lg font-semibold">Access Denied</h2>
        <p className="mt-2 text-sm">Master users only. Your role does not allow access to the earnings engine.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-100">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Earning Dashboard</h2>
          <p className="text-sm text-slate-400">Welcome back, {userName}. Review the latest financial signals below.</p>
        </div>
        <span className="rounded-full bg-cyan-600 px-3 py-1 text-sm font-medium text-white">Master Access</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {revenueMetrics.map((metric) => (
          <div key={metric.label} className="rounded-lg bg-slate-900 border border-slate-700 p-4">
            <p className="text-sm text-slate-400">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
            <p className="mt-1 text-sm text-green-400">{metric.change} vs last period</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-slate-900 border border-slate-700 p-4">
        <h3 className="text-lg font-semibold">Revenue Notes</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li>QMOI earnings forecast remains strong across core engineering and automation pipelines.</li>
          <li>Watch the external market indicator for new risk signals in the next 24 hours.</li>
          <li>Ensure master-level approvals are in place for any high-value deployments.</li>
        </ul>
      </div>
    </div>
  );
};

export default EarningDashboard;
