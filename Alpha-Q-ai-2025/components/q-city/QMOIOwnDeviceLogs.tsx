import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Filter, 
  Search, 
  Calendar, 
  Activity, 
  Shield, 
  Unlock, 
  Eye,
  BarChart3,
  History,
  Settings,
  RefreshCw
} from 'lucide-react';

interface DeviceOwnershipLog {
  id: number;
  timestamp: string;
  action: string;
  device_id: string;
  device_info: any;
  restriction_type?: string;
  organization?: string;
  severity?: string;
  success: boolean;
  duration_ms: number;
  error_message?: string;
  master_user: string;
  session_id: string;
  ip_address: string;
  user_agent: string;
  additional_data: any;
}

interface UnlockLog {
  id: number;
  timestamp: string;
  device_id: string;
  unlock_method: string;
  attempt_number: number;
  success: boolean;
  duration_ms: number;
  error_details?: string;
  bypass_techniques: string[];
  verification_results: any;
}

interface MasterLog {
  id: number;
  timestamp: string;
  master_user: string;
  action: string;
  target_device?: string;
  success: boolean;
  details: any;
  session_id: string;
}

interface DeviceHistory {
  device_id: string;
  first_detected: string;
  last_activity: string;
  total_attempts: number;
  successful_unlocks: number;
  organizations_detected: string[];
  status: string;
}

interface Statistics {
  total_detections: number;
  total_unlock_attempts: number;
  successful_unlocks: number;
  failed_unlocks: number;
  master_actions: number;
  unique_devices: number;
  organizations_detected: string[];
  success_rate: number;
}

interface QMOIOwnDeviceLogsProps {
  isMaster: boolean;
  onExport?: (data: any, type: string) => void;
}

