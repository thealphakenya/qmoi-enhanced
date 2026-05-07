"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";

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
    status: "Staging",
    pricing: "$19.99/month",
  },
  {
    id: "MDL-415",
    name: "Predictive Analytics Engine",
    status: "Trial",
    pricing: "$7.99/use",
  },
];

export default function QVillagePage() {
  const { user, hasAccess } = useAuth();
  const [datasets, setDatasets] = useState(defaultDatasets);
  const [models, setModels] = useState(defaultModels);
  const [lastUpdated, setLastUpdated] = useState("");
  const canEditDatasets = hasAccess("qvillage_access") && user.role === "master";
  const canViewModels = hasAccess("qmoi_space_access");

  const roleCopy = useMemo(() => {
    if (user.role === "master") return "Full QVillage management and community coordination access.";
    if (user.role === "sister") return "Collaborative dataset sharing and marketplace access.";
    if (user.role === "user") return "Community dataset browsing and AI model access.";
    return "Guest access to public dataset summaries and onboarding.";
  }, [user.role]);

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
          setLastUpdated(data.lastUpdated || "");
        }
      } catch (error) {
        console.error("Failed to load QVillage spaces:", error);
      }
    }

    loadSpaces();
    return () => {
      active = false;
    };
  }, []);

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

        {/* Dataset Catalog */}
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
          <div className="mt-4 flex gap-2">
            <button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded text-sm transition-colors">Browse All Datasets</button>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors">Upload Dataset</button>
          </div>
        </section>

        {/* AI Model Marketplace */}
        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">AI Model Marketplace</h2>
          <p className="text-slate-400 mb-6">Deploy, test, and monetize AI models in the community marketplace.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map((model) => (
              <div key={model.id} className="bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{model.name}</h4>
                <p className="text-sm text-slate-400 mb-2">Status: {model.status}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-slate-700 px-2 py-1 rounded">{model.pricing}</span>
                  <button className="text-xs bg-purple-600 px-2 py-1 rounded">Use Model</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded text-sm transition-colors">Model Marketplace</button>
            <button className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-sm transition-colors">Deploy Your Model</button>
          </div>
        </section>

        {/* Community Workspace */}
        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Community Workspace</h2>
          <p className="text-slate-400 mb-6">Collaborate on research, share insights, and build together in real-time.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Active Research Projects</h4>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Neural Network Optimization Study</li>
                <li>• Cross-Platform Data Integration</li>
                <li>• AI Ethics Framework Development</li>
              </ul>
              <button className="mt-3 text-xs bg-cyan-600 px-3 py-1 rounded">Join Project</button>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Live Collaboration Sessions</h4>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Dataset Analysis Workshop (12 online)</li>
                <li>• Model Deployment Clinic (8 online)</li>
                <li>• Code Review Session (15 online)</li>
              </ul>
              <button className="mt-3 text-xs bg-cyan-600 px-3 py-1 rounded">Enter Session</button>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded text-sm transition-colors">Community Forum</button>
            <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm transition-colors">Create Project</button>
          </div>
        </section>

        {/* Revenue Tools */}
        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Revenue Analytics</h2>
          <p className="text-slate-400 mb-6">Track earnings from dataset sales, model subscriptions, and marketplace transactions.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">Monthly Revenue</h4>
              <div className="text-green-400 text-2xl">$2,847</div>
              <p className="text-sm text-slate-400">+12% from last month</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">Active Subscriptions</h4>
              <div className="text-blue-400 text-2xl">156</div>
              <p className="text-sm text-slate-400">23 new this week</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">Dataset Downloads</h4>
              <div className="text-purple-400 text-2xl">1,203</div>
              <p className="text-sm text-slate-400">89 this week</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">Model Usage</h4>
              <div className="text-orange-400 text-2xl">45,678</div>
              <p className="text-sm text-slate-400">API calls this month</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm transition-colors">Revenue Dashboard</button>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors">Payout Settings</button>
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

        {/* production Sync & Enterprise Features */}
        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">production Sync & Enterprise</h2>
          <p className="text-slate-400 mb-6">Seamless integration with production environments and enterprise-grade features.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">production Deployment</h4>
              <p className="text-sm text-slate-400 mb-3">Automated model deployment to production with rollback capabilities.</p>
              <div className="flex gap-2">
                <button className="text-xs bg-green-600 px-2 py-1 rounded">Deploy to Prod</button>
                <button className="text-xs bg-red-600 px-2 py-1 rounded">Rollback</button>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Enterprise Integration</h4>
              <p className="text-sm text-slate-400 mb-3">Connect with existing enterprise systems and workflows.</p>
              <div className="flex gap-2">
                <button className="text-xs bg-blue-600 px-2 py-1 rounded">API Integration</button>
                <button className="text-xs bg-purple-600 px-2 py-1 rounded">SSO Setup</button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm transition-colors">Enterprise Dashboard</button>
            <button className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded text-sm transition-colors">Compliance Reports</button>
          </div>
        </section>
      </div>
    </main>
  );
}
