import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  GitMerge,
  Play,
  Stop,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';

interface Pipeline {
  id: number;
  status: 'running' | 'success' | 'failed' | 'pending';
  ref: string;
  created_at: string;
  duration?: number;
  web_url: string;
}

interface Job {
  id: number;
  name: string;
  status: 'running' | 'success' | 'failed' | 'pending';
  stage: string;
  duration?: number;
}

interface Deployment {
  id: string;
  state: 'READY' | 'ERROR' | 'BUILDING' | 'QUEUED';
  url?: string;
  created_at: string;
  meta: {
    githubCommitSha?: string;
    githubCommitMessage?: string;
  };
}

interface QMOIGitLabCloneProps {
  className?: string;
}

export function QMOIGitLabClone({ className }: QMOIGitLabCloneProps) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [autoFixEnabled, setAutoFixEnabled] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [errorCount, setErrorCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);

  // Real-time monitoring
  useEffect(() => {
    if (monitoringActive) {
      const interval = setInterval(() => {
        fetchPipelines();
        fetchJobs();
        fetchDeployments();
        checkErrors();
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [monitoringActive]);

  const fetchPipelines = async () => {
    try {
      const response = await fetch('/api/qmoi-gitlab/pipelines');
      if (response.ok) {
        const data = await response.json();
        setPipelines(data.pipelines || []);
      }
    } catch (error) {
      console.error('Error fetching pipelines:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/qmoi-gitlab/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchDeployments = async () => {
    try {
      const response = await fetch('/api/qmoi-gitlab/deployments');
      if (response.ok) {
        const data = await response.json();
        setDeployments(data.deployments || []);
      }
    } catch (error) {
      console.error('Error fetching deployments:', error);
    }
  };

  const checkErrors = async () => {
    try {
      const response = await fetch('/api/qmoi-gitlab/errors');
      if (response.ok) {
        const data = await response.json();
        setErrorCount(data.errorCount || 0);
        setSuccessCount(data.successCount || 0);
      }
    } catch (error) {
      console.error('Error checking errors:', error);
    }
  };

  const triggerPipeline = async () => {
    try {
      setSyncStatus('syncing');
      const response = await fetch('/api/qmoi-gitlab/trigger', {
        method: 'POST',
      });
      
      if (response.ok) {
        setSyncStatus('success');
        fetchPipelines(); // Refresh pipelines
        setTimeout(() => setSyncStatus('idle'), 3000);
      } else {
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error triggering pipeline:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const toggleMonitoring = () => {
    setMonitoringActive(!monitoringActive);
  };

  const toggleAutoFix = () => {
    setAutoFixEnabled(!autoFixEnabled);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'READY':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
      case 'ERROR':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'running':
      case 'BUILDING':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'pending':
      case 'QUEUED':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'success' || status === 'READY' ? 'default' :
                   status === 'failed' || status === 'ERROR' ? 'destructive' :
                   status === 'running' || status === 'BUILDING' ? 'secondary' : 'outline';
    
    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            QMOI GitLab Clone System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleMonitoring}
                variant={monitoringActive ? "destructive" : "default"}
                size="sm"
              >
                {monitoringActive ? <Stop className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {monitoringActive ? 'Stop Monitoring' : 'Start Monitoring'}
              </Button>
              
              <Button
                onClick={triggerPipeline}
                disabled={syncStatus === 'syncing'}
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                Trigger Pipeline
              </Button>
              
              <Button
                onClick={toggleAutoFix}
                variant={autoFixEnabled ? "default" : "outline"}
                size="sm"
              >
                <GitMerge className="h-4 w-4 mr-2" />
                Auto-Fix: {autoFixEnabled ? 'ON' : 'OFF'}
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-green-500">✓ {successCount}</span>
                <span className="mx-2">|</span>
                <span className="text-red-500">✗ {errorCount}</span>
              </div>
              
              {monitoringActive && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-500">Live</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Alerts */}
      {errorCount > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {errorCount} error(s) detected. Auto-fix is {autoFixEnabled ? 'enabled' : 'disabled'}.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="pipelines" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="pipelines" className="space-y-4">
          <div className="grid gap-4">
            {pipelines.map((pipeline) => (
              <Card key={pipeline.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(pipeline.status)}
                      <div>
                        <div className="font-medium">Pipeline #{pipeline.id}</div>
                        <div className="text-sm text-muted-foreground">
                          Branch: {pipeline.ref} • {new Date(pipeline.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(pipeline.status)}
                      {pipeline.duration && (
                        <span className="text-sm text-muted-foreground">
                          {Math.round(pipeline.duration / 60)}m
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <div className="grid gap-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <div className="font-medium">{job.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Stage: {job.stage}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(job.status)}
                      {job.duration && (
                        <span className="text-sm text-muted-foreground">
                          {Math.round(job.duration / 60)}m
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deployments" className="space-y-4">
          <div className="grid gap-4">
            {deployments.map((deployment) => (
              <Card key={deployment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(deployment.state)}
                      <div>
                        <div className="font-medium">Deployment {deployment.id.slice(0, 8)}</div>
                        <div className="text-sm text-muted-foreground">
                          {deployment.meta.githubCommitMessage || 'No commit message'}
                        </div>
                        {deployment.url && (
                          <a 
                            href={deployment.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            View Deployment
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(deployment.state)}
                      <span className="text-sm text-muted-foreground">
                        {new Date(deployment.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Success Rate</span>
                      <span>{successCount + errorCount > 0 ? Math.round((successCount / (successCount + errorCount)) * 100) : 0}%</span>
                    </div>
                    <Progress value={successCount + errorCount > 0 ? (successCount / (successCount + errorCount)) * 100 : 0} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-green-500 font-medium">{successCount}</div>
                      <div className="text-muted-foreground">Successful</div>
                    </div>
                    <div>
                      <div className="text-red-500 font-medium">{errorCount}</div>
                      <div className="text-muted-foreground">Errors</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Real-time Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monitoring</span>
                    <Badge variant={monitoringActive ? "default" : "secondary"}>
                      {monitoringActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-Fix</span>
                    <Badge variant={autoFixEnabled ? "default" : "secondary"}>
                      {autoFixEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sync Status</span>
                    <Badge variant={
                      syncStatus === 'success' ? "default" :
                      syncStatus === 'error' ? "destructive" :
                      syncStatus === 'syncing' ? "secondary" : "outline"
                    }>
                      {syncStatus.charAt(0).toUpperCase() + syncStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 