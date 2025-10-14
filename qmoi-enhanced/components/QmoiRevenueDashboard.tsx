"use client";

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  Play, 
  Pause, 
  RefreshCw,
  BarChart3,
  Activity,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Zap,
  Smartphone,
  CreditCard,
  Users,
  FileText,
  Settings
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RevenueStream {
  id: string;
  name: string;
  type: 'trading' | 'affiliate' | 'saas' | 'content' | 'automation' | 'consulting';
  dailyTarget: number;
  currentEarnings: number;
  status: 'active' | 'paused' | 'failed';
  lastUpdated: string;
}

interface RevenueTransaction {
  id: string;
  streamId: string;
  amount: number;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

interface RevenueStatus {
  isRunning: boolean;
  totalEarnings: number;
  dailyProgress: {
    target: number;
    current: number;
    percentage: number;
  };
  streams: RevenueStream[];
}

const QmoiRevenueDashboard: React.FC = () => {
  const [revenueStatus, setRevenueStatus] = useState<RevenueStatus | null>(null);
  const [transactions, setTransactions] = useState<RevenueTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mpesaStatus, setMpesaStatus] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchRevenueStatus = async () => {
    try {
      const response = await fetch('/api/qmoi/revenue?action=status', {
        headers: {
          'x-qmoi-master': 'true'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRevenueStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch revenue status:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/qmoi/revenue?action=transactions&limit=100', {
        headers: {
          'x-qmoi-master': 'true'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleRevenueAction = async (action: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/qmoi/revenue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-qmoi-master': 'true'
        },
        body: JSON.stringify({ action })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMpesaStatus(data.message);
          await fetchRevenueStatus();
        }
      }
    } catch (error) {
      console.error(`Failed to ${action} revenue engine:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStreamIcon = (type: string) => {
    switch (type) {
      case 'trading': return <TrendingUp className="w-4 h-4" />;
      case 'affiliate': return <Users className="w-4 h-4" />;
      case 'saas': return <Settings className="w-4 h-4" />;
      case 'content': return <FileText className="w-4 h-4" />;
      case 'automation': return <Zap className="w-4 h-4" />;
      case 'consulting': return <Activity className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getStreamColor = (type: string) => {
    switch (type) {
      case 'trading': return 'bg-green-100 text-green-800';
      case 'affiliate': return 'bg-blue-100 text-blue-800';
      case 'saas': return 'bg-purple-100 text-purple-800';
      case 'content': return 'bg-orange-100 text-orange-800';
      case 'automation': return 'bg-yellow-100 text-yellow-800';
      case 'consulting': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  useEffect(() => {
    fetchRevenueStatus();
    fetchTransactions();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchRevenueStatus();
        fetchTransactions();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  if (!revenueStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QMOI Revenue Dashboard</h1>
          <p className="text-gray-600">Real-time revenue generation and M-Pesa integration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
        </div>
      </div>

      {/* Revenue Engine Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Revenue Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {revenueStatus.isRunning ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Pause className="w-5 h-5 text-red-500" />
                )}
                <span className="font-medium">
                  Status: {revenueStatus.isRunning ? 'Running' : 'Stopped'}
                </span>
              </div>
              <Badge variant={revenueStatus.isRunning ? "default" : "secondary"}>
                {revenueStatus.isRunning ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleRevenueAction('start')}
                disabled={isLoading || revenueStatus.isRunning}
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
              <Button
                onClick={() => handleRevenueAction('stop')}
                disabled={isLoading || !revenueStatus.isRunning}
                variant="destructive"
                size="sm"
              >
                <Pause className="w-4 h-4 mr-2" />
                Stop
              </Button>
              <Button
                onClick={() => handleRevenueAction('transfer')}
                disabled={isLoading || revenueStatus.totalEarnings === 0}
                variant="outline"
                size="sm"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Transfer to M-Pesa
              </Button>
            </div>
          </div>
          {mpesaStatus && (
            <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded text-sm">
              {mpesaStatus}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">KES {revenueStatus.totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Target</p>
                <p className="text-2xl font-bold">KES {revenueStatus.dailyProgress.target.toLocaleString()}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <Progress 
              value={revenueStatus.dailyProgress.percentage} 
              className="mt-2" 
            />
            <p className="text-xs text-gray-500 mt-1">
              {revenueStatus.dailyProgress.percentage.toFixed(1)}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Streams</p>
                <p className="text-2xl font-bold">
                  {revenueStatus.streams.filter(s => s.status === 'active').length}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Streams and Transactions */}
      <Tabs defaultValue="streams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="streams">Revenue Streams</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="streams" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {revenueStatus.streams.map((stream) => (
              <Card key={stream.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStreamIcon(stream.type)}
                      <CardTitle className="text-lg">{stream.name}</CardTitle>
                    </div>
                    {getStatusIcon(stream.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Earnings</span>
                      <span className="font-semibold">KES {stream.currentEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Daily Target</span>
                      <span className="text-sm">KES {stream.dailyTarget.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={(stream.currentEarnings / stream.dailyTarget) * 100} 
                      className="h-2" 
                    />
                    <div className="flex items-center justify-between">
                      <Badge className={getStreamColor(stream.type)}>
                        {stream.type}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(stream.lastUpdated).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">KES {transaction.amount.toLocaleString()}</p>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QmoiRevenueDashboard; 