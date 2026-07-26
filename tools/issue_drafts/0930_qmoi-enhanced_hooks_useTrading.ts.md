---
title: "Issue draft for qmoi-enhanced/hooks/useTrading.ts"
generated: 2025-11-08T16:06:38.799264Z
---

# Review needed: qmoi-enhanced/hooks/useTrading.ts

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [AUTOFIXED by Ollama at 2026-07-26T18:54:42.038633Z] markers or [AUTOFIXED by Ollama at 2026-07-26T18:54:42.038633Z]s.
- If the file is safe for production, remove the [AUTOFIXED by Ollama at 2026-07-26T18:54:42.038633Z] and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
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
  const closePositionMutat
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
