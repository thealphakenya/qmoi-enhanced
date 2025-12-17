import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  Play,
  Monitor,
  Shield,
  Settings,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Database,
  Code,
  Globe,
  Zap,
  TrendingUp,
  Cpu,
  HardDrive,
  Network,
} from "lucide-react";

interface QVillageProps {
  isMaster: boolean;
}

interface Model {
  id: string;
  name: string;
  type: string;
  version: string;
  status: "active" | "inactive" | "deployed" | "error";
  performance: number;
  security: "secure" | "warning" | "vulnerable";
  lastUpdated: string;
}

interface Space {
  id: string;
  name: string;
  type: string;
  domain: string;
  status: "active" | "inactive" | "deployed" | "error";
  performance: number;
  security: "secure" | "warning" | "vulnerable";
  lastUpdated: string;
}

interface Dataset {
  id: string;
  name: string;
  type: string;
  version: string;
  status: "active" | "inactive" | "deployed" | "error";
  size: string;
  security: "secure" | "warning" | "vulnerable";
  lastUpdated: string;
}

interface Inference {
  id: string;
  name: string;
  modelId: string;
  endpoint: string;
  status: "active" | "inactive" | "scaling" | "error";
  requests: number;
  latency: number;
  security: "secure" | "warning" | "vulnerable";
  lastUpdated: string;
}

interface EnterpriseMetrics {
  security: {
    status: "secure" | "warning" | "vulnerable";
    threats: number;
    vulnerabilities: number;
    lastScan: string;
  };
  compliance: {
    status: "compliant" | "warning" | "non-compliant";
    gdpr: boolean;
    hipaa: boolean;
    sox: boolean;
    lastAudit: string;
  };
  performance: {
    totalRequests: number;
    averageLatency: number;
    uptime: number;
    lastUpdated: string;
  };
}

