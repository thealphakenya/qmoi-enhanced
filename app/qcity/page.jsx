"use client";

import React, { useMemo, useState } from "react";
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
  const [showComponents, setShowComponents] = useState(true);
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
              <Link
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
                href="/qvillage"
              >
                Open QVillage
              </Link>
            )}
            {hasAccess("qmoi_space_access") && (
              <Link
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500"
                href="/qmoi-space"
              >
                Open QMOI Space
              </Link>
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

        {/* Device Management Dashboard */}
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

        {/* Security Monitoring Center */}
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
              <div className="text-yellow-400 text-lg">2</div>
              <p className="text-sm text-slate-400">Minor warnings</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Recent Access</h4>
              <div className="text-blue-400 text-lg">12</div>
              <p className="text-sm text-slate-400">Last hour</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition-colors">Security Logs</button>
            <button className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-sm transition-colors">Threat Analysis</button>
          </div>
        </section>

        {/* System Health Overview */}
        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">System Performance</h2>
          <p className="text-slate-400 mb-6">Real-time diagnostics and optimization monitoring.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">CPU Usage</h4>
              <div className="text-cyan-400 text-2xl">45%</div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                <div className="bg-cyan-400 h-2 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">Memory</h4>
              <div className="text-green-400 text-2xl">67%</div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                <div className="bg-green-400 h-2 rounded-full" style={{width: '67%'}}></div>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">Network</h4>
              <div className="text-blue-400 text-2xl">23%</div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{width: '23%'}}></div>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">Storage</h4>
              <div className="text-purple-400 text-2xl">78%</div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                <div className="bg-purple-400 h-2 rounded-full" style={{width: '78%'}}></div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm transition-colors">Run Diagnostics</button>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors">Performance Report</button>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm transition-colors">Auto-Optimize</button>
          </div>
        </section>

        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Related UI Modules</h2>
              <p className="mt-2 text-sm text-slate-400">Display the documented components used in related QMOI apps and integrations.</p>
            </div>
            <button
              onClick={() => setShowComponents((current) => !current)}
              className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
            >
              {showComponents ? 'Hide Modules' : 'Show Modules'}
            </button>
          </div>
          {showComponents ? (
            <div className="mt-6 space-y-6">
              <AdminDashboard />
              <ChatMessaging />
              <QMOIAutoFixDashboard />
              <QMOIAutoSetup />
              <AudibleConversation />
              <FileUploadDownload />
              <VisualEnhancement />
              <ClientUISettings />
              <div className="grid gap-6 md:grid-cols-2">
                <UserProfile />
                <WalletList />
              </div>
              <RegisterForm />
              <SponsoredUsersManager />
              <QMOIMasterDashboard />
              <QVillage />
              <QVillageDatasetsPanel />
              <QCityErrorManager />
              <QCityThemeProvider />
              <DeploymentManager />
              <TestingAutomationSuite />
              <MonitoringDashboard />
              <ComplianceManager />
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-slate-300">
              Expand to view the shared UI modules that support QCity's broader QMOI ecosystem functionality.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
