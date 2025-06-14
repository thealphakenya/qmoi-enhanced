import React, { useEffect, useState, useRef } from "react";
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
import { useRef } from 'react';
import { FaWallet, FaChild, FaRobot, FaMoneyBillWave, FaKey, FaMapMarkerAlt, FaLanguage, FaChalkboardTeacher } from 'react-icons/fa';

// Dummy master check (replace with real auth logic)
function isMaster() {
  // TODO: Replace with real master check
  return typeof window !== 'undefined' && localStorage.getItem('userRole') === 'master';
}

// Color for confidence threshold
function confidenceColor(conf: number) {
  if (conf < 0.4) return 'bg-red-500';
  if (conf < 0.7) return 'bg-yellow-400';
  if (conf < 0.9) return 'bg-lime-400';
  return 'bg-green-500';
}

// --- Secure, encrypted storage for master/sister goals (stub, replace with real encryption) ---
const ENCRYPTED_GOALS_KEY = 'alphaq-secure-goals';
const MASTER_EMAILS = ['victor@kwemoi@gmail.com', 'thealphakenya@gmail.com', 'leah@chebet.com'];
function isMasterOrSister() {
  if (typeof window === 'undefined') return false;
  const email = localStorage.getItem('userEmail') || '';
  return MASTER_EMAILS.includes(email);
}
function encrypt(data: any) { return btoa(unescape(encodeURIComponent(JSON.stringify(data)))); }
function decrypt(data: string) { try { return JSON.parse(decodeURIComponent(escape(atob(data)))); } catch { return []; } }

