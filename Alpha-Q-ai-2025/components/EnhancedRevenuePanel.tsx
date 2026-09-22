'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  TrendingUp, 
  Phone, 
  CreditCard, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

interface RevenueData {
  mpesa: number;
  airtel: number;
  combined: number;
  today: {
    mpesa: number;
    airtel: number;
    combined: number;
  };
  targets: {
    daily: {
      mpesa: number;
      airtel: number;
      combined: number;
    };
    autoTransfer: {
      mpesa: number;
      airtel: number;
      combined: number;
    };
  };
  status: string;
}

interface Transaction {
  id: string;
  type: string;
  stream?: string;
  amount: number;
  timestamp: string;
  status: string;
}

export default function EnhancedRevenuePanel() {
  const [isMaster, setIsMaster] = useState(false);
  const [masterKey, setMasterKey] = useState('');
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [engineStatus, setEngineStatus] = useState('stopped');
  const [loading, setLoading] = useState(false);
  const [targetAmount, setTargetAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedType, setSelectedType] = useState('mpesa');
  const [autoTransferEnabled, setAutoTransferEnabled] = useState(true);
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    email: true,
    sms: true
  });

  useEffect(() => {
    checkMasterStatus();
    if (isMaster) {
      loadRevenueData();
      const interval = setInterval(loadRevenueData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isMaster]);

  const checkMasterStatus = async () => {
    try {
      const response = await fetch('/api/qmoi/master/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: masterKey })
      });
      
      if (response.ok) {
        setIsMaster(true);
        loadRevenueData();
      }
    } catch (error) {
      console.error('Master verification failed:', error);
    }
  };

  const loadRevenueData = async () => {
    try {
      const response = await fetch('/api/qmoi/revenue/status');
      if (response.ok) {
        const data = await response.json();
        setRevenueData(data);
        setEngineStatus(data.status);
      }

      const txResponse = await fetch('/api/qmoi/revenue/transactions');
      if (txResponse.ok) {
        const txData = await txResponse.json();
        setTransactions(txData);
      }
    } catch (error) {
      console.error('Failed to load revenue data:', error);
    }
  };

  const handleMasterLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/qmoi/master/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: masterKey })
      });

      if (response.ok) {
        setIsMaster(true);
        await loadRevenueData();
      } else {
        alert('Invalid master key');
      }
    } catch (error) {
      console.error('Master login failed:', error);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const startEngine = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/qmoi/revenue/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setEngineStatus('running');
        await loadRevenueData();
      }
    } catch (error) {
      console.error('Failed to start engine:', error);
    } finally {
      setLoading(false);
    }
  };

  const stopEngine = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/qmoi/revenue/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setEngineStatus('stopped');
        await loadRevenueData();
      }
    } catch (error) {
      console.error('Failed to stop engine:', error);
    } finally {
      setLoading(false);
    }
  };

  const setTarget = async () => {
    if (!targetAmount || !selectedType) return;

    setLoading(true);
    try {
      const response = await fetch('/api/qmoi/revenue/target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          amount: parseInt(targetAmount)
        })
      });

      if (response.ok) {
        setTargetAmount('');
        await loadRevenueData();
      }
    } catch (error) {
      console.error('Failed to set target:', error);
    } finally {
      setLoading(false);
    }
  };

  const manualTransfer = async () => {
    if (!transferAmount || !selectedType) return;

    setLoading(true);
    try {
      const response = await fetch('/api/qmoi/revenue/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          amount: parseInt(transferAmount)
        })
      });

      if (response.ok) {
        setTransferAmount('');
        await loadRevenueData();
      }
    } catch (error) {
      console.error('Failed to transfer:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetDaily = async () => {
    if (!confirm('Are you sure you want to reset daily earnings?')) return;

    setLoading(true);
    try {
      const response = await fetch('/api/qmoi/revenue/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        await loadRevenueData();
      }
    } catch (error) {
      console.error('Failed to reset daily earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isMaster) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Master Access Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="master-key">Master Key</Label>
            <Input
              id="master-key"
              type="password"
              placeholder="Enter master key"
              value={masterKey}
              onChange={(e) => setMasterKey(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleMasterLogin} 
            disabled={loading || !masterKey}
            className="w-full"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Access Revenue Panel'}
          </Button>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This panel contains sensitive financial controls. Only authorized master users can access.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!revenueData) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const today = revenueData.today;
  const targets = revenueData.targets.daily;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QMOI Enhanced Revenue Panel</h1>
          <p className="text-muted-foreground">Master-controlled revenue generation system</p>
        </div>
        <Badge variant={engineStatus === 'running' ? 'default' : 'secondary'}>
          {engineStatus === 'running' ? (
            <Play className="h-3 w-3 mr-1" />
          ) : (
            <Pause className="h-3 w-3 mr-1" />
          )}
          {engineStatus}
        </Badge>
      </div>

      {/* Engine Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Engine Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={startEngine} 
              disabled={loading || engineStatus === 'running'}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Engine
            </Button>
            <Button 
              onClick={stopEngine} 
              disabled={loading || engineStatus === 'stopped'}
              variant="destructive"
              className="flex-1"
            >
              <Pause className="h-4 w-4 mr-2" />
              Stop Engine
            </Button>
            <Button 
              onClick={loadRevenueData} 
              disabled={loading}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">M-Pesa Revenue</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {today.mpesa.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Target: KES {targets.mpesa.toLocaleString()}
            </p>
            <Progress 
              value={(today.mpesa / targets.mpesa) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Airtel Money Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {today.airtel.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Target: KES {targets.airtel.toLocaleString()}
            </p>
            <Progress 
              value={(today.airtel / targets.airtel) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Combined Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {today.combined.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Target: KES {targets.combined.toLocaleString()}
            </p>
            <Progress 
              value={(today.combined / targets.combined) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Master Controls */}
      <Tabs defaultValue="targets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="targets">Targets</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="targets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Set Revenue Targets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Type</Label>
                  <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="mpesa">M-Pesa</option>
                    <option value="airtel">Airtel Money</option>
                    <option value="combined">Combined</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Daily Target (KES)</Label>
                  <Input
                    type="number"
                    placeholder="Enter target amount"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={setTarget} disabled={loading || !targetAmount}>
                Set Target
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Transfer Type</Label>
                  <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="mpesa">M-Pesa</option>
                    <option value="airtel">Airtel Money</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Amount (KES)</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={manualTransfer} disabled={loading || !transferAmount}>
                Transfer Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auto-Transfer Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={autoTransferEnabled}
                  onCheckedChange={setAutoTransferEnabled}
                />
                <Label>Enable Auto-Transfers</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>M-Pesa Auto-Transfer: KES {revenueData.targets.autoTransfer.mpesa}</p>
                  <p>Airtel Auto-Transfer: KES {revenueData.targets.autoTransfer.airtel}</p>
                </div>
                <div>
                  <p>Combined Auto-Transfer: KES {revenueData.targets.autoTransfer.combined}</p>
                  <p>Frequency: Every hour</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{tx.type.replace('_', ' ').toUpperCase()}</p>
                      {tx.stream && <p className="text-sm text-muted-foreground">{tx.stream}</p>}
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">KES {tx.amount.toLocaleString()}</p>
                      <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Master Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Notifications</Label>
                <div className="space-y-2">
                  {Object.entries(notifications).map(([key, enabled]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                      <Label className="capitalize">{key}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>System Actions</Label>
                <div className="flex gap-2">
                  <Button onClick={resetDaily} variant="outline" disabled={loading}>
                    Reset Daily Earnings
                  </Button>
                  <Button onClick={loadRevenueData} variant="outline" disabled={loading}>
                    Refresh Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Total Earnings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Total Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                KES {revenueData.mpesa.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total M-Pesa</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                KES {revenueData.airtel.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Airtel Money</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                KES {revenueData.combined.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Combined</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 