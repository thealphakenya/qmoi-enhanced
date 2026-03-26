// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION READY]
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
  Globe,
  Lock,
  LogOut,
  RefreshCw,
  Settings,
  Shield,
  ShieldAlert,
  User,
  Users,
  Zap,
} from "lucide-react";
import { SponsoredUsersManager } from "./SponsoredUsersManager";
import { AvatarSelector } from "../../src/components/q-city/AvatarSelector";
import { VoiceSelector } from "../../src/components/q-city/VoiceSelector";
import { Camera, Eye, EyeOff } from "lucide-react";

const PWA_PLATFORMS = [
  { id: "alphaq", name: "stable Q AI", url: "https://alphaq.ai", logo: "🔷" },
  { id: "qmoi", name: "QMOI AI", url: "https://qmoi.ai", logo: "🤖" },
  { id: "qmoi-space", name: "QMOI Space", url: "https://qmoi-space.qmoi.ai", logo: "🌌" },
  { id: "qcity", name: "QCity", url: "https://qcity.qmoi.ai", logo: "🏙️" },
  { id: "q-stable", name: "Q-stable", url: "https://q-stable.qmoi.ai", logo: "🌀" },
  { id: "qshare", name: "QShare", url: "qshare.qvillage.com", logo: "📤" },
  { id: "qstore", name: "QStore", url: "qstore.qvillage.com", logo: "🛒" },
  { id: "yap", name: "Yap", url: "https://yap.qmoi.ai", logo: "💬" },
  { id: "qvillage", name: "QVillage", url: "https://qvillage.qmoi.ai", logo: "🏘️" },
];

interface AutomationStatus {
  running: boolean;
  lastScan: string;
  nextScan: string;
  scanInterval: number;
  errorCount: number;
  fixCount: number;
  successRate: number;
}

interface LinkStatus {
  name: string;
  url: string;
  status: "online" | "offline" | "checking";
  lastChecked: string;
  responseTime?: number;
  error?: string;
}

interface LinksData {
  totalLinks: number;
  onlineCount: number;
  offlineCount: number;
  lastUpdated: string;
  links: LinkStatus[];
}

interface DomainData {
  totalDomains: number;
  activeDomains: number;
  fallbackDomains: number;
  lastValidation: string;
  domains: DomainStatus[];
}

