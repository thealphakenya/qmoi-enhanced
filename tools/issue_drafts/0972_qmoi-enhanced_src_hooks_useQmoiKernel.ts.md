---
title: "Issue draft for qmoi-enhanced/src/hooks/useQmoiKernel.ts"
generated: 2025-11-08T16:06:38.834795Z
---

# Review needed: qmoi-enhanced/src/hooks/useQmoiKernel.ts

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
import { useState, useCallback, useMemo } from "react";

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
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<QMoiKernelActionResult | null>(
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/qmoi/status");
      if (!res.ok) throw new Error("Failed to fetch status");
      const data = await res.json();
      setStatus({
        status: data.status,
        lastCheck: data.last_check,
        mutationCount: data.mutation_count,
        logs: data.logs || [],
      });
    } catch (err: any) {
      setError(err.message || "Unknown error");
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
        const res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
        });
        if (!res.ok) throw new Error(`Failed to run ${action}`);
        const data = await res.json().catch(() => ({}));
        setLastAction({
          success: true,
          message: data.message || `${action} completed successfully`,
        });
        await fetchStatus();
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setLastAction({
          success: false,
          message: err.message || "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    },
    [fetchStatus],
  );

  return useMemo(
    () => ({

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
