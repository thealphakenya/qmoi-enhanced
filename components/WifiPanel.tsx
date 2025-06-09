import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface WifiNetwork {
  ssid: string;
  signal: number;
  secure: boolean;
  connected: boolean;
  priority?: number;
}

interface WifiPanelProps {
  onClose: () => void;
}

export function WifiPanel({ onClose }: WifiPanelProps) {
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoConnect, setAutoConnect] = useState(true);
  const [priorities, setPriorities] = useState<{ [ssid: string]: number }>({});
  const [activeTab, setActiveTab] = useState('wifi');
  const [passwords, setPasswords] = useState<{ [ssid: string]: string }>({});
  const [logs, setLogs] = useState<string[]>([]);
  const [logFilter, setLogFilter] = useState('');
  const [monitorStatus, setMonitorStatus] = useState<{ enabled: boolean; interval: number; last_result: any } | null>(null);
  const [monitorInterval, setMonitorInterval] = useState(60);
  const [analytics, setAnalytics] = useState<{ total_events: number; unique_ips: number; top_ips: [string, number][] } | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [hourlyAnalytics, setHourlyAnalytics] = useState<{ [hour: string]: number } | null>(null);
  const { toast } = useToast();

  // Load priorities from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wifiPriorities');
    if (saved) setPriorities(JSON.parse(saved));
  }, []);

  // Save priorities to localStorage when changed
  useEffect(() => {
    localStorage.setItem('wifiPriorities', JSON.stringify(priorities));
  }, [priorities]);

  // Load logs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wifiSecurityLogs');
    if (saved) setLogs(JSON.parse(saved));
  }, []);

  // Save logs to localStorage when changed
  useEffect(() => {
    localStorage.setItem('wifiSecurityLogs', JSON.stringify(logs));
  }, [logs]);

  // Fetch available networks from backend
  const fetchNetworks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/wifi');
      if (!res.ok) throw new Error('Failed to scan networks. Please check your Wi-Fi adapter.');
      const data = await res.json();
      if (data.networks) {
        setNetworks(data.networks);
        const connectedNet = data.networks.find((n: WifiNetwork) => n.connected);
        setConnected(connectedNet ? connectedNet.ssid : null);
      } else {
        setNetworks([]);
        setConnected(null);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to scan networks.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNetworks();
    // Auto-connect to best network when enabled or on refresh
    if (autoConnect && networks.length > 0) {
      // Find the highest-priority available network not already connected
      const sorted = [...networks].sort((a, b) => (priorities[b.ssid] || 1) - (priorities[a.ssid] || 1));
      const best = sorted.find(n => !n.connected);
      if (best && (!connected || best.ssid !== connected)) {
        handleConnect(best.ssid);
      }
    }
    // eslint-disable-next-line
  }, [networks, autoConnect, priorities]);

  const handleConnect = async (ssid: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/wifi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ssid, password: passwords[ssid] || '' })
      });
      const data = await res.json();
      if (data.success) {
        setConnected(ssid);
        setNetworks(nets => nets.map(n => ({ ...n, connected: n.ssid === ssid })));
      } else {
        setError(data.error || 'Failed to connect. Please check your password and try again.');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to connect. Please check your network and try again.');
    }
    setLoading(false);
  };

  const handlePriorityChange = (ssid: string, value: number) => {
    setPriorities(p => ({ ...p, [ssid]: value }));
  };

  const handlePasswordChange = (ssid: string, value: string) => {
    setPasswords(p => ({ ...p, [ssid]: value }));
  };

  // Helper to add a log entry
  const addLog = (entry: string) => {
    setLogs(l => [
      `${new Date().toLocaleString()}: ${entry}`,
      ...l.slice(0, 99) // keep last 100 logs
    ]);
  };

  // Fetch monitoring status on mount and every 10s if enabled
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    const fetchStatus = async () => {
      try {
        const res = await fetch('http://localhost:5001/monitor/status');
        const data = await res.json();
        setMonitorStatus(data);
      } catch {}
    };
    fetchStatus();
    if (monitorStatus?.enabled) {
      intervalId = setInterval(fetchStatus, 10000);
    }
    return () => { if (intervalId) clearInterval(intervalId); };
    // eslint-disable-next-line
  }, [monitorStatus?.enabled]);

  const startMonitoring = async () => {
    setLoading(true);
    setError(null);
    try {
      const monitorRes = await fetch('http://localhost:5001/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enable: true, interval: monitorInterval })
      });
      const monitorData = await monitorRes.json();
      addLog(`Monitoring started: every ${monitorInterval}s`);
      setMonitorStatus(s => ({ ...s, enabled: true, interval: monitorInterval, last_result: null }));
    } catch (e: any) {
      setError('Failed to start monitoring.');
      addLog('Failed to start monitoring.');
    }
    setLoading(false);
  };

  const stopMonitoring = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch('http://localhost:5001/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enable: false })
      });
      addLog('Monitoring stopped.');
      setMonitorStatus(s => s ? { ...s, enabled: false } : { enabled: false, interval: monitorInterval, last_result: null });
    } catch (e: any) {
      setError('Failed to stop monitoring.');
      addLog('Failed to stop monitoring.');
    }
    setLoading(false);
  };

  // Notify on anomaly detection in monitoring
  useEffect(() => {
    if (monitorStatus?.last_result && monitorStatus.last_result.anomaly) {
      toast({
        title: "Security Alert: Anomaly Detected!",
        description: monitorStatus.last_result.msg || "Anomaly detected in login attempts.",
        variant: "destructive"
      });
    }
  }, [monitorStatus?.last_result, toast]);

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const res = await fetch('http://localhost:5001/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch {}
  };

  // Fetch hourly analytics
  const fetchHourlyAnalytics = async () => {
    try {
      const res = await fetch('http://localhost:5001/analytics/hourly');
      const data = await res.json();
      setHourlyAnalytics(data);
    } catch {}
  };

  // Export analytics as CSV
  const exportAnalytics = () => {
    window.open('http://localhost:5001/export-analytics', '_blank');
  };

  // Send alert to external system
  const sendAlert = async (msg: string) => {
    if (!webhookUrl) return;
    try {
      await fetch('http://localhost:5001/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, webhook: webhookUrl })
      });
      toast({ title: 'Alert sent to external system.' });
    } catch {
      toast({ title: 'Failed to send alert.', variant: 'destructive' });
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-2">
        <TabsTrigger value="wifi">Wi-Fi</TabsTrigger>
        <TabsTrigger value="security">Security/AI</TabsTrigger>
      </TabsList>
      <TabsContent value="wifi">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Wi-Fi Networks</span>
          <Button size="sm" variant="outline" onClick={fetchNetworks} disabled={loading}>Refresh</Button>
        </div>
        {loading && <div>Scanning...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <ul className="mb-4">
          {networks.map(net => (
            <li key={net.ssid} className={`flex items-center justify-between py-1 ${net.connected ? 'font-bold text-green-600' : ''}`}>
              <span>{net.ssid} {net.secure ? '🔒' : '🔓'} ({net.signal}%)</span>
              <div className="flex gap-2 items-center">
                <Input
                  type={net.secure ? 'password' : 'text'}
                  placeholder={net.secure ? 'Password' : 'No password'}
                  value={passwords[net.ssid] || ''}
                  onChange={e => handlePasswordChange(net.ssid, e.target.value)}
                  disabled={!net.secure || net.connected}
                  className="w-24"
                />
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={priorities[net.ssid] || 1}
                  onChange={e => handlePriorityChange(net.ssid, Number(e.target.value))}
                  className="w-14"
                  title="Priority"
                  disabled={net.connected}
                />
                {net.connected ? (
                  <span>Connected</span>
                ) : (
                  <Button size="sm" onClick={() => handleConnect(net.ssid)} disabled={loading}>Connect</Button>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 mb-2">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={autoConnect} onChange={e => setAutoConnect(e.target.checked)} />
            Auto-connect to best network
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </TabsContent>
      <TabsContent value="security">
        <div className="mb-2 font-semibold">Security & AI Tools</div>
        <div className="mb-2 flex gap-2">
          <Button size="sm" variant="outline" onClick={fetchAnalytics}>Show Analytics</Button>
          <Button size="sm" variant="outline" onClick={fetchHourlyAnalytics}>Show Hourly Analytics</Button>
          <Button size="sm" variant="outline" onClick={exportAnalytics}>Export Analytics (CSV)</Button>
          <Input
            type="text"
            placeholder="Webhook URL (Slack, etc)"
            value={webhookUrl}
            onChange={e => setWebhookUrl(e.target.value)}
            className="h-7 w-64 text-xs"
          />
          <Button size="sm" variant="outline" onClick={() => sendAlert('Security anomaly detected!')} disabled={!webhookUrl}>Send Test Alert</Button>
        </div>
        {analytics && (
          <div className="mb-2 text-xs bg-gray-50 rounded p-2">
            <div><b>Total Events:</b> {analytics.total_events}</div>
            <div><b>Unique IPs:</b> {analytics.unique_ips}</div>
            <div><b>Top IPs:</b>
              <ul className="ml-2">
                {analytics.top_ips.map(([ip, count]) => (
                  <li key={ip}>{ip}: {count}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {hourlyAnalytics && (
          <div className="mb-2 text-xs bg-gray-50 rounded p-2">
            <div><b>Failed Logins Per Hour:</b></div>
            <ul className="ml-2">
              {Object.entries(hourlyAnalytics).map(([hour, count]) => (
                <li key={hour}>{hour}: {count}</li>
              ))}
            </ul>
          </div>
        )}
        <ul className="list-disc pl-4 space-y-2">
          <li>Wi-Fi Network Security Testing (with permission): <Button size="sm" variant="outline" onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              const res = await fetch('/api/wifi-security?action=security-test');
              const data = await res.json();
              if (data.networks) {
                const msg = 'Scan complete.\n' + data.networks.map((n: any) => `${n.ssid}: ${n.encryption}`).join('\n');
                alert(msg);
                addLog(msg);
              } else {
                alert(data.result);
                addLog(data.result);
              }
            } catch (e: any) {
              setError('Security test failed.');
              addLog('Security test failed.');
            }
            setLoading(false);
          }}>Start Test</Button></li>
          <li>Device Hardening via AI:
            <div className="flex gap-2 items-center mt-1">
              <Button size="sm" variant="outline" onClick={startMonitoring} disabled={monitorStatus?.enabled || loading}>Start Monitoring</Button>
              <Button size="sm" variant="outline" onClick={stopMonitoring} disabled={!monitorStatus?.enabled || loading}>Stop Monitoring</Button>
              <Input
                type="number"
                min={10}
                max={3600}
                value={monitorInterval}
                onChange={e => setMonitorInterval(Number(e.target.value))}
                className="h-7 w-20 text-xs"
                disabled={monitorStatus?.enabled}
                title="Interval (seconds)"
              />
              <span className="text-xs text-gray-500">Interval (s)</span>
              {monitorStatus && (
                <span className={`text-xs ml-2 ${monitorStatus.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                  {monitorStatus.enabled ? `Active (every ${monitorStatus.interval}s)` : 'Inactive'}
                </span>
              )}
            </div>
            {monitorStatus?.last_result && (
              <div className="text-xs mt-1">
                <span className="font-semibold">Last result: </span>
                {monitorStatus.last_result.anomaly ? (
                  <span className="text-red-600">Anomaly detected! {monitorStatus.last_result.msg}</span>
                ) : (
                  <span className="text-green-600">No anomaly</span>
                )}
                {/* Advanced analytics: show per-IP attempts if available */}
                {monitorStatus.last_result.ip_counts && (
                  <div className="mt-1">
                    <span className="font-semibold">Attempts per IP:</span>
                    <ul className="ml-2">
                      {Object.entries(monitorStatus.last_result.ip_counts).map(([ip, count]) => (
                        <li key={ip}>{ip}: {String(count)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </li>
          <li>AI-Powered Network Scanner: <Button size="sm" variant="outline" onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              const res = await fetch('/api/wifi-security?action=network-scan');
              const data = await res.json();
              if (data.hosts) {
                const msg = 'Hosts found:\n' + data.hosts.join('\n');
                alert(msg);
                addLog(msg);
              } else {
                alert(data.result);
                addLog(data.result);
              }
            } catch (e: any) {
              setError('Network scan failed.');
              addLog('Network scan failed.');
            }
            setLoading(false);
          }}>Scan Network</Button></li>
          <li>Wireless Signal Analysis: <Button size="sm" variant="outline" onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              const res = await fetch('/api/wifi-security?action=signal-analysis');
              const data = await res.json();
              if (data.signals) {
                const msg = 'Signals:\n' + data.signals.map((s: any) => `${s.ssid}: ${s.signal}`).join('\n');
                alert(msg);
                addLog(msg);
              } else {
                alert(data.result);
                addLog(data.result);
              }
            } catch (e: any) {
              setError('Signal analysis failed.');
              addLog('Signal analysis failed.');
            }
            setLoading(false);
          }}>Analyze Signals</Button></li>
          <li>IoT Vulnerability Scanner: <Button size="sm" variant="outline" onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              const res = await fetch('/api/wifi-security?action=iot-scan');
              const data = await res.json();
              if (data.risks && data.risks.length > 0) {
                const msg = 'IoT Risks:\n' + data.risks.map((r: any) => `${r.host}: ${r.open}`).join('\n');
                alert(msg);
                addLog(msg);
              } else {
                alert(data.result);
                addLog(data.result);
              }
            } catch (e: any) {
              setError('IoT scan failed.');
              addLog('IoT scan failed.');
            }
            setLoading(false);
          }}>Scan IoT</Button></li>
          <li>Secure AI Agents: <Button size="sm" variant="outline" onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              const res = await fetch('/api/wifi-security?action=ai-agents');
              const data = await res.json();
              alert(data.result);
              addLog(data.result);
            } catch (e: any) {
              setError('AI agent activation failed.');
              addLog('AI agent activation failed.');
            }
            setLoading(false);
          }}>Activate Agents</Button></li>
        </ul>
        <div className="text-xs text-gray-500 mt-2">* All tools require user consent and are for legal, educational, or authorized use only.</div>
        <div className="mt-4">
          <div className="font-semibold mb-1 flex items-center gap-2">
            Security/AI Logs
            <Button size="sm" variant="outline" onClick={() => setLogs([])}>Clear Logs</Button>
            <Button size="sm" variant="outline" onClick={() => {
              const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `wifi-security-logs-${new Date().toISOString().slice(0,10)}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}>Export Logs</Button>
            <Input
              type="text"
              placeholder="Filter logs..."
              value={logFilter}
              onChange={e => setLogFilter(e.target.value)}
              className="h-7 w-32 text-xs"
            />
          </div>
          <div className="bg-gray-100 rounded p-2 h-32 overflow-auto text-xs">
            {logs.length === 0 ? <span className="text-gray-400">No logs yet.</span> :
              logs.filter(log => log.toLowerCase().includes(logFilter.toLowerCase())).length === 0 ?
                <span className="text-gray-400">No logs match filter.</span> :
                logs.filter(log => log.toLowerCase().includes(logFilter.toLowerCase())).map((log, i) => <div key={i}>{log}</div>)}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
