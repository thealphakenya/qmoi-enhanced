import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Users,
  Globe,
  Settings,
  Download,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

interface RevenueData {
  current: number;
  target: number;
  progress: number;
  streams: RevenueStream[];
  history: RevenueHistory[];
}

interface RevenueStream {
  id: string;
  name: string;
  target: number;
  current: number;
}

interface RevenueHistory {
  timestamp: string;
  revenue: number;
  target: number;
  progress: number;
}

interface ActivityData {
  recent: Activity[];
  byType: Record<string, Activity[]>;
  byPlatform: Record<string, Activity[]>;
}

interface Activity {
  id: string;
  type: string;
  platform: string;
  timestamp: string;
  revenue: number;
  details: string;
}

interface PlatformData {
  active: Platform[];
  accounts: Account[];
  performance: Record<string, PerformanceData>;
}

interface Platform {
  id: string;
  name: string;
  type: string;
  revenue: number;
  accounts: number;
}

interface Account {
  id: string;
  platform: string;
  username: string;
  email: string;
  status: string;
  createdAt: string;
  revenue: number;
}

interface PerformanceData {
  revenue: PerformancePoint[];
  accounts: PerformancePoint[];
  engagement: PerformancePoint[];
}

interface PerformancePoint {
  timestamp: string;
  value: number;
}

interface DashboardData {
  revenue: RevenueData;
  activities: ActivityData;
  platforms: PlatformData;
}

const QMOIRevenueDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [masterMode, setMasterMode] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/qmoi/revenue-dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('qmoi-master-token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const enableMasterMode = async () => {
    try {
      const response = await fetch('/api/qmoi/master-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('qmoi-master-token')}`
        },
        body: JSON.stringify({ enabled: true })
      });

      if (response.ok) {
        setMasterMode(true);
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to enable master mode:', err);
    }
  };

  const exportDashboardData = async () => {
    try {
      const response = await fetch('/api/qmoi/revenue-dashboard/export', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('qmoi-master-token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qmoi-revenue-dashboard-${new Date().toISOString()}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to export dashboard data:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE');
  };

  if (!masterMode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Master Access Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This dashboard contains sensitive revenue and activity data. 
              Master mode is required to access this information.
            </p>
            <Button onClick={enableMasterMode} className="w-full">
              Enable Master Mode
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Loading QMOI Revenue Dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchDashboardData} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No dashboard data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QMOI Revenue Dashboard</h1>
          <p className="text-muted-foreground">
            Master-only access to all revenue activities and analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowSensitiveData(!showSensitiveData)}
          >
            {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showSensitiveData ? 'Hide' : 'Show'} Sensitive Data
          </Button>
          <Button variant="outlined" size="small" onClick={exportDashboardData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outlined" size="small" onClick={fetchDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Revenue Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(dashboardData.revenue.current)}
              </p>
              <p className="text-sm text-muted-foreground">Current Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(dashboardData.revenue.target)}
              </p>
              <p className="text-sm text-muted-foreground">Daily Target</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {dashboardData.revenue.progress.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Progress</p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={dashboardData.revenue.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Streams</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue History Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Revenue History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Revenue history chart will be displayed here
                </div>
              </CardContent>
            </Card>

            {/* Top Revenue Streams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Top Revenue Streams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.revenue.streams
                    .sort((a, b) => b.current - a.current)
                    .slice(0, 5)
                    .map((stream) => (
                      <div key={stream.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{stream.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(stream.current)} / {formatCurrency(stream.target)}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {((stream.current / stream.target) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Streams Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                All Revenue Streams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.revenue.streams.map((stream) => (
                  <Card key={stream.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{stream.name}</h3>
                      <Badge variant="outline">{stream.id}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current:</span>
                        <span className="font-medium">{formatCurrency(stream.current)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Target:</span>
                        <span className="font-medium">{formatCurrency(stream.target)}</span>
                      </div>
                      <Progress 
                        value={(stream.current / stream.target) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.activities.recent.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{activity.type}</Badge>
                      <div>
                        <p className="font-medium">{activity.details}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(activity.timestamp)} • {activity.platform}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        +{formatCurrency(activity.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Platforms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Active Platforms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.platforms.active.map((platform) => (
                    <div key={platform.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{platform.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {platform.type} • {platform.accounts} accounts
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          {formatCurrency(platform.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Platform Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.platforms.accounts
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 10)
                    .map((account) => (
                      <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{account.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {account.platform} • {formatDate(account.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                            {account.status}
                          </Badge>
                          {showSensitiveData && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {account.email}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QMOIRevenueDashboard; 