export function QMOIOwnDeviceLogs({ isMaster, onExport }: QMOIOwnDeviceLogsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [ownershipLogs, setOwnershipLogs] = useState<DeviceOwnershipLog[]>([]);
  const [unlockLogs, setUnlockLogs] = useState<UnlockLog[]>([]);
  const [masterLogs, setMasterLogs] = useState<MasterLog[]>([]);
  const [deviceHistory, setDeviceHistory] = useState<DeviceHistory[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  
  // Filter states
  const [logType, setLogType] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState(100);
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

  useEffect(() => {
    if (isMaster) {
      loadLogs();
      if (autoRefresh) {
        const interval = setInterval(loadLogs, refreshInterval * 1000);
        return () => clearInterval(interval);
      }
    }
  }, [isMaster, logType, deviceFilter, dateFrom, dateTo, limit, autoRefresh, refreshInterval]);

  const loadLogs = async () => {
    if (!isMaster) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/qmoi/own-device-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          log_type: logType,
          device_id: deviceFilter || undefined,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
          limit
        })
      });

      if (!response.ok) {
        throw new Error('Failed to load logs');
      }

      const data = await response.json();
      
      if (data.ownership_logs) setOwnershipLogs(data.ownership_logs);
      if (data.unlock_logs) setUnlockLogs(data.unlock_logs);
      if (data.master_logs) setMasterLogs(data.master_logs);
      if (data.device_history) setDeviceHistory(data.device_history);
      if (data.statistics) setStatistics(data.statistics);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: string) => {
    if (!isMaster) return;
    
    try {
      const response = await fetch('/api/qmoi/own-device-logs/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          device_id: deviceFilter || undefined,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to export logs');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qmoi-own-device-logs-${type}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export logs');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSuccessColor = (success: boolean) => {
    return success ? 'bg-green-500' : 'bg-red-500';
  };

  if (!isMaster) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Master access required to view QMOI Own Device logs and history.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Unlock className="h-5 w-5" />
                QMOI Own Device Logs & History
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Master-only access to device ownership detection and unlock logs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadLogs}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Log Type</label>
                <Select value={logType} onValueChange={setLogType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Logs</SelectItem>
                    <SelectItem value="ownership">Ownership Detection</SelectItem>
                    <SelectItem value="unlock">Unlock Attempts</SelectItem>
                    <SelectItem value="master">Master Actions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Device ID</label>
                <Input
                  placeholder="Filter by device ID"
                  value={deviceFilter}
                  onChange={(e) => setDeviceFilter(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Date From</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Date To</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                <label htmlFor="autoRefresh" className="text-sm">Auto-refresh</label>
              </div>
              
              {autoRefresh && (
                <Select value={refreshInterval.toString()} onValueChange={(v) => setRefreshInterval(parseInt(v))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Overview */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total Detections</p>
                  <p className="text-2xl font-bold">{statistics.total_detections}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Unlock Attempts</p>
                  <p className="text-2xl font-bold">{statistics.total_unlock_attempts}</p>
                </div>
                <Unlock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Success Rate</p>
                  <p className="text-2xl font-bold">{statistics.success_rate.toFixed(1)}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Unique Devices</p>
                  <p className="text-2xl font-bold">{statistics.unique_devices}</p>
                </div>
                <Eye className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ownership">Ownership Logs</TabsTrigger>
          <TabsTrigger value="unlock">Unlock Logs</TabsTrigger>
          <TabsTrigger value="master">Master Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ownershipLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={getSeverityColor(log.severity)}>
                        {log.restriction_type || 'Detection'}
                      </Badge>
                      <div>
                        <p className="font-medium">{log.device_id}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.organization} • {formatTimestamp(log.timestamp)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={log.success ? 'default' : 'destructive'}>
                      {log.success ? 'Success' : 'Failed'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device ID</TableHead>
                    <TableHead>First Detected</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deviceHistory.slice(0, 10).map((device) => (
                    <TableRow key={device.device_id}>
                      <TableCell className="font-medium">{device.device_id}</TableCell>
                      <TableCell>{formatTimestamp(device.first_detected)}</TableCell>
                      <TableCell>{formatTimestamp(device.last_activity)}</TableCell>
                      <TableCell>{device.total_attempts}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(device.successful_unlocks / device.total_attempts) * 100} 
                            className="w-20"
                          />
                          <span className="text-sm">
                            {device.successful_unlocks}/{device.total_attempts}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
                          {device.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ownership" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ownership Detection Logs</CardTitle>
                <Button onClick={() => handleExport('ownership')} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Device ID</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Restriction Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Success</TableHead>
                    <TableHead>Master User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ownershipLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                      <TableCell className="font-medium">{log.device_id}</TableCell>
                      <TableCell>{log.organization || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.restriction_type || 'Unknown'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(log.severity)}>
                          {log.severity || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.success ? 'default' : 'destructive'}>
                          {log.success ? 'Success' : 'Failed'}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.master_user}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unlock" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Unlock Attempt Logs</CardTitle>
                <Button onClick={() => handleExport('unlock')} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Device ID</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Attempt #</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Success</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unlockLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                      <TableCell className="font-medium">{log.device_id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.unlock_method}</Badge>
                      </TableCell>
                      <TableCell>{log.attempt_number}</TableCell>
                      <TableCell>{log.duration_ms}ms</TableCell>
                      <TableCell>
                        <Badge variant={log.success ? 'default' : 'destructive'}>
                          {log.success ? 'Success' : 'Failed'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.error_details && (
                          <span className="text-red-500 text-sm">
                            {log.error_details.substring(0, 50)}...
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="master" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Master Action Logs</CardTitle>
                <Button onClick={() => handleExport('master')} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Master User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target Device</TableHead>
                    <TableHead>Success</TableHead>
                    <TableHead>Session ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {masterLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                      <TableCell className="font-medium">{log.master_user}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell>{log.target_device || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={log.success ? 'default' : 'destructive'}>
                          {log.success ? 'Success' : 'Failed'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.session_id}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 