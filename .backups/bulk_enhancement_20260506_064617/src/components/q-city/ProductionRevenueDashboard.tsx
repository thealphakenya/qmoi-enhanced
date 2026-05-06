import React, { useState, useEffect } from "react";
// Master-only access control
const MasterAccessRequired = ({ children }: { children: React.ReactNode }) => {
  const [isMaster, setIsMaster] = React.useState(false);
  
  React.useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setIsMaster(userData.role === "master");
    }
  }, []);
  
  if (!isMaster) {
    return <div className="p-4 text-red-600">Access denied: Master users only</div>;
  }
  
  return <>{children}</>;
};

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import apiClient from "@/api/client";

interface RevenueData {
  timestamp: string;
  daily_target: number;
  current_revenue: number;
  achievement_rate: number;
  status: string;
  revenue_sources: Record<string, number>;
  predictions: {
    predicted_end_of_day: number;
    confidence: number;
    trend: string;
  };
}

const ProductionRevenueDashboard: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  // Fetch revenue data from production validator
  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await apiClient.get("/api/revenue/validate");
      const data = await res.json();
      
      setRevenueData(data);
      setLastUpdate(new Date().toISOString());
      
      // Prepare chart data
      const sources = Object.entries(data.revenue_sources || {}).map(([name, value]) => ({
        name: name.replace(/_/g, " ").toUpperCase(),
        value: Number(value) || 0
      }));
      
      setChartData(sources);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch revenue data");
      logger.error("Revenue fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Monitor revenue in real-time
  const toggleMonitoring = async () => {
    try {
      const res = await apiClient.post("/api/revenue/monitor", {
        enabled: !isMonitoring
      });
      const data = await res.json();
      setIsMonitoring(data.monitoring);
    } catch (err) {
      setError("Failed to toggle monitoring");
    }
  };

  // Auto-refresh
  useEffect(() => {
    fetchRevenueData();
    
    const interval = setInterval(() => {
      fetchRevenueData();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact"
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACHIEVING":
        return "bg-green-100 text-green-800";
      case "UNDERACHIEVING":
        return "bg-orange-100 text-orange-800";
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin">⏳ Loading production revenue data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🚀 Production Revenue Dashboard</h1>
          <p className="text-gray-600">Real-time revenue validation and monitoring</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          Last updated: {new Date(lastUpdate).toLocaleTimeString()}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            ⚠️ {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Status Cards */}
      {revenueData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Revenue */}
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-600">Current Revenue</div>
              <div className="text-3xl font-bold mt-2">
                {formatCurrency(revenueData.current_revenue)}
              </div>
              <div className="text-xs text-gray-500 mt-2">Validated in real-time</div>
            </CardContent>
          </Card>

          {/* Daily Target */}
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-600">Daily Target</div>
              <div className="text-3xl font-bold mt-2">
                {formatCurrency(revenueData.daily_target)}
              </div>
              <div className="text-xs text-gray-500 mt-2">Target amount</div>
            </CardContent>
          </Card>

          {/* Achievement Rate */}
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-600">Achievement Rate</div>
              <div className="text-3xl font-bold text-green-600 mt-2">
                {revenueData.achievement_rate.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 mt-2">Of daily target</div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-600">Status</div>
              <div className="mt-2">
                <Badge className={getStatusColor(revenueData.status)}>
                  {revenueData.status}
                </Badge>
              </div>
              <div className="text-xs text-gray-500 mt-2">Current state</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {revenueData && chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Sources Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>💰 Revenue Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Predictions */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Predictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Predicted End of Day</div>
                <div className="text-2xl font-bold mt-1">
                  {formatCurrency(revenueData.predictions.predicted_end_of_day)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Confidence Level</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {(revenueData.predictions.confidence * 100).toFixed(0)}%
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Trend</div>
                <div className={`text-2xl font-bold mt-1 ${
                  revenueData.predictions.trend === "increasing" ? "text-green-600" : "text-orange-600"
                }`}>
                  {revenueData.predictions.trend === "increasing" ? "📈 Increasing" : "📉 Stable"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Button onClick={fetchRevenueData} disabled={loading} variant="primary">
              🔄 Refresh Now
            </Button>
            <Button 
              onClick={toggleMonitoring} 
              variant={isMonitoring ? "destructive" : "secondary"}
            >
              {isMonitoring ? "⏹️ Stop Monitoring" : "▶️ Start Monitoring"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Indicator */}
      <div className="text-center text-sm text-gray-600">
        {isMonitoring && (
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span className="inline-block w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            Monitoring active - Real-time updates
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionRevenueDashboard;



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
