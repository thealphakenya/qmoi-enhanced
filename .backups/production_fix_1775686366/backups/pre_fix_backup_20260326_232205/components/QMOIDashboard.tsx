// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Bell,
    Brain,
    Clock,
    Code,
    Cpu,
    Database,
    FileText,
    Grid,
    Home,
    Lock,
    Menu,
    MessageSquare,
    Settings,
    Shield,
    TrendingUp,
    Users,
    Wifi,
    Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useMaster } from "./MasterContext";

// Import our enhanced components
import AccountabilitySystem from "./AccountabilitySystem";
import AskQMoi from "./AskQMoi";
import BiometricAuth from "./BiometricAuth";
import Chatbot from "./Chatbot";
import FileExplorer from "./FileExplorer";
import { FinancialManager } from "./FinancialManager";
import MemoryAwareness from "./MemoryAwareness";
import { NotificationCenter } from "./NotificationCenter";
import ParallelProcessing from "./ParallelProcessing";
import { QConverse } from "./QConverse";
import QmoiMediaManager from "./QmoiMediaManager";
import QVillage from "./QVillage";
import { SisterProjects } from "./SisterProjects";
import SystemHealthMonitor from "./SystemHealthMonitor";
import { TradingPanel } from "./TradingPanel";
import UserAccessControl, { AccessControlProvider } from "./UserAccessControl";
import { WhatsAppBusinessPanel } from "./WhatsAppBusinessPanel";

