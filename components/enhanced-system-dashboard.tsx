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
import { QI } from "@/components/QI"

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

export function EnhancedSystemDashboard({ isAdmin }: { isAdmin: boolean }) {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        disk: Math.max(0, Math.min(100, prev.disk + (Math.random() - 0.5) * 2)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
      }))
    }, 2000)

    return () => clearInterval(interval)
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

  return (
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
        </Tabs>

        {/* QI panel, only for admin */}
        {isAdmin && (
          <div className="col-span-4">
            <QI />
          </div>
        )}
      </div>
    </div>
  )
}
