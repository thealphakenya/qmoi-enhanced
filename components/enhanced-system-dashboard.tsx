"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Code,
  Database,
  GitBranch,
  Globe,
  Mic,
  Play,
  Settings,
  Shield,
  Zap,
} from "lucide-react"
import QI from "@/components/QI"
import { NotificationCenter } from "@/components/NotificationCenter"
import { DeviceSettingsPanel } from "@/components/DeviceSettingsPanel"
import { FloatingPreviewWindow } from "@/components/FloatingPreviewWindow"
import { PluginManager } from "../src/plugins/PluginManager"
import { PluginNotificationsProvider, usePluginNotifications } from "./ui/PluginNotifications"
import { PluginHelpModal } from "./ui/PluginHelpModal"
import { AWSIntegration, AzureIntegration, GCPIntegration, IoTIntegration, MobileIntegration } from "./device/DeviceIntegrationStubs"
import { AWSCredentialsModal } from "./device/AWSCredentialsModal"
import { AzureCredentialsModal } from "./device/AzureCredentialsModal"
import { GCPCredentialsModal } from "./device/GCPCredentialsModal"
import { AnalyticsCharts } from "./analytics/AnalyticsCharts"
import { RoleProvider, useRole } from "./security/RoleContext"
import { OrchestratorStatusPanel, OrchestratorStatus } from "./predeploy/OrchestratorStatusPanel"
import { AutomationRulesPanel } from "./automation/AutomationRulesPanel"
import { EncryptedAuditLog } from "./analytics/EncryptedAuditLog"

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
}

interface ProjectStatus {
  id: string
  name: string
  status: "active" | "building" | "deployed" | "error"
  lastUpdate: string
}

const pluginManager = new PluginManager();
pluginManager.autoDiscoverAndRegisterPlugins();

const deviceIntegrations = [
  { name: 'AWS', integration: AWSIntegration },
  { name: 'Azure', integration: AzureIntegration },
  { name: 'GCP', integration: GCPIntegration },
  { name: 'IoT', integration: IoTIntegration },
  { name: 'Mobile', integration: MobileIntegration },
];

