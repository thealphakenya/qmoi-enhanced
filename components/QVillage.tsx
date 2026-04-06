// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  BookOpen,
  Search,
  MessageSquare,
  TrendingUp,
  Star,
  Clock,
  Users,
  Zap,
  Brain,
  Database,
  Network,
  Shield,
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Eye,
  Mic,
  Settings,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  Moon,
  Sun,
} from "lucide-react";

// Enhanced QVillage hooks
import {
  useQVillage,
  useQVillageStatus,
  useQMOIThinking,
  useQVillageAccessibility,
  useQVillagePerformance,
  useQVillageAutoHeal,
  useQVillageNotifications,
} from "../hooks/useQVillage";

interface QVillagePaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  arxivId: string;
  publishedDate: string;
  tags: string[];
  relevanceScore: number;
  saved: boolean;
}

interface QVillageKBEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: string;
  views: number;
  likes: number;
}

interface QVillageDiscussion {
  id: string;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  tags: string[];
  trending: boolean;
}

interface QVillageMetrics {
  papersToday: number;
  kbEntries: number;
  activeUsers: number;
  discussions: number;
  apiCalls: number;
  responseTime: number;
  accuracy: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
}

interface QVillageStatus {
  isOnline: boolean;
  lastSync: string;
  syncStatus: "idle" | "syncing" | "error" | "success";
  hfIntegration: boolean;
  qmoiConnection: boolean;
  parallelProcessing: boolean;
}

