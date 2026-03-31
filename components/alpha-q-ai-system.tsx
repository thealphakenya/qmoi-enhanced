// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"use client";

import React, { useState, useEffect } from "react";

interface stableQAISystemProps {
  className?: string;
}

const stableQAISystem: React.FC<stableQAISystemProps> = ({ className = "" }) => {
  const [systemStatus, setSystemStatus] = useState<"active" | "degraded" | "offline">("active");
  const [aiVersion, setAiVersion] = useState("stable-Q-1.0.0");
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleString());
  const [averageLatency, setAverageLatency] = useState<number>(0);
  const [activeJobs, setActiveJobs] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function fetchSystemStatus() {
      setIsUpdating(true);
      setError(null);
      const start = Date.now();

      try {
        const res = await fetch("/api/qmoi-model?allStats");
        if (!res.ok) {
          throw new Error(`Status endpoint returned ${res.status}`);
        }

        const data = await res.json();
        if (isCancelled) return;

        const elapsed = Date.now() - start;
        setAverageLatency((prev) => Math.round((prev * 3 + elapsed) / 4));
        setLastUpdate(new Date().toLocaleString());

        if (data.status === "operational" || data.status === "success") {
          setSystemStatus("active");
        } else if (data.status === "degraded") {
          setSystemStatus("degraded");
        } else {
          setSystemStatus("offline");
        }

        if (data.model_used) {
          setAiVersion(String(data.model_used));
        }

        setActiveJobs(Number(data.tasks?.length || 0));
      } catch (err: any) {
        if (!isCancelled) {
          setSystemStatus("degraded");
          setError(err?.message || "Unknown error");
        }
      } finally {
        if (!isCancelled) {
          setIsUpdating(false);
        }
      }
    }

    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30_000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`bg-[#1a1a1a] border border-green-600 rounded-lg p-4 mb-4 qmoi-card ${className}`}
    >
      <h3 className="text-lg font-semibold text-green-400 mb-3">
        stable-Q AI System
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-300">Status:</span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              systemStatus === "active"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {systemStatus.toUpperCase()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">Version:</span>
          <span className="text-green-400">{aiVersion}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">Last Update:</span>
          <span className="text-gray-400 text-xs">{lastUpdate}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">Avg Latency:</span>
          <span className="text-green-300 text-xs">{averageLatency}ms</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">Active Jobs:</span>
          <span className="text-green-300 text-xs">{activeJobs}</span>
        </div>

        {error && (
          <div className="mt-2 text-xs text-yellow-300">
            Error: {error}
          </div>
        )}

        <div className="mt-2 text-xs text-gray-300">
          {isUpdating ? "Updating status..." : "Status updated"}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-green-700">
        <div className="text-xs text-gray-400">
          AI System running with enhanced QMOI integration
        </div>
      </div>
    </div>
  );
};

export default stableQAISystem;
