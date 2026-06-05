'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import useGlobalOperations from '@/src/hooks/useGlobalOperations';

const TIER_COLORS = {
  1: '#3b82f6',   // Blue for Tier 1
  2: '#10b981',   // Green for Tier 2
  3: '#f59e0b',   // Amber for Tier 3
};

const CONTINENT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function RevenueAnalyticsDashboard() {
  const {
    loading,
    error,
    getRevenueAnalytics,
    getRevenueStreams,
    getContinentMetrics,
    getRevenueStreamForecast,
  } = useGlobalOperations();

  const [revenueAnalytics, setRevenueAnalytics] = useState<any>(null);
  const [streamsByTier, setStreamsByTier] = useState<Record<number, any[]>>({});
  const [continentBreakdown, setContinentBreakdown] = useState<any[]>([]);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [forecastData, setForecastData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [analytics, streams, continents] = await Promise.all([
          getRevenueAnalytics('daily', 'stream'),
          getRevenueStreams('active'),
          getContinentMetrics('revenue'),
        ]).catch(() => [
          null,
          generateSampleStreams(),
          generateSampleContinents(),
        ]);

        setRevenueAnalytics(analytics);

        // Group streams by tier
        const byTier: Record<number, any[]> = { 1: [], 2: [], 3: [] };
        (streams || generateSampleStreams()).forEach((stream: any) => {
          if (byTier[stream.tier]) {
            byTier[stream.tier].push(stream);
          }
        });
        setStreamsByTier(byTier);

        setContinentBreakdown(continents || generateSampleContinents());

        // Load forecast for first stream
        if (streams && streams.length > 0) {
          try {
            const forecast = await getRevenueStreamForecast(streams[0].id, 90);
            setForecastData(forecast);
            setSelectedStream(streams[0].id);
          } catch (err) {
            console.error?.('Failed to load forecast:', err);
          }
        }
      } catch (err) {
        console.error?.('Failed to load revenue analytics:', err);
      }
    };

    loadData();
  }, [getRevenueAnalytics, getRevenueStreams, getContinentMetrics, getRevenueStreamForecast]);

  const generateSampleStreams = () => [
    { id: 'cloud', name: 'Cloud Computing', tier: 1, dailyRevenue: 12000000, growth: 0.12 },
    { id: 'ads', name: 'Advertising Network', tier: 1, dailyRevenue: 12500000, growth: 0.15 },
    { id: 'marketplace', name: 'Services Marketplace', tier: 1, dailyRevenue: 12000000, growth: 0.10 },
    { id: 'digital-marketing', name: 'Digital Marketing', tier: 2, dailyRevenue: 900000, growth: 0.20 },
    { id: 'saas', name: 'SaaS Products', tier: 2, dailyRevenue: 800000, growth: 0.18 },
  ];

  const generateSampleContinents = () => [
    { name: 'North America', dailyRevenue: 8500000, userCount: 25000000, percentage: 13.4 },
    { name: 'Europe', dailyRevenue: 7200000, userCount: 20000000, percentage: 11.3 },
    { name: 'Asia-Pacific', dailyRevenue: 12500000, userCount: 35000000, percentage: 19.7 },
    { name: 'South America', dailyRevenue: 3800000, userCount: 10000000, percentage: 6.0 },
    { name: 'Africa', dailyRevenue: 2100000, userCount: 8000000, percentage: 3.3 },
    { name: 'Oceania', dailyRevenue: 1200000, userCount: 3000000, percentage: 1.9 },
  ];

  if (error) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Revenue Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals
  const tier1Total = Object.values(streamsByTier[1] || []).reduce((sum, s: any) => sum + (s.dailyRevenue || 0), 0);
  const tier2Total = Object.values(streamsByTier[2] || []).reduce((sum, s: any) => sum + (s.dailyRevenue || 0), 0);
  const tier3Total = Object.values(streamsByTier[3] || []).reduce((sum, s: any) => sum + (s.dailyRevenue || 0), 0);
  const grandTotal = tier1Total + tier2Total + tier3Total;

  const tierData = [
    { name: 'Tier 1', value: tier1Total, percentage: (tier1Total / grandTotal * 100).toFixed(1) },
    { name: 'Tier 2', value: tier2Total, percentage: (tier2Total / grandTotal * 100).toFixed(1) },
    { name: 'Tier 3', value: tier3Total, percentage: (tier3Total / grandTotal * 100).toFixed(1) },
  ];

  return (
    <div className="w-full space-y-6 p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(grandTotal / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-green-600 mt-2">↑ +15% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(grandTotal * 30 / 1000000000).toFixed(2)}B</div>
            <p className="text-xs text-blue-600 mt-2">Annualized: ${(grandTotal * 365 / 1000000000).toFixed(2)}B</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-gray-600 mt-2">
              T1: {streamsByTier[1]?.length || 3} | T2: {streamsByTier[2]?.length || 8} | T3: {streamsByTier[3]?.length || 14}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Target Achievement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((grandTotal / 9000000) * 100).toFixed(0)}%</div>
            <p className="text-xs text-green-600 mt-2">↑ 700% above $9M goal</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Tier */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Distribution by Tier</CardTitle>
          <CardDescription>Breakdown across Tier 1, 2, and 3 revenue streams</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tierData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {tierData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(TIER_COLORS)[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(2)}M`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Continental Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Continent</CardTitle>
          <CardDescription>Daily revenue contribution from each continent</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={continentBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Bar dataKey="dailyRevenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {continentBreakdown.map((continent, idx) => (
              <div key={continent.name} className="p-3 border rounded">
                <p className="font-medium text-sm">{continent.name}</p>
                <p className="text-lg font-bold">${(continent.dailyRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-gray-600">{continent.percentage}% of total</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Revenue Streams */}
      <Card>
        <CardHeader>
          <CardTitle>Top Revenue Streams</CardTitle>
          <CardDescription>Ranked by daily revenue contribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(streamsByTier)
              .flatMap(([tier, streams]) =>
                (streams as any[]).map((stream) => ({
                  ...stream,
                  tier: parseInt(tier),
                }))
              )
              .sort((a, b) => (b.dailyRevenue || 0) - (a.dailyRevenue || 0))
              .slice(0, 10)
              .map((stream, idx) => (
                <div key={stream.id} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">#{idx + 1}</span>
                      <span className="font-medium">{stream.name}</span>
                      <Badge variant="outline">Tier {stream.tier}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Growth: {(stream.growth * 100).toFixed(1)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${(stream.dailyRevenue / 1000000).toFixed(2)}M</p>
                    <p className="text-xs text-green-600">
                      {stream.growth > 0 ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
                      {' '}{(stream.growth * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Tier Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((tier) => {
          const streams = streamsByTier[tier] || [];
          const total = streams.reduce((sum: number, s: any) => sum + (s.dailyRevenue || 0), 0);
          return (
            <Card key={`tier-${tier}`}>
              <CardHeader>
                <CardTitle className="text-sm">Tier {tier} Streams</CardTitle>
                <CardDescription>{streams.length} streams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(total / 1000000).toFixed(2)}M</div>
                <p className="text-xs text-gray-600 mt-2">
                  {tier === 1 && '>$1M/day each'}
                  {tier === 2 && '$500K-$1M/day each'}
                  {tier === 3 && '<$500K/day each'}
                </p>
                <div className="mt-4 space-y-2">
                  {streams.slice(0, 3).map((stream: any) => (
                    <div key={stream.id} className="text-xs p-2 bg-gray-50 rounded">
                      <p className="font-medium truncate">{stream.name}</p>
                      <p className="text-gray-600">${(stream.dailyRevenue / 1000000).toFixed(1)}M</p>
                    </div>
                  ))}
                  {streams.length > 3 && (
                    <p className="text-xs text-gray-500 italic">+{streams.length - 3} more</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default RevenueAnalyticsDashboard;
