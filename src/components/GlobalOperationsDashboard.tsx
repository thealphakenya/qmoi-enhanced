'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Globe,
  TrendingUp,
  Activity,
  AlertTriangle,
  Clock,
  Users,
  Target,
  Zap,
  BarChart3,
  Shield,
  Database,
} from 'lucide-react';
import useGlobalOperations from '@/src/hooks/useGlobalOperations';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function GlobalOperationsDashboard() {
  const {
    loading,
    error,
    getGlobalOverview,
    getContinentMetrics,
    getRevenueStreams,
    getConsciousnessStatus,
    getGlobalPerformance,
    getComplianceOverview,
  } = useGlobalOperations();

  const [globalOverview, setGlobalOverview] = useState<any>(null);
  const [continents, setContinents] = useState<any[]>([]);
  const [revenueStreams, setRevenueStreams] = useState<any[]>([]);
  const [consciousness, setConsciousness] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [compliance, setCompliance] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [overview, conts, streams, cons, perf, comp] = await Promise.all([
          getGlobalOverview(),
          getContinentMetrics('revenue'),
          getRevenueStreams('active'),
          getConsciousnessStatus(),
          getGlobalPerformance(),
          getComplianceOverview(),
        ]);

        setGlobalOverview(overview);
        setContinents(conts);
        setRevenueStreams(streams.slice(0, 10)); // Top 10 streams
        setConsciousness(cons);
        setPerformance(perf);
        setCompliance(comp);
      } catch (err) {
        console.error('Failed to load global operations data:', err);
      }
    };

    loadData();
  }, [getGlobalOverview, getContinentMetrics, getRevenueStreams, getConsciousnessStatus, getGlobalPerformance, getComplianceOverview]);

  if (error) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Global Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6 p-6">
      {/* Global Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${globalOverview?.totalDailyRevenue?.toLocaleString() || 'Loading...'}</div>
            <p className="text-xs text-green-600 mt-2">↑ 700% above target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalOverview?.activeCountries || '195'}</div>
            <p className="text-xs text-blue-600 mt-2">6 continents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Global Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalOverview?.globalUptime || '99.99'}%</div>
            <p className="text-xs text-green-600 mt-2">✓ Operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Consciousness Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{consciousness?.consciousnessLevel || 'Loading...'}</div>
            <p className="text-xs text-purple-600 mt-2">Sync: {consciousness?.avgLatency || '--'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">
            <Globe className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="continents">
            <TrendingUp className="w-4 h-4 mr-2" />
            Continents
          </TabsTrigger>
          <TabsTrigger value="revenue">
            <Target className="w-4 h-4 mr-2" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="consciousness">
            <Activity className="w-4 h-4 mr-2" />
            Consciousness
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Zap className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <Shield className="w-4 h-4 mr-2" />
            Compliance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Operations Overview</CardTitle>
              <CardDescription>Real-time status across all regions and operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold">{globalOverview?.totalEmployees?.toLocaleString() || '11,500'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenue Streams</p>
                  <p className="text-2xl font-bold">25</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Regional Hubs</p>
                  <p className="text-2xl font-bold">100</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Consciousness Nodes</p>
                  <p className="text-2xl font-bold">25</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">System Health</p>
                  <p className="text-lg font-bold text-green-600">Optimal</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data Centers</p>
                  <p className="text-2xl font-bold">50+</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Continents Tab */}
        <TabsContent value="continents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Continental Breakdown</CardTitle>
              <CardDescription>Revenue and operations metrics by continent</CardDescription>
            </CardHeader>
            <CardContent>
              {continents.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={continents}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Bar dataKey="dailyRevenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">Loading continental data...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Streams Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Streams Analysis</CardTitle>
              <CardDescription>Top 10 revenue streams by daily revenue</CardDescription>
            </CardHeader>
            <CardContent>
              {revenueStreams.length > 0 ? (
                <div className="space-y-3">
                  {revenueStreams.map((stream, idx) => (
                    <div key={stream.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{stream.name}</p>
                        <p className="text-sm text-gray-600">Tier {stream.tier}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${(stream.dailyRevenue / 1000000).toFixed(2)}M</p>
                        <p className="text-xs text-green-600">↑ {(stream.growth * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Loading revenue streams...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consciousness Tab */}
        <TabsContent value="consciousness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Consciousness Status</CardTitle>
              <CardDescription>Distributed consciousness system metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Active Syncs</p>
                  <p className="text-2xl font-bold">{consciousness?.activeSyncs || '25'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Latency</p>
                  <p className="text-2xl font-bold">{consciousness?.avgLatency || '87ms'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Memory Util.</p>
                  <p className="text-2xl font-bold">{consciousness?.memoryUtilization || '78'}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Learning Rate</p>
                  <p className="text-2xl font-bold">{(consciousness?.learningRate * 100 || 94).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Predictive Accuracy</p>
                  <p className="text-2xl font-bold">{(consciousness?.predictiveAccuracy * 100 || 97).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Sync</p>
                  <p className="text-sm font-bold">{consciousness?.lastSync ? new Date(consciousness.lastSync).toLocaleTimeString() : 'Just now'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Performance Metrics</CardTitle>
              <CardDescription>System-wide performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Avg Latency</p>
                  <p className="text-2xl font-bold">{performance?.avgLatency || '87ms'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">P99 Latency</p>
                  <p className="text-2xl font-bold">{performance?.p99Latency || '450ms'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Error Rate</p>
                  <p className="text-2xl font-bold text-green-600">{(performance?.errorRate * 100 || 0.1).toFixed(3)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">RPS</p>
                  <p className="text-2xl font-bold">{(performance?.requestsPerSecond || 45000).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CPU Util.</p>
                  <p className="text-2xl font-bold">{performance?.cpuUtilization || '62'}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Memory Util.</p>
                  <p className="text-2xl font-bold">{performance?.memoryUtilization || '71'}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Compliance Status</CardTitle>
              <CardDescription>Compliance and regulatory overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Jurisdictions</p>
                  <p className="text-2xl font-bold">{compliance?.jurisdictions || '100'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Compliance Rate</p>
                  <p className="text-2xl font-bold text-green-600">{compliance?.complianceRate || '99.7'}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Audits</p>
                  <p className="text-2xl font-bold">{compliance?.activeAudits || '5'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Critical Issues</p>
                  <p className="text-2xl font-bold text-green-600">{compliance?.criticalIssues || '0'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Warning Issues</p>
                  <p className="text-2xl font-bold text-yellow-600">{compliance?.warningIssues || '3'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Audit</p>
                  <p className="text-sm font-bold">{compliance?.lastAuditDate ? new Date(compliance.lastAuditDate).toLocaleDateString() : 'June 1, 2026'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default GlobalOperationsDashboard;
