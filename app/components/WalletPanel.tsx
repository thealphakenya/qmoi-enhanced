"use client";
import { useEffect, useMemo, useState } from "react";
interface WalletSummary {
  id: string;
  currency: string;
  balance: number;
  transactionCount: number;
  status: string;
  createdAt: string;
}
interface WalletOverview {
  totalWallets: number;
  totalBalance: number;
  currencyDistribution: Record<string, {
    currency: string;
    walletCount: number;
    totalBalance: number;
    averageBalance: number;
  }>;
  walletUtilization: number;
  transactionStats: {
    totalTransactions: number;
    averageTransactionSize: number;
  };
}
interface WalletGrowth {
  newWalletsLast30Days: number;
  transactionsLast30Days: number;
}
interface WalletAnalyticsResponse {
  analytics: {
    overview: WalletOverview;
    growth: WalletGrowth;
    wallets: WalletSummary[];
  };
}
const formatCurrency = (value: number, currency = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
};
const formatPercent = (value: number) => `${value.toFixed(1)}%`;
export default function WalletPanel() {
  const [analytics, setAnalytics] = useState<WalletAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchWalletAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analytics/wallets", {
        cache: "no-store",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok || !data?.analytics) {
        const message = data?.error || data?._error?.message || "Unable to load wallet analytics.";
        setError(message);
        setAnalytics(null);
        return;
      }
      setAnalytics(data as WalletAnalyticsResponse);
    } catch (fetchError) {
      setError("Failed to load wallet analytics. Please sign in or try again later.");
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWalletAnalytics();
  }, []);
  const overview = analytics?.analytics.overview;
  const growth = analytics?.analytics.growth;
  const wallets = analytics?.analytics.wallets ?? [];
  const topCurrencies = useMemo(() => {
    return Object.values(overview?.currencyDistribution ?? {}).
      sort((a, b) => b.totalBalance - a.totalBalance)
      .slice(0, 3);
  }, [overview]);
  const currencyCode = wallets.length > 0 ? wallets[0].currency : "USD";
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold">Wallet Analytics</h3>
          <p className="text-slate-400">Live production wallet balances, currency distribution, and transaction activity.</p>
        </div>
        <button
          type="button"
          onClick={fetchWalletAnalytics}
          className="inline-flex items-center justify-center rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
        >
          Refresh
        </button>
      </div>
      {loading ? (
        <div className="mt-6 rounded-3xl bg-slate-950/80 p-6 text-slate-400">Loading wallet analytics...</div>
      ) : error ? (
        <div className="mt-6 rounded-3xl bg-slate-950/80 p-6 text-red-400">{error}</div>
      ) : !overview ? (
        <div className="mt-6 rounded-3xl bg-slate-950/80 p-6 text-slate-400">No wallet analytics available.</div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-3xl bg-slate-950/80 p-5">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Wallets</div>
              <div className="mt-3 text-3xl font-semibold text-white">{overview.totalWallets}</div>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-5">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Total Balance</div>
              <div className="mt-3 text-3xl font-semibold text-white">{formatCurrency(overview.totalBalance, currencyCode)}</div>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-5">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Utilization</div>
              <div className="mt-3 text-3xl font-semibold text-white">{formatPercent(overview.walletUtilization)}</div>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-5">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Transactions</div>
              <div className="mt-3 text-3xl font-semibold text-white">{overview.transactionStats.totalTransactions}</div>
            </div>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-3xl bg-slate-950/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm uppercase tracking-[0.3em] text-slate-500">Growth (30 days)</h4>
                <span className="text-xs text-slate-400">Live</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-900 p-4">
                  <div className="text-xs text-slate-500">New wallets</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{growth?.newWalletsLast30Days ?? 0}</div>
                </div>
                <div className="rounded-2xl bg-slate-900 p-4">
                  <div className="text-xs text-slate-500">Transactions</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{growth?.transactionsLast30Days ?? 0}</div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-5">
              <div className="mb-4 text-sm uppercase tracking-[0.3em] text-slate-500">Currency distribution</div>
              <div className="space-y-3">
                {topCurrencies.length > 0 ? (
                  topCurrencies.map((distribution) => (
                    <div key={distribution.currency} className="rounded-2xl bg-slate-900 p-4">
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>{distribution.currency}</span>
                        <span>{distribution.walletCount} wallets</span>
                      </div>
                      <div className="mt-2 text-lg font-semibold text-white">{formatCurrency(distribution.totalBalance, distribution.currency)}</div>
                      <div className="mt-2 h-2 rounded-full bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-violet-500"
                          style={{ width: `${((distribution.totalBalance / Math.max(overview.totalBalance, 1)) * 100).toFixed(0)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400">No currency distribution data available.</div>
                )}
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-950/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm uppercase tracking-[0.3em] text-slate-500">Top wallets</h4>
              <span className="text-xs text-slate-400">Most active balances</span>
            </div>
            <div className="space-y-3">
              {wallets.length > 0 ? (
                wallets.slice(0, 4).map((wallet) => (
                  <div key={wallet.id} className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-900 p-4">
                    <div>
                      <div className="text-sm text-slate-400">{wallet.currency}</div>
                      <div className="mt-2 text-lg font-semibold text-white">{formatCurrency(wallet.balance, wallet.currency)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Transactions</div>
                      <div className="mt-2 text-lg font-semibold text-white">{wallet.transactionCount}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400">No active wallets found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
