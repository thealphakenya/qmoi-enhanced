"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import AdminDashboard from "../components/AdminDashboard";
import ChatMessaging from "../components/ChatMessaging";
import QMOIAutoFixDashboard from "../components/QMOIAutoFixDashboard";
import QMOIAutoSetup from "../components/QMOIAutoSetup";
import FileUploadDownload from "../components/FileUploadDownload";
import VisualEnhancement from "../components/VisualEnhancement";
import AudibleConversation from "../components/AudibleConversation";
import ClientUISettings from "../components/ClientUISettings";
import { QMOIMasterDashboard } from "../components/QMOIMasterDashboard";
import SponsoredUsersManager from "../components/SponsoredUsersManager";
import UserProfile from "../components/user/UserProfile";
import WalletList from "../components/wallet/WalletList";
import RegisterForm from "../components/auth/RegisterForm";
import QVillage from "../components/QVillage";
import QVillageDatasetsPanel from "../components/QVillageDatasetsPanel";
import QCityErrorManager from "../components/QCityErrorManager";
import QCityThemeProvider from "../components/QCityThemeProvider";
import DeploymentManager from "../components/DeploymentManager";
import TestingAutomationSuite from "../components/TestingAutomationSuite";
import MonitoringDashboard from "../components/MonitoringDashboard";
import ComplianceManager from "../components/ComplianceManager";

interface Metric {
  label: string;
  value: number | string;
  delta: string;
  status: "good" | "warning";
}

interface Service {
  name: string;
  status: "operational" | "degraded" | "offline";
}

interface Incident {
  id: string;
  category: string;
  summary: string;
  severity: "low" | "medium" | "high";
}

interface StatusSummary {
  overallHealth: string;
  uptime: string;
  activeAlerts: number;
}

const defaultMetrics: Metric[] = [
  { label: "Connected Nodes", value: 128, delta: "+4%", status: "good" },
  { label: "Active Services", value: 34, delta: "+1%", status: "good" },
  { label: "Open Alerts", value: 3, delta: "-18%", status: "warning" },
  { label: "Incident Response", value: "2m 30s", delta: "-12%", status: "good" },
];

const defaultServices: Service[] = [
  { name: "Water Supply Control", status: "operational" },
  { name: "Transit Management", status: "operational" },
  { name: "Energy Grid Monitoring", status: "degraded" },
  { name: "Public Safety Sensors", status: "operational" },
];

const defaultIncidents: Incident[] = [
  { id: "IQ-921", category: "Grid Load", summary: "Power surge detected in sector 7", severity: "high" },
  { id: "IQ-913", category: "Traffic", summary: "Signal sync disruption on 5th Avenue", severity: "medium" },
];

