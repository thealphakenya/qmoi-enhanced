"use client";

import React, { useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/app/hooks/useAuth";
import { persistUserToStorage } from "@/app/lib/auth/persistence";
import { log as logger } from "@/lib/logger";
import { AppShellHeader } from "@/components/shared/ui";
import ThemeSelector from "@/components/theme/ThemeSelector";
import { RoleGate } from "@/src/components/auth/RoleGate";
import { getRoleStyles, getRoleGreeting, getRoleButtonStyle } from "@/lib/rbac/roleStyles";
import { getAccessibleFeatures } from "@/lib/rbac/roleFeatures";
import QMOIChat from "./QMOIChat";
import AvatarDisplay from "./AvatarDisplay";

export default function QMOIAIShell() {
  const { theme, resolvedTheme } = useTheme();
  const { user, isAuthenticated, isLoading, login, logout, refreshUser, hasAccess } = useAuth();

  const effectiveTheme = theme === "system" ? resolvedTheme || "dark" : theme || "dark";
  const shellBackgroundClass =
    effectiveTheme === "light"
      ? "min-h-screen bg-slate-100 text-slate-950"
      : effectiveTheme === "high-contrast"
      ? "min-h-screen bg-black text-white"
      : "min-h-screen bg-slate-950 text-white";

  const roleStyles = useMemo(() => getRoleStyles(user.role), [user.role]);
  const accessibleFeatures = useMemo(
    () => getAccessibleFeatures("qmoiAI", user.role),
    [user.role],
  );

  const handleLogin = useCallback(async () => {
    try {
      await login?.("user");
      persistUserToStorage(user);
      await refreshUser?.();
      logger.info("QMOI AI login success", { userId: user?.id, role: user?.role });
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
          statusMessage={`Session: ${isAuthenticated ? "Authenticated" : "Guest"} • Role: ${user?.role} • Access Level: ${user?.accessLevel}`}
        />

        {/* Role-Specific Welcome Card */}
        {isAuthenticated && (
          <section
            className={`rounded-3xl bg-gradient-to-br ${roleStyles.headerClass} border ${roleStyles.borderClass} p-6 shadow-xl`}
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-full ${roleStyles.badgeClass} px-3 py-2 text-xs font-semibold uppercase`}>
                {user.role}
              </div>
              <div className="flex-1">
                <p className={`text-lg font-bold ${roleStyles.accentClass}`}>{getRoleGreeting(user.role, user.displayName)}</p>
                <p className="mt-1 text-sm text-slate-400">
                  Available features: {accessibleFeatures.length} • Access level: {user.accessLevel}%
                </p>
              </div>
            </div>
          </section>
        )}
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
                    className={`mt-3 ${getRoleButtonStyle("user")}`}
                  >
                    Sign in to QMOI AI
                  </button>
                )}
              </div>
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
          <>
            {/* Chat Feature */}
            <RoleGate
              feature="chat"
              category="qmoiAI"
              role={user.role}
              showRestrictionMessage={true}
              fallback={
                <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl text-center">
                  <p className="text-slate-300">Chat feature is not available for your role.</p>
                </section>
              }
            >
              <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-white">Chat Interface</h2>
                    <p className="text-sm text-slate-400">Interactive AI conversation with role-aware responses</p>
                  </div>
                  <QMOIChat />
                </div>
                <div className="space-y-6">
                  <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
                    <AvatarDisplay name={user?.displayName || "QMOI User"} isActive={true} />
                  </div>

                  {/* Advanced Models Feature (Master Only) */}
                  <RoleGate
                    feature="advanced_models"
                    category="qmoiAI"
                    role={user.role}
                    fallback={
                      <div className="rounded-3xl bg-slate-900/50 p-4 border border-slate-700/50 text-center">
                        <p className="text-xs text-slate-400">Advanced models available for master users</p>
                      </div>
                    }
                  >
                    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
                      <h3 className="text-sm font-semibold text-white">Advanced Models</h3>
                      <p className="mt-2 text-xs text-slate-400">
                        Access to experimental and fine-tuned models.
                      </p>
                      <button
                        type="button"
                        className={`mt-4 w-full ${getRoleButtonStyle(user.role, "primary")}`}
                      >
                        Manage Models
                      </button>
                    </div>
                  </RoleGate>

                  {/* Chat History Export (Master & Sister) */}
                  <RoleGate
                    feature="chat_export"
                    category="qmoiAI"
                    role={user.role}
                    fallback={
                      user.role === "user" ? (
                        <div className="rounded-3xl bg-slate-900/50 p-4 border border-slate-700/50 text-center">
                          <p className="text-xs text-slate-400">Export available for master and sister roles</p>
                        </div>
                      ) : null
                    }
                  >
                    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
                      <h3 className="text-sm font-semibold text-white">Export Chat</h3>
                      <p className="mt-2 text-xs text-slate-400">
                        Export conversation history for backup or analysis.
                      </p>
                      <button
                        type="button"
                        className={`mt-4 w-full ${getRoleButtonStyle(user.role, "secondary")}`}
                      >
                        Export Chat History
                      </button>
                    </div>
                  </RoleGate>

                  <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm text-slate-300">
                    <p className="text-sm">
                      QMOI AI responds contextually based on your role and available features, providing personalized insights and capabilities.
                    </p>
                  </div>
                </div>
              </section>
            </RoleGate>
          </>
        )}
      </div>
    </main>
  );
}