export default function QVillage({ isMaster }: QVillageProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [inference, setInference] = useState<Inference[]>([]);
  const [enterprise, setEnterprise] = useState<EnterpriseMetrics>({
    security: {
      status: "secure",
      threats: 0,
      vulnerabilities: 0,
      lastScan: new Date().toISOString(),
    },
    compliance: {
      status: "compliant",
      gdpr: true,
      hipaa: false,
      sox: true,
      lastAudit: new Date().toISOString(),
    },
    performance: {
      totalRequests: 0,
      averageLatency: 0,
      uptime: 100,
      lastUpdated: new Date().toISOString(),
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isMaster) {
      loadQVillageData();
    }
  }, [isMaster]);

  const loadQVillageData = async () => {
    setLoading(true);
    try {
      // Simulate loading data from QMOI Hugging Face clone
      const mockModels: Model[] = [
        {
          id: "1",
          name: "qmoi-transformer-v1",
          type: "transformer",
          version: "1.0.0",
          status: "deployed",
          performance: 95,
          security: "secure",
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "2",
          name: "qmoi-bert-large",
          type: "bert",
          version: "2.1.0",
          status: "active",
          performance: 88,
          security: "secure",
          lastUpdated: new Date().toISOString(),
        },
      ];

      const mockSpaces: Space[] = [
        {
          id: "1",
          name: "qmoi-demo-app",
          type: "gradio",
          domain: "demo.qmoi.com",
          status: "deployed",
          performance: 92,
          security: "secure",
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "2",
          name: "qmoi-interactive-chat",
          type: "streamlit",
          domain: "chat.qmoi.com",
          status: "active",
          performance: 87,
          security: "secure",
          lastUpdated: new Date().toISOString(),
        },
      ];

      const mockDatasets: Dataset[] = [
        {
          id: "1",
          name: "qmoi-training-data",
          type: "text",
          version: "1.0.0",
          status: "deployed",
          size: "2.5GB",
          security: "secure",
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "2",
          name: "qmoi-validation-set",
          type: "text",
          version: "1.1.0",
          status: "active",
          size: "500MB",
          security: "secure",
          lastUpdated: new Date().toISOString(),
        },
      ];

      const mockInference: Inference[] = [
        {
          id: "1",
          name: "nlp-api",
          modelId: "qmoi-transformer-v1",
          endpoint: "api.qmoi.com/nlp",
          status: "active",
          requests: 1500,
          latency: 45,
          security: "secure",
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "2",
          name: "chat-api",
          modelId: "qmoi-bert-large",
          endpoint: "api.qmoi.com/chat",
          status: "active",
          requests: 2300,
          latency: 32,
          security: "secure",
          lastUpdated: new Date().toISOString(),
        },
      ];

      setModels(mockModels);
      setSpaces(mockSpaces);
      setDatasets(mockDatasets);
      setInference(mockInference);
      setError(null);
    } catch (err) {
      setError("Failed to load QVillage data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "deployed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "inactive":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSecurityBadge = (security: string) => {
    switch (security) {
      case "secure":
        return (
          <Badge variant="default" className="bg-green-500">
            Secure
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            Warning
          </Badge>
        );
      case "vulnerable":
        return <Badge variant="destructive">Vulnerable</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!isMaster) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            QVillage - Master Only Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              QVillage is restricted to master access only. Only the master can
              view and manage Hugging Face features.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            QVillage - Hugging Face Master Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">
                Models: {models.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">
                Spaces: {spaces.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">
                Datasets: {datasets.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">
                Inference: {inference.length}
              </span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="models" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="spaces">Spaces</TabsTrigger>
              <TabsTrigger value="datasets">Datasets</TabsTrigger>
              <TabsTrigger value="inference">Inference</TabsTrigger>
              <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Model Management</h3>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Model
                </Button>
              </div>
              <div className="grid gap-4">
                {models.map((model) => (
                  <Card key={model.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(model.status)}
                            <h4 className="font-medium">{model.name}</h4>
                            <Badge variant="outline">{model.type}</Badge>
                            <Badge variant="outline">v{model.version}</Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4" />
                              <span className="text-sm">
                                Performance: {model.performance}%
                              </span>
                            </div>
                            {getSecurityBadge(model.security)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Monitor className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="spaces" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Space Management</h3>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Create Space
                </Button>
              </div>
              <div className="grid gap-4">
                {spaces.map((space) => (
                  <Card key={space.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(space.status)}
                            <h4 className="font-medium">{space.name}</h4>
                            <Badge variant="outline">{space.type}</Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              <span className="text-sm">{space.domain}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4" />
                              <span className="text-sm">
                                Performance: {space.performance}%
                              </span>
                            </div>
                            {getSecurityBadge(space.security)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Monitor className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="datasets" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Dataset Management</h3>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Dataset
                </Button>
              </div>
              <div className="grid gap-4">
                {datasets.map((dataset) => (
                  <Card key={dataset.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(dataset.status)}
                            <h4 className="font-medium">{dataset.name}</h4>
                            <Badge variant="outline">{dataset.type}</Badge>
                            <Badge variant="outline">v{dataset.version}</Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <HardDrive className="h-4 w-4" />
                              <span className="text-sm">
                                Size: {dataset.size}
                              </span>
                            </div>
                            {getSecurityBadge(dataset.security)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Monitor className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="inference" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Inference Management</h3>
                <Button size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Setup Inference
                </Button>
              </div>
              <div className="grid gap-4">
                {inference.map((endpoint) => (
                  <Card key={endpoint.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(endpoint.status)}
                            <h4 className="font-medium">{endpoint.name}</h4>
                            <Badge variant="outline">{endpoint.modelId}</Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Network className="h-4 w-4" />
                              <span className="text-sm">
                                {endpoint.endpoint}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              <span className="text-sm">
                                {endpoint.requests} req/min
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Cpu className="h-4 w-4" />
                              <span className="text-sm">
                                {endpoint.latency}ms
                              </span>
                            </div>
                            {getSecurityBadge(endpoint.security)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Monitor className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="enterprise" className="space-y-4">
              <h3 className="text-lg font-semibold">Enterprise Management</h3>
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Overall Status</span>
                        {getSecurityBadge(enterprise.security.status)}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-500">
                            {enterprise.security.threats}
                          </div>
                          <div className="text-sm text-gray-500">Threats</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-500">
                            {enterprise.security.vulnerabilities}
                          </div>
                          <div className="text-sm text-gray-500">
                            Vulnerabilities
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">
                            {enterprise.performance.uptime}%
                          </div>
                          <div className="text-sm text-gray-500">Uptime</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Compliance Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Overall Status</span>
                        <Badge
                          variant={
                            enterprise.compliance.status === "compliant"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {enterprise.compliance.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div
                            className={`text-2xl font-bold ${enterprise.compliance.gdpr ? "text-green-500" : "text-red-500"}`}
                          >
                            {enterprise.compliance.gdpr ? "✓" : "✗"}
                          </div>
                          <div className="text-sm text-gray-500">GDPR</div>
                        </div>
                        <div className="text-center">
                          <div
                            className={`text-2xl font-bold ${enterprise.compliance.hipaa ? "text-green-500" : "text-red-500"}`}
                          >
                            {enterprise.compliance.hipaa ? "✓" : "✗"}
                          </div>
                          <div className="text-sm text-gray-500">HIPAA</div>
                        </div>
                        <div className="text-center">
                          <div
                            className={`text-2xl font-bold ${enterprise.compliance.sox ? "text-green-500" : "text-red-500"}`}
                          >
                            {enterprise.compliance.sox ? "✓" : "✗"}
                          </div>
                          <div className="text-sm text-gray-500">SOX</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-500">
                            {enterprise.performance.totalRequests.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            Total Requests
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">
                            {enterprise.performance.averageLatency}ms
                          </div>
                          <div className="text-sm text-gray-500">
                            Avg Latency
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-500">
                            {enterprise.performance.uptime}%
                          </div>
                          <div className="text-sm text-gray-500">Uptime</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