function QIComponent() {
  // Use shared AI context
  const {
    chatHistory, setChatHistory,
    aiHealth, deviceHealth,
    optimizeDevice, scanForErrors, selfHeal,
    persistentMemory, setPersistentMemory
  } = useAIContext();

  const { speak } = useTTCVoice();
  const [talkMode, setTalkMode] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [aiTasks, setAiTasks] = useState<any[]>([]);
  const [tradingStats, setTradingStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAllStats, setShowAllStats] = useState(false);
  const [showQIChat, setShowQIChat] = useState(false);
  // Chart data for analytics
  const [chartData, setChartData] = useState<any>(null);
  useEffect(() => {
    if (tradingStats && tradingStats.analytics && tradingStats.trades) {
      setChartData({
        labels: tradingStats.trades.map((t: any) => t.id),
        datasets: [
          {
            label: 'Profit',
            data: tradingStats.trades.map((t: any) => t.profit),
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.2)',
          },
        ],
      });
    }
  }, [tradingStats]);

  // Export analytics as CSV (no file-saver)
  const exportAnalytics = () => {
    if (!tradingStats || !tradingStats.trades) return;
    const header = 'ID,Pair,Amount,Profit,Status\n';
    const rows = tradingStats.trades.map((t: any) => `${t.id},${t.pair},${t.amount},${t.profit},${t.status}`).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-analytics-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Fetch AI tasks and trading stats on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch trading stats from backend
        const tradingRes = await fetch("/api/qi-trading?action=stats", {
          headers: { "x-admin-token": localStorage.getItem("adminToken") || "" },
        });
        const tradingData = await tradingRes.json();
        // Fetch AI tasks (simulate for now, replace with real API)
        const aiRes = await fetch("/api/qmoi-model?allStats=1", {
          headers: { "x-admin-token": localStorage.getItem("adminToken") || "" },
        });
        const aiData = await aiRes.json();
        setTradingStats(tradingData);
        setAiTasks(aiData.tasks || []);
      } catch (e) {
        // Error handling
        setTradingStats(null);
        setAiTasks([]);
      }
      setLoading(false);
    }
    fetchData();
    // Auto-refresh every 30s for live analytics
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- Enhanced QI Chat logic ---
  // Handles file uploads, update requests, and background enhancements
  const [pendingEnhancements, setPendingEnhancements] = useState<string[]>([]);

  // Simulate background enhancement suggestions and auto-improvements
  useEffect(() => {
    if (!showQIChat) return;
    // Suggest enhancements every 60s
    const interval = setInterval(() => {
      setPendingEnhancements((prev) => [
        ...prev,
        `Suggested enhancement at ${new Date().toLocaleTimeString()}: Optimize trading strategy or update AI model.`
      ]);
    }, 60000);
    return () => clearInterval(interval);
  }, [showQIChat]);

  // Handle file uploads and update requests in chat
  const handleChatFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    await fetch("/api/qmoi-model?upload=1", {
      method: "POST",
      headers: { "x-admin-token": localStorage.getItem("adminToken") || "" },
      body: formData,
    });
    setChatHistory([
      ...chatHistory,
      { type: "system", content: `File '${file.name}' uploaded for analysis.` }
    ]);
  };

  // Handle enhancement requests (manual or background)
  const handleEnhancement = async (desc: string) => {
    setChatHistory([
      ...chatHistory,
      { type: "system", content: `Enhancement triggered: ${desc}` }
    ]);
    await fetch("/api/qmoi-model?enhance=1", {
      method: "POST",
      headers: { "x-admin-token": localStorage.getItem("adminToken") || "" },
      body: JSON.stringify({ desc }),
    });
  };

  // --- Export/Control handlers ---
  const exportTasks = (type: 'csv'|'json') => {
    if (!Array.isArray(aiTasks) || !aiTasks.length) return;
    if (type === 'csv') {
      const header = 'ID,User,Type,Description/File,Status,Timestamp,Duration\n';
      const rows = aiTasks.map((t: any) => `${t.id},${t.user||'admin'},${t.type},${t.desc||t.file||'-'},${t.status},${t.timestamp},${t.duration||'-'}`).join('\n');
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
  };
  const clearLogs = async () => {
    await fetch('/api/qmoi-model?clear=1', { method: 'POST', headers: { 'x-admin-token': localStorage.getItem('adminToken')||'' } });
    setAiTasks([]);
  };
  const downloadAllData = () => exportTasks('json');

  // Example global state (replace with real data)
  const globalState = {
    sessions: 5, // Example: number of active sessions
    memory: aiTasks.length,
    health: 'Good',
  };

  // Simulated device data (replace with real backend data)
  const [devices, setDevices] = useState<any[]>([
    { user: "Alice", name: "Alice's Phone", status: "active", lastSeen: "2025-06-09 10:00", location: { lat: 37.7749, lng: -122.4194 } },
    { user: "Bob", name: "Bob's Laptop", status: "lost", lastSeen: "2025-06-08 22:30", location: { lat: 51.5074, lng: 0.1278 } },
    { user: "Carol", name: "Carol's Tablet", status: "offline", lastSeen: "2025-06-09 09:15", location: { lat: 35.6895, lng: 139.6917 } },
  ]);

  // --- Device lost tracking (simulate for now) ---
  const reportDeviceLost = (deviceName: string) => {
    setDevices((prev) => prev.map(d => d.name === deviceName ? { ...d, status: 'lost' } : d));
  };

  const colab = useColabJob();
  const extMgr = useExtensionManager();
  const [extInput, setExtInput] = useState("");

  // --- Life Goals & Invention Projects State ---
  const [goals, setGoals] = useState<any[]>([]);
  const [goalInput, setGoalInput] = useState('');
  const [goalEditIdx, setGoalEditIdx] = useState<number|null>(null);
  const [goalEditValue, setGoalEditValue] = useState('');
  const [inventions, setInventions] = useState<any[]>([]);
  const [inventionInput, setInventionInput] = useState('');

  // Load encrypted goals/inventions on mount
  useEffect(() => {
    if (!isMasterOrSister()) return;
    const enc = localStorage.getItem(ENCRYPTED_GOALS_KEY);
    if (enc) {
      const { goals = [], inventions = [] } = decrypt(enc);
      setGoals(goals);
      setInventions(inventions);
    }
  }, []);
  // Save encrypted goals/inventions
  useEffect(() => {
    if (!isMasterOrSister()) return;
    const enc = encrypt({ goals, inventions });
    localStorage.setItem(ENCRYPTED_GOALS_KEY, enc);
  }, [goals, inventions]);

  // Listen for user speech if talkMode is enabled
  useEffect(() => {
    if (!talkMode) return;
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setChatHistory([...chatHistory, { type: 'user', text: transcript }]);
      // Optionally trigger QI chat logic here
    };
    recognitionRef.current = recognition;
    recognition.start();
    return () => recognition.stop();
  }, [talkMode, setChatHistory]);

  // Speak QI AI replies if talkMode is enabled
  useEffect(() => {
    if (!talkMode) return;
    const last = chatHistory[chatHistory.length - 1];
    if (last && last.type === 'ai') {
      speak(last.text);
    }
  }, [chatHistory, talkMode, speak]);

  // --- Autonomous Project, Notification, Backup, and Self-Enhancement Logic ---
  // Email notification (uses backend API, e.g., /api/notify)
  async function sendEmailNotification(subject: string, message: string) {
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': localStorage.getItem('adminToken') || '' },
        body: JSON.stringify({ subject, message }),
      });
    } catch (e) {
      // Optionally log error
    }
  }

  // Hugging Face backup (simulate with backend API or direct upload)
  async function backupToHuggingFace(projectName: string, files: any[]) {
    try {
      await fetch('/api/qmoi-model?backupHuggingface=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': localStorage.getItem('adminToken') || '' },
        body: JSON.stringify({ projectName, files }),
      });
      sendEmailNotification(`Backup Complete: ${projectName}`, `Project ${projectName} was backed up to Hugging Face Spaces.`);
    } catch (e) {
      sendEmailNotification(`Backup Failed: ${projectName}`, `Backup failed for project ${projectName}.`);
    }
  }

  // Autonomous Colab project creation and saving
  const createColabProject = async (projectName: string, details: any) => {
    setLoading(true);
    try {
      // Simulate Colab job and project creation
      const res = await fetch('/api/qmoi-model?initiateProject=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': localStorage.getItem('adminToken') || '' },
        body: JSON.stringify({ projectName, files: details.files, userPrefs: details.userPrefs }),
      });
      const data = await res.json();
      setChatHistory([
        ...chatHistory,
        { type: 'system', content: `Colab project '${projectName}' created and saved to master projects.` }
      ]);
      // Backup to Hugging Face
      await backupToHuggingFace(projectName, details.files);
      sendEmailNotification(`Project Created: ${projectName}`, `Colab project '${projectName}' created and saved.`);
    } catch (e) {
      setChatHistory([
        ...chatHistory,
        { type: 'system', content: `Failed to create Colab project '${projectName}'.` }
      ]);
      sendEmailNotification(`Project Creation Failed: ${projectName}`, `Colab project '${projectName}' failed to create.`);
    }
    setLoading(false);
  };

  // Autonomous self-enhancement and auto-feature addition
  const triggerSelfEnhancement = async (desc: string = 'Autonomous self-enhancement') => {
    setLoading(true);
    try {
      await fetch('/api/qmoi-model?enhance=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': localStorage.getItem('adminToken') || '' },
        body: JSON.stringify({ desc }),
      });
      setChatHistory([
        ...chatHistory,
        { type: 'system', content: `Self-enhancement triggered: ${desc}` }
      ]);
      sendEmailNotification('AI Self-Enhancement', `The AI has performed a self-enhancement: ${desc}`);
    } catch (e) {
      setChatHistory([
        ...chatHistory,
        { type: 'system', content: `Self-enhancement failed: ${desc}` }
      ]);
      sendEmailNotification('AI Self-Enhancement Failed', `Self-enhancement failed: ${desc}`);
    }
    setLoading(false);
  };

  // Periodic backup and self-enhancement (every 6 hours)
  useEffect(() => {
    if (!isMaster()) return;
    const interval = setInterval(() => {
      // Example: backup all current projects (simulate with one project for now)
      if (aiTasks.length > 0) {
        const lastProject = aiTasks.find((t: any) => t.type === 'project-init');
        if (lastProject) {
          backupToHuggingFace(lastProject.project, lastProject.files || []);
        }
      }
      // Trigger self-enhancement
      triggerSelfEnhancement('Periodic autonomous self-enhancement');
    }, 6 * 60 * 60 * 1000); // 6 hours
    return () => clearInterval(interval);
  }, [aiTasks]);

  const mediaStatus = useMediaGenerationStatus();
  const automationStatus = useGlobalAutomation();
  const datasets = useDatasetManager();
  const { trainingStatus, lastTrained } = useModelTrainer();
  const problems = useVSCodeProblems();
  const analytics = useAnalyticsDashboard();

  if (!isMaster()) return null;

  // --- Colab Status Indicator ---
  const colabStatus = colab.result?.status || (colab.error ? 'error' : 'idle');
  const colabStatusColor = colabStatus === 'success' ? 'bg-green-500' : colabStatus === 'error' ? 'bg-red-500' : colabStatus === 'running' ? 'bg-yellow-400' : 'bg-gray-300';

  // --- Log master actions ---
  const logMasterAction = (action: string) => {
    setMasterLogs(logs => [...logs, { time: new Date().toLocaleString(), action }]);
  };

  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [masterLogs, setMasterLogs] = useState<{ time: string; action: string }[]>([]);
  const audioPulseRef = useRef<HTMLDivElement>(null);

  // Patch AI speaking effect to trigger pulse
  useEffect(() => {
    if (!talkMode) return;
    const last = chatHistory[chatHistory.length - 1];
    if (last && last.type === 'ai') {
      setAiSpeaking(true);
      speak(last.text);
      setTimeout(() => setAiSpeaking(false), Math.max(1000, last.text.length * 30));
    }
  }, [chatHistory, talkMode, speak]);

  // Patch master-only actions to log
  const masterCreateColabProject = async (...args: [string, any]) => {
    logMasterAction('Created Colab Project');
    await createColabProject(...args);
  };
  const masterTriggerSelfEnhancement = async (...args: [string?]) => {
    logMasterAction('Triggered Self-Enhancement');
    await triggerSelfEnhancement(...args);
  };
  const masterBackupToHuggingFace = async (...args: [string, any[]]) => {
    logMasterAction('Backed up to Hugging Face');
    await backupToHuggingFace(...args);
  };
  const masterSendEmailNotification = async (...args: [string, string]) => {
    logMasterAction('Sent Email Notification');
    await sendEmailNotification(...args);
  };

  // --- Audio Pulse Visualization ---
  useEffect(() => {
    if (!aiSpeaking) return;
    let running = true;
    const animate = () => {
      if (!audioPulseRef.current) return;
      audioPulseRef.current.style.height = `${20 + Math.random() * 30}px`;
      if (running) requestAnimationFrame(animate);
    };
    animate();
    return () => { running = false; if (audioPulseRef.current) audioPulseRef.current.style.height = '20px'; };
  }, [aiSpeaking]);

  // --- System Resource Monitor (Master Only) ---
  const health = useAIHealthCheck();
  const [autoUpgrade, setAutoUpgrade] = useState(true);
  const [autoTrading, setAutoTrading] = useState(false);

  // Auto self-enhance if autoUpgrade is enabled
  useEffect(() => {
    if (!isMaster() || !autoUpgrade) return;
    const interval = setInterval(() => {
      triggerSelfEnhancement('Auto-upgrade (master toggle enabled)');
    }, 2 * 60 * 60 * 1000); // every 2 hours
    return () => clearInterval(interval);
  }, [autoUpgrade]);

  // --- Autonomous Trading Logic ---
  const tradingStatus = useTradingAutomation();
  useEffect(() => {
    if (!isMaster() || !autoTrading) return;
    const interval = setInterval(() => {
      // Example: Only trade if confidence is high and analytics are positive
      if (tradingStats && tradingStats.confidence > 0.85 && tradingStats.analytics && tradingStats.analytics.winCount > tradingStats.analytics.lossCount) {
        // Find best pair and trade small amount
        const bestPair = tradingStats.analytics.pairs && tradingStats.analytics.pairs.length > 0 ? tradingStats.analytics.pairs[0] : 'BTCUSDT';
        executeTrade({ symbol: bestPair, side: 'buy', amount: 0.001 }).then(result => {
          logMasterAction(`Autonomous trade: ${bestPair} buy 0.001`);
          setChatHistory(prev => ([
            ...prev,
            { type: 'system', content: `Autonomous trade executed: ${bestPair} buy 0.001. Result: ${JSON.stringify(result)}` }
          ]));
        });
      }
    }, 10 * 60 * 1000); // every 10 minutes
    return () => clearInterval(interval);
  }, [autoTrading, tradingStats]);

  // Quick Colab notebook launcher (master only)
  const launchColabNotebook = () => {
    window.open('https://colab.research.google.com/', '_blank');
    logMasterAction('Launched Colab Notebook');
  };

  // --- Bitget Trading Control (Master Only) ---
  const {
    bitgetStatus,
    enableRealTrading,
    disableRealTrading,
    executeTrade,
    isRealTradingEnabled,
    lastTradeResult,
    tradingError
  } = useBitgetTrader();
  const [tradingEnabled, setTradingEnabled] = useState(isRealTradingEnabled);

  // Master can toggle real trading
  const handleToggleTrading = () => {
    if (tradingEnabled) {
      disableRealTrading();
      setTradingEnabled(false);
      logMasterAction('Disabled real trading on Bitget');
    } else {
      enableRealTrading();
      setTradingEnabled(true);
      logMasterAction('Enabled real trading on Bitget');
    }
  };

  // Master can force a trade (for demo/testing)
  const handleForceTrade = async () => {
    const result = await executeTrade({ symbol: 'BTCUSDT', side: 'buy', amount: 0.001 });
    logMasterAction('Forced trade on Bitget: BTCUSDT buy 0.001');
    setChatHistory([
      ...chatHistory,
      { type: 'system', content: `Forced trade executed: ${JSON.stringify(result)}` }
    ]);
  };

  // --- Wallet & Cashon State ---
  const [walletTab, setWalletTab] = useState<'send'|'instruction'|'apikeys'|'history'>('send');
  const [walletPlatform, setWalletPlatform] = useState('Mpesa');
  const [walletTo, setWalletTo] = useState('');
  const [walletAmount, setWalletAmount] = useState('');
  const [walletCurrency, setWalletCurrency] = useState('KES');
  const [walletInstruction, setWalletInstruction] = useState('');
  const [walletApiKey, setWalletApiKey] = useState('');
  const [walletApiKeyPlatform, setWalletApiKeyPlatform] = useState('Mpesa');
  const [walletResult, setWalletResult] = useState<any>(null);
  const [walletHistory, setWalletHistory] = useState<any[]>([]);
  // --- Kids Zone State ---
  const [kidsTab, setKidsTab] = useState<'music'|'story'|'conversation'|'reminder'>('music');
  const [kidsInput, setKidsInput] = useState('');
  const [kidsResult, setKidsResult] = useState<any>(null);
  // --- Multi-Presence State ---
  const [multiLocations, setMultiLocations] = useState<string>('');
  const [multiTask, setMultiTask] = useState('');
  const [multiResult, setMultiResult] = useState<any>(null);
  // --- Swahili Chat State ---
  const [swahiliUser, setSwahiliUser] = useState('Victor');
  const [swahiliMessage, setSwahiliMessage] = useState('');
  const [swahiliReply, setSwahiliReply] = useState('');
  // --- AI Teacher State ---
  const [teachUser, setTeachUser] = useState('Victor');
  const [teachSubject, setTeachSubject] = useState('Swahili');
  const [teachLevel, setTeachLevel] = useState('beginner');
  const [teachLanguage, setTeachLanguage] = useState('sw');
  const [teachLesson, setTeachLesson] = useState('');

  // --- UI ---
  return (
    <Card>
      <QIStateWindow state="admin" global={globalState} aiHealth={aiHealth} colabJob={{
        jobStatus: colab.result,
        result: colab.result,
        error: colab.error || undefined,
      }} />
      <CardHeader>
        <CardTitle>Q-I {talkMode && <span style={{color:'#0a0'}}>🗣️ Talk Mode</span>}</CardTitle>
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={() => setShowAllStats(v => !v)}>All AI Stats</Button>
          <Button size="sm" variant="outline" onClick={() => setShowQIChat(true)}>QI Chat (App Control)</Button>
          <Button size="sm" variant={talkMode ? 'destructive' : 'outline'} onClick={() => setTalkMode(t => !t)}>
            {talkMode ? 'Disable Talk Mode' : 'Enable Talk Mode'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAllStats && (
          <div className="mb-4 p-2 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">All AI Stats (All Sessions/Users/Projects)</h3>
            <div className="flex flex-wrap gap-4 mb-2">
              <div><b>Total AI Tasks:</b> {aiTasks.length}</div>
              <div><b>Enhancements:</b> {aiTasks.filter((t: any) => t.type === 'enhancement').length}</div>
              <div><b>File Uploads:</b> {aiTasks.filter((t: any) => t.type === 'file-upload').length}</div>
              <div><b>Last Task:</b> {aiTasks.length > 0 ? new Date(aiTasks[aiTasks.length-1].timestamp).toLocaleString() : 'N/A'}</div>
              <div><b>Unique Users:</b> {new Set(aiTasks.map((t: any) => t.user || 'admin')).size}</div>
              <div><b>Enhancement Success Rate:</b> {(() => { const e = aiTasks.filter((t: any) => t.type === 'enhancement'); return e.length ? (e.filter((t: any) => t.status === 'completed').length / e.length * 100).toFixed(1) + '%' : 'N/A'; })()}</div>
              <div><b>File Types:</b> {(() => { const types = {}; aiTasks.filter((t: any) => t.type === 'file-upload').forEach((t: any) => { const ext = t.file?.split('.').pop(); types[ext] = (types[ext]||0)+1; }); return Object.entries(types).map(([k,v])=>`${k}: ${v}`).join(', ') || 'N/A'; })()}</div>
              <div><b>Avg Task Duration:</b> {(() => { const durs = aiTasks.map((t: any) => t.duration).filter(Boolean); return durs.length ? (durs.reduce((a: number,b: number)=>a+b,0)/durs.length).toFixed(2)+'s' : 'N/A'; })()}</div>
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
                  {aiTasks.map((t: any, i: number) => (
                    <tr key={i}>
                      <td>{t.id || i}</td>
                      <td>{t.user || 'admin'}</td>
                      <td>{t.type}</td>
                      <td>{t.desc || t.file || '-'}</td>
                      <td>
                        <Badge variant={t.status === 'completed' ? 'success' : t.status === 'pending' ? 'warning' : 'default'}>
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
                <span className="text-lg font-bold">{aiTasks.filter((t: any) => t.status === 'pending').length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Completed Tasks</span>
                <span className="text-lg font-bold">{aiTasks.filter((t: any) => t.status === 'completed').length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Failed Tasks</span>
                <span className="text-lg font-bold">{aiTasks.filter((t: any) => t.status === 'error').length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Avg Duration</span>
                <span className="text-lg font-bold">
                  {(() => {
                    const durations = aiTasks.map((t: any) => t.duration).filter(Boolean);
                    if (durations.length === 0) return '-';
                    const avgDuration = durations.reduce((a: number, b: number) => a + b, 0) / durations.length;
                    return `${avgDuration.toFixed(1)}s`;
                  })()}
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
            <div className="flex flex-col mt-2">
              <span className="text-xs text-gray-500">Status</span>
              <Badge variant={mediaStatus?.status === 'generating' ? 'warning' : mediaStatus?.status === 'completed' ? 'success' : 'default'}>
                {mediaStatus?.status === 'generating' ? 'Media is being generated' : mediaStatus?.status === 'completed' ? 'Media generation completed' : 'N/A'}
              </Badge>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Global Automation Status</h3>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Status</span>
              <Badge variant={automationStatus?.enabled ? 'success' : 'destructive'}>
                {automationStatus?.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-xs text-gray-500">Last Run</span>
              <span className="text-lg font-bold">
                {automationStatus?.lastRun ? new Date(automationStatus.lastRun).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-xs text-gray-500">Next Run</span>
              <span className="text-lg font-bold">
                {automationStatus?.nextRun ? new Date(automationStatus.nextRun).toLocaleString() : 'N/A'}
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
                      {msg.text}
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
      </CardContent>
    </Card>
  );
}

export default QIComponent;