export function EnhancedSystemDashboard({ isMaster }: { isMaster: boolean }) {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 23,
  })

  const [projects] = useState<ProjectStatus[]>([
    { id: "1", name: "Alpha-Q AI", status: "active", lastUpdate: "2 minutes ago" },
    { id: "2", name: "Trading Bot", status: "deployed", lastUpdate: "1 hour ago" },
    { id: "3", name: "Voice Interface", status: "building", lastUpdate: "5 minutes ago" },
  ])

  const [isVoiceActive, setIsVoiceActive] = useState(false)

  const { notify } = usePluginNotifications();

  const [deviceStatus, setDeviceStatus] = useState<{ [name: string]: boolean }>({});

  // Add state for search/filter/group
  const [pluginSearch, setPluginSearch] = useState('');
  const [pluginGroup, setPluginGroup] = useState('all');
  const [deviceSearch, setDeviceSearch] = useState('');
  const [deviceGroup, setDeviceGroup] = useState('all');

  const [analytics, setAnalytics] = useState<{ events: any[] }>({ events: [] });
  const [auditLog, setAuditLog] = useState<string[]>([]);

  const [awsModalOpen, setAwsModalOpen] = useState(false);
  const [awsBuckets, setAwsBuckets] = useState<string[]>([]);

  const [azureModalOpen, setAzureModalOpen] = useState(false);
  const [azureResourceGroups, setAzureResourceGroups] = useState<string[]>([]);
  const handleAzureConnect = async (creds: { tenantId: string; clientId: string; clientSecret: string; subscriptionId: string }) => {
    setAzureModalOpen(false);
    const result = await AzureIntegration.connect(creds);
    if (result) {
      notify('Azure connected', 'success');
      const rgs = await (AzureIntegration as any).listResourceGroups();
      setAzureResourceGroups(rgs);
    } else {
      notify('Azure connection failed', 'error');
    }
  };

  const [gcpModalOpen, setGcpModalOpen] = useState(false);
  const [gcpBuckets, setGcpBuckets] = useState<string[]>([]);
  const handleGCPConnect = async (creds: { projectId: string; keyFilename: string }) => {
    setGcpModalOpen(false);
    const result = await GCPIntegration.connect(creds);
    if (result) {
      notify('GCP connected', 'success');
      const buckets = await (GCPIntegration as any).listBuckets();
      setGcpBuckets(buckets);
    } else {
      notify('GCP connection failed', 'error');
    }
  };

  const handleAWSConnect = async (creds: { accessKeyId: string; secretAccessKey: string; region: string }) => {
    setAwsModalOpen(false);
    const result = await AWSIntegration.connect(creds);
    if (result) {
      notify('AWS connected', 'success');
      const buckets = await AWSIntegration.listBuckets();
      setAwsBuckets(buckets);
    } else {
      notify('AWS connection failed', 'error');
    }
  };

  const { role } = useRole();

  const [orchestratorStatus, setOrchestratorStatus] = useState<OrchestratorStatus>({
    env: 'success', lint: 'success', test: 'success', build: 'success', audit: 'success', fix: 'success', deploy: 'success'
  });

  const runOrchestrator = () => {
    setOrchestratorStatus({ env: 'success', lint: 'warning', test: 'error', build: 'success', audit: 'warning', fix: 'success', deploy: 'success' });
    notify('Orchestrator run complete (mock)', 'info');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        disk: Math.max(0, Math.min(100, prev.disk + (Math.random() - 0.5) * 2)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
      }))
    }, 2000)

    // Demo: Simulate device health event after 3s
    setTimeout(() => {
      pluginManager.emit({ type: 'deviceHealthChange', payload: { cpu: 92 } });
      notify('Device health event: CPU 92%', 'info');
    }, 3000);
    // Schedule Optimization Suggestion Plugin every minute
    const optPlugin = pluginManager.getPlugins().find((p: any) => p.id === 'optimization-suggestion');
    if (optPlugin) {
      pluginManager.schedule(optPlugin, 60000);
      notify('Optimization Suggestion Plugin scheduled every 1 min', 'info');
    }

    return () => {
      clearInterval(interval)
      pluginManager.clearSchedules()
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "building":
        return "bg-yellow-500"
      case "deployed":
        return "bg-blue-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Activity className="h-4 w-4" />
      case "building":
        return <Clock className="h-4 w-4" />
      case "deployed":
        return <CheckCircle className="h-4 w-4" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const logEvent = (event: any) => {
    setAnalytics(a => ({ events: [...a.events, event] }));
    setAuditLog(l => [...l, `[${new Date().toISOString()}] ${event.type}: ${JSON.stringify(event.payload)}`]);
  };

  return (
    <RoleProvider>
      <PluginNotificationsProvider>
        <div className="relative">
          {/* Notification Center for real-time events */}
          <NotificationCenter />
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Alpha-Q AI Dashboard</h1>
                  <p className="text-slate-600 dark:text-slate-400">Enhanced AI-powered development platform</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant={isVoiceActive ? "destructive" : "default"}
                    onClick={() => setIsVoiceActive(!isVoiceActive)}
                    className="flex items-center space-x-2"
                  >
                    <Mic className="h-4 w-4" />
                    <span>{isVoiceActive ? "Stop Voice" : "Start Voice"}</span>
                  </Button>
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>System Online</span>
                  </Badge>
                </div>
              </div>

              {/* System Alerts */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>System Status</AlertTitle>
                <AlertDescription>All systems operational. Supabase connected. GitHub integration active.</AlertDescription>
              </Alert>

              {/* System Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.cpu.toFixed(1)}%</div>
                    <Progress value={metrics.cpu} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Memory</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.memory.toFixed(1)}%</div>
                    <Progress value={metrics.memory} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.disk.toFixed(1)}%</div>
                    <Progress value={metrics.disk} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Network</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.network.toFixed(1)}%</div>
                    <Progress value={metrics.network} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <Tabs defaultValue="projects" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="ai">AI Features</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="devices">Devices</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="plugins">Plugins</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="projects" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Projects</CardTitle>
                      <CardDescription>Manage and monitor your development projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {projects.map((project) => (
                          <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                              <div>
                                <h3 className="font-medium">{project.name}</h3>
                                <p className="text-sm text-muted-foreground">Last updated {project.lastUpdate}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="flex items-center space-x-1">
                                {getStatusIcon(project.status)}
                                <span className="capitalize">{project.status}</span>
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Play className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ai" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Zap className="h-5 w-5" />
                          <span>AI Assistant</span>
                        </CardTitle>
                        <CardDescription>Intelligent code generation and assistance</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">
                          <Code className="h-4 w-4 mr-2" />
                          Generate Code
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Mic className="h-5 w-5" />
                          <span>Voice Interface</span>
                        </CardTitle>
                        <CardDescription>Voice-controlled development environment</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          className="w-full"
                          variant={isVoiceActive ? "destructive" : "default"}
                          onClick={() => setIsVoiceActive(!isVoiceActive)}
                        >
                          {isVoiceActive ? "Stop Listening" : "Start Listening"}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <GitBranch className="h-5 w-5" />
                          <span>GitHub</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Connected</span>
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Database className="h-5 w-5" />
                          <span>Supabase</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Connected</span>
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Globe className="h-5 w-5" />
                          <span>Vercel</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Ready</span>
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Configuration</CardTitle>
                      <CardDescription>Configure your Alpha-Q AI system settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Auto-deploy enabled</span>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Voice interface</span>
                          <Badge variant={isVoiceActive ? "default" : "secondary"}>
                            {isVoiceActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Security scanning</span>
                          <Badge variant="outline">Enabled</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="devices">
                  <Card>
                    <CardHeader>
                      <CardTitle>Device Management</CardTitle>
                      <CardDescription>Configure and manage your devices</CardDescription>
                      <input
                        type="text"
                        placeholder="Search devices..."
                        value={deviceSearch}
                        onChange={e => setDeviceSearch(e.target.value)}
                        style={{ marginTop: 8, marginBottom: 8, width: 200 }}
                      />
                      <select value={deviceGroup} onChange={e => setDeviceGroup(e.target.value)} style={{ marginLeft: 8 }}>
                        <option value="all">All</option>
                        <option value="connected">Connected</option>
                        <option value="disconnected">Disconnected</option>
                      </select>
                    </CardHeader>
                    <CardContent>
                      <h4>Device Integrations</h4>
                      <ul>
                        {deviceIntegrations
                          .filter(d => d.name.toLowerCase().includes(deviceSearch.toLowerCase()))
                          .filter(d =>
                            deviceGroup === 'all' ? true : deviceGroup === 'connected' ? deviceStatus[d.name] : !deviceStatus[d.name]
                          )
                          .map(d => (
                            <li key={d.name} style={{ marginBottom: 8 }}>
                              <strong>{d.name}</strong>
                              <span style={{ marginLeft: 8, color: deviceStatus[d.name] ? 'green' : 'gray' }}>
                                [{deviceStatus[d.name] ? 'Connected' : 'Disconnected'}]
                              </span>
                              <button
                                style={{ marginLeft: 12 }}
                                onClick={async () => {
                                  if (role !== 'admin') { notify('Admin only', 'error'); return; }
                                  if (deviceStatus[d.name]) {
                                    setDeviceStatus((s) => ({ ...s, [d.name]: false }));
                                    notify(`${d.name} disconnected`, 'warning');
                                  } else {
                                    const result = await d.integration.connect();
                                    setDeviceStatus((s) => ({ ...s, [d.name]: !!result }));
                                    notify(`${d.name} ${result ? 'connected' : 'failed to connect'}`, result ? 'success' : 'error');
                                  }
                                }}
                              >
                                {deviceStatus[d.name] ? 'Disconnect' : 'Connect'}
                              </button>
                              {d.name === 'AWS' && deviceStatus[d.name] && (
                                <div style={{ marginTop: 8, marginBottom: 8 }}>
                                  <button onClick={async () => {
                                    if (role !== 'admin') { notify('Admin only', 'error'); return; }
                                    if (typeof (AWSIntegration as any).listBuckets === 'function') {
                                      const buckets = await (AWSIntegration as any).listBuckets();
                                      setAwsBuckets(buckets);
                                      notify('Buckets refreshed', 'info');
                                    }
                                  }}>Refresh Buckets</button>
                                  <button onClick={() => {
                                    if (role !== 'admin') { notify('Admin only', 'error'); return; }
                                    setAwsModalOpen(true)
                                  }} style={{ marginLeft: 8 }}>Set Credentials</button>
                                  <div>Buckets: {awsBuckets.length ? awsBuckets.join(', ') : 'None'}</div>
                                </div>
                              )}
                              {d.name === 'Azure' && deviceStatus[d.name] && (
                                <div style={{ marginTop: 8, marginBottom: 8 }}>
                                  <button onClick={async () => {
                                    if (role !== 'admin') { notify('Admin only', 'error'); return; }
                                    if (typeof (AzureIntegration as any).listResourceGroups === 'function') {
                                      const rgs = await (AzureIntegration as any).listResourceGroups();
                                      setAzureResourceGroups(rgs);
                                      notify('Resource groups refreshed', 'info');
                                    }
                                  }}>Refresh Resource Groups</button>
                                  <button onClick={() => {
                                    if (role !== 'admin') { notify('Admin only', 'error'); return; }
                                    setAzureModalOpen(true)
                                  }} style={{ marginLeft: 8 }}>Set Credentials</button>
                                  <div>Resource Groups: {azureResourceGroups.length ? azureResourceGroups.join(', ') : 'None'}</div>
                                </div>
                              )}
                              <AzureCredentialsModal open={azureModalOpen} onClose={() => setAzureModalOpen(false)} onSave={handleAzureConnect} />
                              {d.name === 'GCP' && deviceStatus[d.name] && (
                                <div style={{ marginTop: 8, marginBottom: 8 }}>
                                  <button onClick={async () => {
                                    if (role !== 'admin') { notify('Admin only', 'error'); return; }
                                    if (typeof (GCPIntegration as any).listBuckets === 'function') {
                                      const buckets = await (GCPIntegration as any).listBuckets();
                                      setGcpBuckets(buckets);
                                      notify('Buckets refreshed', 'info');
                                    }
                                  }}>Refresh Buckets</button>
                                  <button onClick={() => {
                                    if (role !== 'admin') { notify('Admin only', 'error'); return; }
                                    setGcpModalOpen(true)
                                  }} style={{ marginLeft: 8 }}>Set Credentials</button>
                                  <div>Buckets: {gcpBuckets.length ? gcpBuckets.join(', ') : 'None'}</div>
                                </div>
                              )}
                              <GCPCredentialsModal open={gcpModalOpen} onClose={() => setGcpModalOpen(false)} onSave={handleGCPConnect} />
                            </li>
                          ))}
                      </ul>
                      <DeviceSettingsPanel />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview">
                  {/* <FloatingPreviewWindow /> */}
                </TabsContent>

                <TabsContent value="plugins">
                  <Card>
                    <CardHeader>
                      <CardTitle>Plugins</CardTitle>
                      <CardDescription>Manage and configure QMOI plugins</CardDescription>
                      <PluginHelpModal />
                      <input
                        type="text"
                        placeholder="Search plugins..."
                        value={pluginSearch}
                        onChange={e => setPluginSearch(e.target.value)}
                        style={{ marginTop: 8, marginBottom: 8, width: 200 }}
                      />
                      <select value={pluginGroup} onChange={e => setPluginGroup(e.target.value)} style={{ marginLeft: 8 }}>
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </CardHeader>
                    <CardContent>
                      <ul>
                        {pluginManager.getPlugins()
                          .filter((plugin: any) =>
                            plugin.name.toLowerCase().includes(pluginSearch.toLowerCase()) ||
                            plugin.description.toLowerCase().includes(pluginSearch.toLowerCase())
                          )
                          .filter((plugin: any) =>
                            pluginGroup === 'all' ? true : pluginGroup === 'active' ? pluginManager.getPluginStatus(plugin.id) : !pluginManager.getPluginStatus(plugin.id)
                          )
                          .map((plugin: any) => (
                            <li key={plugin.id} className="mb-2">
                              <strong>{plugin.name}</strong>: {plugin.description}
                              <span style={{ marginLeft: 8, color: pluginManager.getPluginStatus(plugin.id) ? 'green' : 'gray' }}>
                                [{pluginManager.getPluginStatus(plugin.id) ? 'Active' : 'Inactive'}]
                              </span>
                              <button
                                style={{ marginLeft: 12 }}
                                onClick={() => {
                                  if (role !== 'admin') { notify('Admin only', 'error'); return; }
                                  if (pluginManager.getPluginStatus(plugin.id)) {
                                    pluginManager.disablePlugin(plugin.id);
                                    notify(`${plugin.name} disabled`, 'warning');
                                  } else {
                                    pluginManager.enablePlugin(plugin.id);
                                    notify(`${plugin.name} enabled`, 'success');
                                  }
                                }}
                              >
                                {pluginManager.getPluginStatus(plugin.id) ? 'Disable' : 'Enable'}
                              </button>
                              {plugin.getSettingsPanel && (
                                <div className="mt-2">{plugin.getSettingsPanel()}</div>
                              )}
                            </li>
                          ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Analytics & Reporting</CardTitle>
                      <CardDescription>View usage stats, automation events, and audit logs</CardDescription>
                      <button onClick={runOrchestrator} style={{ marginBottom: 8 }}>Run Orchestrator (Mock)</button>
                      <OrchestratorStatusPanel status={orchestratorStatus} />
                      <AutomationRulesPanel />
                      <button
                        onClick={() => {
                          const csv = analytics.events.map(e => `${e.type},${JSON.stringify(e.payload)}`).join('\n');
                          const blob = new Blob([csv], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'analytics.csv';
                          a.click();
                        }}
                        style={{ marginTop: 8 }}
                      >Export as CSV</button>
                    </CardHeader>
                    <CardContent>
                      <AnalyticsCharts analytics={analytics} />
                      <h4>Recent Events</h4>
                      <ul>
                        {analytics.events.slice(-10).reverse().map((e, i) => (
                          <li key={i}>{e.type}: {JSON.stringify(e.payload)}</li>
                        ))}
                      </ul>
                      <h4>Audit Log</h4>
                      <pre style={{ maxHeight: 200, overflow: 'auto', background: '#f8f8f8', padding: 8 }}>{auditLog.slice(-20).reverse().join('\n')}</pre>
                      <EncryptedAuditLog logs={auditLog} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Qi panel, only for master */}
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
  )
}
