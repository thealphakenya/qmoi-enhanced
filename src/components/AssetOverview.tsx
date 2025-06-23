import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  AccountBalance,
  Refresh,
  Info
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { AssetManagerImpl, Asset } from '../config/assets';

interface AssetOverviewProps {
  className?: string;
}

export const AssetOverview: React.FC<AssetOverviewProps> = ({ className }) => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [opportunities, setOpportunities] = useState<Array<{ type: string; opportunity: string; potentialProfit: number; risk: 'low' | 'medium' | 'high'; }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBalance, setTotalBalance] = useState(0);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const assetManager = AssetManagerImpl.getInstance();
      const [assetsData, opportunitiesData, total] = await Promise.all([
        assetManager.getAssets(),
        assetManager.getProfitOpportunities(),
        assetManager.getTotalBalance(),
      ]);

      setAssets(assetsData);
      setOpportunities(opportunitiesData);
      setTotalBalance(total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch asset data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatBalance = (balance: number, currency: string) => {
    if (currency === 'BTC') {
      return balance.toFixed(8);
    }
    return balance.toFixed(2);
  };

  const getAssetTypeColor = (type: Asset['type']) => {
    switch (type) {
      case 'spot':
        return 'primary';
      case 'futures':
        return 'secondary';
      case 'otc':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  if (!user || !['master', 'sister'].includes(user.role)) {
    return null;
  }

  return (
    <Card className={className}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            Asset Overview
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" color="primary">
              {formatCurrency(totalBalance)}
            </Typography>
            <Tooltip title="Refresh Assets">
              <IconButton
                size="small"
                onClick={fetchData}
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

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            <Grid container spacing={2} mb={3}>
              {assets.map((asset) => (
                <Grid item xs={12} sm={6} md={4} key={`${asset.type}_${asset.currency}`}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <AccountBalance fontSize="small" />
                        <Typography variant="subtitle2">
                          {asset.type.toUpperCase()} - {asset.currency}
                        </Typography>
                      </Box>
                      <Typography variant="h6">
                        {formatBalance(asset.balance, asset.currency)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ≈ {formatCurrency(asset.usdValue)}
                      </Typography>
                      <Chip
                        size="small"
                        label={asset.type}
                        color={getAssetTypeColor(asset.type)}
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" gutterBottom>
              Profit Opportunities
            </Typography>
            <Grid container spacing={2}>
              {opportunities.map((opp, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2">
                            {opp.opportunity}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {opp.type.toUpperCase()}
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="h6" color="success.main">
                            +{formatCurrency(opp.potentialProfit)}
                          </Typography>
                          <Chip
                            size="small"
                            label={`Risk: ${opp.risk}`}
                            color={getRiskColor(opp.risk)}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <Box mt={2}>
          <Alert severity="info" icon={<Info />}>
            Asset balances are automatically updated every 30 seconds. Click the refresh button to update manually.
          </Alert>
        </Box>
      </CardContent>
    </Card>
  );
}; 