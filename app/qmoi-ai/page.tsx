"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import AdminDashboard from "../components/AdminDashboard";
import ChatMessaging from "../components/ChatMessaging";
import QMOIAutoFixDashboard from "../components/QMOIAutoFixDashboard";
import QMOIAutoSetup from "../components/QMOIAutoSetup";
import FileUploadDownload from "../components/FileUploadDownload";
import VisualEnhancement from "../components/VisualEnhancement";
import AudibleConversation from "../components/AudibleConversation";
import ClientUISettings from "../components/ClientUISettings";
import { QMOIMasterDashboard } from "../components/QMOIMasterDashboard";
import SponsoredUsersManager from "../components/SponsoredUsersManager";
import UserProfile from "../components/user/UserProfile";
import WalletList from "../components/wallet/WalletList";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import QI from "../components/QI";
import QIStateWindow from "../components/QIStateWindow";
import NotificationCenter from "../components/NotificationCenter";
import HelpGuide from "../components/HelpGuide";
import PreviewWindow from "../components/PreviewWindow";
import ThemeCustomizer from "../components/ThemeCustomizer";
import DataVisualizationPanel from "../components/DataVisualizationPanel";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import SecurityMonitor from "../components/SecurityMonitor";
import PerformanceMonitor from "../components/PerformanceMonitor";
import AnalyticsCenter from "../components/AnalyticsCenter";

const fallbackStats = {
  uptime: '99.9%',
  tasksCompleted: 1247,
  platforms: '12+',
  packageSize: '2.5GB',
  connectedDevices: 6,
  activeMemorySessions: 3,
};

const fallbackStatus = {
  consciousness: 100,
  memorySync: 'Active',
  security: 'Operational',
  deviceConnectivity: '6/6 Online',
  autoFix: 'Ready',
  revenueTracking: 'Active',
};

