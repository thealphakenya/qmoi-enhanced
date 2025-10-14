import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Fingerprint,
  Mic,
  Camera,
  Eye,
  User,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  Settings,
  Save,
  Trash2,
  Plus,
  Scan,
  Zap,
  DollarSign,
  TrendingUp,
  Globe,
  Code,
  TestTube,
  Rocket,
  Brain,
  Unlock,
  Database,
  Network,
  Smartphone,
  Monitor,
  Server,
  CreditCard,
  BarChart3,
  Target,
  AlertTriangle,
  Activity,
  Clock,
  MapPin,
  Key,
  FileText,
  GitBranch,
  Cloud,
  MessageSquare,
  Bot,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
} from "lucide-react";

interface BiometricData {
  id: string;
  type: "fingerprint" | "voice" | "face" | "iris" | "gait" | "keystroke";
  name: string;
  data: string;
  createdAt: Date;
  lastUsed: Date;
  isActive: boolean;
  confidence?: number;
  livenessScore?: number;
  antiSpoofingScore?: number;
  behavioralScore?: number;
  environmentalScore?: number;
}

interface MasterControlRequest {
  interface: string;
  command: string;
  filePath?: string;
  content?: string;
  revenueIdea?: any;
  financialOperation?: any;
  timestamp: Date;
  status: "pending" | "approved" | "rejected" | "implemented";
}

interface PaymentConfirmation {
  id: string;
  provider: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: "pending" | "confirmed" | "failed";
  blockchainTxHash?: string;
  fraudScore?: number;
  timestamp: Date;
}

interface RevenueStrategy {
  id: string;
  type: "ai_service" | "trading" | "content" | "platform" | "consulting";
  description: string;
  expectedRevenue: number;
  riskLevel: "low" | "medium" | "high";
  implementationTime: number; // days
  status: "pending" | "implementing" | "active" | "completed" | "failed";
  createdAt: Date;
  revenueGenerated?: number;
  costIncurred?: number;
  roi?: number;
}

interface FinancialReport {
  id: string;
  period: string;
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  roi: number;
  activeStrategies: number;
  pendingPayments: number;
  riskMetrics: Record<string, number>;
  timestamp: Date;
}

interface SystemHealth {
  biometrics: {
    activeSessions: number;
    authenticationRate: number;
    errorRate: number;
  };
  masterControl: {
    activeRequests: number;
    approvalRate: number;
    implementationRate: number;
  };
  financial: {
    activeStrategies: number;
    totalRevenue: number;
    pendingPayments: number;
  };
  interfaces: {
    active: string[];
    syncStatus: Record<string, boolean>;
  };
}

interface BiometricAuthProps {
  onAuthSuccess: (userData: any) => void;
  onAuthFailure: (error: string) => void;
  onBiometricSaved: (biometricData: BiometricData) => void;
  onMasterControl?: (request: MasterControlRequest) => Promise<boolean>;
  onRevenueGeneration?: () => Promise<RevenueStrategy[]>;
  onPaymentConfirmation?: (payment: PaymentConfirmation) => Promise<boolean>;
  onFinancialOperation?: (operation: any) => Promise<any>;
  onSystemHealth?: () => Promise<SystemHealth>;
}

