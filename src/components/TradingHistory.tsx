import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { TrendingUp, TrendingDown, Refresh, Info } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { TradingManager } from "../config/trading";

interface Trade {
  id: string;
  timestamp: Date;
  pair: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  total: number;
  profit?: number;
  status: "completed" | "failed" | "pending";
  userId: string;
  userRole: string;
}

interface TradingHistoryProps {
  className?: string;
}

export const TradingHistory: React.FC<TradingHistoryProps> = ({
  className,
}) => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalTrades: 0,
    successfulTrades: 0,
    totalProfit: 0,
    winRate: 0,
  });

  const fetchTrades = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const tradingManager = TradingManager.getInstance();
      const history = (await tradingManager.getTradingHistory()).map(
        (trade: any) => ({
          ...trade,
          timestamp: new Date(trade.timestamp),
        }),
      );
      setTrades(history);

      // Calculate statistics
      const successfulTrades = history.filter(
        (t: Trade) => t.status === "completed",
      );
      const totalProfit = successfulTrades.reduce(
        (sum: number, trade: Trade) => sum + (trade.profit || 0),
        0,
      );
      const winRate = (successfulTrades.length / history.length) * 100;

      setStats({
        totalTrades: history.length,
        successfulTrades: successfulTrades.length,
        totalProfit,
        winRate,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch trading history",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
    const interval = setInterval(fetchTrades, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(date);
  };

  if (!user || !["master", "sister"].includes(user.role)) {
    return null;
  }

  return (
    <Card className={className}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" component="h2">
            Trading History
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Refresh History">
              <IconButton
                size="small"
                onClick={fetchTrades}
                disabled={isLoading}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Trades
              </Typography>
              <Typography variant="h6">{stats.totalTrades}</Typography>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Successful Trades
              </Typography>
              <Typography variant="h6">{stats.successfulTrades}</Typography>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Profit
              </Typography>
              <Typography
                variant="h6"
                color={stats.totalProfit >= 0 ? "success.main" : "error.main"}
              >
                {formatCurrency(stats.totalProfit)}
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Win Rate
              </Typography>
              <Typography variant="h6">{stats.winRate.toFixed(1)}%</Typography>
            </CardContent>
          </Card>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Pair</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Profit</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>{formatDate(trade.timestamp)}</TableCell>
                    <TableCell>{trade.pair}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        icon={
                          trade.type === "buy" ? (
                            <TrendingUp />
                          ) : (
                            <TrendingDown />
                          )
                        }
                        label={trade.type.toUpperCase()}
                        color={trade.type === "buy" ? "success" : "error"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">{trade.amount}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(trade.price)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(trade.total)}
                    </TableCell>
                    <TableCell align="right">
                      {trade.profit !== undefined && (
                        <Typography
                          color={
                            trade.profit >= 0 ? "success.main" : "error.main"
                          }
                        >
                          {formatCurrency(trade.profit)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={trade.status}
                        color={
                          trade.status === "completed"
                            ? "success"
                            : trade.status === "failed"
                              ? "error"
                              : "warning"
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box mt={2}>
          <Alert severity="info" icon={<Info />}>
            Trading history is automatically updated every minute. Click the
            refresh button to update manually.
          </Alert>
        </Box>
      </CardContent>
    </Card>
  );
};
