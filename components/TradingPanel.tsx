import React from 'react';
import { useTrading } from '../hooks/useTrading';
import { Trade, TradingStrategy } from '../types/trading';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { FaChartLine, FaRobot, FaMoneyBillWave, FaHistory } from 'react-icons/fa';

export function TradingPanel() {
  const {
    isInitialized,
    activeStrategies,
    transactionHistory,
    tradingStats,
    executeTrade,
    updateStrategy
  } = useTrading();

  if (!isInitialized) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <FaRobot className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
            <p className="text-lg font-medium">Initializing Trading System...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaChartLine className="w-5 h-5" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <div className="flex items-center gap-2">
                <Progress value={tradingStats.analytics.successRate * 100} className="w-full" />
                <span className="text-lg font-bold">{(tradingStats.analytics.successRate * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="w-5 h-5 text-green-500" />
                <span className="text-lg font-bold">${tradingStats.analytics.netProfit.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Trades</p>
              <div className="flex items-center gap-2">
                <FaHistory className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-bold">{tradingStats.analytics.totalTrades}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaRobot className="w-5 h-5" />
            Active Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeStrategies.map((strategy) => (
              <div key={strategy.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">{strategy.name}</h3>
                  <Badge variant={strategy.status === 'active' ? 'default' : 'secondary'}>
                    {strategy.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-lg font-bold">{(strategy.performance.winRate * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profit Factor</p>
                    <p className="text-lg font-bold">{strategy.performance.profitFactor.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                    <p className="text-lg font-bold">{strategy.performance.sharpeRatio.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Trades</p>
                    <p className="text-lg font-bold">{strategy.performance.totalTrades}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaHistory className="w-5 h-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
      <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionHistory.slice(0, 5).map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'deposit' ? 'default' : 'secondary'}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === 'completed' ? 'default' : 'destructive'}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
          ))}
            </TableBody>
      </Table>
        </CardContent>
    </Card>
    </div>
  );
}