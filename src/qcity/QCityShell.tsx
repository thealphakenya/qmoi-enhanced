"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "@/app/hooks/useAuth";
import { log as logger } from "@/lib/logger";
import { AppShellHeader } from "@/components/shared/ui";
import QCityThemeProvider from "@/components/QCityThemeProvider";
import QMOIDashboard from "./dashboards/QMOIDashboard";
import DevicesHub from "./DevicesHub";
import MetricsPanel from "./MetricsPanel";
import SchedulePanel from "./SchedulePanel";
import PluginPanel from "./PluginPanel";

export default function QCityShell() {
  const { theme, resolvedTheme } = useTheme();
  const { user, isAuthenticated, isLoading, hasAccess, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "devices" | "metrics" | "schedule" | "plugins">("dashboard");

  const effectiveTheme = theme === "system" ? resolvedTheme || "dark" : theme || "dark";
  const shellBackgroundClass =
    effectiveTheme === "light"
      ? "min-h-screen bg-slate-100 text-slate-950"
      : effectiveTheme === "high-contrast"
      ? "min-h-screen bg-black text-white"
      : "min-h-screen bg-slate-950 text-white";

  const handleLoginAsMaster = useCallback(async () => {
    try {
      await login?.("master");
      logger.info("QCity master upgrade requested");
    } catch (error) {
      logger.error("QCity master upgrade failed", error as any);
    }
  }, [login]);

  const handleLogout = useCallback(async () => {
    try {
      await logout?.();
      logger.info("QCity logout success");
    } catch (error) {
      logger.error("QCity logout failed", error as any);
    }
  }, [logout]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="flex h-screen items-center justify-center">
          <div className="text-slate-300">Loading QCity...</div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto flex max-w-4xl flex-col gap-8">
          <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
            <h1 className="text-4xl font-bold">QCity Access</h1>
            <p className="mt-4 text-slate-400">Sign in to open the QCity command center and real source-level dashboards.</p>
          </section>
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl text-center">
              <button
                type="button"
                onClick={handleLoginAsMaster}
                className="rounded-2xl bg-cyan-600 px-6 py-4 text-sm font-semibold text-white hover:bg-cyan-500"
              >
                Sign in to QCity
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={`${shellBackgroundClass} p-8`}>
      <div className="mx-auto max-w-7xl space-y-8">
        <AppShellHeader
          title="QCity Hub"
          tagline="Unified command center for QMOI operations with live role-aware dashboards and secure enterprise controls."
          iconKey="qcity"
          accentColor="#06b6d4"
        />
        <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-slate-400">Command Center</p>
              <h1 className="text-5xl font-extrabold text-white sm:text-6xl">QCity Hub</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-300">
                Unified control panel for QMOI operations, anchored in source components under `src/components/q-city/`.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-5 py-4 border border-slate-700 text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Logged in as</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-300">{user?.displayName || "Guest"}</p>
              <p className="text-sm text-slate-400">Role: {user?.role || "guest"}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 text-xs text-slate-400 hover:text-white underline"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {user?.role !== "master" && (
              <button
                type="button"
                onClick={handleLoginAsMaster}
                className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-500 transition"
              >
                🔐 Upgrade to Master
              </button>
            )}
            {hasAccess?.("qvillage_access") && (
              <Link href="/qvillage" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition">
                🏘️ Open QVillage
              </Link>
            )}
            {hasAccess?.("qmoi_space_access") && (
              <Link href="/qmoi-space" className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition">
                🚀 QMOI Space
              </Link>
            )}
            <Link href="/qmoi-ai" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition">
              🤖 QMOI AI
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
          <QCityThemeProvider />
        </section>

        <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-4">
          {(["dashboard", "devices", "metrics", "schedule", "plugins"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {activeTab === "dashboard" && (
            <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Master Dashboard</h2>
              <QMOIDashboard />
            </section>
          )}
          {activeTab === "devices" && (
            <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Connected Devices</h2>
              <DevicesHub />
            </section>
          )}
          {activeTab === "metrics" && (
            <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">System Metrics</h2>
              <MetricsPanel />
            </section>
          )}
          {activeTab === "schedule" && (
            <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Schedule & Automation</h2>
              <SchedulePanel />
            </section>
          )}
          {activeTab === "plugins" && (
            <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Plugins & Extensions</h2>
              <PluginPanel />
            </section>
          )}
        </div>

        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
          <p className="text-sm text-slate-400">QCity v1.0 • Master Control Hub • Last sync: {new Date().toLocaleTimeString()}</p>
        </section>
      </div>
    </main>
  );
}
