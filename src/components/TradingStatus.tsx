import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Wifi,
  WifiOff,
  AccountBalance,
  Refresh,
  Warning,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { TradingManager } from '../config/trading';

interface WalletBalance {
  currency: string;
  balance: number;
  usdValue: number;
}

interface TradingStatusProps {
  className?: string;
}

export const TradingStatus: React.FC<TradingStatusProps> = ({ className }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [walletBalances, setWalletBalances] = useState<WalletBalance[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get connection status
      const connectionStatus = TradingManager.getInstance().getConnectionStatus();
      setIsConnected(connectionStatus.isConnected);

      if (connectionStatus.isConnected) {
        // Get wallet balances
        const balances = await TradingManager.getInstance().getWalletBalances();
        setWalletBalances(balances);
      } else {
        setError(connectionStatus.lastError || 'Connection lost');
      }

      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(balance);
  };

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!user || !['master', 'sister'].includes(user.role)) {
    return null;
  }

  return (
    <Card className={className}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            Trading System Status
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              icon={isConnected ? <Wifi /> : <WifiOff />}
              label={isConnected ? 'Connected' : 'Disconnected'}
              color={isConnected ? 'success' : 'error'}
              size="small"
            />
            <Tooltip title="Refresh Status">
              <IconButton
                size="small"
                onClick={fetchStatus}
                disabled={isLoading}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Box display="flex" alignItems="center" gap={1} color="error.main">
            <Warning fontSize="small" />
            <Typography variant="body2">{error}</Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={2}>
              {walletBalances.map((wallet) => (
                <Grid item xs={12} sm={6} md={4} key={wallet.currency}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <AccountBalance fontSize="small" />
                        <Typography variant="subtitle2">
                          {wallet.currency}
                        </Typography>
                      </Box>
                      <Typography variant="h6">
                        {formatBalance(wallet.balance)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ≈ {formatUSD(wallet.usdValue)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box mt={2}>
              <Typography variant="caption" color="text.secondary">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}; 