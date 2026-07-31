"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/components/AdminDashboard.tsx -->
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HealthMetrics {
  uptime: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    heapUsedPercent: number;
  };
  performance: Record<string, any>;
  errors: Record<string, any>;
  healthScore: number;
  status: "healthy" | "degraded" | "critical";
}

interface Alert {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  component: string;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [monitoring, setMonitoring] = useState<HealthMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [monitoringRes, alertsRes] = await Promise.all([
          fetch("/api/admin/monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!monitoringRes.ok || !alertsRes.ok) {
          throw new Error("Failed to fetch monitoring data");
        }

        const monitoringData = await monitoringRes.json();
        const alertsData = await alertsRes.json();

        setMonitoring(monitoringData.monitoring);
        setAlerts(alertsData.alerts);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  if (_error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Dashboard</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const healthColor = {
    healthy: "text-green-600",
    degraded: "text-yellow-600",
    critical: "text-red-600",
  };

  const severityColor = {
    critical: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System health and performance metrics
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(_e) => setRefreshInterval(parseInt(_e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={300}>Every 5m</option>
          </select>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Health Summary */}
        {monitoring && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Overall Status
              </h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  healthColor[monitoring.status]
                }`}
              >
                {monitoring.status.toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Health Score: {monitoring.healthScore}/100
              </p>
            </div>

            {/* Uptime */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Uptime</h3>
              <p className="text-2xl font-bold mt-2">
                {formatUptime(monitoring.uptime)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.uptime.toFixed(0)} seconds
              </p>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Memory Usage
              </h3>
              <p className="text-2xl font-bold mt-2">
                {monitoring.memory.heapUsedPercent}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    monitoring.memory.heapUsedPercent > 85
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${monitoring.memory.heapUsedPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {monitoring.memory.heapUsedMB}MB /{" "}
                {monitoring.memory.heapTotalMB}MB
              </p>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Active Alerts
              </h3>
              <p className="text-2xl font-bold mt-2 text-red-600">
                {alerts.length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {alerts.filter((a) => a.severity === "critical").length}{" "}
                critical
              </p>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-4 ${severityColor[alert.severity]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm mt-1">{alert.component}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityColor[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {monitoring?.performance && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Performance Metrics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      Avg (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P95 (ms)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      P99 (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(monitoring.performance).map(
                    ([endpoint, metric]: [string, any]) => (
                      <tr key={endpoint} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {endpoint}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.count}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              parseFloat(metric.successRate) > 95
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {metric.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.avgDuration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p95Duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {metric.p99Duration}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/audit-logs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition text-center"
          >
            View Audit Logs
          </Link>
          <Link
            href="/admin/rate-limits"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center"
          >
            Manage Rate Limits
          </Link>
          <Link
            href="/admin/users"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}
