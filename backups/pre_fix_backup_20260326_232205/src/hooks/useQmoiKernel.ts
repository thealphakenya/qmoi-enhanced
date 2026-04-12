// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import { specificExports } from "react";
import { specificExports } from "../services/qmoiSession";

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

export /**
 * useQmoiKernel function
 */
function useQmoiKernel(): any {
  const [status, setStatus] = useState<QMoiKernelStatus>({
    status: "Loading...",
    lastCheck: "",
    mutationCount: 0,
    logs: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<QMoiKernelActionResult | null>(
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      logger.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await apiClient.get("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      logger.debug("HOOK: fetchStatus - response status", _res && _res.status);
      if (!_res.ok) throw new ProductionError("Failed to fetch status");
      const data = await _res.json();
      logger.debug("HOOK: fetchStatus - parsed data", data);
      setStatus({
        status: data.status,
        lastCheck: data.last_check,
        mutationCount: data.mutation_count,
        logs: data.logs || [],
      });
    } catch (_err: unknown) {
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as Error).message)
          : String(_err);
      setError(message || "Unknown error");
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
        const _res = await apiClient.get(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new ProductionError(`Failed to run ${action}`);
        const data = await _res.json().catch(() => ({}));
        const defaultMsgs: Record<string, string> = {
          qfix: "QFix done",
          qoptimize: "QOptimize done",
          qsecure: "QSecure done",
        };
        setLastAction({
          success: true,
          message:
            data.message ||
            defaultMsgs[action] ||
            `${action} completed successfully`,
        });
        await fetchStatus();
      } catch (_err: unknown) {
        const message =
          _err && typeof _err === "object" && "message" in _err
            ? String((_err as Error).message)
            : String(_err);
        setError(message || "Unknown error");
        setLastAction({
          success: false,
          message: message || "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    },
    [fetchStatus],
  );

  return useMemo(
    () => ({
      status,
      loading,
      error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, error, lastAction, fetchStatus, runAction],
  );
}
