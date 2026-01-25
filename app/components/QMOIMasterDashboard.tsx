/**
 * QMOI Master Dashboard - Background Automation Control
 * Master-Only Access UI for Automation Control, Financial Overview, and Status Monitoring
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  BarChart3,
  Clock,
  DollarSign,
  Lock,
  LogOut,
  RefreshCw,
  Settings,
  ShieldAlert,
  Zap,
} from "lucide-react";

interface AutomationStatus {
  running: boolean;
  lastScan: string;
  nextScan: string;
  scanInterval: number;
  errorCount: number;
  fixCount: number;
  successRate: number;
}

interface FinancialData {
  liquid: number;
  revenue: number;
  storageLocations: string[];
  lastUpdated: string;
}

interface MasterDashboardProps {
  masterToken?: string;
  onUnauthorized?: () => void;
}

export function QMOIMasterDashboard({
  masterToken,
  onUnauthorized,
}: MasterDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(masterToken || "");
  const [automationStatus, setAutomationStatus] =
    useState<AutomationStatus | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "automation" | "financial" | "logs"
  >("automation");

  // Verify master authentication
  const verifyMasterAccess = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/autofix/background-automation", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 403) {
        setError("Unauthorized: Invalid master token");
        onUnauthorized?.();
        return false;
      }

      if (response.ok) {
        setIsAuthenticated(true);
        setToken(authToken);
        setError(null);
        return true;
      }
    } catch (err) {
      setError("Failed to verify master access");
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Fetch automation status
  const fetchAutomationStatus = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch("/api/admin/autofix/background-automation", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAutomationStatus(data.status);
      }
    } catch (err) {
      console.error("Failed to fetch automation status:", err);
    }
  };

  // Fetch financial data
  const fetchFinancialData = async () => {
    if (!isAuthenticated) return;

    try {
      // Fetch from backend financial endpoint
      const response = await fetch("/api/admin/financial/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFinancialData(data);
      }
    } catch (err) {
      console.error("Failed to fetch financial data:", err);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch("/api/admin/master/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear session and redirect
      sessionStorage.removeItem("masterToken");
      setIsAuthenticated(false);
      setToken("");
      onUnauthorized?.();
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Failed to logout properly");
    } finally {
      setLoading(false);
    }
  };

  // Control automation
  const controlAutomation = async (action: "start" | "stop" | "restart") => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await fetch("/api/admin/autofix/background-automation", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        await fetchAutomationStatus();
        setError(null);
      } else {
        setError(`Failed to ${action} automation`);
      }
    } catch (err) {
      setError(
        `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyMasterAccess(token);
    if (success) {
      fetchAutomationStatus();
      fetchFinancialData();
    }
  };

  // Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken("");
    setAutomationStatus(null);
    setFinancialData(null);
  };

  // Auto-refresh automation status
  useEffect(() => {
    if (isAuthenticated && activeTab === "automation") {
      fetchAutomationStatus();
      const interval = setInterval(fetchAutomationStatus, 10000); // Refresh every 10s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, activeTab]);

  // Auto-refresh financial data
  useEffect(() => {
    if (isAuthenticated && activeTab === "financial") {
      fetchFinancialData();
      const interval = setInterval(fetchFinancialData, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, activeTab]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-md w-full border border-slate-700">
          <div className="flex items-center justify-center mb-6">
            <ShieldAlert className="h-8 w-8 text-red-500 mr-2" />
            <h1 className="text-2xl font-bold text-white">Master Access</h1>
          </div>

          <p className="text-slate-300 text-center mb-6">
            Background Automation Control Panel
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Master Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter master token"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? "Verifying..." : "Unlock Dashboard"}
            </button>
          </form>

          <p className="text-slate-500 text-xs text-center mt-6">
            🔐 Master-Only Access | All actions logged
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            <h1 className="text-2xl font-bold">Master Control Panel</h1>
            <span className="text-xs bg-red-900/50 border border-red-700 rounded px-2 py-1 text-red-300">
              MASTER ONLY
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/50 hover:bg-red-900 border border-red-700 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {(["automation", "financial", "logs"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {tab === "automation" && <Zap className="inline h-4 w-4 mr-2" />}
              {tab === "financial" && (
                <DollarSign className="inline h-4 w-4 mr-2" />
              )}
              {tab === "logs" && <BarChart3 className="inline h-4 w-4 mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Automation Tab */}
        {activeTab === "automation" && (
          <div className="space-y-6">
            {/* Status Card */}
            {automationStatus && (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Automation Status
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">Status</p>
                    <p className="text-lg font-bold">
                      {automationStatus.running ? (
                        <span className="text-green-400">● Running</span>
                      ) : (
                        <span className="text-red-400">● Stopped</span>
                      )}
                    </p>
                  </div>

                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">
                      Errors Detected
                    </p>
                    <p className="text-lg font-bold text-red-400">
                      {automationStatus.errorCount}
                    </p>
                  </div>

                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">Errors Fixed</p>
                    <p className="text-lg font-bold text-green-400">
                      {automationStatus.fixCount}
                    </p>
                  </div>

                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">Success Rate</p>
                    <p className="text-lg font-bold text-blue-400">
                      {(automationStatus.successRate * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Last Scan
                    </p>
                    <p className="text-sm font-mono text-slate-300">
                      {new Date(automationStatus.lastScan).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Next Scan
                    </p>
                    <p className="text-sm font-mono text-slate-300">
                      {new Date(automationStatus.nextScan).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => controlAutomation("start")}
                    disabled={loading || automationStatus.running}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
                  >
                    <Zap className="h-4 w-4" />
                    Start
                  </button>

                  <button
                    onClick={() => controlAutomation("stop")}
                    disabled={loading || !automationStatus.running}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
                  >
                    Stop
                  </button>

                  <button
                    onClick={() => controlAutomation("restart")}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Restart
                  </button>

                  <button
                    onClick={() => {
                      fetchAutomationStatus();
                      setError(null);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors ml-auto"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Financial Tab */}
        {activeTab === "financial" && (
          <div className="space-y-6">
            {financialData && (
              <>
                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      Liquid Funds
                    </h3>
                    <p className="text-3xl font-bold text-green-400 mb-2">
                      ${financialData.liquid.toLocaleString()}
                    </p>
                    <p className="text-slate-400 text-sm">
                      Available for operations
                    </p>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-400" />
                      Total Revenue
                    </h3>
                    <p className="text-3xl font-bold text-blue-400 mb-2">
                      ${financialData.revenue.toLocaleString()}
                    </p>
                    <p className="text-slate-400 text-sm">
                      Generated since Jan 2026
                    </p>
                  </div>
                </div>

                {/* Storage Locations */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-yellow-400" />
                    Fund Storage Locations
                  </h3>
                  <div className="space-y-3">
                    {financialData.storageLocations.map((location, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"
                      >
                        <Lock className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                        <span className="text-slate-300">{location}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Last Updated */}
                <div className="text-sm text-slate-400 text-right">
                  Last updated:{" "}
                  {new Date(financialData.lastUpdated).toLocaleString()}
                </div>
              </>
            )}
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === "logs" && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              Activity Logs
            </h2>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-400 max-h-96 overflow-y-auto">
              <p>
                [INFO] Master dashboard accessed at {new Date().toISOString()}
              </p>
              <p>[INFO] Automation status queried</p>
              <p>[INFO] Financial data retrieved</p>
              <p className="mt-4 text-slate-500">
                More logs would appear here...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QMOIMasterDashboard;
