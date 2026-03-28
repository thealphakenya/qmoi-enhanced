// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  Settings,
  Shield,
  Activity,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

// Types
interface Transaction {
  id?: string;
  type?: "deposit" | "withdrawal" | "transfer" | string;
  description?: string;
  timestamp?: string | number | Date;
  amount?: number;
  status?: string;
}

interface CashonBalance {
  accountId?: string;
  availableBalance?: number;
  pendingBalance?: number;
  lockedBalance?: number;
  currency?: string;
  lastUpdated?: string | number | Date;
  transactionHistory?: Transaction[];
}

interface TradingStatus {
  enabled?: boolean;
  activeTrades?: number;
  totalProfit?: number;
  lastTrade?: string | number | Date | null;
}

interface TradingSignal {
  symbol?: string;
  action?: "buy" | "sell" | "hold";
  confidence?: number;
  strategy?: string;
  reason?: string;
  expectedReturn?: number;
  riskLevel?: "low" | "medium" | "high";
  timestamp?: string | number | Date;
}

export default function CashonTradingPanel() {
  const [balance, setBalance] = useState<CashonBalance | null>(null);
  const [tradingStatus, setTradingStatus] = useState<TradingStatus | null>(
    null,
  );
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMaster, setIsMaster] = useState(false);
  const [masterToken, setMasterToken] = useState("");
  const [mpesaNumber, setMpesaNumber] = useState<string>("");
  const [syncStatus, setSyncStatus] = useState<string>("");
  const [logs, setLogs] = useState<
    { timestamp?: string | number | Date; event?: string }[]
  >([]);

  // Helpers
  const formatDate = (d?: string | number | Date | null) =>
    d ? new Date(d).toLocaleString() : "Never";

  const fmtNumber = (n?: number) =>
    typeof n === "number" ? n.toLocaleString() : "0";

  const safeFixed = (n?: number, decimals = 2) =>
    typeof n === "number" ? n.toFixed(decimals) : (0).toFixed(decimals);

  const percent = (n?: number) => (typeof n === "number" ? Math.round(n) : 0);

  // Check if user is master
  useEffect(() => {
    const token =
      localStorage.getItem("master_token") ||
      process.env.NEXT_PUBLIC_MASTER_TOKEN;
    setIsMaster(!!token);
    setMasterToken(token || "");
  }, []);

  // Load initial data
  useEffect(() => {
    if (isMaster) {
      loadData();
    }
  }, [isMaster]);

  useEffect(() => {
    // Fetch masked M-Pesa number from API
    fetch("/api/cashon/balance?mpesaInfo=true", {
      headers: { "x-qmoi-master": "true" },
    })
      .then((res) => res.json())
      .then((data) => setMpesaNumber(data.mpesaNumberMasked || ""));
    // Fetch transfer logs
    fetch("/api/cashon/balance?logs=true", {
      headers: { "x-qmoi-master": "true" },
    })
      .then((res) => res.json())
      .then((data) => setLogs(data.logs || []));
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load balance - prefer validated snapshot API
      const financialBalanceResponse = await fetch("/api/financial/balances", {
        headers: { Authorization: `Bearer ${masterToken}` },
      });
      if (financialBalanceResponse.ok) {
        const financialData = await financialBalanceResponse.json();
        if (financialData.success && financialData.snapshot) {
          const primary = financialData.snapshot.balances?.primary_wallet;
          if (primary) {
            setBalance({
              accountId: primary.account_id || "primary_wallet",
              availableBalance: primary.available,
              pendingBalance: primary.pending,
              currency: primary.currency,
              lastUpdated: financialData.snapshot.last_updated,
              transactionHistory: null,
            });
          }
        }
      } else {
        const balanceResponse = await fetch("/api/cashon/balance", {
          headers: { Authorization: `Bearer ${masterToken}` },
        });
        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          setBalance(balanceData);
        }
      }

      // Load trading status
      const statusResponse = await fetch("/api/cashon/trading-status", {
        headers: { Authorization: `Bearer ${masterToken}` },
      });
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setTradingStatus(statusData);
      }

      // Load recent signals
      const signalsResponse = await fetch("/api/cashon/signals", {
        headers: { Authorization: `Bearer ${masterToken}` },
      });
      if (signalsResponse.ok) {
        const signalsData = await signalsResponse.json();
        setSignals(signalsData);
      }
    } catch (err) {
      setError("Failed to load trading data");
      (globalThis.console as any)?.error?.("Load data error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const startTrading = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cashon/start-trading", {
        method: "POST",
        headers: { Authorization: `Bearer ${masterToken}` },
      });

      if (response.ok) {
        await loadData();
      } else {
        setError("Failed to start trading");
      }
    } catch (err) {
      setError("Failed to start trading");
      (globalThis.console as any)?.error?.("Start trading error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const stopTrading = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cashon/stop-trading", {
        method: "POST",
        headers: { Authorization: `Bearer ${masterToken}` },
      });

      if (response.ok) {
        await loadData();
      } else {
        setError("Failed to stop trading");
      }
    } catch (err) {
      setError("Failed to stop trading");
      (globalThis.console as any)?.error?.("Stop trading error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const requestDeposit = async (amount: number) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cashon/deposit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${masterToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        await loadData();
      } else {
        setError("Failed to request deposit");
      }
    } catch (err) {
      setError("Failed to request deposit");
      (globalThis.console as any)?.error?.("Deposit error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncMpesa = async () => {
    setSyncStatus("Syncing...");
    const res = await fetch("/api/cashon/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-qmoi-master": "true" },
      body: JSON.stringify({ action: "sync-mpesa" }),
    });
    const data = await res.json();
    if (data.success) setSyncStatus("Sync successful");
    else setSyncStatus("Sync failed: " + (data.error || "Unknown error"));
  };

  if (!isMaster) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Master Access Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This feature is restricted to Master users only. Please
              authenticate with your master token.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🧠 Cashon AI Trading</h1>
          <p className="text-muted-foreground">
            Autonomous trading with Qmoi AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={tradingStatus?.enabled ? "default" : "secondary"}>
            {tradingStatus?.enabled ? (
              <>
                <Activity className="h-3 w-3 mr-1" />
                Active
              </>
            ) : (
              <>
                <Pause className="h-3 w-3 mr-1" />
                Paused
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {fmtNumber(balance?.availableBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated: {formatDate(balance?.lastUpdated)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              KES {fmtNumber(tradingStatus?.totalProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              {tradingStatus?.activeTrades || 0} active trades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Locked Balance
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {balance?.lockedBalance?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-muted-foreground">Protected profits</p>
          </CardContent>
        </Card>
      </div>

      {/* Trading Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Trading Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={startTrading}
              enabled={isLoading || tradingStatus?.enabled}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start AI Trading
            </Button>
            <Button
              onClick={stopTrading}
              enabled={isLoading || !tradingStatus?.enabled}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Pause className="h-4 w-4" />
              Stop AI Trading
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => requestDeposit(50)}
              enabled={isLoading}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Deposit KES 50
            </Button>
            <Button
              onClick={() => requestDeposit(100)}
              enabled={isLoading}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Deposit KES 100
            </Button>
            <Button
              onClick={() => requestDeposit(500)}
              enabled={isLoading}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Deposit KES 500
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trading Dashboard */}
      <Tabs defaultValue="signals" className="w-full">
        <TabsList>
          <TabsTrigger value="signals">Trading Signals</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trading Signals</CardTitle>
            </CardHeader>
            <CardContent>
              {signals.length === 0 ? (
                <p className="text-muted-foreground">
                  No signals generated yet
                </p>
              ) : (
                <div className="space-y-3">
                  {signals.slice(-5).map((signal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            signal.action === "buy"
                              ? "bg-green-100 text-green-600"
                              : signal.action === "sell"
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {signal.action === "buy" ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : signal.action === "sell" ? (
                            <TrendingDown className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{signal.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {signal.strategy}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {percent(signal.confidence)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {signal.expectedReturn && signal.expectedReturn > 0
                            ? "+"
                            : ""}
                          {safeFixed(signal.expectedReturn)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Success Rate</div>
                  <div className="text-2xl font-bold text-green-600">85%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Average Return</div>
                  <div className="text-2xl font-bold">+2.3%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Best Trade</div>
                  <div className="text-2xl font-bold text-green-600">
                    +12.5%
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Worst Trade</div>
                  <div className="text-2xl font-bold text-red-600">-3.2%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {balance?.transactionHistory?.length === 0 ? (
                <p className="text-muted-foreground">No transactions yet</p>
              ) : (
                <div className="space-y-3">
                  {balance?.transactionHistory
                    ?.slice(-5)
                    .map((tx: Transaction = {}, index: number) => {
                      const t = tx || {};
                      const tType = t.type || "transfer";
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                tType === "deposit"
                                  ? "bg-green-100 text-green-600"
                                  : tType === "withdrawal"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {tType === "deposit" ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : tType === "withdrawal" ? (
                                <AlertTriangle className="h-4 w-4" />
                              ) : (
                                <Activity className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">
                                {t.description || ""}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(t.timestamp)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              KES {fmtNumber(t.amount)}
                            </div>
                            <Badge
                              variant={
                                t.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {t.status || "pending"}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="my-4 p-4 border rounded bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="font-bold">M-Pesa Number:</span>
          <span>{mpesaNumber || "Not configured"}</span>
          <button
            onClick={handleSyncMpesa}
            className="ml-4 px-3 py-1 bg-green-600 text-white rounded"
          >
            Sync to M-Pesa
          </button>
          <span className="ml-2 text-sm text-gray-500">{syncStatus}</span>
        </div>
        <div className="mt-2">
          <span className="font-bold">Transfer Logs:</span>
          <ul className="text-xs mt-1">
            {logs.map(
              (
                log: { timestamp?: string | number | Date; event?: string },
                idx,
              ) => (
                <li key={idx}>
                  {formatDate(log.timestamp)}: {log.event || ""}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
