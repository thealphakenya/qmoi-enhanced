import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';

interface TradingPosition {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entryPrice: number;
  currentPrice: number;
  size: number;
  pnl: number;
  status: 'open' | 'closed';
  timestamp: number;
}

interface TradingConfig {
  enabled: boolean;
  exchanges: string[];
  strategies: string[];
  riskLevel: 'low' | 'medium' | 'high';
  maxPositions: number;
  autoTrading: boolean;
  stopLoss: number;
  takeProfit: number;
}

export function useTrading() {
  const [positions, setPositions] = useState<TradingPosition[]>([]);
  const [config, setConfig] = useState<TradingConfig | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Fetch positions
  const { data: positionsData, refetch: refetchPositions } = useQuery<TradingPosition[], AxiosError>(
    'trading-positions',
    async () => {
      const response = await axios.get('/api/qcity/trading/positions');
      return response.data;
    },
    {
      refetchInterval: 5000, // Poll every 5 seconds
      onError: (err: AxiosError) => setError(err),
    }
  );

  // Fetch trading config
  const { data: configData, refetch: refetchConfig } = useQuery<TradingConfig, AxiosError>(
    'trading-config',
    async () => {
      const response = await axios.get('/api/qcity/trading/config');
      return response.data;
    },
    {
      onError: (err: AxiosError) => setError(err),
    }
  );

  // Open position mutation
  const openPositionMutation = useMutation<TradingPosition, AxiosError, { symbol: string; type: 'long' | 'short'; size: number }>(
    async ({ symbol, type, size }) => {
      const response = await axios.post('/api/qcity/trading/positions', { symbol, type, size });
      return response.data;
    },
    {
      onSuccess: () => refetchPositions(),
      onError: (err: AxiosError) => setError(err),
    }
  );

  // Close position mutation
  const closePositionMutation = useMutation<void, AxiosError, string>(
    async (positionId) => {
      const response = await axios.delete('/api/qcity/trading/positions', { data: { positionId } });
      return response.data;
    },
    {
      onSuccess: () => refetchPositions(),
      onError: (err: AxiosError) => setError(err),
    }
  );

  // Update config mutation
  const updateConfigMutation = useMutation<void, AxiosError, Partial<TradingConfig>>(
    async (newConfig) => {
      const response = await axios.post('/api/qcity/trading/config', newConfig);
      return response.data;
    },
    {
      onSuccess: () => {
        refetchConfig();
        refetchPositions();
      },
      onError: (err: AxiosError) => setError(err),
    }
  );

  // Update positions and config when data changes
  useEffect(() => {
    if (positionsData) {
      setPositions(positionsData);
    }
  }, [positionsData]);

  useEffect(() => {
    if (configData) {
      setConfig(configData);
    }
  }, [configData]);

  // Open position
  const openPosition = useCallback(
    (symbol: string, type: 'long' | 'short', size: number) => {
      openPositionMutation.mutate({ symbol, type, size });
    },
    [openPositionMutation]
  );

  // Close position
  const closePosition = useCallback(
    (positionId: string) => {
      closePositionMutation.mutate(positionId);
    },
    [closePositionMutation]
  );

  // Update config
  const updateConfig = useCallback(
    (newConfig: Partial<TradingConfig>) => {
      updateConfigMutation.mutate(newConfig);
    },
    [updateConfigMutation]
  );

  return {
    positions,
    config,
    error,
    openPosition,
    closePosition,
    updateConfig,
    refetchPositions,
    refetchConfig,
  };
} 