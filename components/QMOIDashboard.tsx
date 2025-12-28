"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Shield,
  Activity,
  Users,
  Brain,
  Zap,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Home,
  BarChart3,
  Lock,
  Database,
  Cpu,
  Wifi,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import our enhanced components
import BiometricAuth from "./BiometricAuth";
import UserAccessControl from "./UserAccessControl";
import MemoryAwareness from "./MemoryAwareness";
import ParallelProcessing from "./ParallelProcessing";
import AccountabilitySystem from "./AccountabilitySystem";
import SystemHealthMonitor from "./SystemHealthMonitor";

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
    role: "Administrator",
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
  const { toast } = useToast();

  // Mock system stats
  const systemStats = {
    activeUsers: 1247,
    totalTransactions: 45632,
    systemLoad: 67,
    memoryUsage: 78,
    uptime: "7d 14h 32m",
    lastBackup: "2 hours ago",
  };

  // Mock recent activities
  const recentActivities = [
    {
      id: "1",
      type: "user_login",
      message: "User authentication successful",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      user: "john.doe",
      status: "success",
    },
    {
      id: "2",
      type: "system_alert",
      message: "High memory usage detected",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      user: "system",
      status: "warning",
    },
    {
      id: "3",
      type: "data_sync",
      message: "Database synchronization completed",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      user: "system",
      status: "success",
    },
    {
      id: "4",
      type: "security_scan",
      message: "Security scan completed with 2 warnings",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      user: "security",
      status: "warning",
    },
  ];

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
  const navigationItems = [
    { id: "overview", label: "Overview", icon: Home, badge: null },
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
    { id: "settings", label: "Settings", icon: Settings, badge: null },
  ];

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

            {/* Component Tabs */}
            {activeTab === "biometric" && (
              <BiometricAuth
                onAuthenticated={(userId, confidence) => {
                  toast({
                    title: "Authentication Successful",
                    description: `User ${userId} authenticated with ${confidence}% confidence`,
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
            {activeTab === "access" && <UserAccessControl />}
            {activeTab === "memory" && <MemoryAwareness />}
            {activeTab === "parallel" && <ParallelProcessing />}
            {activeTab === "accountability" && <AccountabilitySystem />}
            {activeTab === "health" && (
              <SystemHealthMonitor onHealthChange={handleHealthChange} />
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
    </div>
  );
};

export default QMOIDashboard;
