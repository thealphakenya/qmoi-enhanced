console.log("production mode initialized");
// Master-only middleware
export const requireMasterRole = (handler: Function) => {
  return async (req: any, res: any) => {
    const user = req.session?.user;
    if (!user || user.role !== "master") {
      return res.status(403).json({ error: "Master role required" });
    }
    return handler(req, res);
  };
};

import { useState, useEffect, useCallback } from "react";
import { 
  RevenueValidationResponse, 
  SystemStatus, 
  revenueValidator 
} from "@/api/revenueValidator";

/**
 * Hook for revenue validation
 */
export function useRevenueValidation(refreshInterval: number = 30000) {
  const [data, setData] = useState<RevenueValidationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await revenueValidator.validate();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    validate();
    const interval = setInterval(validate, refreshInterval);
    return () => clearInterval(interval);
  }, [validate, refreshInterval]);

  return { data, loading, error, validate };
}

/**
 * Hook for system status
 */
export function useSystemStatus(refreshInterval: number = 60000) {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await revenueValidator.getStatus();
      setStatus(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, refreshInterval);
    return () => clearInterval(interval);
  }, [check, refreshInterval]);

  return { status, loading, error, check };
}

/**
 * Hook for monitoring control
 */
export function useRevenueMonitoring() {
  const [monitoring, setMonitoring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await revenueValidator.setMonitoring(!monitoring);
      setMonitoring(response.monitoring);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [monitoring]);

  return { monitoring, loading, error, toggle };
}

/**
 * Hook for analytics
 */
export function useRevenueAnalytics(refreshInterval: number = 60000) {
  const [analytics, setAnalytics] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await revenueValidator.getAnalytics();
      setAnalytics(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, refreshInterval);
    return () => clearInterval(interval);
  }, [fetch, refreshInterval]);

  return { analytics, loading, error, fetch };
}
