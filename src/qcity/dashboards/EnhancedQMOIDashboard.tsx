"use client";
import React, { useEffect, useState } from "react";
import { enhancedErrorFixingService } from "@/services/EnhancedErrorFixingService";
import { enhancedSiteGenerationService } from "@/services/EnhancedSiteGenerationService";
import { enhancedRevenueAutomationService } from "@/services/EnhancedRevenueAutomationService";
import { enhancedParallelizationService } from "@/services/EnhancedParallelizationService";

interface DashboardData {
  errorFixing: {
    activeErrors: number;
    fixedErrors: number;
    systemHealth: Record<string, any>;
    queueStatus: Record<string, any>;
  };
  siteGeneration: {
    activeSites: number;
    completedSites: number;
    averageAuditScore: number;
  };
  revenueAutomation: {
    activeProjects: number;
    totalRevenue: number;
    revenueGoal: number;
    dealsDiscovered: number;
  };
  parallelization: {
    activeTasks: Array<{ id: string; type: string; status: string; progress: number }>;
    systemHealth: Record<string, any>;
    performanceMetrics: Record<string, any>;
  };
}

export default function EnhancedQMOIDashboard({ isMaster = false }: { isMaster?: boolean }) {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    errorFixing: {
      activeErrors: 0,
      fixedErrors: 0,
      systemHealth: {},
      queueStatus: {},
    },
    siteGeneration: { activeSites: 0, completedSites: 0, averageAuditScore: 0 },
    revenueAutomation: {
      activeProjects: 0,
      totalRevenue: 0,
      revenueGoal: 10000,
      dealsDiscovered: 0,
    },
    parallelization: {
      activeTasks: [],
      systemHealth: { systemStatus: "healthy", cpuUsage: 0, memoryUsage: 0 },
      performanceMetrics: { tasksPerMinute: 0, successRate: 0 },
    },
  });

  useEffect(() => {
    if (!isMaster) return;

    const updateDashboard = () => {
      const errorHealth = enhancedErrorFixingService.getSystemHealth();
      const errorQueue = enhancedErrorFixingService.getQueueStatus();
      const parallelData = enhancedParallelizationService.getDashboardData();

      setDashboardData((prev) => ({
        ...prev,
        errorFixing: {
          activeErrors: errorHealth.activeErrors,
          fixedErrors: errorHealth.fixedErrors,
          systemHealth: errorHealth,
          queueStatus: errorQueue,
        },
        parallelization: {
          activeTasks: parallelData.activeTasks,
          systemHealth: parallelData.systemHealth,
          performanceMetrics: parallelData.performanceMetrics,
        },
      }));
    };

    updateDashboard();
    const interval = setInterval(updateDashboard, 5000);

    const errorEvents = ["errorReported", "fixApplied", "healthUpdate"];
    const siteEvents = ["siteRequested", "siteGenerated"];
    const revenueEvents = ["revenueProjectRequested", "revenueProjectAutomated"];
    const parallelEvents = ["taskSubmitted", "taskStarted", "taskCompleted", "taskProgress"];

    errorEvents.forEach((event) => enhancedErrorFixingService.on(event, updateDashboard));
    siteEvents.forEach((event) => enhancedSiteGenerationService.on(event, updateDashboard));
    revenueEvents.forEach((event) => enhancedRevenueAutomationService.on(event, updateDashboard));
    parallelEvents.forEach((event) => enhancedParallelizationService.on(event, updateDashboard));

    return () => {
      clearInterval(interval);
      errorEvents.forEach((event) => enhancedErrorFixingService.off(event, updateDashboard));
      siteEvents.forEach((event) => enhancedSiteGenerationService.off(event, updateDashboard));
      revenueEvents.forEach((event) => enhancedRevenueAutomationService.off(event, updateDashboard));
      parallelEvents.forEach((event) => enhancedParallelizationService.off(event, updateDashboard));
    };
  }, [isMaster]);

  if (!isMaster) return null;

  return (
    <div
      style={{
        border: "1px solid #444",
        padding: 20,
        borderRadius: 8,
        background: "#181818",
        color: "#e0ffe0",
        marginTop: 16,
        maxWidth: "100%",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        <div style={{ border: "1px solid #666", padding: 16, borderRadius: 6 }}>
          <h3>🔧 Error Auto-Fixing System</h3>
          <p>
            <strong>Active Errors:</strong> {dashboardData.errorFixing.activeErrors}
          </p>
          <p>
            <strong>Fixed Errors:</strong> {dashboardData.errorFixing.fixedErrors}
          </p>
          <p>
            <strong>Queue Length:</strong> {dashboardData.errorFixing.queueStatus.queueLength ?? 0}
          </p>
          <p>
            <strong>Processing:</strong> {dashboardData.errorFixing.queueStatus.isProcessing ? "Yes" : "No"}
          </p>
          <p>
            <strong>Average Response Time:</strong> {Math.round(dashboardData.errorFixing.systemHealth.averageResponseTime || 0)} ms
          </p>
        </div>
        <div style={{ border: "1px solid #666", padding: 16, borderRadius: 6 }}>
          <h3>🌐 High-Quality Site Generation</h3>
          <p>
            <strong>Active Sites:</strong> {dashboardData.siteGeneration.activeSites}
          </p>
          <p>
            <strong>Completed Sites:</strong> {dashboardData.siteGeneration.completedSites}
          </p>
          <p>
            <strong>Average Audit Score:</strong> {dashboardData.siteGeneration.averageAuditScore}%
          </p>
          <button
            type="button"
            onClick={() =>
              enhancedSiteGenerationService.requestSiteGeneration({
                type: "affiliate",
                standard: "modern-responsive",
                aiContentEnabled: true,
                aiDesignEnabled: true,
                createdBy: "master",
              })
            }
          >
            Generate New Site
          </button>
        </div>
        <div style={{ border: "1px solid #666", padding: 16, borderRadius: 6 }}>
          <h3>💰 Revenue Automation</h3>
          <p>
            <strong>Active Projects:</strong> {dashboardData.revenueAutomation.activeProjects}
          </p>
          <p>
            <strong>Total Revenue:</strong> ${dashboardData.revenueAutomation.totalRevenue.toLocaleString()}
          </p>
          <p>
            <strong>Revenue Goal:</strong> ${dashboardData.revenueAutomation.revenueGoal.toLocaleString()}
          </p>
          <p>
            <strong>Progress:</strong> {Math.round((dashboardData.revenueAutomation.totalRevenue / dashboardData.revenueAutomation.revenueGoal) * 100)}%
          </p>
          <p>
            <strong>Deals Discovered:</strong> {dashboardData.revenueAutomation.dealsDiscovered}
          </p>
          <button
            type="button"
            onClick={() =>
              enhancedRevenueAutomationService.requestRevenueProject({
                type: "affiliate",
                targetPlatforms: ["amazon", "clickbank", "cj"],
                revenueGoal: 5000,
                marketingChannels: ["social", "email", "seo"],
                autoDiscoveryEnabled: true,
                autoSyndicationEnabled: true,
                createdBy: "master",
              })
            }
          >
            Start Revenue Project
          </button>
        </div>
        <div style={{ border: "1px solid #666", padding: 16, borderRadius: 6 }}>
          <h3>⚡ Enhanced Parallelization</h3>
          <p>
            <strong>Active Tasks:</strong> {dashboardData.parallelization.activeTasks.length}
          </p>
          <p>
            <strong>System Status:</strong>{" "}
            <span
              style={{
                color:
                  dashboardData.parallelization.systemHealth.systemStatus === "healthy"
                    ? "#4CAF50"
                    : dashboardData.parallelization.systemHealth.systemStatus === "warning"
                    ? "#FF9800"
                    : "#F44336",
              }}
            >
              {dashboardData.parallelization.systemHealth.systemStatus}
            </span>
          </p>
          <p>
            <strong>CPU Usage:</strong> {Math.round(dashboardData.parallelization.systemHealth.cpuUsage || 0)}%
          </p>
          <p>
            <strong>Memory Usage:</strong> {Math.round(dashboardData.parallelization.systemHealth.memoryUsage || 0)}%
          </p>
          <p>
            <strong>Success Rate:</strong> {Math.round((dashboardData.parallelization.performanceMetrics.successRate || 0) * 100)}%
          </p>
          <p>
            <strong>Tasks/Min:</strong> {Math.round(dashboardData.parallelization.performanceMetrics.tasksPerMinute || 0)}
          </p>
        </div>
      </div>
      {dashboardData.parallelization.activeTasks.length > 0 && (
        <div style={{ marginTop: 20, border: "1px solid #666", padding: 16, borderRadius: 6 }}>
          <h3>🔄 Active Tasks</h3>
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {dashboardData.parallelization.activeTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  border: "1px solid #444",
                  padding: 8,
                  margin: "4px 0",
                  borderRadius: 4,
                  background: task.status === "running" ? "#1a1a1a" : "#0a0a0a",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>
                    <strong>{task.type}</strong> - {task.id}
                  </span>
                  <span style={{ color: task.status === "running" ? "#4CAF50" : "#FF9800" }}>
                    {task.status} ({task.progress}%)
                  </span>
                </div>
                <div style={{ width: "100%", height: 4, background: "#333", borderRadius: 2, marginTop: 4 }}>
                  <div style={{ width: `${task.progress}%`, height: "100%", background: "#4CAF50", borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ marginTop: 20, border: "1px solid #666", padding: 16, borderRadius: 6 }}>
        <h3>⚡ optimized Actions</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={() => enhancedParallelizationService.submitTask("error_fix", "high")}>Run Error Fix</button>
          <button type="button" onClick={() => enhancedParallelizationService.submitTask("optimization", "medium")}>Run Optimization</button>
          <button type="button" onClick={() => enhancedParallelizationService.submitTask("monitoring", "low")}>Run Health Check</button>
          <button type="button" onClick={() => enhancedParallelizationService.submitTask("site_generation", "medium")}>Generate Site</button>
          <button type="button" onClick={() => enhancedParallelizationService.submitTask("revenue_automation", "high")}>Start Revenue Project</button>
        </div>
      </div>
    </div>
  );
}