const getBadgeClass = (status: string): string => {
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

export default function QCityDashboardPage(): React.ReactElement {
  const { user, hasAccess: checkAccess, login } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>(defaultMetrics);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [incidentReports, setIncidentReports] = useState<Incident[]>(defaultIncidents);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [statusSummary, setStatusSummary] = useState<StatusSummary>({
    overallHealth: "operational",
    uptime: "99.98%",
    activeAlerts: 2,
  });

  useEffect(() => {
    let active = true;

    const loadStatus = async (): Promise<void> => {
      try {
        const [metricsRes, statusRes] = await Promise.all([
          fetch("/api/qcity/metrics", { cache: "no-store" }),
          fetch("/api/qcity/status", { cache: "no-store" }),
        ]);

        if (!active) return;

        const metricsJson = await metricsRes.json();
        const statusJson = await statusRes.json();

        if (metricsJson?.success) {
          setMetrics(metricsJson.metrics || defaultMetrics);
          setLastUpdated(metricsJson.lastUpdated || "");
          if (metricsJson.summary) {
            setStatusSummary((prev) => ({ ...prev, ...metricsJson.summary }));
          }
        }

        if (statusJson?.success) {
          setServices(statusJson.serviceStatus || defaultServices);
          setIncidentReports(statusJson.incidentReports || defaultIncidents);
          setLastUpdated(statusJson.lastChecked || lastUpdated);
          if (statusJson.summary) {
            setStatusSummary((prev) => ({ ...prev, ...statusJson.summary }));
          }
        }
      } catch (error) {
        console.error("Failed to load QCity status:", error as Error);
      }
    };

    loadStatus();

    return () => {
      active = false;
    };
  }, [lastUpdated]);

  const roleSummary = useMemo<string>(() => {
    if (user?.role === "master") return "Full enterprise control, deployment, and monitoring access.";
    if (user?.role === "sister") return "Personal insights, collaboration, and creative workspace access.";
    if (user?.role === "user") return "General QMOI features, chat, help, and view-only dashboards.";
    return "Guest access with limited AI and help support.";
  }, [user?.role]);

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold">QCity Command Center</h1>
              <p className="mt-2 text-slate-400 max-w-2xl">{roleSummary}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-5 py-4 border border-slate-700">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Current user</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-300">{user?.displayName || "Guest"}</p>
              <p className="text-slate-400">Role: {user?.role || "guest"}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {user?.role !== "master" && (
              <button
                className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-500"
                onClick={() => login("master")}
              >
                Switch to Master Role
              </button>
            )}
            {checkAccess("qvillage_access") && (
              <Link
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
                href="/qvillage"
              >
                Open QVillage
              </Link>
            )}
            {hasAccess?.("qmoi_space_access") && (
              <Link
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500"
                href="/qmoi-space"
              >
                Open QMOI Space
              </Link>
            )}
          </div>
          {lastUpdated && (
            <p className="mt-4 text-sm text-slate-500">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
          )}
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
                {statusSummary.overallHealth || "Operational"}
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

        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Device Connectivity</h2>
          <p className="text-slate-400 mb-6">Monitor and control all connected devices across your QMOI ecosystem.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">iPhone 15 Pro</span>
                <span className="text-green-400 text-sm">● Online</span>
              </div>
              <p className="text-sm text-slate-400">Mobile • iOS • Nairobi, Kenya</p>
              <div className="mt-2 flex gap-2">
                <button className="text-xs bg-blue-600 px-2 py-1 rounded">Manage</button>
                <button className="text-xs bg-gray-600 px-2 py-1 rounded">Sync</button>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">MacBook Pro M3</span>
                <span className="text-green-400 text-sm">● Online</span>
              </div>
              <p className="text-sm text-slate-400">Laptop • macOS • 92% battery</p>
              <div className="mt-2 flex gap-2">
                <button className="text-xs bg-blue-600 px-2 py-1 rounded">Manage</button>
                <button className="text-xs bg-gray-600 px-2 py-1 rounded">Sync</button>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Smart TV LG</span>
                <span className="text-green-400 text-sm">● Online</span>
              </div>
              <p className="text-sm text-slate-400">Smart TV • webOS</p>
              <div className="mt-2 flex gap-2">
                <button className="text-xs bg-blue-600 px-2 py-1 rounded">Manage</button>
                <button className="text-xs bg-gray-600 px-2 py-1 rounded">Sync</button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors">View All Devices</button>
            <button className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm transition-colors">Device Settings</button>
          </div>
        </section>

        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Security Operations</h2>
          <p className="text-slate-400 mb-6">Real-time threat detection and response monitoring.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Threat Level</h4>
              <div className="text-green-400 text-lg">LOW</div>
              <p className="text-sm text-slate-400">All systems secure</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Active Alerts</h4>
              <div className="text-yellow-400 text-lg">{statusSummary.activeAlerts}</div>
              <p className="text-sm text-slate-400">Minor warnings</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Uptime</h4>
              <div className="text-blue-400 text-lg">{statusSummary.uptime}</div>
              <p className="text-sm text-slate-400">production availability</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition-colors">Security Logs</button>
            <button className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-sm transition-colors">Threat Analysis</button>
          </div>
        </section>
      </div>
    </main>
  );
}