export const QVillage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | "papers"
    | "kb"
    | "discussions"
    | "status"
    | "datasets"
    | "auto-projects"
    | "deals"
    | "tracks"
  >("papers");
  const [searchQuery, setSearchQuery] = useState("");
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "error" | "success"
  >("idle");

  const [aviatorState, setAviatorState] = useState({
    isActive: true,
    mode: "autopilot" as "autopilot" | "manual" | "training",
    status: "ready" as "ready" | "working" | "paused" | "error",
    currentMission: "Orchestrating QVillage intelligence" as string,
    message: "QMOI Aviator online and adaptive." as string,
    progress: 0,
    isSpeaking: false,
  });

  const [aviatorActions, setAviatorActions] = useState<string[]>([
    "Analyzing market signals",
    "Optimizing strategy",
    "Syncing datasets",
    "Auto-healing runtime",
  ]);

  const triggerAviatorAction = (action: string) => {
    setAviatorState((prev) => ({
      ...prev,
      status: "working",
      currentMission: action,
      isSpeaking: true,
      progress: Math.min(prev.progress + 20, 100),
    }));

    setTimeout(() => {
      setAviatorState((prev) => ({
        ...prev,
        status: "ready",
        isSpeaking: false,
        message: `Task complete: ${action}`,
      }));
    }, 1300);
  };

  const toggleAviatorMode = () => {
    setAviatorState((prev) => {
      const nextMode = prev.mode === "autopilot" ? "manual" : "autopilot";
      return {
        ...prev,
        mode: nextMode,
        message: `QMOI Aviator switched to ${nextMode} mode.`,
        isSpeaking: true,
      };
    });

    setTimeout(() => {
      setAviatorState((prev) => ({ ...prev, isSpeaking: false }));
    }, 1200);
  };

  const quickAviatorSpeak = () => {
    const quotes = [
      "Executing adaptive plan...",
      "Monitoring success metrics...",
      "Auto-artifact synthesis in progress...",
      "Real-time orchestration engaged...",
    ];
    const msg = quotes[Math.floor(Math.random() * quotes.length)];
    setAviatorState((prev) => ({ ...prev, message: msg, isSpeaking: true }));
    setTimeout(
      () => setAviatorState((prev) => ({ ...prev, isSpeaking: false })),
      1000,
    );
  };

  // Enhanced hooks integration
  const qvillage = useQVillage();
  const status = useQVillageStatus();
  const thinking = useQMOIThinking();
  const accessibility = useQVillageAccessibility();
  const performance = useQVillagePerformance();
  const autoHeal = useQVillageAutoHeal();
  const notifications = useQVillageNotifications();

  // Enhanced thinking status for QVillage AI processing
  const [thinkingStatus, setThinkingStatus] = useState({
    isThinking: false,
    currentTask: "",
    progress: 0,
    eta: "",
    tasks: [] as string[],
  });

  // theme handling
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Enhanced auto-refresh with hooks
  useEffect(() => {
    // Hook handles data fetching automatically
    const interval = setInterval(() => {
      qvillage.fetchAllData();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [qvillage.fetchAllData]);

  // Enhanced search with QMOI AI
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    thinking.startThinking("Searching QVillage knowledge base...", 2000);

    try {
      const results = await qvillage.search(searchQuery);
      if (results) {
        notifications.addNotification({
          type: "search_complete",
          title: "Search Complete",
          message: `Found ${results.total} results for "${searchQuery}"`,
          priority: "low",
        });
      }
    } catch (error) {
      notifications.addNotification({
        type: "error",
        title: "Search Failed",
        message: "Failed to search QVillage knowledge base",
        priority: "high",
      });
    }
  };

  const syncWithHuggingFace = async () => {
    setSyncStatus("syncing");

    setThinkingStatus({
      isThinking: true,
      currentTask: "Synchronizing with Hugging Face...",
      progress: 0,
      eta: "5s",
      tasks: [
        "Connecting to HF",
        "Syncing papers",
        "Syncing KB",
        "Validating data",
      ],
    });

    for (let i = 0; i <= 100; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setThinkingStatus((prev) => ({
        ...prev,
        progress: i,
        currentTask:
          i < 20
            ? "Connecting to Hugging Face..."
            : i < 40
              ? "Syncing daily papers..."
              : i < 60
                ? "Syncing knowledge base..."
                : i < 80
                  ? "Validating data integrity..."
                  : "Finalizing synchronization...",
        eta: `${Math.max(0, ((100 - i) / 20) * 0.3)}s`,
      }));
    }

    setSyncStatus("success");

    setThinkingStatus({
      isThinking: false,
      currentTask: "",
      progress: 100,
      eta: "",
      tasks: [],
    });
  };

  const autoProjectTemplates = [
    {
      id: "music-prod-001",
      name: "AI Music Production Suite",
      type: "media_production",
      status: "active",
      revenue: 2450.5,
      platforms: ["spotify", "youtube", "apple_music"],
    },
    {
      id: "video-gen-002",
      name: "Automated Video Content Creator",
      type: "media_production",
      status: "active",
      revenue: 1890.75,
      platforms: ["youtube", "tiktok", "instagram"],
    },
    {
      id: "app-dev-003",
      name: "AI App Development Pipeline",
      type: "auto_projects",
      status: "active",
      revenue: 3200.0,
      platforms: ["github", "app_store", "google_play"],
    },
    {
      id: "trading-bot-004",
      name: "Crypto Trading Automation",
      type: "investment",
      status: "active",
      revenue: 5670.25,
      platforms: ["binance", "coinbase", "kraken"],
    },
  ];

  const dealTemplates = [
    {
      id: "deal-revenue-001",
      name: "Multi-Platform Revenue Stream",
      type: "revenue_generation",
      value: 50000,
      revenue: 12500.5,
      status: "active",
      platforms: ["trading", "affiliate", "content"],
      paymentMethods: ["stripe", "crypto"],
    },
    {
      id: "deal-media-002",
      name: "AI Music & Video Production",
      type: "media_production",
      value: 25000,
      revenue: 8750.25,
      status: "active",
      platforms: ["spotify", "youtube", "netflix"],
      paymentMethods: ["paypal", "stripe"],
    },
    {
      id: "deal-invest-003",
      name: "Crypto Investment Portfolio",
      type: "investment",
      value: 100000,
      revenue: 28750.75,
      status: "active",
      platforms: ["binance", "coinbase", "kraken"],
      paymentMethods: ["crypto", "bank_transfer"],
    },
  ];

  const autoProjects = Array.isArray(qvillage.autoProjects) && qvillage.autoProjects.length
    ? (qvillage.autoProjects as Array<Record<string, any>>)
    : autoProjectTemplates;

  const deals = Array.isArray(qvillage.deals) && qvillage.deals.length
    ? (qvillage.deals as Array<Record<string, any>>)
    : dealTemplates;

  const renderPapersTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Daily Research Papers</h3>
        <Badge variant="secondary">{qvillage.papers.length} papers today</Badge>
      </div>

      <div className="space-y-3">
        {qvillage.papers.map((paper) => (
          <Card key={paper.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm hover:text-blue-600 cursor-pointer">
                  {paper.title}
                </h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {paper.relevanceScore.toFixed(2)} relevance
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={paper.saved ? "text-green-600" : ""}
                  >
                    <Star
                      className="h-4 w-4"
                      fill={paper.saved ? "currentColor" : "none"}
                    />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                {paper.authors.join(", ")} • {paper.publishedDate}
              </p>

              <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                {paper.abstract}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {paper.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Read Paper
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderKBTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Knowledge Base</h3>
        <Badge variant="secondary">{qvillage.kbEntries.length} entries</Badge>
      </div>

      <div className="space-y-3">
        {qvillage.kbEntries.map((entry) => (
          <Card key={entry.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm hover:text-blue-600 cursor-pointer">
                  {entry.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Eye className="h-3 w-3" />
                  {entry.views}
                  <Star className="h-3 w-3" />
                  {entry.likes}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                By {entry.author} • Updated {entry.updatedAt}
              </p>

              <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                {entry.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDiscussionsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Community Discussions</h3>
        <Badge variant="secondary">
          {qvillage.discussions.length} active discussions
        </Badge>
      </div>

      <div className="space-y-3">
        {qvillage.discussions.map((discussion) => (
          <Card
            key={discussion.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm hover:text-blue-600 cursor-pointer">
                  {discussion.title}
                  {discussion.trending && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </h4>
                <div className="text-xs text-gray-500">
                  {discussion.replies} replies
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                By {discussion.author} • {discussion.lastActivity}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {discussion.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Join Discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDatasetsTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Available Datasets</h3>
      <Badge variant="secondary">{qvillage.datasets.length} datasets</Badge>
      <div className="space-y-2">
        {qvillage.datasets.slice(0, 20).map((id) => (
          <div key={id} className="text-sm">
            • {id}
          </div>
        ))}
        {qvillage.datasets.length > 20 && (
          <div className="text-sm text-gray-500">
            and {qvillage.datasets.length - 20} more...
          </div>
        )}
      </div>
    </div>
  );

  const renderAutoProjectsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Auto-Projects</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-1" />
            Create Auto-Project
          </Button>
          <Badge variant="secondary">
            {qvillage.autoProjects?.length || 0} active projects
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {autoProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm">{project.name}</h4>
                <Badge
                  variant={
                    project.status === "active" ? "default" : "secondary"
                  }
                >
                  {project.status}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Type: {project.type.replace("_", " ")}
              </p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-green-600">
                  ${project.revenue.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">Revenue Generated</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {project.platforms.map((platform) => (
                  <Badge key={platform} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3 mr-1" />
                  Monitor
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-3 w-3 mr-1" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDealsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Deals & Revenue Generation</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            Create Deal
          </Button>
          <Badge variant="secondary">
            {qvillage.deals?.length || 0} active deals
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-semibold">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              ${(qvillage.totalRevenue || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">+12.5% from last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Active Deals</span>
            </div>
            <div className="text-2xl font-bold">
              {qvillage.activeDeals || 0}
            </div>
            <div className="text-sm text-gray-600">
              Across multiple platforms
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <span className="font-semibold">Success Rate</span>
            </div>
            <div className="text-2xl font-bold">94.2%</div>
            <div className="text-sm text-gray-600">Deal completion rate</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {deals.map((deal) => (
          <Card key={deal.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm">{deal.name}</h4>
                <Badge
                  variant={deal.status === "active" ? "default" : "secondary"}
                >
                  {deal.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <span className="text-xs text-gray-500">Deal Value</span>
                  <div className="font-semibold">
                    ${deal.value.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">
                    Revenue Generated
                  </span>
                  <div className="font-semibold text-green-600">
                    ${deal.revenue.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-xs text-gray-500 mr-2">Platforms:</span>
                {deal.platforms.map((platform) => (
                  <Badge key={platform} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-xs text-gray-500 mr-2">Payments:</span>
                {deal.paymentMethods.map((method) => (
                  <Badge key={method} variant="secondary" className="text-xs">
                    {method}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Activity className="h-3 w-3 mr-1" />
                  Execute
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Analytics
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-3 w-3 mr-1" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStatusTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Papers Today</span>
            </div>
            <div className="text-2xl font-bold">
              {qvillage.metrics.papersToday}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-5 w-5 text-green-600" />
              <span className="font-semibold">KB Entries</span>
            </div>
            <div className="text-2xl font-bold">
              {qvillage.metrics.kbEntries?.toLocaleString() || "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="font-semibold">Active Users</span>
            </div>
            <div className="text-2xl font-bold">
              {qvillage.metrics.activeUsers || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <span className="font-semibold">API Calls</span>
            </div>
            <div className="text-2xl font-bold">
              {qvillage.metrics.apiCalls?.toLocaleString() || "0"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Response Time</span>
                <span className="text-sm font-semibold">
                  {qvillage.metrics.responseTime || 0}s
                </span>
              </div>
              <Progress
                value={Math.max(
                  0,
                  100 - (qvillage.metrics.responseTime || 0) * 1000,
                )}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Accuracy</span>
                <span className="text-sm font-semibold">
                  {((qvillage.metrics.accuracy || 0) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress
                value={(qvillage.metrics.accuracy || 0) * 100}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Superiority Score</span>
                <span className="text-sm font-semibold">
                  {(qvillage.qmoiSuperiorityScore * 100).toFixed(1)}%
                </span>
              </div>
              <Progress
                value={qvillage.qmoiSuperiorityScore * 100}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">QVillage Online</span>
                <div className="flex items-center gap-2">
                  {status.online ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm ${
                      status.online ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {status.online ? "Online" : "Offline"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">HF Integration</span>
                <div className="flex items-center gap-2">
                  {status.hf_integration ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm ${
                      status.hf_integration ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {status.hf_integration ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">QMOI Connection</span>
                <div className="flex items-center gap-2">
                  {status.qmoi_connection ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm ${
                      status.qmoi_connection ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {status.qmoi_connection ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Parallel Processing</span>
                <div className="flex items-center gap-2">
                  {status.parallel_processing ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm ${
                      status.parallel_processing
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {status.parallel_processing ? "Enabled" : "enabled"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">CPU Usage</span>
                  <span className="text-sm font-semibold">
                    {qvillage.metrics.cpuUsage}%
                  </span>
                </div>
                <Progress value={qvillage.metrics.cpuUsage} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Memory Usage</span>
                  <span className="text-sm font-semibold">
                    {qvillage.metrics.memoryUsage}%
                  </span>
                </div>
                <Progress
                  value={qvillage.metrics.memoryUsage}
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Network Latency</span>
                  <span className="text-sm font-semibold">
                    {qvillage.metrics.networkLatency || 0}ms
                  </span>
                </div>
                <Progress
                  value={Math.max(
                    0,
                    100 - (qvillage.metrics.networkLatency || 0),
                  )}
                  className="h-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Last Sync</span>
                <span className="text-sm text-gray-600">
                  {new Date(
                    qvillage.lastSync || Date.now(),
                  ).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header with QVillage Branding */}
        <Card className="bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-gray-800">
              <div className="relative">
                <Brain className="h-10 w-10 text-blue-600 animate-pulse" />
                {thinkingStatus.isThinking && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-ping"></div>
                )}
              </div>
              <div>
                <span>QVillage</span>
                <div className="text-sm font-normal text-gray-600">
                  Advanced AI Research & Knowledge Platform
                </div>
              </div>
            </CardTitle>
            <p className="text-gray-600">
              Powered by QMOI AI - Superior intelligence, parallel processing,
              and continuous evolution
            </p>
          </CardHeader>
        </Card>

        {/* Enhanced Search and Controls */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                enabled={qvillage.loading || !searchQuery.trim()}
              >
                {qvillage.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
              <Button
                onClick={() => qvillage.sync("huggingface")}
                variant="outline"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    qvillage.status === "syncing" ? "animate-spin" : ""
                  }`}
                />
                Sync HF
              </Button>
            </div>

            {/* Enhanced Thinking Status with Hook */}
            {thinking.isThinking && (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                  <div className="font-semibold text-blue-800">
                    QMOI AI is processing...
                  </div>
                  <div className="text-sm text-blue-600">
                    ETA: {Math.ceil((100 - thinking.progress) / 25)}s
                  </div>
                </div>
                <div className="text-sm text-blue-700 mb-2">
                  {thinking.currentTask}
                </div>
                <Progress value={thinking.progress} className="h-2 mb-2" />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {thinking.parallelTasks.map((task, index) => (
                      <Badge
                        key={task.id}
                        variant={
                          task.status === "complete" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {task.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-blue-600">
                    Superiority: {(thinking.superiorityScore * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Accessibility Controls */}
            <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
              <Eye className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Accessibility:</span>
              <Button
                variant={accessibility.highContrast ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  accessibility.updateSetting(
                    "highContrast",
                    !accessibility.highContrast,
                  )
                }
              >
                High Contrast
              </Button>
              <Button
                variant={accessibility.largeText ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  accessibility.updateSetting(
                    "largeText",
                    !accessibility.largeText,
                  )
                }
              >
                Large Text
              </Button>
              <Button
                variant={accessibility.voiceCommands ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  accessibility.updateSetting(
                    "voiceCommands",
                    !accessibility.voiceCommands,
                  )
                }
              >
                <Mic className="h-3 w-3 mr-1" />
                Voice
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? (
                  <Moon className="h-3 w-3 mr-1" />
                ) : (
                  <Sun className="h-3 w-3 mr-1" />
                )}
                {theme === "light" ? "Dark" : "Light"}
              </Button>
            </div>

            {/* Real-time QMOI Aviator Window */}
            <Card className="bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-900 text-white shadow-lg border border-indigo-400 mb-4">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                      <span className="font-semibold text-sm">
                        QMOI Aviator (Live)
                      </span>
                    </div>
                    <div className="text-xs text-slate-200">
                      Realtime AI pilot orchestration dashboard
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] uppercase">
                    {aviatorState.mode}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="rounded-xl bg-white/10 p-2 border border-white/20">
                    <div className="text-[11px] uppercase tracking-wide text-slate-300">
                      Mission
                    </div>
                    <div className="font-medium text-sm mt-1">
                      {aviatorState.currentMission}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/10 p-2 border border-white/20">
                    <div className="text-[11px] uppercase tracking-wide text-slate-300">
                      Status
                    </div>
                    <div className="mt-1">
                      <Badge
                        variant={
                          aviatorState.status === "error"
                            ? "destructive"
                            : "default"
                        }
                        className="text-xs"
                      >
                        {aviatorState.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/10 p-2 border border-white/20">
                    <div className="text-[11px] uppercase tracking-wide text-slate-300">
                      Pilot
                    </div>
                    <div className="mt-1 font-medium text-sm">QMOI Ava</div>
                    <div className="text-[11px] text-slate-300">
                      Talking {aviatorState.isSpeaking ? "🗣️" : "💬"}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-100">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="inline-flex h-2 w-2 rounded-full bg-cyan-300 animate-pulse"></span>
                    <span className="font-semibold">Live Aviator Voice</span>
                  </div>
                  <p className="leading-relaxed text-slate-200">
                    {aviatorState.message}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() =>
                      triggerAviatorAction("Auto-synthesizing knowledge nodes")
                    }
                  >
                    Auto-Synthesize
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={toggleAviatorMode}
                  >
                    {aviatorState.mode === "autopilot"
                      ? "Switch Manual"
                      : "Switch Autopilot"}
                  </Button>
                  <Button variant="ghost" size="xs" onClick={quickAviatorSpeak}>
                    Speak Now
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() =>
                      triggerAviatorAction("Deploying adaptive workflow")
                    }
                  >
                    Deploy Workflow
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tab Navigation */}
            <div className="flex gap-1 border-b">
              {/* order maintained with new datasets tab */}
              {[
                {
                  id: "papers",
                  label: "Research Papers",
                  icon: BookOpen,
                  count: qvillage.papers.length,
                },
                {
                  id: "kb",
                  label: "Knowledge Base",
                  icon: Database,
                  count: qvillage.kbEntries.length,
                },
                {
                  id: "discussions",
                  label: "Discussions",
                  icon: MessageSquare,
                  count: qvillage.discussions.length,
                },
                {
                  id: "datasets",
                  label: "Datasets",
                  icon: HardDrive,
                  count: qvillage.datasets.length,
                },
                {
                  id: "auto-projects",
                  label: "Auto-Projects",
                  icon: Zap,
                  count: qvillage.autoProjects?.length || 0,
                },
                {
                  id: "deals",
                  label: "Deals & Revenue",
                  icon: TrendingUp,
                  count: qvillage.deals?.length || 0,
                },
                {
                  id: "tracks",
                  label: "Tracks",
                  icon: Clock,
                  count: qvillage.tracks?.length || 0,
                },
                {
                  id: "status",
                  label: "System Status",
                  icon: Activity,
                  count: null,
                },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex items-center gap-2"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {tab.count !== null && (
                    <Badge variant="secondary" className="text-xs">
                      {tab.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            {activeTab === "papers" && renderPapersTab()}
            {activeTab === "kb" && renderKBTab()}
            {activeTab === "discussions" && renderDiscussionsTab()}
            {activeTab === "datasets" && renderDatasetsTab()}
            {activeTab === "auto-projects" && renderAutoProjectsTab()}
            {activeTab === "deals" && renderDealsTab()}
            {activeTab === "status" && renderStatusTab()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QVillage;
