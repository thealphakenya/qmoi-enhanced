import React, { useEffect, useState } from "react";
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
import { useAIHealthCheck } from "../hooks/useAIHealthCheck";

// Dummy admin check (replace with real auth logic)
function isAdmin() {
  // TODO: Replace with real admin check
  return typeof window !== 'undefined' && localStorage.getItem('userRole') === 'admin';
}

// Color for confidence threshold
function confidenceColor(conf: number) {
  if (conf < 0.4) return 'bg-red-500';
  if (conf < 0.7) return 'bg-yellow-400';
  if (conf < 0.9) return 'bg-lime-400';
  return 'bg-green-500';
}

export function QI() {
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
  const [chatHistory, setChatHistory] = useState<any[]>([]);
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
    // Example: upload file to backend for analysis or update
    const formData = new FormData();
    formData.append("file", file);
    await fetch("/api/qmoi-model?upload=1", {
      method: "POST",
      headers: { "x-admin-token": localStorage.getItem("adminToken") || "" },
      body: formData,
    });
    setChatHistory((prev) => [
      ...prev,
      { type: "system", content: `File '${file.name}' uploaded for analysis.` }
    ]);
  };

  // Handle enhancement requests (manual or background)
  const handleEnhancement = async (desc: string) => {
    setChatHistory((prev) => [
      ...prev,
      { type: "system", content: `Enhancement triggered: ${desc}` }
    ]);
    // Simulate backend enhancement
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
    { user: "Bob", name: "Bob's Laptop", status: "lost", lastSeen: "2025-06-08 22:30", location: { lat: 51.5074, lng: -0.1278 } },
    { user: "Carol", name: "Carol's Tablet", status: "offline", lastSeen: "2025-06-09 09:15", location: { lat: 35.6895, lng: 139.6917 } },
  ]);

  // --- Device lost tracking (simulate for now) ---
  const reportDeviceLost = (deviceName: string) => {
    setDevices((prev) => prev.map(d => d.name === deviceName ? { ...d, status: 'lost' } : d));
  };

  const colab = useColabJob();
  const extMgr = useExtensionManager();
  const aiHealth = useAIHealthCheck();
  const [extInput, setExtInput] = useState("");

  if (!isAdmin()) return null;

  return (
    <Card className="h-full">
      <QIStateWindow state="admin" global={globalState} aiHealth={aiHealth} colabJob={{
        jobStatus: colab.jobStatus,
        result: colab.result,
        error: colab.error || undefined,
      }} />
      <CardHeader>
        <CardTitle>QI (Quantum Intelligence) - Admin Only</CardTitle>
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={() => setShowAllStats(v => !v)}>All AI Stats</Button>
          <Button size="sm" variant="outline" onClick={() => setShowQIChat(true)}>QI Chat (App Control)</Button>
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
                  {aiTasks.slice().reverse().map((t: any) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.user || 'admin'}</td>
                      <td>{t.type}</td>
                      <td>{t.desc || t.file || '-'}</td>
                      <td>{t.status}</td>
                      <td>{new Date(t.timestamp).toLocaleString()}</td>
                      <td>{t.duration ? t.duration+'s' : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-xs text-gray-500 mt-2">[Admin-only] Advanced analytics, export, and controls for all AI activity, usage, and project data.</div>
          </div>
        )}
        {showQIChat && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">QI Chat (App Control, Testing, Updates)</h3>
            <Chatbot
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              selectedModel={"qi-admin"}
              setSelectedModel={() => {}}
              onFileUpload={handleChatFile}
              onEnhancement={handleEnhancement}
              // TODO: Implement preview, test, implement, update push, version history logic
            />
            <div className="text-xs text-gray-500 mt-2">
              This chat is for app-level changes, testing, preview, and update/version management. Updates can be pushed to all apps after testing.<br />
              <b>Pending/Background Enhancements:</b>
              <ul className="list-disc ml-4">
                {pendingEnhancements.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList>
            <TabsTrigger value="tasks">AI Tasks</TabsTrigger>
            <TabsTrigger value="trading">Trading Activities</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="extensions">Extensions/Packages</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Current AI Tasks</h3>
              {aiTasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 mb-1">
                  <Badge>{task.status}</Badge>
                  <span>{task.name}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="trading">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Trading Stats</h3>
              {tradingStats && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span>Confidence:</span>
                    <div className={`w-32 h-4 rounded ${confidenceColor(tradingStats.confidence)}`}></div>
                    <span className="font-mono">{tradingStats.confidence.toFixed(2)}</span>
                  </div>
                  <div className="mb-2">
                    <span>Status: </span>
                    {tradingStats.usingRealFunds ? (
                      <Badge className="bg-green-600">Trading with Real Funds</Badge>
                    ) : (
                      <Badge className="bg-yellow-400 text-black">Paper Trading</Badge>
                    )}
                  </div>
                  <div className="mb-2">Asset: <b>{tradingStats.asset}</b></div>
                  <div className="mb-2">Account Balance: <b>${tradingStats.accountBalance.toLocaleString()}</b></div>
                  {/* Enhanced analytics */}
                  {tradingStats.analytics && (
                    <div className="mb-4 p-2 bg-blue-50 rounded text-xs">
                      <h4 className="font-semibold mb-1">Advanced Analytics</h4>
                      <div className="flex flex-wrap gap-4 mb-2">
                        <div><b>Best Pair:</b> {tradingStats.analytics.pairs && tradingStats.analytics.pairs.length > 0 ? tradingStats.analytics.pairs[0] : '-'}</div>
                        <div><b>Most Profitable Trade:</b> {tradingStats.trades && tradingStats.trades.length > 0 ? Math.max(...tradingStats.trades.map((t: any) => t.profit)).toFixed(2) : '-'}</div>
                        <div><b>Biggest Loss:</b> {tradingStats.trades && tradingStats.trades.length > 0 ? Math.min(...tradingStats.trades.map((t: any) => t.profit)).toFixed(2) : '-'}</div>
                        <div><b>Average Profit:</b> {tradingStats.trades && tradingStats.trades.length > 0 ? (tradingStats.trades.reduce((a: number, t: any) => a + t.profit, 0) / tradingStats.trades.length).toFixed(2) : '-'}</div>
                      </div>
                      <div className="flex flex-wrap gap-4 mb-2">
                        <div><b>Win/Loss Ratio:</b> {tradingStats.analytics.lossCount > 0 ? (tradingStats.analytics.winCount / tradingStats.analytics.lossCount).toFixed(2) : 'N/A'}</div>
                        <div><b>Longest Win Streak:</b> {(() => {
                          let max = 0, cur = 0;
                          for (const t of tradingStats.trades || []) {
                            if (t.profit > 0) cur++; else cur = 0;
                            if (cur > max) max = cur;
                          }
                          return max;
                        })()}</div>
                        <div><b>Longest Loss Streak:</b> {(() => {
                          let max = 0, cur = 0;
                          for (const t of tradingStats.trades || []) {
                            if (t.profit < 0) cur++; else cur = 0;
                            if (cur > max) max = cur;
                          }
                          return max;
                        })()}</div>
                      </div>
                    </div>
                  )}
                  {/* Chart visualization */}
                  {tradingStats && tradingStats.trades && tradingStats.trades.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold">Profit Over Time</h4>
                      <ChartContainer config={{}}>
                        <Recharts.LineChart width={400} height={200} data={tradingStats.trades}>
                          <Recharts.XAxis dataKey="id" />
                          <Recharts.YAxis />
                          <Recharts.Tooltip />
                          <Recharts.Line type="monotone" dataKey="profit" stroke="#22c55e" />
                        </Recharts.LineChart>
                      </ChartContainer>
                    </div>
                  )}
                  <div className="mb-2">
                    <h4 className="font-semibold">Recent Trades</h4>
                    <table className="w-full text-xs">
                      <thead>
                        <tr>
                          <th>Pair</th>
                          <th>Amount</th>
                          <th>Profit</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tradingStats.trades.map((t: any) => (
                          <tr key={t.id} className={t.profit > 0 ? 'text-green-600' : 'text-red-600'}>
                            <td>{t.pair}</td>
                            <td>{t.amount}</td>
                            <td>{t.profit}</td>
                            <td>{t.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mb-2">
                    <span>Last Trade: </span>
                    <span>{tradingStats.lastTrade?.pair} ({tradingStats.lastTrade?.amount})</span>
                    <span className={tradingStats.lastTrade?.profit > 0 ? 'text-green-600' : 'text-red-600'}>
                      {tradingStats.lastTrade?.profit > 0 ? `+${tradingStats.lastTrade?.profit}` : tradingStats.lastTrade?.profit}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="devices">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">All Devices (Map & Stats)</h3>
              <DeviceMap devices={devices} />
              <div className="overflow-x-auto max-h-64 mt-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Device</th>
                      <th>Status</th>
                      <th>Last Seen</th>
                      <th>Latitude</th>
                      <th>Longitude</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((d, i) => (
                      <tr key={i} className={d.status === 'lost' ? 'text-red-600' : d.status === 'active' ? 'text-green-600' : ''}>
                        <td>{d.user}</td>
                        <td>{d.name}</td>
                        <td>{d.status}</td>
                        <td>{d.lastSeen}</td>
                        <td>{d.location.lat}</td>
                        <td>{d.location.lng}</td>
                        <td>
                          {d.status !== 'lost' && (
                            <Button size="sm" variant="destructive" onClick={() => reportDeviceLost(d.name)}>
                              Report Lost
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-gray-500 mt-2">[Admin-only] Track, filter, and manage all user devices. Lost devices are highlighted in red. Use 'Report Lost' to simulate device loss tracking.</div>
            </div>
          </TabsContent>
          <TabsContent value="extensions">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Extension/Package/Dataset Management</h3>
              <div className="flex gap-2 mb-2">
                <input
                  className="border rounded p-2 text-xs"
                  placeholder="Extension/Package name (e.g. numpy, react, vscode-ext)"
                  value={extInput}
                  onChange={e => setExtInput(e.target.value)}
                />
                <Button size="sm" onClick={() => extMgr.installExtension(extInput)} disabled={!extInput || extMgr.status === 'installing'}>
                  Install
                </Button>
                <Button size="sm" onClick={() => colab.startJob({ type: 'build', name: extInput })} disabled={!extInput || colab.jobStatus === 'running'}>
                  Build in Colab
                </Button>
              </div>
              <div className="mb-2">
                <b>Installed:</b> {extMgr.extensions.join(", ") || 'None'}
              </div>
              <div className="mb-2">
                <b>Colab Job Status:</b> {colab.jobStatus} {colab.error && <span className="text-red-500">Error: {colab.error}</span>}
              </div>
              <div className="mb-2">
                <b>AI Health:</b> {aiHealth.status} <span className="text-gray-400">(Last check: {new Date(aiHealth.lastCheck).toLocaleTimeString()})</span> {aiHealth.error && <span className="text-red-500">Error: {aiHealth.error}</span>}
              </div>
              <div className="text-xs text-gray-500 mt-2">[Admin-only] Search, install, and build extensions/packages/datasets. AI can trigger builds/installs and update QI state. All actions are logged and visible in QI analytics.</div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
