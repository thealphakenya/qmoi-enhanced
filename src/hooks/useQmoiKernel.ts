import { useState, useCallback, useMemo } from "react";
import { getSessionHeaders } from "../services/qmoiSession";

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
    status: "Loading...",
    lastCheck: "",
    mutationCount: 0,
    logs: [],
  });
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<QMoiKernelActionResult | null>(
    null
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug(
        "HOOK: fetchStatus - _response status",
        _res && _res.status
      );
      if (!_res.ok) throw new Error("Failed to fetch status");
      const data = await _res.json();
      console.debug("HOOK: fetchStatus - parsed data", data);
      setStatus({
        status: data.status,
        lastCheck: data.last_check,
        mutationCount: data.mutation_count,
        logs: data.logs || [],
      });
    } catch (_err: unknown) {
      const msg =
        _err instanceof Error ? _err.message : String(_err) || "Unknown _error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const runAction = useCallback(
    async (action: "qfix" | "qoptimize" | "qsecure") => {
      setLoading(true);
      setError(null);
      setLastAction(null);
      try {
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
        const data = await _res.json().catch(() => ({}));
        setLastAction({
          success: true,
          message: data.message || `${action} completed successfully`,
        });
        await fetchStatus();
      } catch (_err: unknown) {
        const msg =
          _err instanceof Error
            ? _err.message
            : String(_err) || "Unknown _error";
        setError(msg);
        setLastAction({
          success: false,
          message: msg,
        });
      } finally {
        setLoading(false);
      }
    },
    [fetchStatus]
  );

  return useMemo(
    () => ({
      status,
      loading,
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction]
  );
}
