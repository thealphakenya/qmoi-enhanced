"use client";

import React, { useMemo } from "react";
import { useAuth } from "../hooks/useAuth";

export default function QVillagePage() {
  const { user, hasAccess } = useAuth();
  const canEditDatasets = hasAccess("qvillage_access") && user.role === "master";
  const canViewModels = hasAccess("qmoi_space_access");

  const roleCopy = useMemo(() => {
    if (user.role === "master") return "Full QVillage management and community coordination access.";
    if (user.role === "sister") return "Collaborative dataset sharing and marketplace access.";
    if (user.role === "user") return "Community dataset browsing and AI model access.";
    return "Guest access to public dataset summaries and onboarding.";
  }, [user.role]);

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold">QVillage</h1>
              <p className="mt-2 text-slate-400 max-w-2xl">{roleCopy}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-5 py-4 border border-slate-700 text-right">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Current role</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-300">{user.role}</p>
              <p className="text-slate-400">{user.displayName}</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <h2 className="text-2xl font-semibold mb-3">Datasets</h2>
            <p className="text-slate-400 mb-4">Manage, share, and analyze data generated across the QMOI ecosystem.</p>
            <ul className="space-y-3 text-slate-300">
              <li>• Community dataset catalog</li>
              <li>• Secure sharing controls</li>
              <li>• Marketplace-ready dataset publishing</li>
              <li>• AI-backed dataset recommendations</li>
            </ul>
            {canEditDatasets ? (
              <button className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500">
                Manage Datasets
              </button>
            ) : (
              <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950/50 p-4 text-sm text-slate-300">
                Upgrade to Master for dataset management rights.
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <h2 className="text-2xl font-semibold mb-3">Model Deployment</h2>
            <p className="text-slate-400 mb-4">Collaborative AI model development with production sync and inference.</p>
            <ul className="space-y-3 text-slate-300">
              <li>• Model discovery and staging</li>
              <li>• Continuous training pipelines</li>
              <li>• Community research notebooks</li>
              <li>• Deployment history & status</li>
            </ul>
            {canViewModels ? (
              <button className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500">
                Explore Models
              </button>
            ) : (
              <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950/50 p-4 text-sm text-slate-300">
                QMOI Space access required to review model deployments.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">QVillage Automation</h2>
          <p className="text-slate-400 mb-4">QVillage automates dataset sync, model updates, and community publishing across PWA and enterprise platforms.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="font-semibold text-white">Sync Status</p>
              <p className="mt-2 text-slate-300">Active</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="font-semibold text-white">Offline Support</p>
              <p className="mt-2 text-slate-300">Enabled</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="font-semibold text-white">Community Rate</p>
              <p className="mt-2 text-slate-300">24/7</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
