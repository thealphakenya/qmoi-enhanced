"use client";

import React, { useCallback } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/app/hooks/useAuth";
import { persistUserToStorage } from "@/app/lib/auth/persistence";
import { log as logger } from "@/lib/logger";
import { AppShellHeader } from "@/components/shared/ui";
import ThemeSelector from "@/components/theme/ThemeSelector";
import QMOIChat from "./QMOIChat";
import AvatarDisplay from "./AvatarDisplay";

export default function QMOIAIShell() {
  const { theme, resolvedTheme } = useTheme();
  const { user, isAuthenticated, isLoading, login, logout, refreshUser } = useAuth();

  const effectiveTheme = theme === "system" ? resolvedTheme || "dark" : theme || "dark";
  const shellBackgroundClass =
    effectiveTheme === "light"
      ? "min-h-screen bg-slate-100 text-slate-950"
      : effectiveTheme === "high-contrast"
      ? "min-h-screen bg-black text-white"
      : "min-h-screen bg-slate-950 text-white";

  const handleLogin = useCallback(async () => {
    try {
      await login?.("user");
      persistUserToStorage(user);
      await refreshUser?.();
      logger.info("QMOI AI login success", { userId: user?.id });
    } catch (error) {
      logger.error("QMOI AI login failed", error as any);
    }
  }, [login, refreshUser, user]);

  const handleLogout = useCallback(async () => {
    try {
      await logout?.();
      logger.info("QMOI AI logout success");
    } catch (error) {
      logger.error("QMOI AI logout failed", error as any);
    }
  }, [logout]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="flex h-screen items-center justify-center">
          <div className="text-slate-300">Loading QMOI AI...</div>
        </div>
      </main>
    );
  }

  return (
    <main className={`${shellBackgroundClass} p-8`}>
      <div className="mx-auto max-w-6xl space-y-8">
        <AppShellHeader
          title="QMOI AI Workspace"
          tagline="Quantum AI production shell with live chat, role-aware access, and centralized app branding."
          iconKey="qmoi-ai"
          accentColor="#0ea5e9"
        />
        <section className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <div className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-slate-400">QMOI AI</p>
              <h1 className="text-5xl font-extrabold text-white sm:text-6xl">Quantum AI Workspace</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-300">
                The QMOI AI dashboard is now anchored to source components in `src/components/qmoi/` for production-level AI conversation and avatar presentation.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-5 py-4 border border-slate-700 text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">User Status</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-300">{user?.displayName || "Guest"}</p>
              <p className="text-sm text-slate-400">Role: {user?.role || "guest"}</p>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 text-xs text-slate-400 hover:text-white underline"
                >
                  Logout
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLogin}
                  className="mt-3 rounded-xl bg-cyan-600 px-5 py-3 text-xs font-semibold text-white hover:bg-cyan-500"
                >
                  Sign in to QMOI AI
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">UI Theme</h2>
              <p className="text-sm text-slate-400">Pick a shared QMOI theme for the AI shell and the wider app family.</p>
            </div>
          </div>
          <div className="mt-5">
            <ThemeSelector />
          </div>
        </section>

        {!isAuthenticated ? (
          <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl text-center">
            <p className="text-slate-300">Please sign in to interact with the AI experience.</p>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <QMOIChat />
            </div>
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
                <AvatarDisplay name={user?.displayName || "QMOI User"} isActive={true} />
              </div>
              <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm text-slate-300">
                <p className="text-sm">QMOI AI uses the production model and live source wiring for interactive chat, avatar rendering, and conversational workflows.</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
