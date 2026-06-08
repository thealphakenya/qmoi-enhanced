"use client";

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { persistUserToStorage } from '@/app/lib/auth/persistence';
import { logAuthEvent } from '@/app/lib/auth/memory';
import LoginForm from '@/app/components/auth/LoginForm';
import RegisterForm from '@/app/components/auth/RegisterForm';
import QMOIDashboard from '@/src/components/q-city/QMOIDashboard';
import DevicesHub from '@/src/components/q-city/DevicesHub';
import MetricsPanel from '@/src/components/q-city/MetricsPanel';
import SchedulePanel from '@/src/components/q-city/SchedulePanel';
import PluginPanel from '@/src/components/q-city/PluginPanel';
import { log as logger } from '@/lib/logger';

export default function QCityPage() {
  const { user, isAuthenticated, isLoading, hasAccess, login, refreshUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'devices' | 'metrics' | 'schedule' | 'plugins'>('dashboard');

  const handleLogin = useCallback(
    async (loginData: any) => {
      try {
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
            event: 'login',
            details: { source: 'qcity' },
          });
        }
        await refreshUser?.();
        logger.info('QCity login success', { userId: loginData?.id });
      } catch (error) {
        logger.error('QCity login failed', error as any);
      }
    },
    [refreshUser]
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout?.();
      logger.info('QCity logout success');
    } catch (error) {
      logger.error('QCity logout failed', error as any);
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
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-slate-400">Command Center</p>
              <h1 className="text-5xl font-extrabold text-white sm:text-6xl">QCity Hub</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-300">
                Unified control panel for QMOI operations. Master-level access to all QCity features, devices, metrics, and automations.
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

          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            {user?.role !== 'master' && (
              <button
                type="button"
                onClick={() => login?.('master')}
                className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-500 transition"
              >
                🔐 Upgrade to Master
              </button>
            )}
            {hasAccess?.('qvillage_access') && (
              <Link
                href="/qvillage"
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition"
              >
                🏘️ Open QVillage
              </Link>
            )}
            {hasAccess?.('qmoi_space_access') && (
              <Link
                href="/qmoi-space"
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition"
              >
                🚀 QMOI Space
              </Link>
            )}
            <Link
              href="/qmoi-ai"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition"
            >
              🤖 QMOI AI
            </Link>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-4">
          {['dashboard', 'devices', 'metrics', 'schedule', 'plugins'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Master Dashboard</h2>
              <QMOIDashboard />
            </section>
          )}

          {activeTab === 'devices' && (
            <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Connected Devices</h2>
              <DevicesHub />
            </section>
          )}

          {activeTab === 'metrics' && (
            <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">System Metrics</h2>
              <MetricsPanel />
            </section>
          )}

          {activeTab === 'schedule' && (
            <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Schedule & Automation</h2>
              <SchedulePanel />
            </section>
          )}

          {activeTab === 'plugins' && (
            <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Plugins & Extensions</h2>
              <PluginPanel />
            </section>
          )}
        </div>

        {/* Footer Info */}
        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
          <p className="text-sm text-slate-400">
            QCity v1.0 • Master Control Hub • Last sync: {new Date().toLocaleTimeString()}
          </p>
        </section>
      </div>
    </main>
  );
}
