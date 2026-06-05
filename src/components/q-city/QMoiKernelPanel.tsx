"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { useQmoiKernel } from "@/hooks/useQmoiKernel";

export default memo(function QMoiKernelPanel({ isMaster = false }: { isMaster?: boolean }) {
  const { status, loading, error, lastAction, fetchStatus, runAction } = useQmoiKernel();
  const [showEnhancedDashboard, setShowEnhancedDashboard] = useState(false);

  const handleToggleDashboard = useCallback(() => {
    setShowEnhancedDashboard((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isMaster) return;

    fetchStatus();
    const interval = setInterval(fetchStatus, 20000);
    return () => clearInterval(interval);
  }, [isMaster, fetchStatus]);

  if (!isMaster) {
    return null;
  }

  return (
    <div className="qmoi-kernel-panel rounded-lg border border-slate-700 bg-slate-950 p-5 text-slate-100">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">QMOI Kernel Control Panel</h3>
          <p className="text-sm text-slate-400">Monitor and manage the kernel automation workflow.</p>
        </div>
        <button
          type="button"
          onClick={handleToggleDashboard}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-500"
        >
          {showEnhancedDashboard ? "Hide" : "Show"} Dashboard
        </button>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Status</p>
          <div className="mt-2 text-lg font-medium text-white">{status.status}</div>
          <div className="text-sm text-slate-500">Last check: {status.lastCheck}</div>
          <div className="text-sm text-slate-500">Mutation count: {status.mutationCount}</div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => runAction("qfix")}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Running" : "Run QFix"}
          </button>
          <button
            type="button"
            onClick={() => runAction("qoptimize")}
            disabled={loading}
            className="rounded-lg bg-sky-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Running" : "Run QOptimize"}
          </button>
          <button
            type="button"
            onClick={() => runAction("qsecure")}
            disabled={loading}
            className="rounded-lg bg-violet-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Running" : "Run QSecure"}
          </button>
          <button
            type="button"
            onClick={fetchStatus}
            disabled={loading}
            className="rounded-lg bg-slate-700 px-4 py-2 text-white disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-700 bg-red-950 p-3 text-sm text-red-100">
            <strong>Error:</strong> {error}
          </div>
        )}

        {lastAction && (
          <div className={`rounded-lg border p-3 text-sm ${lastAction.success ? "border-emerald-700 bg-emerald-950 text-emerald-100" : "border-red-700 bg-red-950 text-red-100"}`}>
            <strong>Last Action:</strong> {lastAction.message}
          </div>
        )}

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h4 className="text-base font-semibold text-white">Kernel Logs</h4>
          <ul className="mt-3 max-h-36 space-y-2 overflow-y-auto text-sm text-slate-300">
            {status.logs.map((log, index) => (
              <li key={index} className="rounded-md bg-slate-950 px-3 py-2">
                {log}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});

  }
}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
