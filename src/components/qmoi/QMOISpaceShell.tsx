"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "@/app/hooks/useAuth";
import { log as logger } from "@/lib/logger";
import { AppShellHeader } from "@/components/shared/ui";
import ThemeSelector from "@/components/theme/ThemeSelector";
import AvatarDisplay from "./AvatarDisplay";
import ProjectManagement from "./ProjectManagement";
import FriendshipUI from "./FriendshipUI";

const defaultSpaceStats = {
  activeProjects: 14,
  sharedDatasets: 82,
  modelDeployments: 6,
};

export default function QMOISpaceShell() {
  const { theme, resolvedTheme } = useTheme();
  const { user, isAuthenticated, isLoading, login, logout, refreshUser } = useAuth();

  const effectiveTheme = theme === "system" ? resolvedTheme || "dark" : theme || "dark";
  const shellBackgroundClass =
    effectiveTheme === "light"
      ? "min-h-screen bg-slate-100 text-slate-950"
      : effectiveTheme === "high-contrast"
      ? "min-h-screen bg-black text-white"
      : "min-h-screen bg-slate-950 text-white";

  const handleLogin = async () => {
    try {
      await login?.("user");
      await refreshUser?.();
      logger.info("QMOI Space login success", { userId: user?.id });
    } catch (error) {
      logger.error("QMOI Space login failed", error as any);
    }
  };

  const handleLogout = async () => {
    try {
      await logout?.();
      logger.info("QMOI Space logout success");
    } catch (error) {
      logger.error("QMOI Space logout failed", error as any);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="flex h-screen items-center justify-center">
          <div className="text-slate-300">Loading QMOI Space...</div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto flex max-w-4xl flex-col gap-8">
          <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
            <h1 className="text-4xl font-bold">QMOI Space Access</h1>
            <p className="mt-4 text-slate-400">Sign in to access the QMOI Space channels and source-level collaboration tools.</p>
          </section>
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl text-center">
              <button
                type="button"
                onClick={handleLogin}
                className="rounded-2xl bg-cyan-600 px-6 py-4 text-sm font-semibold text-white hover:bg-cyan-500"
              >
                Sign in to QMOI Space
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={`${shellBackgroundClass} p-8`}>
      <div className="mx-auto max-w-6xl space-y-10">
        <AppShellHeader
          title="QMOI Space"
          tagline="Source-connected collaboration shell with project management, dataset sharing, and live community access."
          iconKey="qmoi-space"
          accentColor="#8b5cf6"
        />
        <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-slate-400">QMOI Space</p>
              <h1 className="text-5xl font-extrabold text-white sm:text-6xl">Source-Connected Collaboration</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-300">
                A production entry page now served from `src/components/qmoi/` source modules for projects, friendships, and avatar presence.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-5 py-4 border border-slate-700 text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Active User</p>
              <p className="mt-2 text-3xl font-semibold text-violet-300">{user?.displayName || "Guest"}</p>
              <p className="text-slate-400">Role: {user?.role || "guest"}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 text-xs text-slate-400 hover:text-white underline"
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Theme & Style</h2>
              <p className="text-sm text-slate-400">Choose a shared UI theme that applies across the QMOI suite.</p>
            </div>
          </div>
          <div className="mt-5">
            <ThemeSelector />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <ProjectManagement userId={user?.id ?? ""} />
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Social Collaboration</h2>
              <FriendshipUI userId={user?.id ?? ""} />
            </div>
            <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <AvatarDisplay name={user?.displayName || "QMOI User"} quality="Collaborative" isActive={true} />
              <div className="mt-6 grid gap-3">
                <Link href="/qmoi-ai" className="rounded-2xl bg-cyan-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-cyan-500">
                  Open QMOI AI
                </Link>
                <Link href="/qcity" className="rounded-2xl bg-violet-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-violet-500">
                  Open QCity
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
            <div className="text-4xl font-semibold text-violet-300">{defaultSpaceStats.activeProjects}</div>
            <p className="mt-2 text-sm text-slate-400">active projects</p>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
            <div className="text-4xl font-semibold text-violet-300">{defaultSpaceStats.sharedDatasets}</div>
            <p className="mt-2 text-sm text-slate-400">shared datasets</p>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
            <div className="text-4xl font-semibold text-violet-300">{defaultSpaceStats.modelDeployments}</div>
            <p className="mt-2 text-sm text-slate-400">model deployments</p>
          </div>
        </section>
      </div>
    </main>
  );
}
