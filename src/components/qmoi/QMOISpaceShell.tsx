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
    () => getAccessibleFeatures("qmoiSpace", user.role),
    [user.role],
  );

  const handleLogin = useCallback(async () => {
    try {
      await login?.("user");
      persistUserToStorage(user);
      await refreshUser?.();
      logger.info("QMOI Space login success", { userId: user?.id, role: user?.role });
    } catch (error) {
      logger.error("QMOI Space login failed", error as any);
    }
  }, [login, refreshUser, user]);

  const handleLogout = useCallback(async () => {
    try {
      await logout?.();
      logger.info("QMOI Space logout success");
    } catch (error) {
      logger.error("QMOI Space logout failed", error as any);
    }
  }, [logout]);

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
              <p className={`mt-2 text-3xl font-semibold ${roleStyles.accentClass}`}>{user?.displayName || "Guest"}</p>
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
          {/* Project Management Feature - Role-Gated */}
          <RoleGate
            feature="view_projects"
            category="qmoiSpace"
            role={user.role}
            fallback={
              <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm text-center">
                <p className="text-slate-300">Project management is not available for your role.</p>
              </div>
            }
          >
            <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <ProjectManagement userId={user?.id ?? ""} />
            </div>
          </RoleGate>

          <div className="space-y-6">
            {/* Social Collaboration - Role-Gated */}
            <RoleGate
              feature="manage_friendships"
              category="qmoiSpace"
              role={user.role}
              fallback={
                <div className="rounded-3xl bg-slate-900/50 p-6 border border-slate-700/50 shadow-sm text-center">
                  <p className="text-xs text-slate-400">Friendship management available for authenticated users</p>
                </div>
              }
            >
              <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Social Collaboration</h2>
                <FriendshipUI userId={user?.id ?? ""} />
              </div>
            </RoleGate>

            <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <AvatarDisplay name={user?.displayName || "QMOI User"} quality="Collaborative" isActive={true} />
              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  className={`rounded-2xl ${getRoleButtonStyle(user.role, "primary")} text-center`}
                  onClick={() => (window.location.href = "/qmoi-ai")}
                >
                  Open QMOI AI
                </button>
                <button
                  type="button"
                  className={`rounded-2xl ${getRoleButtonStyle(user.role, "secondary")} text-center`}
                  onClick={() => (window.location.href = "/qcity")}
                >
                  Open QCity
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RoleGate
            feature="view_projects"
            category="qmoiSpace"
            role={user.role}
            fallback={
              <div className="rounded-3xl bg-slate-900/50 p-6 border border-slate-700/50 text-center">
                <div className="text-2xl font-semibold text-slate-400">-</div>
                <p className="mt-2 text-xs text-slate-500">projects unavailable</p>
              </div>
            }
          >
            <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
              <div className={`text-4xl font-semibold ${roleStyles.accentClass}`}>{defaultSpaceStats.activeProjects}</div>
              <p className="mt-2 text-sm text-slate-400">active projects</p>
            </div>
          </RoleGate>

          <RoleGate
            feature="upload_dataset"
            category="qmoiSpace"
            role={user.role}
            fallback={
              <div className="rounded-3xl bg-slate-900/50 p-6 border border-slate-700/50 text-center">
                <div className="text-2xl font-semibold text-slate-400">-</div>
                <p className="mt-2 text-xs text-slate-500">datasets unavailable</p>
              </div>
            }
          >
            <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
              <div className={`text-4xl font-semibold ${roleStyles.accentClass}`}>{defaultSpaceStats.sharedDatasets}</div>
              <p className="mt-2 text-sm text-slate-400">shared datasets</p>
            </div>
          </RoleGate>

          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
            <div className={`text-4xl font-semibold ${roleStyles.accentClass}`}>{defaultSpaceStats.modelDeployments}</div>
            <p className="mt-2 text-sm text-slate-400">model deployments</p>
          </div>
        </section>
      </div>
    </main>
  );
}
