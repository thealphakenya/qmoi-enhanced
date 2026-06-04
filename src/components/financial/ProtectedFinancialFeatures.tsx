/**
 * Protected Financial Features React Component
 * Provides master-only UI components for all financial operations
 */
import React, { useState, useEffect } from "react";
import {
  isMasterUser,
  useMasterAccess,
  FinancialAuditLog,
  MasterOnly,
} from "@/utils/master-access-control";
import { log } from "@/lib/logger";
/**
 * Access denied fallback component
 */
export const AccessDeniedFallback: React.FC = () => (
  <div className="p-8 bg-red-50 border-2 border-red-300 rounded-lg text-center">
    <div className="text-4xl mb-4">🔒</div>
    <h2 className="text-2xl font-bold text-red-700 mb-2">Access Restricted</h2>
    <p className="text-red-600 mb-4">
      Financial features are restricted to master users only.
    </p>
    <p className="text-sm text-red-500">
      If you believe this is an error, please contact system administrator.
    </p>
  </div>
);
/**
 * Loading state component
 */
export const LoadingState: React.FC = () => (
  <div className="p-8 text-center">
    <div className="inline-block">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    <p className="mt-4 text-gray-600">Verifying master access...</p>
  </div>
);
/**
 * Protected revenue dashboard component
 */
export const ProtectedRevenueDashboard: React.FC = () => {
  const { isMaster, loading, user } = useMasterAccess();
  const [revenueData, setRevenueData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!isMaster || !user) return;
    const fetchRevenueData = async () => {
      try {
        const response = await fetch("/api/revenue/validate", {
          headers: {
            "x-user": JSON.stringify(user),
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch revenue data");
        }
        const data = await response.json();
        setRevenueData(data);
        // Log access
        await FinancialAuditLog.logOperation(
          user.id,
          "validate",
          {
            revenue: data.current_revenue || 0,
            sources: Object.keys(data.revenue_sources || {}),
          },
          "success"
        );
      } catch (err) {
        const errorDetails = err instanceof Error ? err : { message: String(err) };
        setError(err instanceof Error ? err.message : "Unknown error");
        log.error("Failed to fetch revenue data:", errorDetails);
      }
    };
    fetchRevenueData();
  }, [isMaster, user]);
  if (loading) return <LoadingState />;
  if (!isMaster) return <AccessDeniedFallback />;
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          💰 Revenue Dashboard
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Master-only access • Last updated: {new Date().toISOString()}
        </p>
        {error ? (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        ) : revenueData ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded border border-green-200">
              <div className="text-3xl font-bold text-green-700">
                ${(revenueData.current_revenue / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">Current Revenue</div>
            </div>
            <div className="p-4 bg-blue-50 rounded border border-blue-200">
              <div className="text-3xl font-bold text-blue-700">
                {revenueData.achievement_rate?.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Achievement Rate</div>
            </div>
            <div className="p-4 bg-purple-50 rounded border border-purple-200">
              <div className="text-3xl font-bold text-purple-700">
                {Object.keys(revenueData.revenue_sources || {}).length}
              </div>
              <div className="text-sm text-gray-600">Active Sources</div>
            </div>
          </div>
        ) : (
          <div>Loading revenue data...</div>
        )}
      </div>
    </div>
  );
};
/**
 * Protected wallet manager component
 */
export const ProtectedWalletManager: React.FC = () => {
  const { isMaster, loading, user } = useMasterAccess();
  const [wallets, setWallets] = useState<any[]>([]);
  useEffect(() => {
    if (!isMaster || !user) return;
    const fetchWallets = async () => {
      try {
        const response = await fetch("/api/wallet/balance", {
          headers: {
            "x-user": JSON.stringify(user),
          },
        });
        const data = await response.json();
        setWallets(data.wallets || []);
        await FinancialAuditLog.logOperation(user.id, "wallet_view", {
          walletCount: data.wallets?.length || 0,
        });
      } catch (err) {
        const errorDetails = err instanceof Error ? err : { message: String(err) };
        log.error("Failed to fetch wallets:", errorDetails);
      }
    };
    fetchWallets();
  }, [isMaster, user]);
  if (loading) return <LoadingState />;
  if (!isMaster) return <AccessDeniedFallback />;
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">💳 Wallet Manager</h2>
      <p className="text-sm text-gray-500 mb-4">
        Master-only access • Manage multi-currency wallets
      </p>
      <div className="space-y-3">
        {wallets.length > 0 ? (
          wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="p-4 border border-gray-200 rounded flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{wallet.currency}</div>
                <div className="text-sm text-gray-600">{wallet.address}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">${wallet.balance}</div>
                <div className="text-sm text-gray-600">Balance</div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No wallets configured</p>
        )}
      </div>
    </div>
  );
};
/**
 * Protected transaction history component
 */
export const ProtectedTransactionHistory: React.FC = () => {
  const { isMaster, loading, user } = useMasterAccess();
  const [transactions, setTransactions] = useState<any[]>([]);
  useEffect(() => {
    if (!isMaster || !user) return;
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions/all", {
          headers: {
            "x-user": JSON.stringify(user),
          },
        });
        const data = await response.json();
        setTransactions(data.transactions || []);
      } catch (err) {
        const errorDetails = err instanceof Error ? err : { message: String(err) };
        log.error("Failed to fetch transactions:", errorDetails);
      }
    };
    fetchTransactions();
  }, [isMaster, user]);
  if (loading) return <LoadingState />;
  if (!isMaster) return <AccessDeniedFallback />;
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        📋 Transaction History
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Master-only access • Complete audit trail
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.slice(0, 10).map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{new Date(tx.timestamp).toLocaleString()}</td>
                  <td className="p-3">{tx.type}</td>
                  <td className="p-3 font-semibold">${tx.amount}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        tx.status === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
/**
 * Master financial dashboard wrapper
 */
export const MasterFinancialDashboard: React.FC = () => {
  const { isMaster, loading } = useMasterAccess();
  if (loading) return <LoadingState />;
  if (!isMaster) return <AccessDeniedFallback />;
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎯 Financial Management Center
        </h1>
        <p className="text-gray-600">Master-only financial operations and monitoring</p>
      </div>
      <MasterOnly>
        <ProtectedRevenueDashboard />
        <ProtectedWalletManager />
        <ProtectedTransactionHistory />
      </MasterOnly>
    </div>
  );
};
export default {
  ProtectedRevenueDashboard,
  ProtectedWalletManager,
  ProtectedTransactionHistory,
  MasterFinancialDashboard,
  AccessDeniedFallback,
  LoadingState,
};

type ErrorBoundaryProps = {
  children?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: unknown) {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    const errorDetails = error instanceof Error ? error : { message: String(error) };
    log.error('Error caught by boundary:', errorDetails, { errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }

    return this.props.children;
  }
}
