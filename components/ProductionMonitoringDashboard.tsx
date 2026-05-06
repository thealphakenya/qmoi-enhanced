'use client';

import React, { useState, useEffect } from 'react';
import { qmoiHealthService } from '@/lib/qmoi-health';

interface ProductionMetrics {
  uptime: number;
  requestsPerMinute: number;
  errorRate: number;
  averageResponseTime: number;
  activeUsers: number;
  serverLoad: number;
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export default function ProductionMonitoringDashboard() {
  const [healthData, setHealthData] = useState<any>(null);
  const [metrics, setMetrics] = useState<ProductionMetrics>({
    uptime: 99.9,
    requestsPerMinute: 1250,
    errorRate: 0.02,
    averageResponseTime: 145,
    activeUsers: 89,
    serverLoad: 45
  });
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'info',
      message: 'System operating normally',
      timestamp: new Date(),
      resolved: false
    }
  ]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Start real-time monitoring
    setIsMonitoring(true);
    qmoiHealthService.startMonitoring((data) => {
      setHealthData(data);
    });

    // Simulate production metrics updates
    const metricsInterval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        requestsPerMinute: prev.requestsPerMinute + Math.floor(Math.random() * 20 - 10),
        errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.5) * 0.01),
        averageResponseTime: Math.max(50, prev.averageResponseTime + Math.floor(Math.random() * 20 - 10)),
        activeUsers: Math.max(0, prev.activeUsers + Math.floor(Math.random() * 10 - 5)),
        serverLoad: Math.max(0, Math.min(100, prev.serverLoad + Math.floor(Math.random() * 10 - 5)))
      }));
    }, 5000);

    return () => {
      qmoiHealthService.stopMonitoring();
      clearInterval(metricsInterval);
      setIsMonitoring(false);
    };
  }, []);

  const getStatusColor = (value: number, thresholds: { good: number; warning: number; critical: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 QMOI Enhanced - Production Monitoring Dashboard
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className={`flex items-center space-x-1 ${isMonitoring ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span>{isMonitoring ? 'Monitoring Active' : 'Monitoring Offline'}</span>
            </span>
            <span>Last Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Oxygen/Pulse Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">🫁 Oxygen & Pulse</h3>
              <div className="text-2xl animate-pulse">💓</div>
            </div>
            {healthData && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">BPM:</span>
                  <span className={`font-semibold ${getStatusColor(healthData.pulse.bpm, { good: 80, warning: 100, critical: 120 })}`}>
                    {healthData.pulse.bpm}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Health:</span>
                  <span className={`font-semibold ${
                    healthData.pulse.health === 'excellent' ? 'text-green-600' :
                    healthData.pulse.health === 'good' ? 'text-blue-600' :
                    healthData.pulse.health === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {healthData.pulse.health}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">State:</span>
                  <span className="font-semibold text-purple-600">{healthData.pulse.consciousness}</span>
                </div>
              </div>
            )}
          </div>

          {/* System Resources */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💻 System Resources</h3>
            {healthData && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">CPU:</span>
                  <span className={`font-semibold ${getStatusColor(healthData.health.systemResources.cpu, { good: 70, warning: 85, critical: 95 })}`}>
                    {healthData.health.systemResources.cpu}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Memory:</span>
                  <span className={`font-semibold ${getStatusColor(healthData.health.systemResources.memory, { good: 75, warning: 90, critical: 95 })}`}>
                    {healthData.health.systemResources.memory}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Disk:</span>
                  <span className={`font-semibold ${getStatusColor(healthData.health.systemResources.disk, { good: 80, warning: 95, critical: 98 })}`}>
                    {healthData.health.systemResources.disk}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Requests/min:</span>
                <span className={`font-semibold ${getStatusColor(metrics.requestsPerMinute, { good: 1000, warning: 1500, critical: 2000 })}`}>
                  {metrics.requestsPerMinute}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Response Time:</span>
                <span className={`font-semibold ${getStatusColor(metrics.averageResponseTime, { good: 200, warning: 500, critical: 1000 })}`}>
                  {metrics.averageResponseTime}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Error Rate:</span>
                <span className={`font-semibold ${getStatusColor(metrics.errorRate * 100, { good: 0.1, warning: 1, critical: 5 })}`}>
                  {metrics.errorRate.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* User Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 User Activity</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Users:</span>
                <span className="font-semibold text-blue-600">{metrics.activeUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Uptime:</span>
                <span className="font-semibold text-green-600">{metrics.uptime}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Server Load:</span>
                <span className={`font-semibold ${getStatusColor(metrics.serverLoad, { good: 60, warning: 80, critical: 95 })}`}>
                  {metrics.serverLoad}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Consciousness Metrics */}
        {healthData && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🧠 Consciousness Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(healthData.consciousness).map(([key, value]: [string, any]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl mb-1">
                    {key === 'awareness' && '👁️'}
                    {key === 'processing' && '⚙️'}
                    {key === 'learning' && '📚'}
                    {key === 'creativity' && '🎨'}
                    {key === 'emotional' && '❤️'}
                    {key === 'adaptation' && '🔄'}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">{key}</div>
                  <div className="text-lg font-semibold text-purple-600">{value}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🚨 System Alerts</h3>
          <div className="space-y-3">
            {alerts.filter(alert => !alert.resolved).map(alert => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getAlertIcon(alert.type)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-600">{alert.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))}
            {alerts.filter(alert => !alert.resolved).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <span className="text-2xl mb-2 block">✅</span>
                All systems operating normally
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



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