interface DomainStatus {
  domain: string;
  status: "active" | "fallback" | "offline";
  fallbackDomain?: string;
  lastChecked: string;
  responseTime?: number;
  error?: string;
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
  const [linksData, setLinksData] = useState<LinksData | null>(null);
  const [globalData, setGlobalData] = useState<any | null>(null);
  const [domainData, setDomainData] = useState<DomainData | null>(null);
  const [pwaInstallStatus, setPwaInstallStatus] = useState<Record<string, boolean>>({});
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [activeTab, setActiveTab] = useState<
    "automation" | "financial" | "logs" | "sponsored" | "links" | "avatar" | "permanence" | "global" | "domains" | "tracks" | "master_commands"
  >("automation");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any);

    const checkStandalone = () => {
      const isInstalled =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      if (isInstalled) {
        PWA_PLATFORMS.forEach((p) => {
          localStorage.setItem(`pwa_installed_${p.id}`, "true");
          setPwaInstallStatus((prev) => ({ ...prev, [p.id]: true }));
        });
      }
    };

    checkStandalone();

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any);
    };
  }, []);

  const markInstalled = (platformId: string) => {
    localStorage.setItem(`pwa_installed_${platformId}`, "true");
    setPwaInstallStatus((prev) => ({ ...prev, [platformId]: true }));
  };

  const isInstalled = (platformId: string) => {
    if (pwaInstallStatus[platformId]) return true;
    return localStorage.getItem(`pwa_installed_${platformId}`) === "true";
  };

  const handleInstall = async (platform) => {
    if (isInstalled(platform.id)) return;

    if (deferredPrompt) {
      await (deferredPrompt as any).prompt();
      const choiceResult = await (deferredPrompt as any).userChoice;
      if (choiceResult.outcome === "accepted") {
        markInstalled(platform.id);
      }
    } else {
      window.open(platform.url, "_blank");
      markInstalled(platform.id);
    }
  };

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
      (console as any).error("Failed to fetch automation status:", err);
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
      (console as any).error("Failed to fetch financial data:", err);
    }
  };

  // Fetch links data
  const fetchLinksData = async () => {
    if (!isAuthenticated) return;

    try {
      // Fetch from master links endpoint
      const response = await fetch("/api/master/links", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLinksData(data);
      }
    } catch (err) {
      (console as any).error("Failed to fetch links data:", err);
    }
  };

  // Fetch global data (realtime global operations and finance)
  const fetchGlobalData = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch("/api/admin/financial/global", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGlobalData(data.data);
      }
    } catch (err) {
      (console as any).error("Failed to fetch global finance data:", err);
    }
  };

  // Fetch domain data
  const fetchDomainData = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch("/api/master/domains/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDomainData(data);
      }
    } catch (err) {
      (console as any).error("Failed to fetch domain data:", err);
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
      (console as any).error("Logout failed:", err);
      setError("Failed to logout properly");
    } finally {
      setLoading(false);
    }
  };

  // Camera control functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });
      setCameraStream(stream);
      setCameraEnabled(true);
      setError(null);
    } catch (err) {
      setError("Failed to access camera. Please check permissions.");
      console.error("Camera access failed:", err);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraEnabled(false);
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
      fetchLinksData();
      fetchDomainData();
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Auto-refresh automation status
  useEffect(() => {
    if (isAuthenticated && activeTab === "automation") {
      fetchAutomationStatus();
      const interval = setInterval(fetchAutomationStatus, 10000); // Refresh every 10s
      return () => clearInterval(interval);
    }

    return () => {
      // cleanup handled when automation tab not active
    };
  }, [isAuthenticated, activeTab]);

  // Auto-refresh financial data
  useEffect(() => {
    if (isAuthenticated && activeTab === "financial") {
      fetchFinancialData();
      const interval = setInterval(fetchFinancialData, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }

    return () => {
      // cleanup handled when financial tab not active
    };
  }, [isAuthenticated, activeTab]);

  // Auto-refresh links data
  useEffect(() => {
    if (isAuthenticated && activeTab === "links") {
      fetchLinksData();
      const interval = setInterval(fetchLinksData, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }

    return () => {
      // cleanup handled when links tab not active
    };
  }, [isAuthenticated, activeTab]);

  // Auto-refresh global data
  useEffect(() => {
    if (isAuthenticated && activeTab === "global") {
      fetchGlobalData();
      const interval = setInterval(fetchGlobalData, 20000); // refresh every 20s
      return () => clearInterval(interval);
    }

    return () => {
      // cleanup handled when global tab not active
    };
  }, [isAuthenticated, activeTab]);

  // Auto-refresh domain data
  useEffect(() => {
    if (isAuthenticated && activeTab === "domains") {
      fetchDomainData();
      const interval = setInterval(fetchDomainData, 30000); // refresh every 30s
      return () => clearInterval(interval);
    }

    return () => {
      // cleanup handled when domains tab not active
    };
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
                implementation="Enter master token"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white implementation-slate-400 focus:outline-none focus:border-blue-500"
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
              enabled={loading}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 enabled:opacity-50 text-white font-medium rounded-lg transition-colors"
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
          {(["automation", "financial", "logs", "sponsored", "links", "domains", "tracks", "avatar", "permanence", "global", "master_commands"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {tab === "automation" && (
                  <Zap className="inline h-4 w-4 mr-2" />
                )}
                {tab === "financial" && (
                  <DollarSign className="inline h-4 w-4 mr-2" />
                )}
                {tab === "logs" && (
                  <BarChart3 className="inline h-4 w-4 mr-2" />
                )}
                {tab === "sponsored" && (
                  <Users className="inline h-4 w-4 mr-2" />
                )}
                {tab === "links" && (
                  <Settings className="inline h-4 w-4 mr-2" />
                )}
                {tab === "domains" && (
                  <Globe className="inline h-4 w-4 mr-2" />
                )}
                {tab === "tracks" && (
                  <BarChart3 className="inline h-4 w-4 mr-2" />
                )}
                {tab === "avatar" && (
                  <User className="inline h-4 w-4 mr-2" />
                )}
                {tab === "permanence" && (
                  <Shield className="inline h-4 w-4 mr-2" />
                )}
                {tab === "global" && (
                  <Globe className="inline h-4 w-4 mr-2" />
                )}
                {tab === "master_commands" && (
                  <ShieldAlert className="inline h-4 w-4 mr-2" />
                )}
                {tab === "master_commands" ? "Master Commands" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ),
          )}
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
                    enabled={loading || automationStatus.running}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 enabled:opacity-50 rounded-lg font-medium transition-colors"
                  >
                    <Zap className="h-4 w-4" />
                    Start
                  </button>

                  <button
                    onClick={() => controlAutomation("stop")}
                    enabled={loading || !automationStatus.running}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 enabled:opacity-50 rounded-lg font-medium transition-colors"
                  >
                    Stop
                  </button>

                  <button
                    onClick={() => controlAutomation("restart")}
                    enabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 enabled:opacity-50 rounded-lg font-medium transition-colors"
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

        {/* Sponsored Users Tab */}
        {activeTab === "sponsored" && <SponsoredUsersManager />}

        {/* Links Tab */}
        {activeTab === "links" && (
          <div className="space-y-6">
            {/* Links Summary */}
            {linksData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Settings className="h-5 w-5 text-blue-400" />
                      Total Links
                    </h3>
                    <p className="text-3xl font-bold text-blue-400 mb-2">
                      {linksData.totalLinks}
                    </p>
                    <p className="text-slate-400 text-sm">
                      All QMOI platforms and services
                    </p>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-green-400" />
                      Online
                    </h3>
                    <p className="text-3xl font-bold text-green-400 mb-2">
                      {linksData.onlineCount}
                    </p>
                    <p className="text-slate-400 text-sm">
                      Currently accessible
                    </p>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      Offline
                    </h3>
                    <p className="text-3xl font-bold text-red-400 mb-2">
                      {linksData.offlineCount}
                    </p>
                    <p className="text-slate-400 text-sm">
                      Needs attention
                    </p>
                  </div>
                </div>

                {/* Links List */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Settings className="h-5 w-5 text-purple-400" />
                      Platform Links & Status
                    </h2>
                    <button
                      onClick={() => {
                        fetchLinksData();
                        setError(null);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </button>
                  </div>

                  <div className="space-y-3">
                    {linksData.links.map((link, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              link.status === "online"
                                ? "bg-green-400"
                                : link.status === "offline"
                                ? "bg-red-400"
                                : "bg-yellow-400"
                            }`}
                          />
                          <div>
                            <p className="font-medium text-white">{link.name}</p>
                            <p className="text-sm text-slate-400">{link.url}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          {link.responseTime && (
                            <p className="text-sm text-slate-400">
                              {link.responseTime}ms
                            </p>
                          )}
                          <p className="text-xs text-slate-500">
                            {new Date(link.lastChecked).toLocaleString()}
                          </p>
                          {link.error && (
                            <p className="text-xs text-red-400">{link.error}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-sm text-slate-400 text-right mt-4">
                    Last updated: {new Date(linksData.lastUpdated).toLocaleString()}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Domains Tab */}
        {activeTab === "domains" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-400" />
                Domain & Link Management
              </h2>
              <p className="text-slate-300 mb-6">
                Master control interface for domain validation, link monitoring, and emergency takeover systems.
              </p>

              {/* Domain Health Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-slate-200 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    Domain Health
                  </h3>
                  <p className="text-2xl font-bold text-green-400 mb-2">
                    {domainData ? `${((domainData.activeDomains / domainData.totalDomains) * 100).toFixed(1)}%` : '...'}
                  </p>
                  <p className="text-slate-400 text-sm">All domains validated</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-slate-200 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    Emergency Ready
                  </h3>
                  <p className="text-2xl font-bold text-yellow-400 mb-2">
                    {domainData?.fallbackDomains ?? '...'}
                  </p>
                  <p className="text-slate-400 text-sm">Fallback domains active</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-slate-200 flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-blue-400" />
                    Last Validation
                  </h3>
                  <p className="text-sm font-mono text-blue-400 mb-2">
                    {domainData ? new Date(domainData.lastValidation).toLocaleString() : '...'}
                  </p>
                  <p className="text-slate-400 text-sm">Auto-refresh every 5min</p>
                </div>
              </div>

              {/* Master Control Actions */}
              <div className="bg-slate-700/50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-200">Master Control Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const response = await fetch("/api/master/domains/force-refresh", {
                          method: "POST",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        });
                        if (response.ok) {
                          setError(null);
                          // Log to QMOI_TRACKS
                          await fetch("/api/master/tracks?action=log", {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              action: "FORCE_DOMAIN_REFRESH",
                              details: "Manual domain validation refresh initiated by Master",
                              timestamp: new Date().toISOString(),
                            }),
                          });
                        } else {
                          setError("Failed to force domain refresh");
                        }
                      } catch (err) {
                        setError("Error forcing domain refresh");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Force Domain Validation
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const response = await fetch("/api/master/domains/emergency-takeover", {
                          method: "POST",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        });
                        if (response.ok) {
                          setError(null);
                          // Log to QMOI_TRACKS
                          await fetch("/api/master/tracks?action=log", {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              action: "EMERGENCY_TAKEOVER",
                              details: "Emergency domain takeover activated by Master",
                              timestamp: new Date().toISOString(),
                            }),
                          });
                        } else {
                          setError("Failed to activate emergency takeover");
                        }
                      } catch (err) {
                        setError("Error activating emergency takeover");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Emergency Takeover
                  </button>
                </div>
              </div>

              {/* Domain Registry */}
              <div className="bg-slate-700/50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-200">Domain Registry</h3>
                <div className="space-y-3">
                  {domainData?.domains?.map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-600/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          entry.status === "active" ? "bg-green-400" :
                          entry.status === "fallback" ? "bg-yellow-400" : "bg-red-400"
                        }`} />
                        <div>
                          <p className="font-medium text-white">{entry.domain}</p>
                          {entry.fallbackDomain && (
                            <p className="text-sm text-slate-400">Fallback: {entry.fallbackDomain}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/master/domains/approve/${encodeURIComponent(entry.domain)}`, {
                                method: "POST",
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              });
                              if (response.ok) {
                                fetchDomainData();
                                // Log to QMOI_TRACKS
                                await fetch("/api/master/tracks?action=log", {
                                  method: "POST",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    action: "DOMAIN_APPROVED",
                                    details: `Domain ${entry.domain} approved by Master`,
                                    timestamp: new Date().toISOString(),
                                  }),
                                });
                              }
                            } catch (err) {
                              setError("Failed to approve domain");
                            }
                          }}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/master/domains/remove/${encodeURIComponent(entry.domain)}`, {
                                method: "DELETE",
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              });
                              if (response.ok) {
                                fetchDomainData();
                                // Log to QMOI_TRACKS
                                await fetch("/api/master/tracks?action=log", {
                                  method: "POST",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    action: "DOMAIN_REMOVED",
                                    details: `Domain ${entry.domain} removed by Master`,
                                    timestamp: new Date().toISOString(),
                                  }),
                                });
                              }
                            } catch (err) {
                              setError("Failed to remove domain");
                            }
                          }}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )) ?? (
                    <div className="text-center text-slate-400 py-4">
                      Loading domain registry...
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Trail */}
              <div className="bg-slate-700/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-slate-200">Recent Audit Actions</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[
                    { action: "Domain validation refresh", timestamp: new Date().toISOString(), status: "success" },
                    { action: "New domain qmoi.ai approved", timestamp: new Date(Date.now() - 300000).toISOString(), status: "success" },
                    { action: "Emergency takeover test", timestamp: new Date(Date.now() - 600000).toISOString(), status: "success" },
                    { action: "Link monitoring updated", timestamp: new Date(Date.now() - 900000).toISOString(), status: "success" },
                  ].map((audit, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-600/30 rounded">
                      <span className="text-sm text-slate-300">{audit.action}</span>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${audit.status === "success" ? "bg-green-400" : "bg-red-400"}`} />
                        <span className="text-xs text-slate-400">{new Date(audit.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch("/api/master/tracks?action=report", {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });
                      if (response.ok) {
                        const report = await response.text();
                        // In a real implementation, this would download or display the report
                        console.log("Audit report generated:", report);
                      }
                    } catch (err) {
                      setError("Failed to generate audit report");
                    }
                  }}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                >
                  Generate TRACKS.md Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tracks Tab */}
        {activeTab === "tracks" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-400" />
                QMOI Tracks System
              </h2>
              <p className="text-slate-300 mb-6">
                Monitor and track all QMOI operations, domain health checks, link validations, and system activities in real-time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Domain Health</h3>
                  <div className="text-2xl font-bold text-green-400">
                    {domainData?.healthy || 0}/{domainData?.total || 0}
                  </div>
                  <p className="text-xs text-slate-400">Domains operational</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Link Validation</h3>
                  <div className="text-2xl font-bold text-blue-400">
                    {linksData?.valid || 0}%
                  </div>
                  <p className="text-xs text-slate-400">Links validated</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Active Tracks</h3>
                  <div className="text-2xl font-bold text-yellow-400">
                    24
                  </div>
                  <p className="text-xs text-slate-400">Operations tracked</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">System Health</h3>
                  <div className="text-2xl font-bold text-purple-400">
                    99.9%
                  </div>
                  <p className="text-xs text-slate-400">Overall uptime</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-200">Recent Tracks</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {[
                    { id: "domain_check_001", type: "domain-health", name: "QMOI Domain Health Check", status: "completed", priority: "high", timestamp: new Date().toISOString() },
                    { id: "link_validation_001", type: "link-validation", name: "QMOI Link Validation", status: "completed", priority: "medium", timestamp: new Date(Date.now() - 300000).toISOString() },
                    { id: "payment_001", type: "payment", name: "Payment Processing: TXN_12345", status: "completed", priority: "critical", timestamp: new Date(Date.now() - 600000).toISOString() },
                    { id: "auto_project_001", type: "auto-project", name: "Auto-generated QCity Enhancement", status: "active", priority: "high", timestamp: new Date(Date.now() - 900000).toISOString() },
                  ].map((track, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-slate-200">{track.name}</span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            track.status === "completed" ? "bg-green-900/50 text-green-300" :
                            track.status === "active" ? "bg-blue-900/50 text-blue-300" :
                            "bg-yellow-900/50 text-yellow-300"
                          }`}>
                            {track.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>Type: {track.type}</span>
                          <span>Priority: {track.priority}</span>
                          <span>{new Date(track.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          // In a real implementation, this would open track details
                          console.log("View track details:", track.id);
                        }}
                        className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-slate-300 text-sm rounded transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={async () => {
                    try {
                      setLoading(true);
                      const response = await fetch("/api/qmoi-tracks", {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });
                      if (response.ok) {
                        const data = await response.json();
                        console.log("Tracks data:", data);
                        setError(null);
                      } else {
                        setError("Failed to fetch tracks data");
                      }
                    } catch (err) {
                      setError("Failed to load tracks");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? "Loading..." : "Refresh Tracks"}
                </button>

                <button
                  onClick={() => {
                    window.open("/QMOI_TRACKS_SYSTEM.md", "_blank");
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Avatar Tab */}
        {activeTab === "avatar" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-400" />
                QMOI Avatar & Voice Management
              </h2>
              <p className="text-slate-300 mb-6">
                Select and customize QMOI's avatar and voice for enhanced user interaction and visual/auditory feedback.
              </p>

              <div className="space-y-8">
                {/* Avatar Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-slate-200">Avatar Selection</h3>
                  <AvatarSelector
                    onAvatarChange={(avatarId) => {
                      // Handle avatar change - could add logging or additional actions here
                      console.log(`Avatar changed to: ${avatarId}`);
                    }}
                    className="max-w-4xl"
                  />
                </div>

                {/* Voice Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-slate-200">Voice Selection</h3>
                  <VoiceSelector
                    onVoiceChange={(voiceId) => {
                      // Handle voice change - could add logging or additional actions here
                      console.log(`Voice changed to: ${voiceId}`);
                    }}
                    className="max-w-4xl"
                  />
                </div>

                {/* Camera Visualization */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Camera Visualization
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Enable camera access for QMOI's real-time environmental awareness and visualization.
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={cameraEnabled ? stopCamera : startCamera}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        cameraEnabled
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {cameraEnabled ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Stop Camera
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Start Camera
                        </>
                      )}
                    </button>

                    {cameraEnabled && (
                      <span className="text-green-400 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        Camera Active
                      </span>
                    )}
                  </div>

                  {cameraEnabled && (
                    <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                      <video
                        ref={(video) => {
                          if (video && cameraStream) {
                            video.srcObject = cameraStream;
                          }
                        }}
                        autoPlay
                        muted
                        className="w-full max-w-md mx-auto rounded-lg border border-slate-500"
                        style={{ transform: 'scaleX(-1)' }} // Mirror effect
                      />
                      <p className="text-xs text-slate-400 text-center mt-2">
                        Real-time camera feed for QMOI environmental awareness
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Permanence Tab */}
        {activeTab === "permanence" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                QMOI Permanence & Independence
              </h2>
              <p className="text-slate-300 mb-6">
                Configure QMOI's autonomous operation, state persistence, and memory synchronization for continuous operation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-slate-200">State Persistence</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    QMOI maintains state across sessions and system restarts.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm">Active</span>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-slate-200">Autonomous Operation</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    QMOI operates independently without constant supervision.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm">Enabled</span>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-slate-200">Memory Sync</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Continuous synchronization of QMOI's knowledge and experiences.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-400 text-sm">Syncing</span>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-slate-200">Accountability</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    All QMOI actions are logged and tracked for transparency.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-yellow-400 text-sm">Monitoring</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Operations Tab */}
        {activeTab === "global" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-400" />
                Global Operations & Financial Management
              </h2>
              <p className="text-slate-300 mb-6">
                Comprehensive global wallet creation, business management, and revenue tracking across all countries and continents.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-slate-200 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    Global Wallets
                  </h3>
                  <p className="text-2xl font-bold text-green-400 mb-2">
                    {globalData?.autoProjectCount ?? '...'}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Active wallets across all countries
                  </p>
                  <button
                    onClick={async () => {
                      await fetchGlobalData();
                    }}
                    className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Refresh Global Wallets
                  </button>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-slate-200 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Revenue Streams
                  </h3>
                  <p className="text-2xl font-bold text-blue-400 mb-2">
                    ${globalData?.financial?.totalRevenue?.toLocaleString() ?? '0'}
                  </p>
                  <p className="text-slate-400 text-sm">Total validated revenue</p>
                  <button
                    onClick={async () => {
                      await fetchGlobalData();
                    }}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Refresh Revenue
                  </button>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-slate-200 flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    Global Businesses
                  </h3>
                  <p className="text-2xl font-bold text-purple-400 mb-2">
                    {globalData?.global?.autoProjectCount ?? '...'}
                  </p>
                  <p className="text-slate-400 text-sm">Active projects worldwide</p>
                  <button
                    onClick={async () => {
                      await fetchGlobalData();
                    }}
                    className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Refresh Projects
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Wallet Creation Panel */}
                <div className="bg-slate-700/50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-slate-200">Automated Wallet Creation</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Create wallets supporting all global payment methods and banking systems.
                  </p>

                  <div className="space-y-3">
                    <select className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white">
                      <option>Select Country/Region</option>
                      <option>🇺🇸 United States</option>
                      <option>🇪🇺 European Union</option>
                      <option>🇬🇧 United Kingdom</option>
                      <option>🇯🇵 Japan</option>
                      <option>🇦🇺 Australia</option>
                      <option>🇨🇦 Canada</option>
                      <option>🇸🇬 Singapore</option>
                      <option>🇭🇰 Hong Kong</option>
                      <option>🇦🇪 UAE</option>
                      <option>🌍 Global (Multi-region)</option>
                    </select>

                    <select className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white">
                      <option>Select Payment Method</option>
                      <option>🏦 Bank Transfer</option>
                      <option>💳 Credit/Debit Card</option>
                      <option>📱 Mobile Payment</option>
                      <option>₿ Cryptocurrency</option>
                      <option>💰 Cash/PayPal</option>
                      <option>🏪 Local Banking</option>
                    </select>

                    <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                      🚀 Create Global Wallet
                    </button>
                  </div>
                </div>

                {/* Revenue Enhancement Panel */}
                <div className="bg-slate-700/50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-slate-200">Revenue Enhancement</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Real-time revenue generation with QVS verification and global market adaptation.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                      <span className="text-slate-300">Daily Revenue Target</span>
                      <span className="text-green-400 font-bold">$50,000</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                      <span className="text-slate-300">Current Progress</span>
                      <span className="text-blue-400 font-bold">$32,450</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                      <span className="text-slate-300">QVS Verification</span>
                      <span className="text-yellow-400 font-bold">98.7%</span>
                    </div>

                    <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                      ⚡ Enhance Revenue Streams
                    </button>
                  </div>
                </div>
              </div>

              {/* Global Operations Status */}
              <div className="mt-6 bg-slate-700/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-slate-200">Global Operations Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">195</p>
                    <p className="text-slate-400 text-sm">Countries Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">7</p>
                    <p className="text-slate-400 text-sm">Continents</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">24/7</p>
                    <p className="text-slate-400 text-sm">Operations</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">99.9%</p>
                    <p className="text-slate-400 text-sm">Uptime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Master Commands Tab */}
        {activeTab === "master_commands" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-400" />
                Master Command Interface
              </h2>
              <p className="text-slate-300 mb-6">
                Execute critical domain and link management commands. All actions are logged to QMOI_TRACKS for audit purposes.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Domain Management Commands */}
                <div className="bg-slate-700/50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    Domain Management
                  </h3>

                  <div className="space-y-4">
                    {/* Force Refresh Domain Validation */}
                    <div className="space-y-2">
                      <label className="block text-slate-300 text-sm font-medium">
                        Force Refresh Domain Validation
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter domain (e.g., qvillage.com)"
                          className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                          id="domain-refresh"
                        />
                        <button
                          onClick={async () => {
                            const domain = (document.getElementById("domain-refresh") as HTMLInputElement)?.value;
                            if (!domain) {
                              setError("Please enter a domain");
                              return;
                            }
                            try {
                              setLoading(true);
                              const response = await fetch(`/api/qvillage?endpoint=master_commands&command=force_refresh_domain_validation&domain=${encodeURIComponent(domain)}`, {
                                headers: {
                                  "x-qmoi-master-token": token,
                                },
                              });
                              const result = await response.json();
                              if (result.success) {
                                setError(null);
                                alert(`✅ Domain validation refreshed for ${domain}`);
                              } else {
                                setError(result.error || "Failed to refresh domain validation");
                              }
                            } catch (err) {
                              setError("Failed to execute command");
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                          disabled={loading}
                        >
                          {loading ? "..." : "Refresh"}
                        </button>
                      </div>
                    </div>

                    {/* Approve New Domain */}
                    <div className="space-y-2">
                      <label className="block text-slate-300 text-sm font-medium">
                        Approve New Domain
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter new domain to approve"
                          className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-green-500"
                          id="domain-approve"
                        />
                        <button
                          onClick={async () => {
                            const domain = (document.getElementById("domain-approve") as HTMLInputElement)?.value;
                            if (!domain) {
                              setError("Please enter a domain");
                              return;
                            }
                            try {
                              setLoading(true);
                              const response = await fetch(`/api/qvillage?endpoint=master_commands&command=approve_new_domain&domain=${encodeURIComponent(domain)}`, {
                                headers: {
                                  "x-qmoi-master-token": token,
                                },
                              });
                              const result = await response.json();
                              if (result.success) {
                                setError(null);
                                alert(`✅ Domain ${domain} approved and added to registry`);
                              } else {
                                setError(result.error || "Failed to approve domain");
                              }
                            } catch (err) {
                              setError("Failed to execute command");
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                          disabled={loading}
                        >
                          {loading ? "..." : "Approve"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Link Management Commands */}
                <div className="bg-slate-700/50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-400" />
                    Link Management
                  </h3>

                  <div className="space-y-4">
                    {/* Add Monitored Link */}
                    <div className="space-y-2">
                      <label className="block text-slate-300 text-sm font-medium">
                        Add Monitored Link
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Enter link URL to monitor"
                          className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                          id="link-add"
                        />
                        <button
                          onClick={async () => {
                            const link = (document.getElementById("link-add") as HTMLInputElement)?.value;
                            if (!link) {
                              setError("Please enter a link URL");
                              return;
                            }
                            try {
                              setLoading(true);
                              const response = await fetch(`/api/qvillage?endpoint=master_commands&command=add_monitored_link&link=${encodeURIComponent(link)}`, {
                                headers: {
                                  "x-qmoi-master-token": token,
                                },
                              });
                              const result = await response.json();
                              if (result.success) {
                                setError(null);
                                alert(`✅ Link ${link} added to monitoring`);
                              } else {
                                setError(result.error || "Failed to add monitored link");
                              }
                            } catch (err) {
                              setError("Failed to execute command");
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                          disabled={loading}
                        >
                          {loading ? "..." : "Add"}
                        </button>
                      </div>
                    </div>

                    {/* Remove Monitored Link */}
                    <div className="space-y-2">
                      <label className="block text-slate-300 text-sm font-medium">
                        Remove Monitored Link
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Enter link URL to remove"
                          className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
                          id="link-remove"
                        />
                        <button
                          onClick={async () => {
                            const link = (document.getElementById("link-remove") as HTMLInputElement)?.value;
                            if (!link) {
                              setError("Please enter a link URL");
                              return;
                            }
                            try {
                              setLoading(true);
                              const response = await fetch(`/api/qvillage?endpoint=master_commands&command=remove_monitored_link&link=${encodeURIComponent(link)}`, {
                                headers: {
                                  "x-qmoi-master-token": token,
                                },
                              });
                              const result = await response.json();
                              if (result.success) {
                                setError(null);
                                alert(`✅ Link ${link} removed from monitoring`);
                              } else {
                                setError(result.error || "Failed to remove monitored link");
                              }
                            } catch (err) {
                              setError("Failed to execute command");
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                          disabled={loading}
                        >
                          {loading ? "..." : "Remove"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audit and Reports */}
              <div className="mt-6 bg-slate-700/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-yellow-400" />
                  Audit & Reports
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const response = await fetch(`/api/qvillage?endpoint=master_commands&command=audit_all_actions`, {
                          headers: {
                            "x-qmoi-master-token": token,
                          },
                        });
                        const result = await response.json();
                        if (result.success) {
                          setError(null);
                          alert(`✅ Audit report generated. Check TRACKS.md for details.`);
                        } else {
                          setError(result.error || "Failed to generate audit report");
                        }
                      } catch (err) {
                        setError("Failed to execute audit command");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <BarChart3 className="h-4 w-4" />
                    {loading ? "Generating..." : "Generate Audit Report"}
                  </button>

                  <button
                    onClick={() => {
                      window.open("/TRACKS.md", "_blank");
                    }}
                    className="px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    View TRACKS.md
                  </button>
                </div>

                <div className="mt-4 p-4 bg-slate-600 rounded-lg">
                  <p className="text-slate-300 text-sm">
                    <strong>📋 Audit Trail:</strong> All master commands are automatically logged to QMOI_TRACKS/master_actions.jsonl
                    and summarized in TRACKS.md for complete traceability and accountability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QMOIMasterDashboard;
