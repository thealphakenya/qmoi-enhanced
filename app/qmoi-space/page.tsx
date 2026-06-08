"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { useAuth } from '@/app/hooks/useAuth';
import { persistUserToStorage } from "../lib/auth/persistence";
import { logAuthEvent } from "../lib/auth/memory";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import AvatarDisplay from '@/src/components/qmoi/AvatarDisplay';
import ProjectManagement from '@/src/components/qmoi/ProjectManagement';
import FriendshipUI from '@/src/components/qmoi/FriendshipUI';

const defaultSpaceStats = {
  activeProjects: 14,
  sharedDatasets: 82,
  modelDeployments: 6,
};

export default function QMoiSpacePage() {
  const { user, isAuthenticated, isLoading, refreshUser, logout } = useAuth();

  const handleLogin = useCallback(
    async (loginData: any) => {
      if (loginData) {
        persistUserToStorage({
          id: loginData.id,
          role: loginData.role,
          displayName: loginData.displayName,
        });
        logAuthEvent({
          userId: loginData.id,
          role: loginData.role,
          displayName: loginData.displayName,
          event: "login",
          details: { source: "qmoi-space" },
        });
      }
      await refreshUser();
    },
    [refreshUser],
  );

  const handleLogout = useCallback(async () => {
    await logout();
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
            <div className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
              <LoginForm onLogin={handleLogin} />
            </div>
            <div className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
              <RegisterForm />
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-slate-400">QMOI Space</p>
              <h1 className="text-5xl font-extrabold text-white sm:text-6xl">Source-Connected Collaboration</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-300">
                This page is now anchored to source modules in `src/components/qmoi/` for project planning and social collaboration.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-5 py-4 border border-slate-700 text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Active User</p>
              <p className="mt-2 text-3xl font-semibold text-violet-300">{user.displayName}</p>
              <p className="text-slate-400">Role: {user.role}</p>
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

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <ProjectManagement userId={user.id} />
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Social Collaboration</h2>
              <FriendshipUI userId={user.id} />
            </div>
            <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <AvatarDisplay name={user.displayName} quality="Collaborative" isActive={true} />
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
