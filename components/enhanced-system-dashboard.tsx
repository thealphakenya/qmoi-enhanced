"use client";
import React, { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Globe,
  Mic,
  Play,
  Settings,
} from "lucide-react";
import {
  PluginNotificationsProvider,
  usePluginNotifications,
} from "./ui/PluginNotifications";
import { OrchestratorStatus } from "./predeploy/OrchestratorStatusPanel";
import { PluginManager } from "@/plugins/PluginManager";
import { RoleProvider } from "./security/RoleContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import NotificationCenter from "@/components/NotificationCenter";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import EncryptedAuditLog from "@/components/EncryptedAuditLog";
import QI from "@/components/QI";

export type SystemMetrics = { cpu: number; memory: number; disk: number; network: number };

const pluginManager = new PluginManager();
pluginManager.autoDiscoverAndRegisterPlugins();

interface Props {
  isMaster?: boolean;
}

interface Project {
  id: string;
  name: string;
  status: string;
  lastUpdate: string;
}

export const EnhancedSystemDashboard: React.FC<Props> = ({ isMaster = false }) => {
  const [metrics, setMetrics] = useState<SystemMetrics>({ cpu: 10, memory: 20, disk: 30, network: 5 });
  const [projects] = useState<Project[]>([{ id: "1", name: "latest-Q AI", status: "active", lastUpdate: "2 minutes ago" }]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const { notify } = usePluginNotifications();
  const [analytics, setAnalytics] = useState<{ events: Array<Record<string, unknown>> }>({ events: [] });
  const [auditLog, setAuditLog] = useState<string[]>([]);
  const [orchestratorStatus] = useState<OrchestratorStatus>({ env: "success", lint: "success", test: "success", build: "success", audit: "success", fix: "success", deploy: "success" });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 6)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 3)),
        disk: Math.max(0, Math.min(100, prev.disk + (Math.random() - 0.5) * 2)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 8)),
      }));
    }, 2000);

    const optPlugin = pluginManager.getPlugins().find((p: { id: string }) => p.id === "optimization-suggestion");
    if (optPlugin) pluginManager.schedule(optPlugin, 60000);

    // demo: emit a device health event
    const timeout = setTimeout(() => {
      pluginManager.emit({ type: "deviceHealthChange", payload: { cpu: 92 } });
      notify?.("Device health event: CPU 92%", "info");
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      pluginManager.clearSchedules();
    };
  }, [notify]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "building":
        return "bg-yellow-500";
      case "deployed":
        return "bg-blue-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Activity className="h-4 w-4" />;
      case "building":
        return <Clock className="h-4 w-4" />;
      case "deployed":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const logEvent = (event: { type?: string; payload?: Record<string, unknown> }) => {
    setAnalytics((a) => ({ events: [...a.events, event] }));
    setAuditLog((l) => [
      ...l,
      `[${new Date().toISOString()}] ${event.type ?? "event"}: ${JSON.stringify(event.payload ?? {})}`,
    ]);
  };

  return (
    <RoleProvider>
      <PluginNotificationsProvider>
        <div className="relative">
          <NotificationCenter />
          <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">latest-Q AI Dashboard</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant={isVoiceActive ? "destructive" : "default"}
                    onClick={() => {
                      const nextState = !isVoiceActive;
                      setIsVoiceActive(nextState);
                      logEvent({ type: "voice-toggle", payload: { active: nextState } });
                    }}
                  >
                    <Mic className="h-4 w-4" />
                    <span>{isVoiceActive ? "Stop Voice" : "Start Voice"}</span>
                  </Button>
                  <Badge variant="outline">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>System Online</span>
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>CPU Usage</CardTitle>
                    <Activity className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.cpu.toFixed(1)}%</div>
                    <Progress value={metrics.cpu} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>Memory</CardTitle>
                    <Database className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.memory.toFixed(1)}%</div>
                    <Progress value={metrics.memory} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>Disk</CardTitle>
                    <Settings className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.disk.toFixed(1)}%</div>
                    <Progress value={metrics.disk} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>Network</CardTitle>
                    <Globe className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.network.toFixed(1)}%</div>
                    <Progress value={metrics.network} />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Orchestrator Status</CardTitle>
                  <CardDescription>Current automation pipeline health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {Object.entries(orchestratorStatus).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="capitalize">{key}</span>
                        <Badge
                          variant="outline"
                          className={
                            value === "success"
                              ? "border-green-500 text-green-600"
                              : value === "warning"
                              ? "border-yellow-500 text-yellow-600"
                              : "border-red-500 text-red-600"
                          }
                        >
                          {value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="projects">
                <TabsList>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="projects">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Projects</CardTitle>
                      <CardDescription />
                    </CardHeader>
                    <CardContent>
                      {projects.map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(p.status)}`} />
                            <div>
                              <h3 className="font-medium">{p.name}</h3>
                              <p className="text-sm">Last updated {p.lastUpdate}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="flex items-center space-x-1">
                              {getStatusIcon(p.status)}
                              <span className="capitalize">{p.status}</span>
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="analytics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Analytics & Reporting</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AnalyticsCharts analytics={analytics} />
                      <EncryptedAuditLog logs={auditLog} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {isMaster && (
                <div className="col-span-4">
                  <QI />
                </div>
              )}
            </div>
          </div>
        </div>
      </PluginNotificationsProvider>
    </RoleProvider>
  );
};

export default EnhancedSystemDashboard;
