'use client';

import { useState, useCallback, useEffect } from 'react';
import { buildMasterHeaders, readMasterToken } from '@/app/lib/auth/master';

// Types for Global Operations API responses
interface GlobalOverview {
  totalDailyRevenue: number;
  activeCountries: number;
  totalEmployees: number;
  consciousnessStatus: string;
  globalUptime: number;
  continentMetrics: Record<string, any>;
  topRevenueStreams: string[];
  systemHealth: string;
  timestamp: string;
}

interface ContinentMetrics {
  name: string;
  dailyRevenue: number;
  userCount: number;
  regionalHubs: number;
  uptime: number;
  topStreams: string[];
}

interface RevenueStream {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  dailyRevenue: number;
  status: 'operational' | 'maintenance' | 'pending' | 'paused';
  growth: number;
  clients?: number;
}

interface RegionalHub {
  region: string;
  location: string;
  employees: number;
  monthlyRevenue: number;
  operationalStatus: string;
  activeProjects: number;
  complianceStatus: string;
  uptime: number;
}

interface ConsciousnessStatus {
  consciousnessLevel: string;
  activeSyncs: number;
  avgLatency: string;
  memoryUtilization: number;
  learningRate: number;
  predictiveAccuracy: number;
  lastSync: string;
}

interface PerformanceMetrics {
  avgLatency: string;
  p99Latency: string;
  errorRate: number;
  requestsPerSecond: number;
  cpuUtilization: number;
  memoryUtilization: number;
  bandwidthUtilization: number;
}

interface ComplianceOverview {
  jurisdictions: number;
  complianceRate: number;
  activeAudits: number;
  criticalIssues: number;
  warningIssues: number;
  lastAuditDate: string;
}