interface DashboardProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export const QMOIDashboard: React.FC<DashboardProps> = ({
  user = {
    id: "1",
    name: "Admin User",
    email: "admin@qmoi.com",
    role: "admin",
    avatar: undefined,
  },
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [systemStatus, setSystemStatus] = useState<
    "healthy" | "warning" | "critical"
  >("healthy");
  const [chatHistory, setChatHistory] = useState<unknown[]>([]);
  const [askQMoiOpen, setAskQMoiOpen] = useState(false);
  const { toast } = useToast();
  const {
    setCurrentUser,
    setRole,
    updateQMOIMemory,
    qmoiMemory,
    currentRole,
    memoryStatus,
  } = useMaster();

  // Validate tab access on role change
  useEffect(() => {
    const accessibleTabs = getAccessibleTabs(currentRole);
    if (!accessibleTabs.has(activeTab)) {
      // Redirect to first accessible tab
      const firstAccessible = Array.from(accessibleTabs)[0];
      if (firstAccessible) {
        setActiveTab(firstAccessible);
      }
    }
  }, [currentRole]);

  const [systemStats, setSystemStats] = useState<{
    activeUsers: number;
    totalTransactions: number;
    systemLoad: number;
    memoryUsage: number;
    uptime: string;
    lastBackup: string;
  }>({
    activeUsers: 0,
    totalTransactions: 0,
    systemLoad: 0,
    memoryUsage: 0,
    uptime: "-",
    lastBackup: "-",
  });

  const [recentActivities, setRecentActivities] = useState<
    Array<{
      id: string;
      type: string;
      message: string;
      timestamp: Date;
      user: string;
      status: "success" | "warning" | "error";
    }>
  >([]);

  // Fetch system metrics from monitoring endpoint
  useEffect(() => {
    const fetchMonitoring = async () => {
      try {
        const res = await fetch("/api/monitor/status");
        if (!res.ok) throw new Error("Failed to fetch monitoring status");
        const data = await res.json();

        const health = data?.last_result;
        const system = health?.system;
        const hasAnomaly = health?.anomaly;

        setSystemStats((prev) => ({
          ...prev,
          activeUsers: data?.activeUsers ?? prev.activeUsers,
          totalTransactions: data?.totalTransactions ?? prev.totalTransactions,
          systemLoad: system?.loadAverage?.[0]
            ? Math.round(system.loadAverage[0] * 100) / 100
            : prev.systemLoad,
          memoryUsage: system
            ? Math.round(
                ((system.totalMemory - system.freeMemory) /
                  system.totalMemory) *
                  100,
              )
            : prev.memoryUsage,
          uptime: system
            ? `${Math.floor(system.uptimeSeconds / 3600)}h`
            : prev.uptime,
          lastBackup: data?.lastBackup || prev.lastBackup,
        }));

        const activities: any[] = [];
        if (hasAnomaly) {
          activities.push({
            id: `anomaly-${Date.now()}`,
            type: "system_alert",
            message: health.msg || "Anomaly detected",
            timestamp: new Date(),
            user: "system",
            status: "warning",
          });
        }

        if (health?.ip_counts) {
          const topIps = Object.entries(health.ip_counts)
            .sort((a, b) => (b[1] as number) - (a[1] as number))
            .slice(0, 2);
          for (const [ip, count] of topIps) {
            activities.push({
              id: `ip-${ip}`,
              type: "network",
              message: `Activity from IP ${ip} (${count} events)`,
              timestamp: new Date(),
              user: "system",
              status: "success",
            });
          }
        }

        setRecentActivities(activities);
      } catch (e) {
        // keep defaults
      }
    };

    fetchMonitoring();
    const interval = setInterval(fetchMonitoring, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Handle system health changes
  const handleHealthChange = (status: "healthy" | "warning" | "critical") => {
    setSystemStatus(status);
    if (status === "critical") {
      setNotifications((prev) => prev + 1);
      toast({
        title: "Critical System Alert",
        description: "System health has degraded to critical status",
        variant: "destructive",
      });
    }
  };

  // Navigation items
  const getAccessibleTabs = (role: string): Set<string> => {
    // Normalize role - map display names to internal codes
    const normalizedRole = role.toLowerCase().includes("master")
      ? "master"
      : role.toLowerCase().includes("sister")
        ? "sister"
        : role.toLowerCase().includes("admin")
          ? "admin"
          : role.toLowerCase().includes("user")
            ? "user"
            : role.toLowerCase().includes("sponsored")
              ? "sponsored"
              : "guest";

    const tabAccess: Record<string, string[]> = {
      master: [
        "overview",
        "chat",
        "qconverse",
        "biometric",
        "access",
        "memory",
        "parallel",
        "accountability",
        "health",
        "trading",
        "financial",
        "qvillage",
        "media",
        "files",
        "whatsapp",
        "notifications",
        "settings",
      ],
      sister: [
        "overview",
        "chat",
        "qconverse",
        "biometric",
        "memory",
        "parallel",
        "accountability",
        "health",
        "trading",
        "financial",
        "qvillage",
        "media",
        "files",
        "projects",
        "notifications",
        "settings",
      ],
      admin: [
        "overview",
        "chat",
        "qconverse",
        "biometric",
        "access",
        "memory",
        "parallel",
        "accountability",
        "health",
        "trading",
        "financial",
        "qvillage",
        "media",
        "files",
        "whatsapp",
        "notifications",
        "settings",
      ],
      user: [
        "overview",
        "chat",
        "qconverse",
        "biometric",
        "memory",
        "trading",
        "media",
        "files",
        "notifications",
        "settings",
      ],
      sponsored: ["chat", "trading", "notifications", "settings"],
      guest: [],
    };
    return new Set(tabAccess[normalizedRole] || []);
  };

  const accessibleTabs = getAccessibleTabs(currentRole);

  const allNavigationItems = [
    { id: "overview", label: "Overview", icon: Home, badge: null },
    { id: "chat", label: "Chat with QMOI", icon: MessageSquare, badge: null },
    { id: "qconverse", label: "QConverse (Voice)", icon: Wifi, badge: "NEW" },
    { id: "biometric", label: "Biometric Auth", icon: Shield, badge: null },
    { id: "access", label: "Access Control", icon: Lock, badge: null },
    { id: "memory", label: "Memory Awareness", icon: Brain, badge: null },
    { id: "parallel", label: "Parallel Processing", icon: Zap, badge: null },
    {
      id: "accountability",
      label: "Accountability",
      icon: BarChart3,
      badge: null,
    },
    { id: "health", label: "System Health", icon: Activity, badge: null },
    {
      id: "trading",
      label: "Trading & Revenue",
      icon: TrendingUp,
      badge: null,
    },
    {
      id: "financial",
      label: "Financial Manager",
      icon: BarChart3,
      badge: null,
    },
    { id: "qvillage", label: "QVillage", icon: Database, badge: "ENTERPRISE" },
    { id: "media", label: "Media Manager", icon: MessageSquare, badge: null },
    { id: "files", label: "File Explorer", icon: Database, badge: null },
    {
      id: "projects",
      label: "Sister Projects",
      icon: Grid,
      badge: null,
    },
    {
      id: "tools",
      label: "Developer Tools",
      icon: Code,
      badge: null,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageSquare,
      badge: null,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: notifications > 0 ? String(notifications) : null,
    },
    { id: "settings", label: "Settings", icon: Settings, badge: null },
  ];

  // Filter navigation items based on role access
  const navigationItems = allNavigationItems.filter((item) =>
    accessibleTabs.has(item.id),
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_login":
        return <Users className="w-4 h-4" />;
      case "system_alert":
        return <AlertTriangle className="w-4 h-4" />;
      case "data_sync":
        return <Database className="w-4 h-4" />;
      case "security_scan":
        return <Shield className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden mr-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">QM</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  QMOI Enhanced
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* System Status Indicator */}
              <div className="hidden md:flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    systemStatus === "healthy"
                      ? "bg-green-500"
                      : systemStatus === "warning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-gray-600 capitalize">
                  {systemStatus}
                </span>
              </div>

              {/* Memory Sync Indicator */}
              <div className="hidden md:flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    memoryStatus === "ok"
                      ? "bg-green-500"
                      : memoryStatus === "offline"
                        ? "bg-red-500"
                        : "bg-gray-400"
                  }`}
                />
                <span className="text-sm text-gray-600 capitalize">
                  Memory: {memoryStatus}
                </span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    {notifications}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}
        >
          <div className="flex flex-col h-full pt-16 md:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                  {item.badge && (
                    <Badge className="ml-auto" variant="secondary">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </nav>

            {/* System Info */}
            <div className="p-4 border-t">
              <div className="text-xs text-gray-500 space-y-1">
                <div>Version: 1.2.3</div>
                <div>Uptime: {systemStats.uptime}</div>
                <div>Last Backup: {systemStats.lastBackup}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">
                    Welcome to QMOI Enhanced
                  </h2>
                  <p className="text-blue-100">
                    Advanced AI-powered system with biometric authentication,
                    parallel processing, and comprehensive security monitoring.
                  </p>
                </div>

                {/* System Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Active Users
                          </p>
                          <p className="text-2xl font-bold">
                            {systemStats.activeUsers.toLocaleString()}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-green-600">+12%</span>
                        <span className="text-gray-600 ml-2">
                          from last month
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Total Transactions
                          </p>
                          <p className="text-2xl font-bold">
                            {systemStats.totalTransactions.toLocaleString()}
                          </p>
                        </div>
                        <Activity className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-green-600">+8%</span>
                        <span className="text-gray-600 ml-2">
                          from last month
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            System Load
                          </p>
                          <p className="text-2xl font-bold">
                            {systemStats.systemLoad}%
                          </p>
                        </div>
                        <Cpu className="w-8 h-8 text-yellow-600" />
                      </div>
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-600 h-2 rounded-full"
                            style={{ width: `${systemStats.systemLoad}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Memory Usage
                          </p>
                          <p className="text-2xl font-bold">
                            {systemStats.memoryUsage}%
                          </p>
                        </div>
                        <Database className="w-8 h-8 text-purple-600" />
                      </div>
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${systemStats.memoryUsage}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Ask QMoi */}
                <AskQMoi />

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center gap-4 p-3 border rounded-lg"
                        >
                          <div className={getActivityColor(activity.status)}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.message}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{activity.user}</span>
                              <span>•</span>
                              <span>
                                {activity.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              activity.status === "success"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === "chat" && (
              <Chatbot
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
              />
            )}

            {/* Component Tabs */}
            {activeTab === "biometric" && (
              <BiometricAuth
                onAuthenticated={(userId, confidence) => {
                  // Update global user context so QMOI becomes aware
                  const userProfile = {
                    id: String(userId),
                    name: `Biometric User ${String(userId)}`,
                    email: `${String(userId)}@qmoi`,
                    role: "user" as const,
                    avatar: undefined,
                  };
                  try {
                    setCurrentUser;
                    setRole("user");
                    updateQMOIMemory({
                      conversations: (qmoiMemory?.conversations || 0) + 1,
                      preferences: {
                        ...(qmoiMemory?.preferences || {}),
                        lastAuthMethod: "biometric",
                        lastAuthConfidence: confidence,
                      },
                      contextHistory: [
                        `Biometric login by ${userProfile.name} (${(
                          confidence * 100
                        ).toFixed(1)}%)`,
                      ],
                    });
                  } catch (e) {
                    // safe fallback if context not available
                    console.warn(
                      "Could not update MasterContext on biometric auth",
                      e,
                    );
                  }

                  toast({
                    title: "Authentication Successful",
                    description: `User ${userId} authenticated with ${(confidence * 100).toFixed(1)}% confidence`,
                  });
                }}
                onFailed={(reason) => {
                  toast({
                    title: "Authentication Failed",
                    description: reason,
                    variant: "destructive",
                  });
                }}
              />
            )}
            {activeTab === "access" && (
              <AccessControlProvider>
                <UserAccessControl />
              </AccessControlProvider>
            )}
            {activeTab === "memory" && <MemoryAwareness />}
            {activeTab === "parallel" && <ParallelProcessing />}
            {activeTab === "accountability" && <AccountabilitySystem />}
            {activeTab === "health" && (
              <SystemHealthMonitor onHealthChange={handleHealthChange} />
            )}

            {/* QConverse Tab */}
            {activeTab === "qconverse" && (
              <QConverse
                isEnabled={true}
                onToggle={() => {}}
                userId={user?.id || "1"}
              />
            )}

            {/* Trading Panel Tab */}
            {activeTab === "trading" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Trading & Revenue Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TradingPanel />
                </CardContent>
              </Card>
            )}

            {/* Financial Manager Tab */}
            {activeTab === "financial" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Financial Manager
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FinancialManager />
                </CardContent>
              </Card>
            )}

            {/* QVillage Tab */}
            {activeTab === "qvillage" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    QVillage Enterprise
                  </CardTitle>
                  <CardDescription>
                    Master-only AI/ML infrastructure management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QVillage />
                </CardContent>
              </Card>
            )}

            {/* Media Manager Tab */}
            {activeTab === "media" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid className="w-5 h-5" />
                    Media Manager
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <QmoiMediaManager />
                </CardContent>
              </Card>
            )}

            {/* File Explorer Tab */}
            {activeTab === "files" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    File Explorer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileExplorer />
                </CardContent>
              </Card>
            )}

            {/* Sister Projects Tab */}
            {activeTab === "projects" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid className="w-5 h-5" />
                    Sister Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SisterProjects />
                </CardContent>
              </Card>
            )}

            {/* WhatsApp Tab */}
            {activeTab === "whatsapp" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    WhatsApp Business
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WhatsAppBusinessPanel />
                </CardContent>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <NotificationCenter />
                </CardContent>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Configure system preferences and advanced options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-4">Security Settings</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Enable Biometric Authentication</span>
                            <Badge>Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Multi-Factor Authentication</span>
                            <Badge>Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Session Timeout</span>
                            <span className="text-sm text-gray-600">
                              30 minutes
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-4">
                          Performance Settings
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Parallel Processing</span>
                            <Badge>Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Memory Optimization</span>
                            <Badge>Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Auto-scaling</span>
                            <Badge>Enabled</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <Button>Save Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Floating Ask QMoi */}
      <AskQMoi
        compact
        isOpen={askQMoiOpen}
        onToggle={() => setAskQMoiOpen(!askQMoiOpen)}
      />
    </div>
  );
};

export default QMOIDashboard;
