'use client';

/**
 * Production Dashboard - Real-time trading metrics and control
 * Connects to all Cashon endpoints + monitoring service
 */

import { useEffect, useState } from 'react';
import { buildMasterHeaders, readMasterToken } from '@/app/lib/auth/master';

interface DashboardMetrics {
  trading: {
    enabled: boolean;
    activeTrades: number;
    profit: number;
  };
  wallet: {
    balance: number;
    available: number;
    reserved: number;
  };
  health: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, string>;
  };
  alerts: {
    critical: number;
    warning: number;
    info: number;
  };
}

export function ProductionDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [masterToken, setMasterToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load master token from environment or session
  useEffect(() => {
    const token = readMasterToken() || '';
    setMasterToken(token);
  }, []);

  // Fetch all metrics
  useEffect(() => {
    if (!masterToken) {
      setError('Master token required');
      setLoading(false);
      return;
    }

    const fetchMetrics = async () => {
      try {
        const headers = {
          ...buildMasterHeaders(masterToken),
          'Content-Type': 'application/json',
        };

        // Parallel fetch all endpoints
        const [
          statusRes,
          balanceRes,
          healthRes,
          alertsRes,
          signalsRes,
        ] = await Promise.all([
          fetch('/api/cashon/trading-status', { headers }),
          fetch('/api/cashon/balance', { headers }),
          fetch('/api/monitoring/health', { headers }),
          fetch('/api/monitoring/alerts', { headers }),
          fetch('/api/cashon/signals', { headers }),
        ]);

        if (!statusRes.ok || !balanceRes.ok) {
          throw new Error('Failed to fetch critical metrics');
        }

        const [statusData, balanceData, health, alerts, signals] = await Promise.all([
          statusRes.json(),
          balanceRes.json(),
          healthRes.json(),
          alertsRes.json(),
          signalsRes.json(),
        ]);

        const tradingEnabled =
          statusData?.walletStatus?.enabled ?? statusData?.traderStatus?.enabled ?? false;
        const activeTrades =
          statusData?.walletStatus?.activeTrades ?? statusData?.traderStatus?.activeTrades ?? 0;
        const profit =
          statusData?.walletStatus?.totalProfit ?? statusData?.traderStatus?.totalProfit ?? 0;

        setMetrics({
          trading: {
            enabled: tradingEnabled,
            activeTrades,
            profit,
          },
          wallet: {
            balance: balanceData?.balance ?? 0,
            available: balanceData?.available ?? 0,
            reserved: balanceData?.reserved ?? 0,
          },
          health: {
            status: health.status || 'healthy',
            services: health.services || {},
          },
          alerts: {
            critical: alerts.critical_count || 0,
            warning: alerts.count ? alerts.count - (alerts.critical_count || 0) : 0,
            info: 0,
          },
        });

        setError(null);
      } catch (err) {
        setError(`Failed to load metrics: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [masterToken]);

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!metrics) {
    return <div className="p-6 text-center">No data available</div>;
  }

  return (
    <div className="production-dashboard p-6 bg-slate-950 text-white">
      <h1 className="text-4xl font-bold mb-8">QMOI Trading Dashboard</h1>

      {/* System Health */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
          <div className="text-sm text-gray-400">System Status</div>
          <div className={`text-2xl font-bold ${
            metrics.health.status === 'healthy' ? 'text-green-500' : 
            metrics.health.status === 'degraded' ? 'text-yellow-500' : 
            'text-red-500'
          }`}>
            {metrics.health.status.toUpperCase()}
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
          <div className="text-sm text-gray-400">Trading Status</div>
          <div className={`text-2xl font-bold ${
            metrics.trading.enabled ? 'text-green-500' : 'text-gray-500'
          }`}>
            {metrics.trading.enabled ? '🟢 ACTIVE' : '🔴 INACTIVE'}
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
          <div className="text-sm text-gray-400">Active Trades</div>
          <div className="text-2xl font-bold text-blue-400">
            {metrics.trading.activeTrades}
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
          <div className="text-sm text-gray-400">Total Profit</div>
          <div className={`text-2xl font-bold ${
            metrics.trading.profit >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            ${metrics.trading.profit.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Wallet Status */}
      <div className="mb-8 p-6 bg-slate-900 rounded-lg border border-slate-800">
        <h2 className="text-xl font-semibold mb-4">💰 Wallet Status</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-400">Total Balance</div>
            <div className="text-3xl font-bold text-green-500">
              ${metrics.wallet.balance.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Available</div>
            <div className="text-2xl font-bold text-blue-400">
              ${metrics.wallet.available.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Reserved</div>
            <div className="text-2xl font-bold text-yellow-500">
              ${metrics.wallet.reserved.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(metrics.alerts.critical > 0 || metrics.alerts.warning > 0) && (
        <div className="mb-8 p-6 bg-slate-900 rounded-lg border border-red-800">
          <h2 className="text-xl font-semibold mb-4">🚨 Active Alerts</h2>
          <div className="grid grid-cols-3 gap-4">
            {metrics.alerts.critical > 0 && (
              <div className="p-3 bg-red-900 rounded border border-red-700">
                <div className="text-sm text-red-300">Critical</div>
                <div className="text-2xl font-bold text-red-200">
                  {metrics.alerts.critical}
                </div>
              </div>
            )}
            {metrics.alerts.warning > 0 && (
              <div className="p-3 bg-yellow-900 rounded border border-yellow-700">
                <div className="text-sm text-yellow-300">Warnings</div>
                <div className="text-2xl font-bold text-yellow-200">
                  {metrics.alerts.warning}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Service Health Details */}
      <div className="p-6 bg-slate-900 rounded-lg border border-slate-800">
        <h2 className="text-xl font-semibold mb-4">🔧 Service Status</h2>
        <div className="space-y-2">
          {Object.entries(metrics.health.services).map(([service, status]) => (
            <div key={service} className="flex justify-between items-center p-2 bg-slate-800 rounded">
              <span className="capitalize">{service.replace(/_/g, ' ')}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                status === 'healthy' ? 'bg-green-900 text-green-200' :
                status === 'degraded' ? 'bg-yellow-900 text-yellow-200' :
                'bg-red-900 text-red-200'
              }`}>
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs text-gray-500 text-center">
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
        <p>Auto-refreshes every 30 seconds</p>
      </div>
    </div>
  );
}

export default ProductionDashboard;
