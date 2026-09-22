"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Code, 
  Settings,
  Play,
  Stop,
  Download,
  Upload,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Activity,
  Clock,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";

interface AutoFixReport {
  timestamp: string;
  status: "running" | "completed" | "error";
  summary: {
    md_files_processed: number;
    claims_verified: number;
    claims_fixed: number;
    errors_fixed: number;
    manual_errors_fixed: number;
    new_features_documented: number;
  };
  deployment: {
    status: string;
    github_actions: string;
  };
  details: Array<{
    type: string;
    file?: string;
    claim?: string;
    error?: string;
  }>;
}

interface GitHubActionStatus {
  status: "success" | "failure" | "running" | "unknown";
  last_run: string;
  duration: string;
  workflow: string;
}

export default function QMOIAutoFixDashboard() {
  const [report, setReport] = useState<AutoFixReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [githubStatus, setGitHubStatus] = useState<GitHubActionStatus | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<string>("unknown");
  const [autoMode, setAutoMode] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Fetch latest report
  const fetchReport = async () => {
    try {
      const response = await fetch('/api/qmoi/auto-fix/status');
      if (response.ok) {
        const data = await response.json();
        setReport(data);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  // Start auto-fix process
  const startAutoFix = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('/api/qmoi/auto-fix/start', {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setReport(data);
        addLog('Auto-fix process started successfully');
      }
    } catch (error) {
      addLog(`Error starting auto-fix: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Stop auto-fix process
  const stopAutoFix = async () => {
    try {
      await fetch('/api/qmoi/auto-fix/stop', { method: 'POST' });
      setIsRunning(false);
      addLog('Auto-fix process stopped');
    } catch (error) {
      addLog(`Error stopping auto-fix: ${error}`);
    }
  };

  // Toggle auto mode
  const toggleAutoMode = async () => {
    setAutoMode(!autoMode);
    addLog(`Auto mode ${!autoMode ? 'enabled' : 'disabled'}`);
  };

  // Add log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 99)]);
  };

  // Fetch GitHub Actions status
  const fetchGitHubStatus = async () => {
    try {
      const response = await fetch('/api/qmoi/auto-fix/github-status');
      if (response.ok) {
        const data = await response.json();
        setGitHubStatus(data);
      }
    } catch (error) {
      console.error('Error fetching GitHub status:', error);
    }
  };

  // Fetch deployment status
  const fetchDeploymentStatus = async () => {
    try {
      const response = await fetch('/api/deployment-status');
      if (response.ok) {
        const data = await response.json();
        setDeploymentStatus(data.status);
      }
    } catch (error) {
      console.error('Error fetching deployment status:', error);
    }
  };

  // Download report
  const downloadReport = async () => {
    try {
      const response = await fetch('/api/qmoi/auto-fix/download-report');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qmoi-auto-fix-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      addLog(`Error downloading report: ${error}`);
    }
  };

  // Auto-refresh data
  useEffect(() => {
    fetchReport();
    fetchGitHubStatus();
    fetchDeploymentStatus();

    const interval = setInterval(() => {
      fetchReport();
      fetchGitHubStatus();
      fetchDeploymentStatus();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto mode effect
  useEffect(() => {
    if (autoMode && !isRunning) {
      const autoInterval = setInterval(() => {
        startAutoFix();
      }, 300000); // Run every 5 minutes

      return () => clearInterval(autoInterval);
    }
  }, [autoMode, isRunning]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
      case 'failure':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'error':
      case 'failure':
        return <Badge variant="destructive">Error</Badge>;
      case 'running':
        return <Badge variant="secondary" className="bg-blue-500">Running</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QMOI Auto-Fix Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive automation and error fixing system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={toggleAutoMode}
            variant={autoMode ? "default" : "outline"}
            className={autoMode ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <Zap className="h-4 w-4 mr-2" />
            Auto Mode {autoMode ? "ON" : "OFF"}
          </Button>
          <Button onClick={fetchReport} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Fix Status</CardTitle>
            {report && getStatusIcon(report.status)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {report ? getStatusBadge(report.status) : "Unknown"}
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated: {report?.timestamp ? new Date(report.timestamp).toLocaleString() : "Never"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GitHub Actions</CardTitle>
            {githubStatus && getStatusIcon(githubStatus.status)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {githubStatus ? getStatusBadge(githubStatus.status) : "Unknown"}
            </div>
            <p className="text-xs text-muted-foreground">
              {githubStatus?.workflow || "No workflow"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deployment</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getStatusBadge(deploymentStatus)}
            </div>
            <p className="text-xs text-muted-foreground">
              Vercel deployment status
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto Mode</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {autoMode ? (
                <Badge variant="default" className="bg-green-500">Active</Badge>
              ) : (
                <Badge variant="outline">Inactive</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Automatic error fixing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Summary Cards */}
          {report && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">MD Files Processed</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{report.summary.md_files_processed}</div>
                  <Progress value={report.summary.md_files_processed > 0 ? 100 : 0} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Claims Verified</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{report.summary.claims_verified}</div>
                  <p className="text-xs text-muted-foreground">
                    {report.summary.claims_fixed} fixed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Errors Fixed</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{report.summary.errors_fixed}</div>
                  <p className="text-xs text-muted-foreground">
                    {report.summary.manual_errors_fixed} manual
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest auto-fix operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {report?.details.slice(0, 5).map((detail, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                    {getStatusIcon(detail.type === 'broken_claim' ? 'error' : 'completed')}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{detail.type}</p>
                      {detail.file && <p className="text-xs text-muted-foreground">{detail.file}</p>}
                      {detail.claim && <p className="text-xs text-muted-foreground">Claim: {detail.claim}</p>}
                    </div>
                  </div>
                ))}
                {(!report?.details || report.details.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {/* Detailed Report */}
          {report && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Report</CardTitle>
                <CardDescription>Comprehensive auto-fix analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>MD Files Processed: {report.summary.md_files_processed}</div>
                      <div>Claims Verified: {report.summary.claims_verified}</div>
                      <div>Claims Fixed: {report.summary.claims_fixed}</div>
                      <div>Errors Fixed: {report.summary.errors_fixed}</div>
                      <div>Manual Errors Fixed: {report.summary.manual_errors_fixed}</div>
                      <div>New Features Documented: {report.summary.new_features_documented}</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Deployment Status</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Status: {report.deployment.status}</div>
                      <div>GitHub Actions: {report.deployment.github_actions}</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">All Details</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {report.details.map((detail, index) => (
                        <div key={index} className="p-2 border rounded text-sm">
                          <div className="font-medium">{detail.type}</div>
                          {detail.file && <div className="text-muted-foreground">File: {detail.file}</div>}
                          {detail.claim && <div className="text-muted-foreground">Claim: {detail.claim}</div>}
                          {detail.error && <div className="text-red-500">Error: {detail.error}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          {/* Live Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Live Logs</CardTitle>
              <CardDescription>Real-time system activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index}>{log}</div>
                  ))
                ) : (
                  <div className="text-gray-500">No logs available</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Fix Controls</CardTitle>
                <CardDescription>Manual control of auto-fix system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={startAutoFix}
                  disabled={isRunning}
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Auto-Fix
                </Button>
                <Button
                  onClick={stopAutoFix}
                  disabled={!isRunning}
                  variant="destructive"
                  className="w-full"
                >
                  <Stop className="h-4 w-4 mr-2" />
                  Stop Auto-Fix
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reports & Data</CardTitle>
                <CardDescription>Export and manage reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={downloadReport}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button
                  onClick={fetchReport}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* GitHub Actions Status */}
          {githubStatus && (
            <Card>
              <CardHeader>
                <CardTitle>GitHub Actions Status</CardTitle>
                <CardDescription>Workflow execution details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Workflow:</span>
                    <span className="font-mono">{githubStatus.workflow}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    {getStatusBadge(githubStatus.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Run:</span>
                    <span>{new Date(githubStatus.last_run).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Duration:</span>
                    <span>{githubStatus.duration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 