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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useQmoiKernel.ts -->
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
    null,
  );

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug("HOOK: fetchStatus - calling /api/qmoi/status");
      const _res = await fetch("/api/qmoi/status", {
        headers: getSessionHeaders(),
      });
      console.debug("HOOK: fetchStatus - response status", _res && _res.status);
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
      const message =
        _err && typeof _err === "object" && "message" in _err
          ? String((_err as unknown).message)
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
        const _res = await fetch(`/api/qmoi/payload?${action}`, {
          method: "POST",
          headers: getSessionHeaders(),
        });
        if (!_res.ok) throw new Error(`Failed to run ${action}`);
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
            ? String((_err as unknown).message)
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
      _error,
      lastAction,
      fetchStatus,
      runAction,
    }),
    [status, loading, _error, lastAction, fetchStatus, runAction],
  );
}
