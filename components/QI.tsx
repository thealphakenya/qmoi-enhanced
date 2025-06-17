import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import * as Recharts from "recharts";
import { Chatbot } from "@/components/Chatbot";
import { QIStateWindow } from "./QIStateWindow";
import { DeviceMap } from "./DeviceMap";
import { useColabJob } from "../hooks/useColabJob";
import { useExtensionManager } from "../hooks/useExtensionManager";
import { AIProvider, useAIContext } from "./AIContext";
import { useTTCVoice } from '../hooks/useTTCVoice';
import { useAIHealthCheck } from '../hooks/useAIHealthCheck';
import { useBitgetTrader } from '../hooks/useBitgetTrader';
import { useErrorAutoFix } from '../hooks/useErrorAutoFix';
import { useTradingAutomation } from '../hooks/useTradingAutomation';
import { useMediaGenerationStatus } from '../hooks/useMediaGenerationStatus';
import { useGlobalAutomation } from '../hooks/useGlobalAutomation';
import { useDatasetManager } from '../hooks/useDatasetManager';
import { useModelTrainer } from '../hooks/useModelTrainer';
import { useVSCodeProblems } from '../hooks/useVSCodeProblems';
import { useDeviceOptimizer } from '../hooks/useDeviceOptimizer';
import { useAutoEarningTasks } from '../hooks/useAutoEarningTasks';
import { useAutoFixAllProblems } from '../hooks/useAutoFixAllProblems';
import { useAIFeatureEnhancer } from '../hooks/useAIFeatureEnhancer';
import { useGithubRepoManager } from '../hooks/useGithubRepoManager';
import { useAnalyticsDashboard } from '../hooks/useAnalyticsDashboard';
import { useToast } from "@/components/ui/use-toast";
import { useDeviceHealth } from '../hooks/useDeviceHealth';
import { useLargeFileUpload } from '../hooks/useLargeFileUpload';
import { FloatingPreviewWindow } from './FloatingPreviewWindow';
import { FaWallet, FaChild, FaRobot, FaMoneyBillWave, FaKey, FaMapMarkerAlt, FaLanguage, FaChalkboardTeacher, FaVideo, FaMusic, FaFileAlt, FaDownload, FaHeart, FaBrain, FaCog, FaBell, FaShieldAlt, FaLock, FaUnlock, FaTools, FaCode, FaTerminal, FaServer, FaNetworkWired, FaDatabase, FaMemory, FaMicrochip, FaBatteryFull, FaTemperatureHigh, FaChartLine, FaExchangeAlt, FaCoins, FaHistory, FaChartBar, FaChartPie, FaChartArea } from 'react-icons/fa';
import { AIHealth, MediaStatus, AutomationStatus, BadgeVariant } from '../types';

// Types
interface ChatMessage {
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp?: number;
}

interface AITask {
  id: string;
  user?: string;
  type: string;
  desc?: string;
  file?: string;
  status: 'pending' | 'completed' | 'error';
  timestamp: string;
  duration?: number;
  project?: string;
  files?: string[];
}

interface Trade {
  id: string;
  pair: string;
  amount: number;
  profit: number;
  status: string;
}

interface TradingStats {
  analytics: {
    totalTrades: number;
    successRate: number;
    totalProfit: number;
    totalLoss: number;
    netProfit: number;
    winCount?: number;
    lossCount?: number;
    confidence?: number;
    pairs?: string[];
  };
  trades: Trade[];
}

interface AutomationTask {
  id: string;
  name: string;
  type: 'scheduled' | 'triggered' | 'continuous';
  status: 'active' | 'paused' | 'completed' | 'failed';
  schedule?: {
    interval: number; // in seconds
    lastRun: string;
    nextRun: string;
  };
  stats: {
    totalRuns: number;
    successRate: number;
    lastError?: string;
  };
}

interface AutomationState {
  isEnabled: boolean;
  tasks: AutomationTask[];
  settings: {
    maxConcurrentTasks: number;
    autoRetry: boolean;
    retryLimit: number;
    notificationLevel: 'all' | 'errors' | 'none';
  };
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

interface RecognitionRef {
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: { results: { transcript: string }[][] }) => void;
  onerror: (event: { error: string }) => void;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface EmotionalState {
  bond: number; // 0-100
  mood: 'happy' | 'neutral' | 'sad';
  lastInteraction: string;
  preferences: string[];
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: 'time' | 'event' | 'condition';
  condition?: string;
  action: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
}

interface OptimizationTask {
  id: string;
  type: 'performance' | 'security' | 'storage' | 'network';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  description: string;
  result?: string;
  error?: string;
}

interface DeviceEnhancement {
  id: string;
  type: 'feature' | 'optimization' | 'security' | 'automation';
  name: string;
  description: string;
  status: 'suggested' | 'implemented' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  impact: string;
}

interface SystemDiagnostic {
  category: 'performance' | 'security' | 'storage' | 'network';
  issues: {
    id: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    fix?: string;
  }[];
}

interface TradingStrategy {
  id: string;
  name: string;
  type: 'momentum' | 'mean-reversion' | 'ml-based' | 'hybrid';
  status: 'active' | 'paused' | 'testing';
  performance: {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    totalTrades: number;
    netProfit: number;
  };
  settings: {
    riskLevel: 'low' | 'medium' | 'high';
    maxDrawdown: number;
    positionSize: number;
    stopLoss: number;
    takeProfit: number;
  };
}

interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'transfer';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  details?: string;
}

