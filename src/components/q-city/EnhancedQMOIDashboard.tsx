import React, { useEffect, useState } from 'react';
import { enhancedErrorFixingService } from '../../services/EnhancedErrorFixingService';
import { enhancedSiteGenerationService } from '../../services/EnhancedSiteGenerationService';
import { enhancedRevenueAutomationService } from '../../services/EnhancedRevenueAutomationService';
import { enhancedParallelizationService } from '../../services/EnhancedParallelizationService';

interface DashboardData {
  errorFixing: {
    activeErrors: number;
    fixedErrors: number;
    systemHealth: any;
    queueStatus: any;
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
    activeTasks: any[];
    systemHealth: any;
    performanceMetrics: any;
  };
}

export default function EnhancedQMOIDashboard({ isMaster = false }: { isMaster?: boolean }) {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    errorFixing: { activeErrors: 0, fixedErrors: 0, systemHealth: {}, queueStatus: {} },
    siteGeneration: { activeSites: 0, completedSites: 0, averageAuditScore: 0 },
    revenueAutomation: { activeProjects: 0, totalRevenue: 0, revenueGoal: 10000, dealsDiscovered: 0 },
    parallelization: { activeTasks: [], systemHealth: {}, performanceMetrics: {} }
  });

  useEffect(() => {
    if (!isMaster) return;

    const updateDashboard = () => {
      // Update error fixing data
      const errorHealth = enhancedErrorFixingService.getSystemHealth();
      const errorQueue = enhancedErrorFixingService.getQueueStatus();
      
      // Update parallelization data
      const parallelData = enhancedParallelizationService.getDashboardData();

      setDashboardData(prev => ({
        ...prev,
        errorFixing: {
          activeErrors: errorHealth.activeErrors,
          fixedErrors: errorHealth.fixedErrors,
          systemHealth: errorHealth,
          queueStatus: errorQueue
        },
        parallelization: {
          activeTasks: parallelData.activeTasks,
          systemHealth: parallelData.systemHealth,
          performanceMetrics: parallelData.performanceMetrics
        }
      }));
    };

    updateDashboard();
    const interval = setInterval(updateDashboard, 5000);

    // Listen to real-time events
    const errorEvents = ['errorReported', 'fixApplied', 'healthUpdate'];
    const siteEvents = ['siteRequested', 'siteGenerated'];
    const revenueEvents = ['revenueProjectRequested', 'revenueProjectAutomated'];
    const parallelEvents = ['taskSubmitted', 'taskStarted', 'taskCompleted', 'taskProgress'];

    errorEvents.forEach(event => {
      enhancedErrorFixingService.on(event, updateDashboard);
    });

    siteEvents.forEach(event => {
      enhancedSiteGenerationService.on(event, updateDashboard);
    });

    revenueEvents.forEach(event => {
      enhancedRevenueAutomationService.on(event, updateDashboard);
    });

    parallelEvents.forEach(event => {
      enhancedParallelizationService.on(event, updateDashboard);
    });

    return () => {
      clearInterval(interval);
      errorEvents.forEach(event => {
        enhancedErrorFixingService.off(event, updateDashboard);
      });
      siteEvents.forEach(event => {
        enhancedSiteGenerationService.off(event, updateDashboard);
      });
      revenueEvents.forEach(event => {
        enhancedRevenueAutomationService.off(event, updateDashboard);
      });
      parallelEvents.forEach(event => {
        enhancedParallelizationService.off(event, updateDashboard);
      });
    };
  }, [isMaster]);

  if (!isMaster) return null;

  return (
    <div style={{
      border: '1px solid #444',
      padding: 20,
      borderRadius: 8,
      background: '#181818',
      color: '#e0ffe0',
      marginTop: 16,
      maxWidth: '100%'
    }}>
      <h2>🚀 Enhanced QMOI Real-Time Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        
        {/* Error Fixing Panel */}
        <div style={{ border: '1px solid #666', padding: 16, borderRadius: 6 }}>
          <h3>🔧 Error Auto-Fixing System</h3>
          <p><b>Active Errors:</b> {dashboardData.errorFixing.activeErrors}</p>
          <p><b>Fixed Errors:</b> {dashboardData.errorFixing.fixedErrors}</p>
          <p><b>Queue Length:</b> {dashboardData.errorFixing.queueStatus.queueLength}</p>
          <p><b>Processing:</b> {dashboardData.errorFixing.queueStatus.isProcessing ? 'Yes' : 'No'}</p>
          <p><b>Average Response Time:</b> {Math.round(dashboardData.errorFixing.systemHealth.averageResponseTime || 0)}ms</p>
        </div>

        {/* Site Generation Panel */}
        <div style={{ border: '1px solid #666', padding: 16, borderRadius: 6 }}>
          <h3>🌐 High-Quality Site Generation</h3>
          <p><b>Active Sites:</b> {dashboardData.siteGeneration.activeSites}</p>
          <p><b>Completed Sites:</b> {dashboardData.siteGeneration.completedSites}</p>
          <p><b>Average Audit Score:</b> {dashboardData.siteGeneration.averageAuditScore}%</p>
          <button onClick={() => enhancedSiteGenerationService.requestSiteGeneration({
            type: 'affiliate',
            template: 'modern-responsive',
            aiContentEnabled: true,
            aiDesignEnabled: true,
            createdBy: 'master'
          })}>Generate New Site</button>
        </div>

        {/* Revenue Automation Panel */}
        <div style={{ border: '1px solid #666', padding: 16, borderRadius: 6 }}>
          <h3>💰 Revenue Automation</h3>
          <p><b>Active Projects:</b> {dashboardData.revenueAutomation.activeProjects}</p>
          <p><b>Total Revenue:</b> ${dashboardData.revenueAutomation.totalRevenue.toLocaleString()}</p>
          <p><b>Revenue Goal:</b> ${dashboardData.revenueAutomation.revenueGoal.toLocaleString()}</p>
          <p><b>Progress:</b> {Math.round((dashboardData.revenueAutomation.totalRevenue / dashboardData.revenueAutomation.revenueGoal) * 100)}%</p>
          <p><b>Deals Discovered:</b> {dashboardData.revenueAutomation.dealsDiscovered}</p>
          <button onClick={() => enhancedRevenueAutomationService.requestRevenueProject({
            type: 'affiliate',
            targetPlatforms: ['amazon', 'clickbank', 'cj'],
            revenueGoal: 5000,
            marketingChannels: ['social', 'email', 'seo'],
            autoDiscoveryEnabled: true,
            autoSyndicationEnabled: true,
            createdBy: 'master'
          })}>Start Revenue Project</button>
        </div>

        {/* Parallelization Panel */}
        <div style={{ border: '1px solid #666', padding: 16, borderRadius: 6 }}>
          <h3>⚡ Enhanced Parallelization</h3>
          <p><b>Active Tasks:</b> {dashboardData.parallelization.activeTasks.length}</p>
          <p><b>System Status:</b> <span style={{ color: dashboardData.parallelization.systemHealth.systemStatus === 'healthy' ? '#4CAF50' : dashboardData.parallelization.systemHealth.systemStatus === 'warning' ? '#FF9800' : '#F44336' }}>
            {dashboardData.parallelization.systemHealth.systemStatus}
          </span></p>
          <p><b>CPU Usage:</b> {Math.round(dashboardData.parallelization.systemHealth.cpuUsage || 0)}%</p>
          <p><b>Memory Usage:</b> {Math.round(dashboardData.parallelization.systemHealth.memoryUsage || 0)}%</p>
          <p><b>Success Rate:</b> {Math.round((dashboardData.parallelization.performanceMetrics.successRate || 0) * 100)}%</p>
          <p><b>Tasks/Min:</b> {Math.round(dashboardData.parallelization.performanceMetrics.tasksPerMinute || 0)}</p>
        </div>
      </div>

      {/* Active Tasks List */}
      {dashboardData.parallelization.activeTasks.length > 0 && (
        <div style={{ marginTop: 20, border: '1px solid #666', padding: 16, borderRadius: 6 }}>
          <h3>🔄 Active Tasks</h3>
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {dashboardData.parallelization.activeTasks.map(task => (
              <div key={task.id} style={{ 
                border: '1px solid #444', 
                padding: 8, 
                margin: '4px 0', 
                borderRadius: 4,
                background: task.status === 'running' ? '#1a1a1a' : '#0a0a0a'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><b>{task.type}</b> - {task.id}</span>
                  <span style={{ color: task.status === 'running' ? '#4CAF50' : '#FF9800' }}>
                    {task.status} ({task.progress}%)
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: 4, 
                  background: '#333', 
                  borderRadius: 2, 
                  marginTop: 4 
                }}>
                  <div style={{ 
                    width: `${task.progress}%`, 
                    height: '100%', 
                    background: '#4CAF50', 
                    borderRadius: 2 
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginTop: 20, border: '1px solid #666', padding: 16, borderRadius: 6 }}>
        <h3>⚡ Quick Actions</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => enhancedParallelizationService.submitTask('error_fix', 'high')}>
            Run Error Fix
          </button>
          <button onClick={() => enhancedParallelizationService.submitTask('optimization', 'medium')}>
            Run Optimization
          </button>
          <button onClick={() => enhancedParallelizationService.submitTask('monitoring', 'low')}>
            Run Health Check
          </button>
          <button onClick={() => enhancedParallelizationService.submitTask('site_generation', 'medium')}>
            Generate Site
          </button>
          <button onClick={() => enhancedParallelizationService.submitTask('revenue_automation', 'high')}>
            Start Revenue Project
          </button>
        </div>
      </div>
    </div>
  );
} 