export default function BiometricAuth({
  onAuthSuccess,
  onAuthFailure,
  onBiometricSaved,
  onMasterControl,
  onRevenueGeneration,
  onPaymentConfirmation,
  onFinancialOperation,
  onSystemHealth,
}: BiometricAuthProps) {
  const [activeTab, setActiveTab] = useState("login");
  const [authMethod, setAuthMethod] = useState<"traditional" | "biometric">(
    "traditional",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authProgress, setAuthProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Biometric states
  const [savedBiometrics, setSavedBiometrics] = useState<BiometricData[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [selectedBiometric, setSelectedBiometric] =
    useState<BiometricData | null>(null);

  // Advanced biometric features
  const [securityLevel, setSecurityLevel] = useState<
    "low" | "medium" | "high" | "very_high"
  >("high");
  const [multiFactor, setMultiFactor] = useState(false);
  const [livenessDetection, setLivenessDetection] = useState(true);
  const [antiSpoofing, setAntiSpoofing] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30); // minutes
  const [auditLog, setAuditLog] = useState<
    Array<{
      timestamp: Date;
      action: string;
      result: string;
      interface?: string;
    }>
  >([]);

  // Master control features
  const [masterControl, setMasterControl] = useState(false);
  const [realTimeModification, setRealTimeModification] = useState(false);
  const [autoTesting, setAutoTesting] = useState(true);
  const [autoDeployment, setAutoDeployment] = useState(true);
  const [multiInterfaceAuth, setMultiInterfaceAuth] = useState(false);
  const [interfaceSync, setInterfaceSync] = useState(false);
  const [masterRequests, setMasterRequests] = useState<MasterControlRequest[]>(
    [],
  );
  const [activeInterfaces, setActiveInterfaces] = useState<string[]>([]);

  // Financial capabilities
  const [financialCapabilities, setFinancialCapabilities] = useState(false);
  const [revenueStrategies, setRevenueStrategies] = useState(false);
  const [paymentConfirmation, setPaymentConfirmation] = useState(false);
  const [riskManagement, setRiskManagement] = useState(false);
  const [revenueIdeas, setRevenueIdeas] = useState<RevenueStrategy[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentConfirmation[]>(
    [],
  );
  const [financialReports, setFinancialReports] = useState<FinancialReport[]>(
    [],
  );

  // AI and automation features
  const [aiIntelligence, setAiIntelligence] = useState(false);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState(false);
  const [automatedTrading, setAutomatedTrading] = useState(false);
  const [portfolioOptimization, setPortfolioOptimization] = useState(false);
  const [fraudDetection, setFraudDetection] = useState(false);
  const [costControl, setCostControl] = useState(false);
  const [dynamicPricing, setDynamicPricing] = useState(false);
  const [customerSegmentation, setCustomerSegmentation] = useState(false);
  const [upsellingStrategies, setUpsellingStrategies] = useState(false);
  const [resourceOptimization, setResourceOptimization] = useState(false);
  const [automatedScaling, setAutomatedScaling] = useState(false);
  const [budgetManagement, setBudgetManagement] = useState(false);
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(false);
  const [predictiveSecurity, setPredictiveSecurity] = useState(false);
  const [adaptiveAuthentication, setAdaptiveAuthentication] = useState(false);
  const [quantumResistant, setQuantumResistant] = useState(false);
  const [behavioralAnalysis, setBehavioralAnalysis] = useState(false);
  const [geolocationVerification, setGeolocationVerification] = useState(false);
  const [timeBasedTokens, setTimeBasedTokens] = useState(false);
  const [endToEndEncryption, setEndToEndEncryption] = useState(true);
  const [secureStorage, setSecureStorage] = useState(true);
  const [accessLogging, setAccessLogging] = useState(true);
  const [sessionManagement, setSessionManagement] = useState(true);

  // System health and monitoring
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Refs for biometric capture
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Master control functions
  const handleMasterControlRequest = async (request: MasterControlRequest) => {
    if (!onMasterControl) return false;

    try {
      const result = await onMasterControl(request);
      if (result) {
        setMasterRequests((prev) => [
          ...prev,
          { ...request, status: "approved" },
        ]);
        setSuccess("Master control request approved and implemented");
        addAuditLog("master_control", "approved", request.interface);
      } else {
        setMasterRequests((prev) => [
          ...prev,
          { ...request, status: "rejected" },
        ]);
        setError("Master control request rejected");
        addAuditLog("master_control", "rejected", request.interface);
      }
      return result;
    } catch (err) {
      setError("Master control request failed");
      addAuditLog("master_control", "failed", request.interface);
      return false;
    }
  };

  const generateRevenueIdeas = async () => {
    if (!onRevenueGeneration) return;

    try {
      const ideas = await onRevenueGeneration();
      setRevenueIdeas(ideas);
      setSuccess(`Generated ${ideas.length} revenue strategies`);
      addAuditLog("revenue_generation", "success", "system");
    } catch (err) {
      setError("Failed to generate revenue ideas");
      addAuditLog("revenue_generation", "failed", "system");
    }
  };

  const confirmPayment = async (payment: PaymentConfirmation) => {
    if (!onPaymentConfirmation) return false;

    try {
      const result = await onPaymentConfirmation(payment);
      if (result) {
        setPaymentHistory((prev) => [
          ...prev,
          { ...payment, status: "confirmed" },
        ]);
        setSuccess("Payment confirmed successfully");
        addAuditLog("payment_confirmation", "confirmed", payment.provider);
      } else {
        setPaymentHistory((prev) => [
          ...prev,
          { ...payment, status: "failed" },
        ]);
        setError("Payment confirmation failed");
        addAuditLog("payment_confirmation", "failed", payment.provider);
      }
      return result;
    } catch (err) {
      setError("Payment confirmation error");
      addAuditLog("payment_confirmation", "error", payment.provider);
      return false;
    }
  };

  const performFinancialOperation = async (operation: any) => {
    if (!onFinancialOperation) return null;

    try {
      const result = await onFinancialOperation(operation);
      setSuccess("Financial operation completed");
      addAuditLog("financial_operation", "success", "system");
      return result;
    } catch (err) {
      setError("Financial operation failed");
      addAuditLog("financial_operation", "failed", "system");
      return null;
    }
  };

  const monitorSystemHealth = async () => {
    if (!onSystemHealth) return;

    setIsMonitoring(true);
    try {
      const health = await onSystemHealth();
      setSystemHealth(health);
      setActiveInterfaces(health.interfaces.active);
      addAuditLog("system_health", "monitored", "system");
    } catch (err) {
      setError("System health monitoring failed");
      addAuditLog("system_health", "failed", "system");
    } finally {
      setIsMonitoring(false);
    }
  };

  const addAuditLog = (action: string, result: string, interface?: string) => {
    const logEntry = {
      timestamp: new Date(),
      action,
      result,
      interface,
    };
    setAuditLog((prev) => [...prev, logEntry]);
  };

  const syncAcrossInterfaces = async () => {
    setInterfaceSync(true);
    try {
      // Simulate interface synchronization
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccess("All interfaces synchronized");
      addAuditLog("interface_sync", "success", "all");
    } catch (err) {
      setError("Interface synchronization failed");
      addAuditLog("interface_sync", "failed", "all");
    } finally {
      setInterfaceSync(false);
    }
  };

  const implementRevenueStrategy = async (strategy: RevenueStrategy) => {
    try {
      const updatedStrategy = { ...strategy, status: "implementing" as const };
      setRevenueIdeas((prev) =>
        prev.map((s) => (s.id === strategy.id ? updatedStrategy : s)),
      );

      // Simulate implementation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const completedStrategy = {
        ...updatedStrategy,
        status: "active" as const,
      };
      setRevenueIdeas((prev) =>
        prev.map((s) => (s.id === strategy.id ? completedStrategy : s)),
      );

      setSuccess(
        `Revenue strategy "${strategy.description}" implemented successfully`,
      );
      addAuditLog("revenue_implementation", "success", strategy.type);
    } catch (err) {
      setError("Revenue strategy implementation failed");
      addAuditLog("revenue_implementation", "failed", strategy.type);
    }
  };

  // Traditional login
  const handleTraditionalLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsAuthenticating(true);
    setAuthProgress(0);
    setError("");

    try {
      // Simulate login process
      for (let i = 0; i <= 100; i += 10) {
        setAuthProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Mock successful login
      const userData = {
        id: "user-123",
        email,
        name: "QMOI User",
        biometrics: savedBiometrics,
      };

      setSuccess("Login successful!");
      onAuthSuccess(userData);
    } catch (err) {
      setError("Login failed. Please try again.");
      onAuthFailure("Authentication failed");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Biometric authentication
  const handleBiometricAuth = async (biometric: BiometricData) => {
    setIsAuthenticating(true);
    setAuthProgress(0);
    setError("");

    try {
      // Simulate biometric verification
      for (let i = 0; i <= 100; i += 20) {
        setAuthProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Update last used timestamp
      const updatedBiometric = { ...biometric, lastUsed: new Date() };
      setSavedBiometrics((prev) =>
        prev.map((b) => (b.id === biometric.id ? updatedBiometric : b)),
      );

      const userData = {
        id: "user-123",
        email: "biometric@qmoi.ai",
        name: "QMOI User",
        biometrics: savedBiometrics,
      };

      setSuccess("Biometric authentication successful!");
      onAuthSuccess(userData);
    } catch (err) {
      setError("Biometric authentication failed. Please try again.");
      onAuthFailure("Biometric authentication failed");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Capture biometric data
  const startBiometricCapture = async (type: BiometricData["type"]) => {
    setIsCapturing(true);
    setCaptureProgress(0);
    setError("");

    try {
      switch (type) {
        case "fingerprint":
          await captureFingerprint();
          break;
        case "voice":
          await captureVoice();
          break;
        case "face":
          await captureFace();
          break;
        case "iris":
          await captureIris();
          break;
        case "gait":
          await captureGait();
          break;
        case "keystroke":
          await captureKeystroke();
          break;
      }
    } catch (err) {
      setError(`Failed to capture ${type}. Please try again.`);
    } finally {
      setIsCapturing(false);
    }
  };

  const captureFingerprint = async () => {
    // Simulate fingerprint capture
    for (let i = 0; i <= 100; i += 10) {
      setCaptureProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const biometricData: BiometricData = {
      id: `fingerprint-${Date.now()}`,
      type: "fingerprint",
      name: "Primary Fingerprint",
      data: "fingerprint-data-encrypted",
      createdAt: new Date(),
      lastUsed: new Date(),
      isActive: true,
    };

    setSavedBiometrics((prev) => [...prev, biometricData]);
    onBiometricSaved(biometricData);
    setSuccess("Fingerprint captured successfully!");
  };

  const captureVoice = async () => {
    // Simulate voice capture
    for (let i = 0; i <= 100; i += 10) {
      setCaptureProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const biometricData: BiometricData = {
      id: `voice-${Date.now()}`,
      type: "voice",
      name: "Voice Recognition",
      data: "voice-data-encrypted",
      createdAt: new Date(),
      lastUsed: new Date(),
      isActive: true,
    };

    setSavedBiometrics((prev) => [...prev, biometricData]);
    onBiometricSaved(biometricData);
    setSuccess("Voice pattern captured successfully!");
  };

  const captureFace = async () => {
    // Simulate face capture
    for (let i = 0; i <= 100; i += 10) {
      setCaptureProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    const biometricData: BiometricData = {
      id: `face-${Date.now()}`,
      type: "face",
      name: "Face Recognition",
      data: "face-data-encrypted",
      createdAt: new Date(),
      lastUsed: new Date(),
      isActive: true,
    };

    setSavedBiometrics((prev) => [...prev, biometricData]);
    onBiometricSaved(biometricData);
    setSuccess("Face pattern captured successfully!");
  };

  const captureIris = async () => {
    // Simulate iris capture
    for (let i = 0; i <= 100; i += 10) {
      setCaptureProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const biometricData: BiometricData = {
      id: `iris-${Date.now()}`,
      type: "iris",
      name: "Iris Recognition",
      data: "iris-data-encrypted",
      createdAt: new Date(),
      lastUsed: new Date(),
      isActive: true,
    };

    setSavedBiometrics((prev) => [...prev, biometricData]);
    onBiometricSaved(biometricData);
    setSuccess("Iris pattern captured successfully!");
  };

  const captureGait = async () => {
    // Simulate gait capture
    for (let i = 0; i <= 100; i += 10) {
      setCaptureProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    const biometricData: BiometricData = {
      id: `gait-${Date.now()}`,
      type: "gait",
      name: "Gait Recognition",
      data: "gait-data-encrypted",
      createdAt: new Date(),
      lastUsed: new Date(),
      isActive: true,
    };

    setSavedBiometrics((prev) => [...prev, biometricData]);
    onBiometricSaved(biometricData);
    setSuccess("Gait pattern captured successfully!");
  };

  const captureKeystroke = async () => {
    // Simulate keystroke capture
    for (let i = 0; i <= 100; i += 10) {
      setCaptureProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    const biometricData: BiometricData = {
      id: `keystroke-${Date.now()}`,
      type: "keystroke",
      name: "Keystroke Dynamics",
      data: "keystroke-data-encrypted",
      createdAt: new Date(),
      lastUsed: new Date(),
      isActive: true,
    };

    setSavedBiometrics((prev) => [...prev, biometricData]);
    onBiometricSaved(biometricData);
    setSuccess("Keystroke pattern captured successfully!");
  };

  const deleteBiometric = (id: string) => {
    setSavedBiometrics((prev) => prev.filter((b) => b.id !== id));
    setSuccess("Biometric data deleted successfully!");
  };

  const toggleBiometric = (id: string) => {
    setSavedBiometrics((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b)),
    );
  };

  const getBiometricIcon = (type: BiometricData["type"]) => {
    switch (type) {
      case "fingerprint":
        return <Fingerprint className="w-4 h-4" />;
      case "voice":
        return <Mic className="w-4 h-4" />;
      case "face":
        return <Camera className="w-4 h-4" />;
      case "iris":
        return <Eye className="w-4 h-4" />;
      case "gait":
        return <User className="w-4 h-4" />;
      case "keystroke":
        return <Lock className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getBiometricName = (type: BiometricData["type"]) => {
    switch (type) {
      case "fingerprint":
        return "Fingerprint";
      case "voice":
        return "Voice Recognition";
      case "face":
        return "Face Recognition";
      case "iris":
        return "Iris Recognition";
      case "gait":
        return "Gait Recognition";
      case "keystroke":
        return "Keystroke Dynamics";
      default:
        return "Biometric";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            QMOI Biometric Authentication
          </CardTitle>
          <CardDescription>
            Secure login with biometric authentication or traditional
            credentials
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="setup">Setup Biometrics</TabsTrigger>
              <TabsTrigger value="master">Master Control</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="monitoring">System</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="flex gap-4 mb-4">
                <Button
                  variant={authMethod === "traditional" ? "default" : "outline"}
                  onClick={() => setAuthMethod("traditional")}
                  className="flex-1"
                >
                  <User className="w-4 h-4 mr-2" />
                  Email & Password
                </Button>
                <Button
                  variant={authMethod === "biometric" ? "default" : "outline"}
                  onClick={() => setAuthMethod("biometric")}
                  className="flex-1"
                >
                  <Fingerprint className="w-4 h-4 mr-2" />
                  Biometric
                </Button>
              </div>

              {authMethod === "traditional" ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>
                  <Button
                    onClick={handleTraditionalLogin}
                    disabled={isAuthenticating}
                    className="w-full"
                  >
                    {isAuthenticating ? "Authenticating..." : "Login"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedBiometrics.length > 0 ? (
                    <div className="space-y-2">
                      <Label>Saved Biometrics</Label>
                      {savedBiometrics
                        .filter((b) => b.isActive)
                        .map((biometric) => (
                          <div
                            key={biometric.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleBiometricAuth(biometric)}
                          >
                            <div className="flex items-center gap-3">
                              {getBiometricIcon(biometric.type)}
                              <div>
                                <div className="font-medium">
                                  {biometric.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {getBiometricName(biometric.type)}
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary">
                              {biometric.lastUsed.toLocaleDateString()}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Fingerprint className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No biometric data saved</p>
                      <p className="text-sm text-gray-400">
                        Set up biometric authentication in the Setup tab
                      </p>
                    </div>
                  )}
                </div>
              )}

              {isAuthenticating && (
                <div className="space-y-2">
                  <Progress value={authProgress} className="w-full" />
                  <p className="text-sm text-gray-500">Authenticating...</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="setup" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    type: "fingerprint" as const,
                    icon: Fingerprint,
                    name: "Fingerprint",
                  },
                  {
                    type: "voice" as const,
                    icon: Mic,
                    name: "Voice Recognition",
                  },
                  {
                    type: "face" as const,
                    icon: Camera,
                    name: "Face Recognition",
                  },
                  {
                    type: "iris" as const,
                    icon: Eye,
                    name: "Iris Recognition",
                  },
                  {
                    type: "gait" as const,
                    icon: User,
                    name: "Gait Recognition",
                  },
                  {
                    type: "keystroke" as const,
                    icon: Lock,
                    name: "Keystroke Dynamics",
                  },
                ].map(({ type, icon: Icon, name }) => (
                  <Card
                    key={type}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="w-6 h-6" />
                        <div>
                          <div className="font-medium">{name}</div>
                          <div className="text-sm text-gray-500">
                            {savedBiometrics.find((b) => b.type === type)
                              ? "Configured"
                              : "Not configured"}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => startBiometricCapture(type)}
                        disabled={isCapturing}
                        className="w-full"
                        variant={
                          savedBiometrics.find((b) => b.type === type)
                            ? "outline"
                            : "default"
                        }
                      >
                        {isCapturing ? (
                          <>
                            <Scan className="w-4 h-4 mr-2 animate-spin" />
                            Capturing...
                          </>
                        ) : savedBiometrics.find((b) => b.type === type) ? (
                          <>
                            <Settings className="w-4 h-4 mr-2" />
                            Reconfigure
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Setup
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {isCapturing && (
                <div className="space-y-2">
                  <Progress value={captureProgress} className="w-full" />
                  <p className="text-sm text-gray-500">
                    Capturing biometric data...
                  </p>
                </div>
              )}

              {savedBiometrics.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Saved Biometrics</h3>
                  <div className="space-y-2">
                    {savedBiometrics.map((biometric) => (
                      <div
                        key={biometric.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getBiometricIcon(biometric.type)}
                          <div>
                            <div className="font-medium">{biometric.name}</div>
                            <div className="text-sm text-gray-500">
                              Created:{" "}
                              {biometric.createdAt.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={biometric.isActive ? "default" : "outline"}
                            onClick={() => toggleBiometric(biometric.id)}
                          >
                            {biometric.isActive ? "Active" : "Inactive"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteBiometric(biometric.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