interface AnalyticsData {
  trading: {
    dailyProfit: number[];
    winRate: number[];
    tradeCount: number[];
    riskMetrics: {
      sharpeRatio: number;
      sortinoRatio: number;
      maxDrawdown: number;
    };
  };
  system: {
    performance: {
      cpu: number[];
      memory: number[];
      network: number[];
    };
    errors: {
      count: number;
      types: Record<string, number>;
    };
  };
  user: {
    activity: {
      sessions: number;
      duration: number;
      features: Record<string, number>;
    };
  };
}

// Error Boundary Component
class QIErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('QI Error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 rounded-lg">
          <h2 className="text-red-600 font-semibold">Something went wrong</h2>
          <p className="text-red-500">{this.state.error?.message}</p>
          <Button 
            variant="outline" 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2"
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Constants
const ENCRYPTED_GOALS_KEY = 'alphaq-secure-goals';
const MASTER_EMAILS = ['victor@kwemoi@gmail.com', 'thealphakenya@gmail.com', 'leah@chebet.com'];
const REFRESH_INTERVAL = 30000; // 30 seconds

// Utility functions
function isMaster(): boolean {
  try {
    return typeof window !== 'undefined' && localStorage.getItem('userRole') === 'master';
  } catch (error) {
    console.error('Failed to check master status:', error);
    return false;
  }
}

function isMasterOrSister(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const email = localStorage.getItem('userEmail') || '';
    return MASTER_EMAILS.includes(email);
  } catch (error) {
    console.error('Failed to check master/sister status:', error);
    return false;
  }
}

function encrypt(data: unknown): string {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  } catch (error) {
    console.error('Failed to encrypt data:', error);
    return '';
  }
}

function decrypt(data: string): unknown {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(data))));
  } catch (error) {
    console.error('Failed to decrypt data:', error);
    return [];
  }
}

function confidenceColor(conf: number): string {
  if (conf < 0.4) return 'bg-red-500';
  if (conf < 0.7) return 'bg-yellow-400';
  if (conf < 0.9) return 'bg-lime-400';
  return 'bg-green-500';
}