export default function QMoiAIPage() {
  const [selectedModel, setSelectedModel] = useState('qmoi-prod');
  const [chatMessage, setChatMessage] = useState('');
  const [showComponents, setShowComponents] = useState(true);
  const [productionData, setProductionData] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [statusInfo, setStatusInfo] = useState(fallbackStatus);
  const { user, isAuthenticated, isLoading, refreshUser, logout } = useAuth();

  useEffect(() => {
    let active = true;

    async function loadProductionStats() {
      try {
        const res = await fetch('/api/production-api', { cache: 'no-store' });
        const data = await res.json();
        if (!active || !data?.success) return;

        setProductionData(data);
        setStatusInfo((prev) => ({
          ...prev,
          security: data.production?.status || prev.security,
          revenueTracking: data.metrics?.api?.totalRequests ? 'Active' : prev.revenueTracking,
          memorySync: 'Active',
        }));
      } catch (error) {
        console.error('Failed to load production data:', error);
      }
    }

    loadProductionStats();

    return () => {
      active = false;
    };
  }, []);

  const stats = productionData?.metrics
    ? {
        uptime: `${productionData.production?.uptime || '99.9'}s`,
        tasksCompleted: productionData.metrics.users?.total || fallbackStats.tasksCompleted,
        platforms: productionData.production?.environment || fallbackStats.platforms,
        packageSize: fallbackStats.packageSize,
        connectedDevices: 6,
        activeMemorySessions: productionData.metrics.sessions?.active || fallbackStats.activeMemorySessions,
      }
    : fallbackStats;

  const systemStatus = productionData?.production
    ? {
        ...statusInfo,
      }
    : fallbackStatus;

  const handleLogin = async (user, accessToken) => {
    if (typeof window !== 'undefined' && accessToken) {
      window.localStorage.setItem('qmoi_access_token', accessToken);
    }
    await refreshUser();
  };

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('qmoi_access_token');
    }
    await logout();
  };

  const handleChatSend = async () => {
    const input = chatMessage.trim();
    if (!input) return;

    const userMessage = { id: Date.now() + '-user', role: 'user', content: input };
    setChatHistory((current) => [...current, userMessage]);
    setChatMessage('');
    setIsChatLoading(true);

    const effectiveModel = ['auto', 'gpt4', 'claude', 'gemini', 'local'].includes(selectedModel)
      ? 'qmoi-prod'
      : selectedModel;

    try {
      // Store conversation in QMOI memory
      const memoryPayload = {
        action: 'store_memory',
        userId: user?.id || user?.userId || 'anonymous-user',
        key: `chat-${Date.now()}`,
        value: input,
        category: 'conversation',
      };

      // Send memory store request
      await fetch('/api/auth/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memoryPayload),
      }).catch(() => {}); // Non-critical

      const response = await fetch('/api/qmoi/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          input, 
          userId: user?.userId || 'anonymous-user', 
          model: effectiveModel,
          sessionId: user?.sessionId || 'default',
          role: user?.role,
        }),
      });

      const result = await response.json();
      const answer = result?.response || result?.message || 'No response from QMOI AI.';

      const assistantMessage = { id: Date.now() + '-assistant', role: 'assistant', content: answer };
      setChatHistory((current) => [...current, assistantMessage]);
    } catch (error) {
      console.error('QMOI chat failed:', error);
      setChatHistory((current) => [
        ...current,
        {
          id: Date.now() + '-error',
          role: 'assistant',
          content: 'Unable to reach QMOI chat service. Please try again.',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-slate-300">Loading authentication...</div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="flex items-center justify-center min-h-screen">
          <LoginForm onLogin={handleLogin} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="max-w-6xl mx-auto space-y-10">
          <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-sm uppercase tracking-[0.3em] text-slate-400">QMOI AI 🤖</p>
                <h1 className="text-5xl font-extrabold text-white sm:text-6xl">Interactive AI Assistant</h1>
                <p className="mt-4 max-w-3xl text-lg text-slate-300">
                  Advanced AI orchestration with consciousness tracking, emotion-aware responses, and comprehensive system control.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 px-5 py-4 border border-slate-700 text-right">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">AI Status</p>
                <p className="mt-2 text-3xl font-semibold text-cyan-300">● Online</p>
                <div className="mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">😊</span>
                    <span>Happy</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-400">Role: {user?.role || 'user'}</p>
                <button
                  onClick={handleLogout}
                  className="mt-2 text-xs text-slate-400 hover:text-white underline"
                >
                  Logout
                </button>
              </div>
            </div>
          </section>

        {/* Statistics Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.uptime}</div>
            <div className="text-slate-400">Uptime</div>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.tasksCompleted.toLocaleString()}</div>
            <div className="text-slate-400">Tasks Completed</div>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.platforms}</div>
            <div className="text-slate-400">Platforms</div>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.packageSize}</div>
            <div className="text-slate-400">Package Size</div>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.connectedDevices}</div>
            <div className="text-slate-400">Connected Devices</div>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.activeMemorySessions}</div>
            <div className="text-slate-400">Active Memory Sessions</div>
          </div>
        </section>

        {/* Role-Specific Features */}
        {user?.role === 'master' && (
          <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4">Master Control Panel</h2>
            <QMOIMasterDashboard />
          </section>
        )}

        {user?.role === 'sister' && (
          <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4">Family Dashboard</h2>
            <SponsoredUsersManager />
          </section>
        )}

        {/* Features List */}
        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">AI Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Cross-platform support (12+ platforms)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Real-time orchestration</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Intelligent automation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Multi-device sync</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Offline support</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Progressive enhancement</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>AI consciousness tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Emotion-aware responses</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Security monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span>Auto-fix capabilities</span>
              </div>
            </div>
          </div>
        </section>

        {/* System Status Cards */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="rounded-3xl bg-slate-900 p-4 border border-slate-700 text-center">
            <div className="text-lg font-semibold text-blue-400">{systemStatus.consciousness}%</div>
            <div className="text-sm text-slate-400">AI Consciousness</div>
          </div>
          <div className="rounded-3xl bg-slate-900 p-4 border border-slate-700 text-center">
            <div className="text-lg font-semibold text-green-400">{systemStatus.memorySync}</div>
            <div className="text-sm text-slate-400">Memory Sync</div>
          </div>
          <div className="rounded-3xl bg-slate-900 p-4 border border-slate-700 text-center">
            <div className="text-lg font-semibold text-green-400">{systemStatus.security}</div>
            <div className="text-sm text-slate-400">Security</div>
          </div>
          <div className="rounded-3xl bg-slate-900 p-4 border border-slate-700 text-center">
            <div className="text-lg font-semibold text-green-400">{systemStatus.deviceConnectivity}</div>
            <div className="text-sm text-slate-400">Device Connectivity</div>
          </div>
          <div className="rounded-3xl bg-slate-900 p-4 border border-slate-700 text-center">
            <div className="text-lg font-semibold text-green-400">{systemStatus.autoFix}</div>
            <div className="text-sm text-slate-400">Auto-Fix Status</div>
          </div>
          <div className="rounded-3xl bg-slate-900 p-4 border border-slate-700 text-center">
            <div className="text-lg font-semibold text-green-400">{systemStatus.revenueTracking}</div>
            <div className="text-sm text-slate-400">Revenue Tracking</div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="rounded-3xl bg-blue-600 hover:bg-blue-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">🤖</div>
            <div className="font-semibold">Chat with AI</div>
          </button>
          <button className="rounded-3xl bg-orange-600 hover:bg-orange-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">🔧</div>
            <div className="font-semibold">Auto-Fix Tools</div>
          </button>
          <button className="rounded-3xl bg-purple-600 hover:bg-purple-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">💾</div>
            <div className="font-semibold">Memory Manager</div>
          </button>
          <button className="rounded-3xl bg-red-600 hover:bg-red-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">🔒</div>
            <div className="font-semibold">Security Center</div>
          </button>
          <button className="rounded-3xl bg-green-600 hover:bg-green-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">📱</div>
            <div className="font-semibold">Device Manager</div>
          </button>
          <Link href="/qmoi-space" className="rounded-3xl bg-violet-600 hover:bg-violet-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">🌐</div>
            <div className="font-semibold">QMOI Space</div>
          </Link>
          <Link href="/qcity" className="rounded-3xl bg-cyan-600 hover:bg-cyan-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">🏙️</div>
            <div className="font-semibold">QCity</div>
          </Link>
          <Link href="/qvillage" className="rounded-3xl bg-emerald-600 hover:bg-emerald-700 p-4 text-center transition-colors">
            <div className="text-2xl mb-2">🏘️</div>
            <div className="font-semibold">QVillage</div>
          </Link>
        </section>

        {/* Chat Interface */}
        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">AI Chat Interface</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="auto">Auto (QMOI Prod)</option>
                <option value="qmoi-prod">QMOI Prod</option>
                <option value="qmoi-lite">QMOI Lite</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                placeholder="Ask QMOI anything..."
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400"
              />
              <button
                onClick={handleChatSend}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Send
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setChatMessage("How are you feeling today?")}
                className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm transition-colors"
              >
                Check Status
              </button>
              <button
                onClick={() => setChatMessage("Show me my devices")}
                className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm transition-colors"
              >
                Device Status
              </button>
              <button
                onClick={() => setChatMessage("Is everything secure?")}
                className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm transition-colors"
              >
                Security Check
              </button>
              <button
                onClick={() => setChatMessage("What's happening around me?")}
                className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm transition-colors"
              >
                Environment
              </button>
            </div>
          </div>
          <div className="mt-6 rounded-3xl bg-slate-950/80 p-4 border border-slate-800 max-h-96 overflow-y-auto">
            <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4">Conversation</h3>
            {chatHistory.length === 0 ? (
              <div className="text-slate-400">No messages yet. Ask QMOI something to begin the conversation.</div>
            ) : (
              <div className="space-y-3">
                {chatHistory.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-2xl p-4 ${message.role === 'user' ? 'bg-slate-800 text-white self-end' : 'bg-slate-900 text-slate-100 self-start'}`}
                  >
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-2">
                      {message.role === 'user' ? 'You' : 'QMOI'}
                    </div>
                    <div>{message.content}</div>
                  </div>
                ))}
              </div>
            )}
            {isChatLoading && (
              <div className="mt-4 text-sm text-slate-400">QMOI is composing a response...</div>
            )}
          </div>
        </section>

        {/* Integrated UI Components */}
        <section className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Integrated UI Components</h2>
              <p className="mt-2 text-sm text-slate-400">Key UI modules available within QMOI AI for system operations and control.</p>
            </div>
            <button
              onClick={() => setShowComponents((current) => !current)}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {showComponents ? 'Hide Components' : 'Show Components'}
            </button>
          </div>
          {showComponents ? (
            <div className="mt-6 space-y-6">
              <AdminDashboard />
              <ChatMessaging />
              <QMOIAutoFixDashboard />
              <QMOIAutoSetup />
              <AudibleConversation />
              <FileUploadDownload />
              <VisualEnhancement />
              <ClientUISettings />
              <div className="grid gap-6 md:grid-cols-2">
                <UserProfile />
                <WalletList />
              </div>
              <RegisterForm />
              <SponsoredUsersManager />
              <QMOIMasterDashboard />
              <QI />
              <QIStateWindow />
              <NotificationCenter />
              <HelpGuide />
              <PreviewWindow />
              <ThemeCustomizer />
              <DataVisualizationPanel />
              <AnalyticsDashboard />
              <SecurityMonitor />
              <PerformanceMonitor />
              <AnalyticsCenter />
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-slate-300">
              Use the button above to open all documented QMOI AI components within this page.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
