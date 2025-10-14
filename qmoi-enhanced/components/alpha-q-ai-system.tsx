"use client";

import React, { useState, useEffect } from "react";

interface AlphaQAISystemProps {
  className?: string;
}

const AlphaQAISystem: React.FC<AlphaQAISystemProps> = ({ className = "" }) => {
  const [systemStatus, setSystemStatus] = useState("active");
  const [aiVersion, setAiVersion] = useState("Alpha-Q-1.0.0");
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleString());

  useEffect(() => {
    // Simulate system status updates
    const interval = setInterval(() => {
      setLastUpdate(new Date().toLocaleString());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`bg-[#1a1a1a] border border-green-600 rounded-lg p-4 mb-4 ${className}`}
    >
      <h3 className="text-lg font-semibold text-green-400 mb-3">
        Alpha-Q AI System
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
      </div>

      <div className="mt-4 pt-3 border-t border-green-700">
        <div className="text-xs text-gray-400">
          AI System running with enhanced QMOI integration
        </div>
      </div>
    </div>
  );
};

export default AlphaQAISystem;
