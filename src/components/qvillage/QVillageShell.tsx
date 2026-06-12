"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { AppShellHeader } from "@/components/shared/ui";
import ThemeSelector from "@/app/components/theme/ThemeSelector";
import { useTheme } from "next-themes";

const defaultDatasets = [
  {
    id: "DS-1001",
    name: "QMOI AI Conversations",
    description: "1.2M anonymized chat logs for training conversational models.",
    access: "Free",
    price: "0",
  },
  {
    id: "DS-1002",
    name: "Device Performance Metrics",
    description: "500K device logs across production and field environments.",
    access: "Paid",
    price: "$24.99",
  },
  {
    id: "DS-1003",
    name: "Marketplace Transaction History",
    description: "50K categorized revenue events and customer analytics.",
    access: "Paid",
    price: "$49.99",
  },
];

const defaultModels = [
  {
    id: "MDL-210",
    name: "Sentiment Analysis Pro",
    status: "Deployed",
    pricing: "$9.99/month",
  },
  {
    id: "MDL-311",
    name: "Image Recognition Enterprise",
    status: "Ready",
    pricing: "$19.99/month",
  },
  {
    id: "MDL-415",
    name: "Predictive Analytics Engine",
    status: "Available",
    pricing: "$7.99/use",
  },
];

export default function QVillageShell() {
  const { user, hasAccess, isAuthenticated, logout } = useAuth();
  const { theme, resolvedTheme } = useTheme();
  const [datasets, setDatasets] = useState(defaultDatasets);
  const [models, setModels] = useState(defaultModels);
  const [lastUpdated, setLastUpdated] = useState("");

  const effectiveTheme = theme === "system" ? resolvedTheme || "dark" : theme || "dark";
  const shellBackgroundClass =
    effectiveTheme === "light"
      ? "min-h-screen bg-slate-100 text-slate-950"
      : effectiveTheme === "high-contrast"
      ? "min-h-screen bg-black text-white"
      : "min-h-screen bg-slate-950 text-white";

  const canEditDatasets = hasAccess?.("qvillage_access") && user?.role === "master";
  const canViewModels = hasAccess?.("qmoi_space_access");

  const roleCopy = useMemo(() => {
    if (user?.role === "master") return "Full QVillage management and community coordination access.";
    if (user?.role === "sister") return "Collaborative dataset sharing and marketplace access.";
    if (user?.role === "user") return "Community dataset browsing and AI model access.";
    return "Guest access to public dataset summaries and onboarding.";
  }, [user?.role]);

  useEffect(() => {
    let active = true;

    async function loadSpaces() {
      try {
        const res = await fetch("/api/qvillage/spaces", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        if (data?.success) {
          setDatasets(data.datasets || defaultDatasets);
          setModels(data.models || defaultModels);
          setLastUpdated(data.lastUpdated || new Date().toISOString());
        }
      } catch (error) {
        console.error?.("Failed to load QVillage spaces:", error);
      }
    }

    loadSpaces();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className={`${shellBackgroundClass} p-8`}>
      <div className="max-w-6xl mx-auto space-y-8">
        <AppShellHeader
          title="QVillage"
          tagline="Community datasets and collaborative AI model deployment hub with role-aware access."
          iconKey="qvillage"
          accentColor="#22c55e"
          statusMessage={`Session status: ${isAuthenticated ? "Authenticated" : "Guest"} • Role: ${user?.role || "guest"}`}
        />
        <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold">QVillage</h1>
              <p className="mt-2 text-slate-400 max-w-2xl">{roleCopy}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-5 py-4 border border-slate-700 text-right">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Current role</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-300">{user?.role || "guest"}</p>
              <p className="text-slate-400">{user?.displayName || "Anonymous"}</p>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_0.6fr] items-center">
          <ThemeSelector />
          <div className="flex items-center gap-2 justify-end">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => window.location.assign('/universal?redirect=/qvillage&mode=signin')}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Log in
                </button>
                <button
                  onClick={() => window.location.assign('/universal?redirect=/qvillage&mode=register')}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-white/90"
                >
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  logout().finally(() => window.location.reload());
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
              >
                Log out
              </button>
            )}
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
              <li>• Model discovery and deployment</li>
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Dataset Catalog</h2>
              <p className="text-slate-400">Browse and access community-shared datasets for AI training and analysis.</p>
            </div>
            {lastUpdated && (
              <span className="text-sm text-slate-500">Updated {new Date(lastUpdated).toLocaleString()}</span>
            )}
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasets.map((dataset) => (
              <div key={dataset.id} className="bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{dataset.name}</h4>
                <p className="text-sm text-slate-400 mb-2">{dataset.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-slate-700 px-2 py-1 rounded">{dataset.access}</span>
                  <button className="text-xs bg-blue-600 px-2 py-1 rounded">
                    {dataset.access === "Free" ? "Download" : "Purchase"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Model Registry</h2>
                <p className="text-slate-400">Review community AI deployments and model marketplace details.</p>
              </div>
              {lastUpdated && (
                <span className="text-sm text-slate-500">Updated {new Date(lastUpdated).toLocaleString()}</span>
              )}
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models.map((model) => (
                <div key={model.id} className="bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{model.name}</h4>
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{model.status}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">Pricing: {model.pricing}</p>
                  <button className="w-full rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500">
                    View Model
                  </button>
                </div>
              ))}
              {models.length === 0 && (
                <div className="rounded-3xl border border-slate-700 bg-slate-950/50 p-6 text-sm text-slate-300">
                  No models available yet. Ensure QMOI Space access and community model sync are configured.
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded text-sm transition-colors">Browse All Datasets</button>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors">Upload Dataset</button>
          </div>
        </section>
      </div>
    </main>
  );
}