// Global Operations Hooks
export const useGlobalOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = readMasterToken();

  const api = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api${endpoint}`, {
          ...options,
          headers: {
            ...buildMasterHeaders(token),
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `API error: ${response.status}`);
        }

        return await response.json();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Global Overview Operations
  const getGlobalOverview = useCallback(async (): Promise<GlobalOverview> => {
    return api('/global/overview');
  }, [api]);

  const getContinentMetrics = useCallback(
    async (sort: 'revenue' | 'users' | 'health' = 'revenue'): Promise<ContinentMetrics[]> => {
      return api(`/global/continents?sort=${sort}&include=details`);
    },
    [api]
  );

  const getGlobalHealthStatus = useCallback(async () => {
    return api('/global/health-status');
  }, [api]);

  // Revenue Stream Operations
  const getRevenueStreams = useCallback(
    async (status: string = 'active', tier?: 1 | 2 | 3): Promise<RevenueStream[]> => {
      const params = new URLSearchParams();
      params.append('status', status);
      if (tier) params.append('tier', tier.toString());
      return api(`/revenue-streams?${params.toString()}`);
    },
    [api]
  );

  const getRevenueStreamDetails = useCallback(
    async (streamId: string): Promise<RevenueStream & { expansion: any; risks: any }> => {
      return api(`/revenue-streams/${streamId}`);
    },
    [api]
  );

  const adjustRevenueStream = useCallback(
    async (streamId: string, parameter: string, value: any, reason: string) => {
      return api(`/revenue-streams/${streamId}/adjust`, {
        method: 'POST',
        body: JSON.stringify({
          parameter,
          value,
          reason,
          effectiveDate: new Date().toISOString(),
        }),
      });
    },
    [api]
  );

  const getRevenueStreamForecast = useCallback(
    async (streamId: string, days: 30 | 90 | 365 = 90) => {
      return api(
        `/revenue-streams/${streamId}/forecast?days=${days}&includeScenarios=true&confidence=0.9`
      );
    },
    [api]
  );

  // Regional Hub Operations
  const getRegionalHubs = useCallback(
    async (continent?: string, sortBy: string = 'revenue'): Promise<RegionalHub[]> => {
      const params = new URLSearchParams();
      if (continent) params.append('continent', continent);
      params.append('sortBy', sortBy);
      return api(`/hubs?${params.toString()}`);
    },
    [api]
  );

  const getRegionalHubDetails = useCallback(
    async (region: string): Promise<RegionalHub & { projects: any; compliance: any }> => {
      return api(`/hubs/${region}`);
    },
    [api]
  );

  const allocateHubResources = useCallback(
    async (
      region: string,
      budget: number,
      headcount: number,
      projects: string[],
      priorityLevel: 1 | 2 | 3 | 4 | 5
    ) => {
      return api(`/hubs/${region}/allocate-resources`, {
        method: 'POST',
        body: JSON.stringify({
          budget,
          headcount,
          projects,
          priorityLevel,
        }),
      });
    },
    [api]
  );

  const getHubPerformance = useCallback(
    async (region: string, period: 'daily' | 'weekly' | 'monthly' | 'quarterly' = 'monthly') => {
      return api(`/hubs/${region}/performance?period=${period}`);
    },
    [api]
  );

  // Consciousness Operations
  const getConsciousnessStatus = useCallback(async (): Promise<ConsciousnessStatus> => {
    return api('/consciousness/status');
  }, [api]);

  const getConsciousnessHubs = useCallback(async () => {
    return api('/consciousness/hubs');
  }, [api]);

  const triggerConsciousnessSync = useCallback(
    async (priority: 'high' | 'normal' | 'low' = 'normal', includeMemoryMerge = true) => {
      return api('/consciousness/trigger-sync', {
        method: 'POST',
        body: JSON.stringify({
          priority,
          includeMemoryMerge,
          timeout: 300,
        }),
      });
    },
    [api]
  );

  const getConsciousnessMemory = useCallback(
    async (
      category: 'market' | 'operational' | 'learning' | 'strategic' = 'operational',
      timeRange: 'last-24h' | 'last-week' | 'last-month' = 'last-24h'
    ) => {
      return api(
        `/consciousness/memory?category=${category}&timeRange=${timeRange}&limit=100`
      );
    },
    [api]
  );

  const optimizeConsciousness = useCallback(
    async (
      optimizationType: 'neural' | 'memory' | 'sync' | 'all' = 'all',
      targetMetric: 'latency' | 'accuracy' | 'throughput' = 'latency'
    ) => {
      return api('/consciousness/optimize', {
        method: 'POST',
        body: JSON.stringify({
          optimizationType,
          targetMetric,
          duration: 60,
        }),
      });
    },
    [api]
  );

  // Currency Operations
  const getCurrencies = useCallback(async () => {
    return api('/currencies');
  }, [api]);

  const getCurrencyHistorical = useCallback(
    async (code: string, days: 90 | 365 = 90, granularity: 'hourly' | 'daily' = 'daily') => {
      return api(`/currencies/${code}/historical?days=${days}&granularity=${granularity}`);
    },
    [api]
  );

  const convertCurrency = useCallback(
    async (amount: number, fromCurrency: string, toCurrency: string) => {
      return api('/currencies/convert', {
        method: 'POST',
        body: JSON.stringify({
          amount,
          fromCurrency,
          toCurrency,
        }),
      });
    },
    [api]
  );

  const getLanguages = useCallback(async () => {
    return api('/languages');
  }, [api]);

  // Compliance Operations
  const getComplianceOverview = useCallback(async (): Promise<ComplianceOverview> => {
    return api('/compliance/overview');
  }, [api]);

  const getJurisdictionCompliance = useCallback(
    async (jurisdiction: string) => {
      return api(`/compliance/${jurisdiction}`);
    },
    [api]
  );

  const triggerComplianceAudit = useCallback(
    async (scope: 'worldwide' | 'continent' | 'country' | 'hub', target: string, priority: 1 | 2 | 3 | 4 | 5 = 3) => {
      return api('/compliance/audit', {
        method: 'POST',
        body: JSON.stringify({
          scope,
          target,
          priority,
        }),
      });
    },
    [api]
  );

  const getSecurityThreats = useCallback(async () => {
    return api('/security/threats');
  }, [api]);

  // Performance Operations
  const getGlobalPerformance = useCallback(async (): Promise<PerformanceMetrics> => {
    return api('/performance/global');
  }, [api]);

  const getRegionalPerformance = useCallback(
    async (region: string): Promise<PerformanceMetrics> => {
      return api(`/performance/${region}`);
    },
    [api]
  );

  const triggerAutoScale = useCallback(
    async (
      region: string = 'all',
      targetUtilization: number = 70,
      duration: 'temporary' | 'permanent' = 'temporary'
    ) => {
      return api('/optimization/auto-scale', {
        method: 'POST',
        body: JSON.stringify({
          region,
          targetUtilization,
          duration,
        }),
      });
    },
    [api]
  );

  // Analytics Operations
  const getRevenueAnalytics = useCallback(
    async (
      period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' = 'daily',
      breakdownBy: 'stream' | 'continent' | 'hub' = 'stream'
    ) => {
      return api(`/analytics/revenue?period=${period}&breakdownBy=${breakdownBy}`);
    },
    [api]
  );

  const getUserAnalytics = useCallback(
    async (
      period: 'daily' | 'weekly' | 'monthly' = 'daily',
      metrics: string = 'retention,acquisition,churn,engagement'
    ) => {
      return api(`/analytics/users?period=${period}&metrics=${metrics}`);
    },
    [api]
  );

  const getMarketAnalytics = useCallback(
    async (region?: string, includeForecasts = true) => {
      const params = new URLSearchParams();
      if (region) params.append('region', region);
      params.append('includeForecasts', includeForecasts.toString());
      return api(`/analytics/markets?${params.toString()}`);
    },
    [api]
  );

  const generateReport = useCallback(
    async (
      reportType: 'strategic' | 'operational' | 'financial' | 'compliance' | 'comprehensive',
      scope: 'worldwide' | 'continent' | 'region',
      includeForecasts = true,
      format: 'json' | 'pdf' = 'json'
    ) => {
      return api('/reports/generate', {
        method: 'POST',
        body: JSON.stringify({
          reportType,
          scope,
          includeForecasts,
          format,
        }),
      });
    },
    [api]
  );

  // Advanced Operations
  const executeStrategy = useCallback(
    async (strategyId: string, regions: string[] = ['all'], dryRun = false) => {
      return api('/operations/execute-strategy', {
        method: 'POST',
        body: JSON.stringify({
          strategyId,
          startDate: new Date().toISOString(),
          regions,
          dryRun,
        }),
      });
    },
    [api]
  );

  const triggerEmergencyResponse = useCallback(
    async (
      incidentType: 'outage' | 'security' | 'compliance' | 'market',
      severity: 1 | 2 | 3 | 4 | 5,
      affectedRegions: string[] = []
    ) => {
      return api('/operations/emergency-response', {
        method: 'POST',
        body: JSON.stringify({
          incidentType,
          severity,
          affectedRegions,
          immediateActions: [],
        }),
      });
    },
    [api]
  );

  const getOperationAuditLog = useCallback(
    async (
      startDate?: string,
      endDate?: string,
      actionType?: string,
      limit: number = 10000
    ) => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (actionType) params.append('actionType', actionType);
      params.append('limit', limit.toString());
      return api(`/operations/audit-log?${params.toString()}`);
    },
    [api]
  );

  return {
    loading,
    error,
    // Global Overview
    getGlobalOverview,
    getContinentMetrics,
    getGlobalHealthStatus,
    // Revenue Streams
    getRevenueStreams,
    getRevenueStreamDetails,
    adjustRevenueStream,
    getRevenueStreamForecast,
    // Regional Hubs
    getRegionalHubs,
    getRegionalHubDetails,
    allocateHubResources,
    getHubPerformance,
    // Consciousness
    getConsciousnessStatus,
    getConsciousnessHubs,
    triggerConsciousnessSync,
    getConsciousnessMemory,
    optimizeConsciousness,
    // Currency & Languages
    getCurrencies,
    getCurrencyHistorical,
    convertCurrency,
    getLanguages,
    // Compliance & Security
    getComplianceOverview,
    getJurisdictionCompliance,
    triggerComplianceAudit,
    getSecurityThreats,
    // Performance
    getGlobalPerformance,
    getRegionalPerformance,
    triggerAutoScale,
    // Analytics
    getRevenueAnalytics,
    getUserAnalytics,
    getMarketAnalytics,
    generateReport,
    // Advanced Operations
    executeStrategy,
    triggerEmergencyResponse,
    getOperationAuditLog,
  };
};

export default useGlobalOperations;
