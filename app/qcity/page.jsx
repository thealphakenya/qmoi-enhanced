"use client";

import React, { useMemo } from "react";
import { useAuth } from "../hooks/useAuth";

const metrics = [
  { label: "Connected Nodes", value: 128, delta: "+4%", status: "good" },
  { label: "Active Services", value: 34, delta: "+1%", status: "good" },
  { label: "Open Alerts", value: 3, delta: "-18%", status: "warning" },
  { label: "Incident Response", value: "2m 30s", delta: "-12%", status: "good" },
];

const services = [
  { name: "Water Supply Control", status: "operational" },
  { name: "Transit Management", status: "operational" },
  { name: "Energy Grid Monitoring", status: "degraded" },
  { name: "Public Safety Sensors", status: "operational" },
];

const incidentReports = [
  { id: "IQ-921", category: "Grid Load", summary: "Power surge detected in sector 7", severity: "high" },
  { id: "IQ-913", category: "Traffic", summary: "Signal sync disruption on 5th Avenue", severity: "medium" },
];

const getBadgeClass = (status) => {
  switch (status) {
    case "operational":
      return "bg-emerald-600/15 text-emerald-300 border-emerald-500/40";
    case "degraded":
      return "bg-amber-600/15 text-amber-300 border-amber-500/40";
    case "offline":
      return "bg-rose-600/15 text-rose-300 border-rose-500/40";
    default:
      return "bg-slate-700 text-slate-200 border-slate-600";
  }
};

export default function QCityDashboardPage() {
  const { user, hasAccess, login } = useAuth();
  const roleSummary = useMemo(() => {
    if (user.role === "master") return "Full enterprise control, deployment, and monitoring access.";
    if (user.role === "sister") return "Personal insights, collaboration, and creative workspace access.";
    if (user.role === "user") return "General QMOI features, chat, help, and view-only dashboards.";
    return "Guest access with limited AI and help support.";
  }, [user.role]);

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold">QCity Command Center</h1>
              <p className="mt-2 text-slate-400 max-w-2xl">
                {roleSummary}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-5 py-4 border border-slate-700">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Current user</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-300">{user.displayName}</p>
              <p className="text-slate-400">Role: {user.role}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {user.role !== "master" && (
              <button
                className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-500"
                onClick={() => login("master")}
              >
                Switch to Master Role
              </button>
            )}
            {hasAccess("qvillage_access") && (
              <a
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
                href="/qvillage"
              >
                Open QVillage
              </a>
            )}
            {hasAccess("qmoi_space_access") && (
              <a
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500"
                href="/qmoi-space.html"
              >
                Open QMOI Space
              </a>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{metric.label}</p>
              <p className="mt-4 text-4xl font-semibold text-white">{metric.value}</p>
              <p className={`mt-2 text-sm ${metric.status === "good" ? "text-emerald-300" : "text-amber-300"}`}>
                {metric.delta}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Service Operations</h2>
                <p className="mt-2 text-sm text-slate-400">Operational status for core city controls.</p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                Updated just now
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {services.map((service) => (
                <div key={service.name} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-4">
                  <div>
                    <p className="font-medium text-white">{service.name}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeClass(service.status)}`}>
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <h2 className="text-2xl font-semibold">Active Incident Reports</h2>
            <p className="mt-2 text-sm text-slate-400">Immediate issues requiring coordination.</p>
            <div className="mt-6 space-y-3">
              {incidentReports.map((incident) => (
                <div key={incident.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-white">{incident.category}</p>
                    <span className="rounded-full bg-rose-600/15 px-3 py-1 text-xs text-rose-300">{incident.severity}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{incident.summary}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">Report ID: {incident.id}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