// Main component
function QIComponent() {
  const { toast } = useToast();
  const {
    chatHistory, setChatHistory,
    aiHealth, deviceHealth,
    optimizeDevice, scanForErrors, selfHeal,
    persistentMemory, setPersistentMemory
  } = useAIContext();

  const { speak } = useTTCVoice();
  const [talkMode, setTalkMode] = useState<boolean>(false);
  const recognitionRef = useRef<RecognitionRef | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [aiTasks, setAiTasks] = useState<AITask[]>([]);
  const [tradingStats, setTradingStats] = useState<TradingStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAllStats, setShowAllStats] = useState<boolean>(false);
  const [showQIChat, setShowQIChat] = useState<boolean>(false);
  const [pendingEnhancements, setPendingEnhancements] = useState<string[]>([]);
  const [masterLogs, setMasterLogs] = useState<{ time: string; action: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // New state variables for enhanced features
  const [showPreviewWindow, setShowPreviewWindow] = useState<boolean>(false);
  const [previewContent, setPreviewContent] = useState<{ type: string; url: string } | null>(null);
  const [showDeviceSettings, setShowDeviceSettings] = useState<boolean>(false);
  const [showWalletPanel, setShowWalletPanel] = useState<boolean>(false);
  const [showDownloadManager, setShowDownloadManager] = useState<boolean>(false);
  const [showBluetoothDevices, setShowBluetoothDevices] = useState<boolean>(false);
  const [showNetworkSettings, setShowNetworkSettings] = useState<boolean>(false);
  const [showLifeGoals, setShowLifeGoals] = useState<boolean>(false);
  const [showInventionProjects, setShowInventionProjects] = useState<boolean>(false);

  const { status: mediaStatus } = useMediaGenerationStatus();
  const { status: automationStatusRaw } = useGlobalAutomation();
  const automationStatus: AutomationState | null = automationStatusRaw as AutomationState | null;
  const { result: colabJob } = useColabJob();
  const deviceHealthData = useDeviceHealth();
  const { progress: uploadProgress, status: uploadStatus, error: uploadError, uploadFile } = useLargeFileUpload();

  // Chart data for analytics
  const [chartData, setChartData] = useState<ChartData | null>(null);
  useEffect(() => {
    if (tradingStats?.trades) {
      setChartData({
        labels: tradingStats.trades.map(t => t.id),
        datasets: [
          {
            label: 'Profit',
            data: tradingStats.trades.map(t => t.profit),
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.2)',
          },
        ],
      });
    }
  }, [tradingStats]);

  // Export analytics as CSV
  const exportAnalytics = useCallback(() => {
    if (!tradingStats?.trades) {
      toast({
        title: 'Error',
        description: 'No trading data available to export',
        variant: 'destructive'
      });
      return;
    }
    try {
      const header = 'ID,Pair,Amount,Profit,Status\n';
      const rows = tradingStats.trades.map(t => `${t.id},${t.pair},${t.amount},${t.profit},${t.status}`).join('\n');
      const csv = header + rows;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trading-analytics-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to export analytics',
        variant: 'destructive'
      });
    }
  }, [tradingStats, toast]);

  // Fetch AI tasks and trading stats
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    async function fetchData() {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);
      try {
        const adminToken = localStorage.getItem("adminToken") || "";
        
        const [tradingRes, aiRes] = await Promise.all([
          fetch("/api/qi-trading?action=stats", {
            headers: { "x-admin-token": adminToken },
            signal: abortControllerRef.current.signal
          }),
          fetch("/api/qmoi-model?allStats=1", {
            headers: { "x-admin-token": adminToken },
            signal: abortControllerRef.current.signal
          })
        ]);

        if (!tradingRes.ok) throw new Error('Failed to fetch trading stats');
        if (!aiRes.ok) throw new Error('Failed to fetch AI tasks');

        const [tradingData, aiData] = await Promise.all([
          tradingRes.json(),
          aiRes.json()
        ]);

        if (isMounted) {
        setTradingStats(tradingData);
        setAiTasks(aiData.tasks || []);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Failed to fetch data:', error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'Failed to fetch data');
        toast({
          title: 'Error',
          description: 'Failed to fetch data',
          variant: 'destructive'
        });
        setTradingStats(null);
        setAiTasks([]);
        }
      } finally {
        if (isMounted) {
        setLoading(false);
        }
      }
    }

    fetchData();
    timeoutId = setInterval(fetchData, REFRESH_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [toast]);

  // Handle file uploads
  const handleChatFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const adminToken = localStorage.getItem("adminToken") || "";
      
      const response = await fetch("/api/qmoi-model?upload=1", {
        method: "POST",
        headers: { "x-admin-token": adminToken },
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to upload file');
      
      const newMessage: ChatMessage = { 
        type: "system", 
        content: `File '${file.name}' uploaded for analysis.`,
        timestamp: Date.now()
      };
      setChatHistory([...chatHistory, newMessage]);
    } catch (error) {
      console.error('Failed to upload file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive'
      });
    }
  };

  // Handle enhancement requests
  const handleEnhancement = async (desc: string) => {
    try {
      const adminToken = localStorage.getItem("adminToken") || "";
      
      const newMessage: ChatMessage = { 
        type: "system", 
        content: `Enhancement triggered: ${desc}`,
        timestamp: Date.now()
      };
      setChatHistory([...chatHistory, newMessage]);

      const response = await fetch("/api/qmoi-model?enhance=1", {
        method: "POST",
        headers: { "x-admin-token": adminToken },
        body: JSON.stringify({ desc }),
      });

      if (!response.ok) throw new Error('Failed to trigger enhancement');
    } catch (error) {
      console.error('Failed to trigger enhancement:', error);
      toast({
        title: 'Error',
        description: 'Failed to trigger enhancement',
        variant: 'destructive'
      });
    }
  };

  // Export tasks
  const exportTasks = useCallback((type: 'csv'|'json') => {
    if (!aiTasks.length) {
      toast({
        title: 'Error',
        description: 'No tasks available to export',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      if (type === 'csv') {
        const header = 'ID,User,Type,Description/File,Status,Timestamp,Duration\n';
        const rows = aiTasks.map(t => `${t.id},${t.user||'admin'},${t.type},${t.desc||t.file||'-'},${t.status},${t.timestamp},${t.duration||'-'}`).join('\n');
        const csv = header + rows;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-tasks-${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([JSON.stringify(aiTasks, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-tasks-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to export tasks',
        variant: 'destructive'
      });
    }
  }, [aiTasks, toast]);

  // Clear logs
  const clearLogs = useCallback(() => {
    setMasterLogs([]);
    toast({
      title: 'Success',
      description: 'Logs cleared successfully',
    });
  }, [toast]);

  // Download all data
  const downloadAllData = useCallback(() => {
    try {
      const data = {
        aiTasks,
        tradingStats,
        chatHistory,
        masterLogs,
        timestamp: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qi-data-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download data:', error);
      toast({
        title: 'Error',
        description: 'Failed to download data',
        variant: 'destructive'
      });
    }
  }, [aiTasks, tradingStats, chatHistory, masterLogs, toast]);

  // Log master actions
  const logMasterAction = useCallback((action: string) => {
    setMasterLogs(prev => [...prev, { time: new Date().toLocaleString(), action }]);
  }, []);

  // Fix Badge variant types
  const getBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'completed':
        return 'secondary';
      case 'pending':
      case 'generating':
        return 'outline';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Fix file types counting
  const getFileTypes = (tasks: AITask[]): Record<string, number> => {
    const types: Record<string, number> = {};
    tasks
      .filter(t => t.type === 'file-upload')
      .forEach(t => {
        const ext = t.file?.split('.').pop() || 'unknown';
        types[ext] = (types[ext] || 0) + 1;
      });
    return types;
  };

  // Fix duration calculations
  const calculateAvgDuration = (durations: (number | undefined)[]): string => {
    const validDurations = durations.filter((d): d is number => d !== undefined);
    if (validDurations.length === 0) return '-';
    const avgDuration = validDurations.reduce((a, b) => a + b, 0) / validDurations.length;
    return `${avgDuration.toFixed(1)}s`;
  };

  // New state for enhanced features
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    bond: 0,
    mood: 'neutral',
    lastInteraction: new Date().toISOString(),
    preferences: []
  });

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [showAutomationRules, setShowAutomationRules] = useState(false);
  const [showEmotionalState, setShowEmotionalState] = useState(false);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // Emotional bonding effect
  useEffect(() => {
    const interval = setInterval(() => {
      setEmotionalState(prev => ({
        ...prev,
        bond: Math.min(100, prev.bond + 0.1),
        lastInteraction: new Date().toISOString()
      }));
    }, 60000); // Increase bond every minute

    return () => clearInterval(interval);
  }, []);

  // Handle automation rule changes
  const handleAutomationRuleChange = useCallback((rule: AutomationRule) => {
    setAutomationRules(prev => prev.map(r => r.id === rule.id ? rule : r));
    toast({
      title: 'Automation Updated',
      description: `Rule "${rule.name}" has been ${rule.enabled ? 'enabled' : 'disabled'}`,
    });
  }, [toast]);

  // Handle emotional state updates
  const handleEmotionalUpdate = useCallback((update: Partial<EmotionalState>) => {
    setEmotionalState(prev => ({ ...prev, ...update }));
    toast({
      title: 'Emotional State Updated',
      description: 'Your preferences and emotional bond have been updated',
    });
  }, [toast]);

  // New state for autonomous optimization
  const [optimizationTasks, setOptimizationTasks] = useState<OptimizationTask[]>([]);
  const [deviceEnhancements, setDeviceEnhancements] = useState<DeviceEnhancement[]>([]);
  const [systemDiagnostics, setSystemDiagnostics] = useState<SystemDiagnostic[]>([]);
  const [showOptimizationPanel, setShowOptimizationPanel] = useState(false);
  const [showEnhancementPanel, setShowEnhancementPanel] = useState(false);
  const [showDiagnosticsPanel, setShowDiagnosticsPanel] = useState(false);

  // Handle optimization task updates
  const handleOptimizationTaskUpdate = useCallback((task: OptimizationTask) => {
    setOptimizationTasks(prev => prev.map(t => t.id === task.id ? task : t));
    toast({
      title: 'Optimization Update',
      description: `Task "${task.description}" is now ${task.status}`,
    });
  }, [toast]);

  // Handle device enhancement suggestions
  const handleEnhancementSuggestion = useCallback((enhancement: DeviceEnhancement) => {
    setDeviceEnhancements(prev => [...prev, enhancement]);
    toast({
      title: 'New Enhancement Suggested',
      description: enhancement.description,
    });
  }, [toast]);

  // Handle system diagnostics
  const handleSystemDiagnostics = useCallback((diagnostics: SystemDiagnostic[]) => {
    setSystemDiagnostics(diagnostics);
    const criticalIssues = diagnostics.flatMap(d => d.issues).filter(i => i.severity === 'high');
    if (criticalIssues.length > 0) {
      toast({
        title: 'Critical Issues Detected',
        description: `${criticalIssues.length} critical issues need attention`,
        variant: 'destructive',
      });
    }
  }, [toast]);

  // New state for trading and analytics
  const [tradingStrategies, setTradingStrategies] = useState<TradingStrategy[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [showTradingPanel, setShowTradingPanel] = useState(false);
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false);

  // Handle trading strategy updates
  const handleStrategyUpdate = useCallback((strategy: TradingStrategy) => {
    setTradingStrategies(prev => prev.map(s => s.id === strategy.id ? strategy : s));
    toast({
      title: 'Strategy Updated',
      description: `Strategy "${strategy.name}" has been updated`,
    });
  }, [toast]);

  // Handle wallet transactions
  const handleWalletTransaction = useCallback((transaction: WalletTransaction) => {
    setWalletTransactions(prev => [...prev, transaction]);
    toast({
      title: 'Transaction Processed',
      description: `${transaction.type} of ${transaction.amount} ${transaction.currency}`,
    });
  }, [toast]);

  // Update analytics data
  const updateAnalytics = useCallback((data: AnalyticsData) => {
    setAnalyticsData(data);
  }, []);

  if (!isMaster()) return null;

  return (
    <QIErrorBoundary>
    <Card>
      <QIStateWindow 
        state="admin" 
        global={{
          sessions: 5,
          memory: aiTasks.length,
            health: deviceHealth?.status || 'Unknown',
        }} 
        aiHealth={{
          status: aiHealth.status,
          lastCheck: new Date(aiHealth.lastCheck).toISOString(),
        }} 
        colabJob={{
          jobStatus: colabJob?.status,
          result: colabJob?.result,
          error: colabJob?.error,
        }} 
      />
      <CardHeader>
        <CardTitle>Q-I {talkMode && <span style={{color:'#0a0'}}>🗣️ Talk Mode</span>}</CardTitle>
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={() => setShowAllStats(v => !v)}>All AI Stats</Button>
          <Button size="sm" variant="outline" onClick={() => setShowQIChat(true)}>QI Chat (App Control)</Button>
          <Button size="sm" variant={talkMode ? 'destructive' : 'outline'} onClick={() => setTalkMode(t => !t)}>
            {talkMode ? 'Disable Talk Mode' : 'Enable Talk Mode'}
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={() => setShowPreviewWindow(true)}>
            <FaVideo className="mr-2" /> Preview Window
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowDeviceSettings(true)}>
            <FaRobot className="mr-2" /> Device Settings
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowWalletPanel(true)}>
            <FaWallet className="mr-2" /> Wallet
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowDownloadManager(true)}>
            <FaDownload className="mr-2" /> Downloads
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowBluetoothDevices(true)}>
            <FaMapMarkerAlt className="mr-2" /> Bluetooth
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowNetworkSettings(true)}>
            <FaKey className="mr-2" /> Network
          </Button>
          {isMasterOrSister() && (
            <>
              <Button size="sm" variant="outline" onClick={() => setShowLifeGoals(true)}>
                <FaChild className="mr-2" /> Life Goals
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowInventionProjects(true)}>
                <FaChalkboardTeacher className="mr-2" /> Inventions
              </Button>
            </>
          )}
          <Button size="sm" variant="outline" onClick={() => setShowEmotionalState(true)}>
            <FaHeart className="mr-2" /> Emotional State
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowAutomationRules(true)}>
            <FaCog className="mr-2" /> Automation
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowSecuritySettings(true)}>
            <FaShieldAlt className="mr-2" /> Security
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowNotificationCenter(true)}>
            <FaBell className="mr-2" /> Notifications
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowOptimizationPanel(true)}>
            <FaTools className="mr-2" /> Optimization
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowEnhancementPanel(true)}>
            <FaCode className="mr-2" /> Enhancements
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowDiagnosticsPanel(true)}>
            <FaTerminal className="mr-2" /> Diagnostics
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowTradingPanel(true)}>
            <FaChartLine className="mr-2" /> Trading
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowAnalyticsPanel(true)}>
            <FaChartBar className="mr-2" /> Analytics
          </Button>
        </div>
      </CardHeader>
      <CardContent>
          {error && (
            <div className="p-4 mb-4 bg-red-50 rounded-lg">
              <p className="text-red-600">{error}</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setError(null)}
                className="mt-2"
              >
                Dismiss
              </Button>
            </div>
          )}
          {loading && (
            <div className="flex justify-center items-center p-4">
              <Progress value={undefined} className="w-full" />
            </div>
          )}

        {/* Device Health Overview */}
        <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
          <h3 className="font-semibold mb-2">Device Health</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">CPU Usage</span>
              <span className="text-lg font-bold">{deviceHealthData.metrics.cpuUsage.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Memory Usage</span>
              <span className="text-lg font-bold">{deviceHealthData.metrics.memoryUsage.toFixed(1)}MB</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Disk Usage</span>
              <span className="text-lg font-bold">{deviceHealthData.metrics.diskUsage.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Battery</span>
              <span className="text-lg font-bold">{deviceHealthData.metrics.batteryLevel?.toFixed(1)}%</span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="outline" onClick={optimizeDevice}>Optimize Device</Button>
            <Button size="sm" variant="outline" onClick={scanForErrors}>Scan for Errors</Button>
            <Button size="sm" variant="outline" onClick={selfHeal}>Self Heal</Button>
          </div>
        </div>

        {/* File Upload Progress */}
        {uploadStatus === 'uploading' && (
          <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
            <h3 className="font-semibold mb-2">File Upload</h3>
            <Progress value={uploadProgress} className="w-full mb-2" />
            <p className="text-sm text-gray-500">Uploading... {uploadProgress}%</p>
          </div>
        )}

        {/* Device Settings Panel */}
        {showDeviceSettings && (
          <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
            <h3 className="font-semibold mb-2">Device Settings</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Wallpaper</span>
                <Button size="sm" variant="outline" onClick={() => {/* TODO: Implement wallpaper change */}}>
                  Change Wallpaper
                </Button>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Appearance</span>
                <Button size="sm" variant="outline" onClick={() => {/* TODO: Implement appearance settings */}}>
                  Customize
                </Button>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Installed Apps</span>
                <Button size="sm" variant="outline" onClick={() => {/* TODO: Implement app management */}}>
                  Manage Apps
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Panel */}
        {showWalletPanel && (
          <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
            <h3 className="font-semibold mb-2">Wallet Management</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Total Balance</span>
                  <span className="text-lg font-bold">$0.00</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">24h Change</span>
                  <span className="text-lg font-bold text-green-500">+0.00%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Active Trades</span>
                  <span className="text-lg font-bold">0</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Pending Orders</span>
                  <span className="text-lg font-bold">0</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Recent Transactions</span>
                  <Button size="sm" variant="outline" onClick={() => {/* TODO: Add funds */}}>
                    Add Funds
                  </Button>
                </div>
                <div className="space-y-2">
                  {walletTransactions.map(transaction => (
                    <div key={transaction.id} className="p-2 bg-white rounded flex justify-between items-center">
                      <div>
                        <span className="font-medium">{transaction.type}</span>
                        <p className="text-xs text-gray-500">{new Date(transaction.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {transaction.amount >= 0 ? '+' : ''}{transaction.amount} {transaction.currency}
                        </span>
                        <Badge variant={transaction.status === 'completed' ? 'default' : transaction.status === 'pending' ? 'outline' : 'destructive'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Download Manager */}
        {showDownloadManager && (
          <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
            <h3 className="font-semibold mb-2">Download Manager</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Downloads</span>
                <Button size="sm" variant="outline" onClick={() => {/* TODO: Implement pause all */}}>
                  Pause All
                </Button>
              </div>
              {uploadStatus === 'uploading' && (
                <div className="p-2 bg-white rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">File Upload</span>
                    <span className="text-xs text-gray-500">{uploadProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bluetooth Devices */}
        {showBluetoothDevices && (
          <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
            <h3 className="font-semibold mb-2">Bluetooth Devices</h3>
            <div className="space-y-2">
              <Button size="sm" variant="outline" onClick={() => {/* TODO: Implement bluetooth scan */}}>
                Scan for Devices
              </Button>
              <div className="text-sm text-gray-500">No devices found</div>
            </div>
          </div>
        )}

        {/* Network Settings */}
        {showNetworkSettings && (
          <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
            <h3 className="font-semibold mb-2">Network Settings</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">WiFi Networks</span>
                <Button size="sm" variant="outline" onClick={() => {/* TODO: Implement wifi scan */}}>
                  Scan
                </Button>
              </div>
              <div className="text-sm text-gray-500">No networks found</div>
            </div>
          </div>
        )}

        {/* Life Goals (Master/Sister Only) */}
        {showLifeGoals && isMasterOrSister() && (
          <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
            <h3 className="font-semibold mb-2">Life Goals</h3>
            <div className="space-y-2">
              <Button size="sm" variant="outline" onClick={() => {/* TODO: Implement add goal */}}>
                Add Goal
              </Button>
              <div className="text-sm text-gray-500">No goals set</div>
            </div>
          </div>
        )}

        {/* Invention Projects (Master/Sister Only) */}
        {showInventionProjects && isMasterOrSister() && (
          <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
            <h3 className="font-semibold mb-2">Invention Projects</h3>
            <div className="space-y-2">
              <Button size="sm" variant="outline" onClick={() => {/* TODO: Implement add project */}}>
                New Project
              </Button>
              <div className="text-sm text-gray-500">No projects yet</div>
            </div>
          </div>
        )}

        {/* Emotional State Panel */}
        {showEmotionalState && (
          <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
            <h3 className="font-semibold mb-2">Emotional State</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Bond Level</span>
                <div className="flex items-center gap-2">
                  <Progress value={emotionalState.bond} className="w-full" />
                  <span className="text-lg font-bold">{emotionalState.bond.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Current Mood</span>
                <Badge variant={emotionalState.mood === 'happy' ? 'default' : emotionalState.mood === 'sad' ? 'destructive' : 'outline'}>
                  {emotionalState.mood}
                </Badge>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Last Interaction</span>
                <span className="text-sm">{new Date(emotionalState.lastInteraction).toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Preferences</span>
                <div className="flex flex-wrap gap-1">
                  {emotionalState.preferences.map((pref, i) => (
                    <Badge key={i} variant="outline">{pref}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Automation Rules Panel */}
        {showAutomationRules && (
          <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
            <h3 className="font-semibold mb-2">Automation Rules</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Rules</span>
                <Button size="sm" variant="outline" onClick={() => {/* TODO: Add new rule */}}>
                  Add Rule
                </Button>
              </div>
              <div className="space-y-2">
                {automationRules.map(rule => (
                  <div key={rule.id} className="p-2 bg-white rounded flex justify-between items-center">
                    <div>
                      <span className="font-medium">{rule.name}</span>
                      <p className="text-xs text-gray-500">{rule.trigger}: {rule.condition || 'always'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={rule.enabled ? 'default' : 'outline'}
                        onClick={() => handleAutomationRuleChange({ ...rule, enabled: !rule.enabled })}
                      >
                        {rule.enabled ? <FaUnlock /> : <FaLock />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Settings Panel */}
        {showSecuritySettings && (
          <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
            <h3 className="font-semibold mb-2">Security Settings</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Master Access</span>
                <Badge variant={isMaster() ? 'default' : 'destructive'}>
                  {isMaster() ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Data Encryption</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Audit Logging</span>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Notification Center */}
        {showNotificationCenter && (
          <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
            <h3 className="font-semibold mb-2">Notification Center</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Recent Notifications</span>
                <Button size="sm" variant="outline" onClick={() => {/* TODO: Clear notifications */}}>
                  Clear All
                </Button>
              </div>
              <div className="space-y-2">
                {/* TODO: Add notification list */}
                <div className="text-sm text-gray-500">No new notifications</div>
              </div>
            </div>
          </div>
        )}

        {/* Optimization Panel */}
        {showOptimizationPanel && (
          <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
            <h3 className="font-semibold mb-2">System Optimization</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">CPU Usage</span>
                <div className="flex items-center gap-2">
                  <FaMicrochip className="text-blue-500" />
                  <span className="text-lg font-bold">{deviceHealthData.metrics.cpuUsage.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Memory Usage</span>
                <div className="flex items-center gap-2">
                  <FaMemory className="text-green-500" />
                  <span className="text-lg font-bold">{deviceHealthData.metrics.memoryUsage.toFixed(1)}MB</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Storage</span>
                <div className="flex items-center gap-2">
                  <FaDatabase className="text-purple-500" />
                  <span className="text-lg font-bold">{deviceHealthData.metrics.diskUsage.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Network</span>
                <div className="flex items-center gap-2">
                  <FaNetworkWired className="text-orange-500" />
                  <span className="text-lg font-bold">Active</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Optimization Tasks</span>
                <Button size="sm" variant="outline" onClick={() => {/* TODO: Start new optimization */}}>
                  Start Optimization
                </Button>
              </div>
              <div className="space-y-2">
                {optimizationTasks.map(task => (
                  <div key={task.id} className="p-2 bg-white rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{task.description}</span>
                      <Badge variant={task.status === 'completed' ? 'default' : task.status === 'failed' ? 'destructive' : 'outline'}>
                        {task.status}
                      </Badge>
                    </div>
                    <Progress value={task.progress} className="w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trading Panel */}
        {showTradingPanel && (
          <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
            <h3 className="font-semibold mb-2">Autonomous Trading</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Strategies</span>
                <Button size="sm" variant="outline" onClick={() => {/* TODO: Add new strategy */}}>
                  Add Strategy
                </Button>
              </div>
              <div className="space-y-2">
                {tradingStrategies.map(strategy => (
                  <div key={strategy.id} className="p-2 bg-white rounded">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-medium">{strategy.name}</span>
                        <p className="text-xs text-gray-500">Type: {strategy.type}</p>
                      </div>
                      <Badge variant={strategy.status === 'active' ? 'default' : strategy.status === 'paused' ? 'outline' : 'secondary'}>
                        {strategy.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Win Rate</span>
                        <span className="text-sm font-medium">{(strategy.performance.winRate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Profit Factor</span>
                        <span className="text-sm font-medium">{strategy.performance.profitFactor.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Sharpe Ratio</span>
                        <span className="text-sm font-medium">{strategy.performance.sharpeRatio.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Net Profit</span>
                        <span className="text-sm font-medium">${strategy.performance.netProfit.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Panel */}
        {showAnalyticsPanel && (
          <div className="p-4 bg-gray-50 rounded-lg shadow mb-4">
            <h3 className="font-semibold mb-2">Advanced Analytics</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Daily Profit</span>
                  <span className="text-lg font-bold">${analyticsData?.trading?.dailyProfit?.[(analyticsData?.trading?.dailyProfit?.length || 1) - 1]?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Win Rate</span>
                  <span className="text-lg font-bold">{(analyticsData?.trading?.winRate?.[(analyticsData?.trading?.winRate?.length || 1) - 1] * 100 || 0).toFixed(1)}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Sharpe Ratio</span>
                  <span className="text-lg font-bold">{analyticsData?.trading?.riskMetrics?.sharpeRatio?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-2 bg-white rounded">
                  <h4 className="font-medium mb-2">System Performance</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">CPU Usage</span>
                      <span className="text-sm font-medium">{analyticsData?.system.performance.cpu[analyticsData.system.performance.cpu.length - 1]?.toFixed(1) || '0'}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Memory Usage</span>
                      <span className="text-sm font-medium">{analyticsData?.system.performance.memory[analyticsData.system.performance.memory.length - 1]?.toFixed(1) || '0'}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Network Usage</span>
                      <span className="text-sm font-medium">{analyticsData?.system.performance.network[analyticsData.system.performance.network.length - 1]?.toFixed(1) || '0'}%</span>
                    </div>
                  </div>
                </div>
                <div className="p-2 bg-white rounded">
                  <h4 className="font-medium mb-2">User Activity</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Active Sessions</span>
                      <span className="text-sm font-medium">{analyticsData?.user.activity.sessions || 0}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Session Duration</span>
                      <span className="text-sm font-medium">{analyticsData?.user.activity.duration || 0} min</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Feature Usage</span>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(analyticsData?.user.activity.features || {}).map(([feature, count]) => (
                          <Badge key={feature} variant="outline">{feature}: {count}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAllStats && (
          <div className="mb-4 p-2 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">All AI Stats (All Sessions/Users/Projects)</h3>
            <div className="flex flex-wrap gap-4 mb-2">
              <div><b>Total AI Tasks:</b> {aiTasks.length}</div>
                <div><b>Enhancements:</b> {aiTasks.filter(t => t.type === 'enhancement').length}</div>
                <div><b>File Uploads:</b> {aiTasks.filter(t => t.type === 'file-upload').length}</div>
              <div><b>Last Task:</b> {aiTasks.length > 0 ? new Date(aiTasks[aiTasks.length-1].timestamp).toLocaleString() : 'N/A'}</div>
                <div><b>Unique Users:</b> {new Set(aiTasks.map(t => t.user || 'admin')).size}</div>
                <div><b>Enhancement Success Rate:</b> {(() => { const e = aiTasks.filter(t => t.type === 'enhancement'); return e.length ? (e.filter(t => t.status === 'completed').length / e.length * 100).toFixed(1) + '%' : 'N/A'; })()}</div>
              <div><b>File Types:</b> {(() => { const types = getFileTypes(aiTasks); return Object.entries(types).map(([k,v])=>`${k}: ${v}`).join(', ') || 'N/A'; })()}</div>
                <div><b>Avg Task Duration:</b> {calculateAvgDuration(aiTasks.map(t => t.duration))}</div>
            </div>
            <div className="flex gap-2 mb-2">
              <Button size="sm" variant="outline" onClick={() => exportTasks('csv')}>Export CSV</Button>
              <Button size="sm" variant="outline" onClick={() => exportTasks('json')}>Export JSON</Button>
              <Button size="sm" variant="destructive" onClick={clearLogs}>Clear Logs</Button>
              <Button size="sm" variant="outline" onClick={() => handleEnhancement('Manual admin enhancement')}>Trigger Enhancement</Button>
              <Button size="sm" variant="outline" onClick={downloadAllData}>Download All Data</Button>
            </div>
            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Description/File</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                    {aiTasks.map((t, i) => (
                    <tr key={i}>
                      <td>{t.id || i}</td>
                      <td>{t.user || 'admin'}</td>
                      <td>{t.type}</td>
                      <td>{t.desc || t.file || '-'}</td>
                      <td>
                        <Badge variant={getBadgeVariant(t.status)}>
                          {t.status}
                        </Badge>
                      </td>
                      <td>{new Date(t.timestamp).toLocaleString()}</td>
                      <td>{t.duration ? `${t.duration}s` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="font-semibold mb-2">AI Tasks Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Total Tasks</span>
                <span className="text-lg font-bold">{aiTasks.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Pending Tasks</span>
                  <span className="text-lg font-bold">{aiTasks.filter(t => t.status === 'pending').length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Completed Tasks</span>
                  <span className="text-lg font-bold">{aiTasks.filter(t => t.status === 'completed').length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Failed Tasks</span>
                  <span className="text-lg font-bold">{aiTasks.filter(t => t.status === 'error').length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Avg Duration</span>
                <span className="text-lg font-bold">
                    {calculateAvgDuration(aiTasks.map(t => t.duration))}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Last Task</span>
                <span className="text-lg font-bold">
                  {aiTasks.length > 0 ? new Date(aiTasks[aiTasks.length - 1].timestamp).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Trading Stats Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Total Trades</span>
                <span className="text-lg font-bold">{tradingStats?.trades.length || 0}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Winning Trades</span>
                <span className="text-lg font-bold">{tradingStats?.analytics.winCount || 0}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Losing Trades</span>
                <span className="text-lg font-bold">{tradingStats?.analytics.lossCount || 0}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Total Profit</span>
                <span className="text-lg font-bold text-green-600">
                  {tradingStats?.analytics.totalProfit !== undefined ? `${tradingStats.analytics.totalProfit.toFixed(2)} USDT` : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Total Loss</span>
                <span className="text-lg font-bold text-red-600">
                  {tradingStats?.analytics.totalLoss !== undefined ? `${Math.abs(tradingStats.analytics.totalLoss).toFixed(2)} USDT` : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Net Profit</span>
                <span className="text-lg font-bold">
                  {tradingStats?.analytics.netProfit !== undefined ? `${tradingStats.analytics.netProfit.toFixed(2)} USDT` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Media Generation Status</h3>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Last Generated Media</span>
              <span className="text-lg font-bold">
                {mediaStatus?.lastGenerated ? new Date(mediaStatus.lastGenerated).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-xs text-gray-500">Next Scheduled Media</span>
              <span className="text-lg font-bold">
                {mediaStatus?.nextScheduled ? new Date(mediaStatus.nextScheduled).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Status</span>
              <Badge variant={getBadgeVariant(mediaStatus?.status || 'idle')}>
                {mediaStatus?.status === 'generating'
                  ? 'Media is being generated'
                  : mediaStatus?.status === 'completed'
                    ? 'Media generation completed'
                    : 'N/A'}
              </Badge>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Global Automation Status</h3>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Status</span>
                <Badge variant={getBadgeVariant(automationStatus?.isEnabled ? 'active' : 'paused')}>
                {automationStatus?.isEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-xs text-gray-500">Last Run</span>
              <span className="text-lg font-bold">
                  {automationStatus?.tasks && automationStatus.tasks.length > 0 
                    ? new Date(automationStatus.tasks[automationStatus.tasks.length - 1].schedule?.lastRun || '').toLocaleString() 
                    : 'N/A'}
              </span>
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-xs text-gray-500">Next Run</span>
              <span className="text-lg font-bold">
                  {automationStatus?.tasks && automationStatus.tasks.length > 0 
                    ? new Date(automationStatus.tasks[automationStatus.tasks.length - 1].schedule?.nextRun || '').toLocaleString() 
                    : 'N/A'}
              </span>
            </div>
          </div>
        </div>
        {showQIChat && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="font-semibold mb-2">QI Chat (App Control)</h3>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setChatHistory([])}>Clear Chat</Button>
                <Button size="sm" variant="outline" onClick={() => setPersistentMemory([])}>Clear Memory</Button>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Talk Mode</span>
                <div className="flex gap-2">
                  <Button size="sm" variant={talkMode ? 'destructive' : 'outline'} onClick={() => setTalkMode(t => !t)}>
                    {talkMode ? 'Disable Talk Mode' : 'Enable Talk Mode'}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Pending Enhancements</span>
                <div className="flex flex-col gap-1">
                  {pendingEnhancements.length === 0 && <span className="text-gray-400 text-sm">No pending enhancements</span>}
                  {pendingEnhancements.map((e, i) => (
                    <div key={i} className="p-2 bg-gray-100 rounded">
                      {e}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Chat History</span>
                <div className="flex flex-col gap-1">
                  {chatHistory.length === 0 && <span className="text-gray-400 text-sm">No chat history</span>}
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`p-2 rounded ${msg.type === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      {msg.type === 'user' ? 'You: ' : 'AI: '}
                      {msg.content}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowQIChat(false)}>Close QI Chat</Button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Window */}
        {showPreviewWindow && (
          <FloatingPreviewWindow
            onClose={() => setShowPreviewWindow(false)}
            content={previewContent}
            onContentChange={setPreviewContent}
          />
        )}
      </CardContent>
    </Card>
    </QIErrorBoundary>
  );
}

export default QIComponent;