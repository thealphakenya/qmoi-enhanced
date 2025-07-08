import { useState, useCallback, useMemo } from 'react';

interface QMoiKernelStatus {
  status: string;
  lastCheck: string;
  mutationCount: number;
  logs: string[];
}

interface QMoiKernelActionResult {
  success: boolean;
  message: string;
}

export function useQmoiKernel() {
  const [status, setStatus] = useState<QMoiKernelStatus>({
    status: 'Loading...',
    lastCheck: '',
    mutationCount: 0,
    logs: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<QMoiKernelActionResult | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/qmoi/status');
      if (!res.ok) throw new Error('Failed to fetch status');
      const data = await res.json();
      setStatus({
        status: data.status,
        lastCheck: data.last_check,
        mutationCount: data.mutation_count,
        logs: data.logs || [],
      });
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const runAction = useCallback(async (action: 'qfix' | 'qoptimize' | 'qsecure') => {
    setLoading(true);
    setError(null);
    setLastAction(null);
    try {
      const res = await fetch(`/api/qmoi/payload?${action}`, { method: 'POST' });
      if (!res.ok) throw new Error(`Failed to run ${action}`);
      const data = await res.json().catch(() => ({}));
      setLastAction({ success: true, message: data.message || `${action} completed successfully` });
      await fetchStatus();
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setLastAction({ success: false, message: err.message || 'Unknown error' });
    } finally {
      setLoading(false);
    }
  }, [fetchStatus]);

  return useMemo(() => ({
    status,
    loading,
    error,
    lastAction,
    fetchStatus,
    runAction,
  }), [status, loading, error, lastAction, fetchStatus, runAction]);
} 