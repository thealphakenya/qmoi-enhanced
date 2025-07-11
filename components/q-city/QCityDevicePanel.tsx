import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { useRole } from '../security/RoleContext';
import { 
  Server, 
  Database, 
  Settings, 
  Shield, 
  Activity, 
  HardDrive,
  Cloud,
  Terminal,
  Package,
  FileCode,
  Zap,
  Brain,
  Network,
  RefreshCw,
  Lock,
  TrendingUp,
  Cpu,
  Wifi,
  Users
} from 'lucide-react';
import axios from 'axios';

interface QCityDeviceStatus {
  enabled: boolean;
  primaryDevice: boolean;
  resourceOffloading: boolean;
  storageInQCity: boolean;
  unlimitedResources: boolean;
  aiOptimization: boolean;
  multiDevice: boolean;
  autoUpgrade: boolean;
  status: 'online' | 'offline' | 'connecting';
  resourceUsage: {
    memory: number;
    storage: number;
    processing: number;
    bandwidth: number;
    connections: number;
  };
}

// Add types for workspace objects
interface Workspace {
  id: string;
  name?: string;
  status?: string;
}

export default function QCityDevicePanel() {
  const { role } = useRole();
  const [qcityStatus, setQcityStatus] = useState<QCityDeviceStatus>({
    enabled: true,
    primaryDevice: true,
    resourceOffloading: true,
    storageInQCity: true,
    unlimitedResources: true,
    aiOptimization: true,
    multiDevice: true,
    autoUpgrade: true,
    status: 'online',
    resourceUsage: {
      memory: 25,
      storage: 40,
      processing: 30,
      bandwidth: 50,
      connections: 35
    }
  });

  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [buildFiles, setBuildFiles] = useState<any[]>([]);
  const [gitpodWorkspaces, setGitpodWorkspaces] = useState<Workspace[]>([]);
  const [localWorkspaces, setLocalWorkspaces] = useState<Workspace[]>([]);
  const [workspaceError, setWorkspaceError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<Record<string, string>>({});

  const isMaster = role === 'admin';

  useEffect(() => {
    // Simulate QCity status updates with unlimited resources
    const interval = setInterval(() => {
      setQcityStatus(prev => ({
        ...prev,
        resourceUsage: {
          memory: Math.random() * 100 + 1,
          storage: Math.random() * 100 + 1,
          processing: Math.random() * 100 + 1,
          bandwidth: Math.random() * 100 + 1,
          connections: Math.random() * 100 + 1
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleQCity = (enabled: boolean) => {
    setQcityStatus(prev => ({ ...prev, enabled }));
  };

  const handleToggleResourceOffloading = (enabled: boolean) => {
    setQcityStatus(prev => ({ ...prev, resourceOffloading: enabled }));
  };

  const handleToggleAI = (enabled: boolean) => {
    setQcityStatus(prev => ({ ...prev, aiOptimization: enabled }));
  };

  const handleToggleMultiDevice = (enabled: boolean) => {
    setQcityStatus(prev => ({ ...prev, multiDevice: enabled }));
  };

  const loadBuildFiles = async () => {
    if (!isMaster) return;
    
    // Simulate loading build files from unlimited QCity storage
    const files = [
      { name: 'node_modules', size: 'Unlimited', type: 'directory' },
      { name: 'build', size: 'Unlimited', type: 'directory' },
      { name: 'dist', size: 'Unlimited', type: 'directory' },
      { name: 'package-lock.json', size: '2MB', type: 'file' },
      { name: 'yarn.lock', size: '1.5MB', type: 'file' },
      { name: 'ai-models', size: 'Unlimited', type: 'directory' },
      { name: 'ml-cache', size: 'Unlimited', type: 'directory' }
    ];
    setBuildFiles(files);
    setShowSensitiveData(true);
  };

  const executeInQCity = async (command: string) => {
    console.log(`Executing in QCity with unlimited resources: ${command}`);
    // Simulate QCity command execution with unlimited resources
    return { success: true, output: `QCity executed with unlimited resources: ${command}` };
  };

  // Fetch workspaces
  useEffect(() => {
    if (!isMaster) return;
    setLoading(true);
    Promise.all([
      axios.get('/api/qcity/listWorkspaces').then(res => setGitpodWorkspaces(res.data.workspaces)).catch(() => setGitpodWorkspaces([])),
      axios.get('/api/qcity/listLocalWorkspaces').then(res => setLocalWorkspaces(res.data.workspaces)).catch(() => setLocalWorkspaces([])),
    ]).catch(err => setWorkspaceError('Failed to fetch workspaces')).finally(() => setLoading(false));
  }, [isMaster]);

  // Handlers for workspace actions
  const handleAction = async (
    type: 'gitpod' | 'local',
    id: string,
    action: 'stop' | 'clone' | 'sync' | 'start',
    extra: Record<string, any> = {}
  ) => {
    setWorkspaceError('');
    setLoading(true);
    try {
      let endpoint = '';
      const data = { id, ...extra };
      if (type === 'gitpod') {
        if (action === 'stop') endpoint = '/api/qcity/stopWorkspace';
        if (action === 'clone') endpoint = '/api/qcity/cloneWorkspace';
        if (action === 'sync') endpoint = '/api/qcity/syncWorkspace';
      } else if (type === 'local') {
        if (action === 'stop') endpoint = '/api/qcity/stopLocalWorkspace';
        if (action === 'start') endpoint = '/api/qcity/startLocalWorkspace';
      }
      if (endpoint) await axios.post(endpoint, data);
      // Refresh workspaces after action
      const [gp, lp] = await Promise.all([
        axios.get('/api/qcity/listWorkspaces').then(res => res.data.workspaces),
        axios.get('/api/qcity/listLocalWorkspaces').then(res => res.data.workspaces),
      ]);
      setGitpodWorkspaces(gp);
      setLocalWorkspaces(lp);
    } catch (err) {
      setWorkspaceError('Workspace action failed');
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs for a workspace (real-time SSE)
  const fetchLogs = async (type: 'gitpod' | 'local', id: string) => {
    setLogs(l => ({ ...l, [id]: 'Loading logs...' }));
    const eventSource = new EventSource(`/api/qcity/workspace-logs?id=${encodeURIComponent(id)}&type=${encodeURIComponent(type)}`);
    const logLines: string[] = [];
    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        setLogs(l => ({ ...l, [id]: logLines.join('\n') + '\n[DONE]' }));
        eventSource.close();
      } else {
        logLines.push(event.data);
        setLogs(l => ({ ...l, [id]: logLines.join('\n') }));
      }
    };
    eventSource.onerror = (err) => {
      setLogs(l => ({ ...l, [id]: 'Error loading logs.' }));
      eventSource.close();
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            QCity Device Status (Unlimited Resources)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={qcityStatus.status === 'online' ? 'default' : 'destructive'}>
                {qcityStatus.status.toUpperCase()}
              </Badge>
              <Badge variant="secondary">UNLIMITED</Badge>
              <span>QCity Device</span>
            </div>
            <Switch
              checked={qcityStatus.enabled}
              onCheckedChange={handleToggleQCity}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4" />
                Memory (Unlimited)
              </div>
              <Progress value={qcityStatus.resourceUsage.memory} />
              <span className="text-xs text-muted-foreground">
                {qcityStatus.resourceUsage.memory.toFixed(1)}% of unlimited
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <HardDrive className="h-4 w-4" />
                Storage (Unlimited)
              </div>
              <Progress value={qcityStatus.resourceUsage.storage} />
              <span className="text-xs text-muted-foreground">
                {qcityStatus.resourceUsage.storage.toFixed(1)}% of unlimited
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Cpu className="h-4 w-4" />
                Processing (Unlimited)
              </div>
              <Progress value={qcityStatus.resourceUsage.processing} />
              <span className="text-xs text-muted-foreground">
                {qcityStatus.resourceUsage.processing.toFixed(1)}% of unlimited
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Wifi className="h-4 w-4" />
                Bandwidth (Unlimited)
              </div>
              <Progress value={qcityStatus.resourceUsage.bandwidth} />
              <span className="text-xs text-muted-foreground">
                {qcityStatus.resourceUsage.bandwidth.toFixed(1)}% of unlimited
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                Connections (Unlimited)
              </div>
              <Progress value={qcityStatus.resourceUsage.connections} />
              <span className="text-xs text-muted-foreground">
                {qcityStatus.resourceUsage.connections.toFixed(1)}% of unlimited
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Resource Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                <span>Resource Offloading</span>
              </div>
              <Switch
                checked={qcityStatus.resourceOffloading}
                onCheckedChange={handleToggleResourceOffloading}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>AI Optimization</span>
              </div>
              <Switch
                checked={qcityStatus.aiOptimization}
                onCheckedChange={handleToggleAI}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                <span>Multi-Device Support</span>
              </div>
              <Switch
                checked={qcityStatus.multiDevice}
                onCheckedChange={handleToggleMultiDevice}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>Auto-Upgrade</span>
              </div>
              <Switch
                checked={qcityStatus.autoUpgrade}
                onCheckedChange={(enabled) => setQcityStatus(prev => ({ ...prev, autoUpgrade: enabled }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => executeInQCity('npm install')}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Install Dependencies
            </Button>
            <Button
              variant="outline"
              onClick={() => executeInQCity('npm run build')}
              className="flex items-center gap-2"
            >
              <FileCode className="h-4 w-4" />
              Build Project
            </Button>
            <Button
              variant="outline"
              onClick={() => executeInQCity('npm test')}
              className="flex items-center gap-2"
            >
              <Terminal className="h-4 w-4" />
              Run Tests
            </Button>
            <Button
              variant="outline"
              onClick={() => executeInQCity('npm run lint')}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Lint Code
            </Button>
            <Button
              variant="outline"
              onClick={() => executeInQCity('qcity:upgrade')}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Auto-Upgrade
            </Button>
            <Button
              variant="outline"
              onClick={() => executeInQCity('qcity:optimize')}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              AI Optimize
            </Button>
            <Button
              variant="outline"
              onClick={() => executeInQCity('qcity:cluster')}
              className="flex items-center gap-2"
            >
              <Network className="h-4 w-4" />
              Multi-Device
            </Button>
            <Button
              variant="outline"
              onClick={() => executeInQCity('qcity:security-audit')}
              className="flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              Security Audit
            </Button>
            <Button
              variant="outline"
              onClick={() => executeInQCity('qcity:tune')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Performance Tune
            </Button>
          </div>
        </CardContent>
      </Card>

      {isMaster && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Master Controls (Unlimited Access)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Master access: You can view and manage all QCity build files, sensitive data, and unlimited resources.
              </AlertDescription>
            </Alert>

            <Button
              onClick={loadBuildFiles}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Load Unlimited Build Files
            </Button>

            {showSensitiveData && buildFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Unlimited Build Files in QCity:</h4>
                <div className="space-y-1">
                  {buildFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        {file.type === 'directory' ? (
                          <Database className="h-4 w-4" />
                        ) : (
                          <FileCode className="h-4 w-4" />
                        )}
                        <span>{file.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{file.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isMaster && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Master access required to view unlimited build files and sensitive data in QCity.
          </AlertDescription>
        </Alert>
      )}

      {isMaster && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Gitpod/QMOI Workspace Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-2">
              <Badge variant="default">Master Only</Badge>
              <span className="ml-2 text-muted-foreground">Manage all Gitpod and QMOI-local workspaces here. Fallback to QMOI-local if Gitpod is unavailable.</span>
            </div>
            {workspaceError && <Alert><AlertDescription>{workspaceError}</AlertDescription></Alert>}
            {loading && <div>Loading workspaces...</div>}
            <div className="space-y-2">
              <div className="font-bold">Gitpod Workspaces</div>
              {gitpodWorkspaces.length === 0 && <div className="text-muted-foreground">No Gitpod workspaces found.</div>}
              {gitpodWorkspaces.map(ws => (
                <div key={ws.id} className="flex items-center justify-between p-2 border rounded">
                  <span>{ws.id} ({ws.status})</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleAction('gitpod', ws.id, 'stop')}>Stop</Button>
                    <Button size="sm" variant="outline" onClick={() => handleAction('gitpod', ws.id, 'clone')}>Clone</Button>
                    <Button size="sm" variant="default" onClick={() => handleAction('gitpod', ws.id, 'sync')}>Sync</Button>
                    <Button size="sm" variant="ghost" onClick={() => fetchLogs('gitpod', ws.id)}>Logs</Button>
                  </div>
                  {logs[ws.id] && <div className="mt-2 text-xs text-muted-foreground">{logs[ws.id]}</div>}
                </div>
              ))}
            </div>
            <div className="space-y-2 mt-4">
              <div className="font-bold">QMOI-local Workspaces</div>
              {localWorkspaces.length === 0 && <div className="text-muted-foreground">No local workspaces found.</div>}
              {localWorkspaces.map(ws => (
                <div key={ws.id} className="flex items-center justify-between p-2 border rounded">
                  <span>{ws.name} ({ws.status})</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleAction('local', ws.id, 'stop')}>Stop</Button>
                    <Button size="sm" variant="default" onClick={() => fetchLogs('local', ws.id)}>Logs</Button>
                  </div>
                  {logs[ws.id] && <div className="mt-2 text-xs text-muted-foreground">{logs[ws.id]}</div>}
                </div>
              ))}
            </div>
            <Alert>
              <AlertDescription>
                <span className="text-warning">If Gitpod is unavailable, QMOI will automatically use local/ephemeral workspaces with identical automation and audit features. All changes will sync back to Gitpod when available.</span>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {!isMaster && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Master access required to view unlimited build files and sensitive data in QCity.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 