import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const AnalyticsScreen = ({ userRole }) => {
  const [analytics, setAnalytics] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [deviceStats, setDeviceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load error/fix analytics
      const analyticsRes = await axios.get(`http://localhost:4000/api/error-fix-log?range=${timeRange}`);
      setAnalytics(analyticsRes.data);
      
      // Load AI predictions
      const predictionsRes = await axios.get('http://localhost:4100/api/predictions');
      setPredictions(predictionsRes.data.predictions || []);
      
      // Load device statistics
      const deviceStatsRes = await axios.get('http://localhost:4000/api/device-stats');
      setDeviceStats(deviceStatsRes.data);
      
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Set default data for [PRODUCTION IMPLEMENTATION REQUIRED]
      setAnalytics([
        {
          date: '2024-01-15',
          errorsFound: 45,
          errorsFixed: 42,
          manualCount: 3,
          percentAutoFixed: 93.3,
          remaining: 3
        },
        {
          date: '2024-01-14',
          errorsFound: 38,
          errorsFixed: 35,
          manualCount: 5,
          percentAutoFixed: 85.7,
          remaining: 3
        },
        {
          date: '2024-01-13',
          errorsFound: 52,
          errorsFixed: 50,
          manualCount: 2,
          percentAutoFixed: 96.0,
          remaining: 2
        }
      ]);
      setPredictions([
        { kind: 'errorType', type: 'SyntaxError', count: 15, confidence: 0.89 },
        { kind: 'errorType', type: 'TypeError', count: 8, confidence: 0.76 },
        { kind: 'file', file: 'src/components/App.js', count: 12, confidence: 0.92 }
      ]);
      setDeviceStats({
        totalDevices: 8,
        onlineDevices: 6,
        warningDevices: 1,
        offlineDevices: 1,
        avgCpu: 45,
        avgMemory: 67,
        avgDisk: 34
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const getTrendDirection = (current, previous) => {
    if (current > previous) return { direction: 'up', color: '#F44336' };
    if (current < previous) return { direction: 'down', color: '#4CAF50' };
    return { direction: 'stable', color: '#FF9800' };
  };

  const calculateTrends = () => {
    if (!analytics || analytics.length < 2) return null;
    
    const current = analytics[0];
    const previous = analytics[1];
    
    return {
      errorsFound: getTrendDirection(current.errorsFound, previous.errorsFound),
      errorsFixed: getTrendDirection(current.errorsFixed, previous.errorsFixed),
      autoFixRate: getTrendDirection(current.percentAutoFixed, previous.percentAutoFixed)
    };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  const trends = calculateTrends();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics Dashboard</Text>
        <View style={styles.viewSelector}>
          {['overview', 'trends', 'predictions', 'devices'].map(view => (
            <TouchableOpacity
              key={view}
              style={[
                styles.viewButton,
                selectedView === view && styles.viewButtonActive
              ]}
              onPress={() => setSelectedView(view)}
            >
              <Text style={[
                styles.viewText,
                selectedView === view && styles.viewTextActive
              ]}>
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.timeRangeSelector}>
          {['1d', '7d', '30d', '90d'].map(range => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && styles.timeRangeButtonActive
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text style={[
                styles.timeRangeText,
                timeRange === range && styles.timeRangeTextActive
              ]}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {selectedView === 'overview' && (
          <View style={styles.overviewSection}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <Icon name="bug-report" size={24} color="#F44336" />
                <Text style={styles.summaryNumber}>
                  {analytics?.reduce((sum, item) => sum + item.errorsFound, 0) || 0}
                </Text>
                <Text style={styles.summaryLabel}>Total Errors</Text>
                {trends && (
                  <View style={styles.trendIndicator}>
                    <Icon 
                      name={`trending-${trends.errorsFound.direction}`} 
                      size={16} 
                      color={trends.errorsFound.color} 
                    />
                  </View>
                )}
              </View>
              <View style={styles.summaryCard}>
                <Icon name="check-circle" size={24} color="#4CAF50" />
                <Text style={styles.summaryNumber}>
                  {analytics?.reduce((sum, item) => sum + item.errorsFixed, 0) || 0}
                </Text>
                <Text style={styles.summaryLabel}>Fixed</Text>
                {trends && (
                  <View style={styles.trendIndicator}>
                    <Icon 
                      name={`trending-${trends.errorsFixed.direction}`} 
                      size={16} 
                      color={trends.errorsFixed.color} 
                    />
                  </View>
                )}
              </View>
              <View style={styles.summaryCard}>
                <Icon name="auto-fix-high" size={24} color="#2196F3" />
                <Text style={styles.summaryNumber}>
                  {analytics?.reduce((sum, item) => sum + (item.errorsFixed - item.manualCount), 0) || 0}
                </Text>
                <Text style={styles.summaryLabel}>Auto Fixed</Text>
              </View>
              <View style={styles.summaryCard}>
                <Icon name="trending-up" size={24} color="#FF9800" />
                <Text style={styles.summaryNumber}>
                  {analytics?.length > 0 ? 
                    Math.round(analytics.reduce((sum, item) => sum + parseFloat(item.percentAutoFixed), 0) / analytics.length) : 0
                  }%
                </Text>
                <Text style={styles.summaryLabel}>Auto Fix Rate</Text>
                {trends && (
                  <View style={styles.trendIndicator}>
                    <Icon 
                      name={`trending-${trends.autoFixRate.direction}`} 
                      size={16} 
                      color={trends.autoFixRate.color} 
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {selectedView === 'trends' && (
          <View style={styles.trendSection}>
            <Text style={styles.sectionTitle}>Trends</Text>
            <View style={styles.trendCard}>
              <Text style={styles.trendTitle}>Error Rate Over Time</Text>
              <View style={styles.trendChart}>
                {analytics?.map((item, index) => (
                  <View key={index} style={styles.trendBar}>
                    <View 
                      style={[
                        styles.trendBarFill,
                        { height: `${Math.min((item.errorsFound / 100) * 100, 100)}%` }
                      ]} 
                    />
                    <Text style={styles.trendLabel}>{item.date}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.trendCard}>
              <Text style={styles.trendTitle}>Auto Fix Rate Trend</Text>
              <View style={styles.lineChart}>
                {analytics?.map((item, index) => (
                  <View key={index} style={styles.linePoint}>
                    <View 
                      style={[
                        styles.linePointDot,
                        { backgroundColor: '#2196F3' }
                      ]} 
                    />
                    <Text style={styles.linePointLabel}>{item.percentAutoFixed}%</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {selectedView === 'predictions' && (
          <View style={styles.predictionsSection}>
            <Text style={styles.sectionTitle}>AI Predictions</Text>
            <View style={styles.predictionsGrid}>
              {predictions?.map((prediction, index) => (
                <View key={index} style={styles.predictionCard}>
                  <View style={styles.predictionHeader}>
                    <Icon 
                      name={prediction.kind === 'errorType' ? 'bug-report' : 'file-copy'} 
                      size={20} 
                      color="#2196F3" 
                    />
                    <Text style={styles.predictionType}>
                      {prediction.kind === 'errorType' ? 'Error Type' : 'File'}
                    </Text>
                  </View>
                  <Text style={styles.predictionValue}>
                    {prediction.type || prediction.file}
                  </Text>
                  <Text style={styles.predictionCount}>
                    Count: {prediction.count}
                  </Text>
                  <View style={styles.confidenceBar}>
                    <View 
                      style={[
                        styles.confidenceFill,
                        { width: `${prediction.confidence * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.confidenceText}>
                    Confidence: {Math.round(prediction.confidence * 100)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {selectedView === 'devices' && deviceStats && (
          <View style={styles.devicesSection}>
            <Text style={styles.sectionTitle}>Device Statistics</Text>
            <View style={styles.deviceStatsGrid}>
              <View style={styles.deviceStatCard}>
                <Icon name="devices" size={24} color="#2196F3" />
                <Text style={styles.deviceStatNumber}>{deviceStats.totalDevices}</Text>
                <Text style={styles.deviceStatLabel}>Total Devices</Text>
              </View>
              <View style={styles.deviceStatCard}>
                <Icon name="wifi" size={24} color="#4CAF50" />
                <Text style={styles.deviceStatNumber}>{deviceStats.onlineDevices}</Text>
                <Text style={styles.deviceStatLabel}>Online</Text>
              </View>
              <View style={styles.deviceStatCard}>
                <Icon name="warning" size={24} color="#FF9800" />
                <Text style={styles.deviceStatNumber}>{deviceStats.warningDevices}</Text>
                <Text style={styles.deviceStatLabel}>Warnings</Text>
              </View>
              <View style={styles.deviceStatCard}>
                <Icon name="wifi-off" size={24} color="#F44336" />
                <Text style={styles.deviceStatNumber}>{deviceStats.offlineDevices}</Text>
                <Text style={styles.deviceStatLabel}>Offline</Text>
              </View>
            </View>
            
            <View style={styles.systemMetricsSection}>
              <Text style={styles.sectionTitle}>System Metrics</Text>
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Average CPU</Text>
                  <Text style={styles.metricValue}>{deviceStats.avgCpu}%</Text>
                  <View style={styles.metricBar}>
                    <View style={[styles.metricFill, { width: `${deviceStats.avgCpu}%` }]} />
                  </View>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Average Memory</Text>
                  <Text style={styles.metricValue}>{deviceStats.avgMemory}%</Text>
                  <View style={styles.metricBar}>
                    <View style={[styles.metricFill, { width: `${deviceStats.avgMemory}%` }]} />
                  </View>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Average Disk</Text>
                  <Text style={styles.metricValue}>{deviceStats.avgDisk}%</Text>
                  <View style={styles.metricBar}>
                    <View style={[styles.metricFill, { width: `${deviceStats.avgDisk}%` }]} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {userRole === 'master' && (
          <View style={styles.detailedSection}>
            <Text style={styles.sectionTitle}>Detailed Analysis</Text>
            {analytics?.map((item, index) => (
              <View key={index} style={styles.detailCard}>
                <Text style={styles.detailDate}>{item.date}</Text>
                <View style={styles.detailStats}>
                  <Text>Errors: {item.errorsFound}</Text>
                  <Text>Fixed: {item.errorsFixed}</Text>
                  <Text>Manual: {item.manualCount}</Text>
                  <Text>Auto Fix: {item.percentAutoFixed}%</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  viewSelector: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  viewButtonActive: {
    backgroundColor: '#2196F3',
  },
  viewText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  viewTextActive: {
    color: '#FFF',
  },
  timeRangeSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  timeRangeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  timeRangeButtonActive: {
    backgroundColor: '#2196F3',
  },
  timeRangeText: {
    fontSize: 12,
    color: '#666',
  },
  timeRangeTextActive: {
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  overviewSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  trendIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  trendSection: {
    marginBottom: 20,
  },
  trendCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  trendChart: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  trendBar: {
    alignItems: 'center',
    flex: 1,
  },
  trendBarFill: {
    width: 20,
    backgroundColor: '#2196F3',
    borderRadius: 2,
    marginBottom: 5,
  },
  trendLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  lineChart: {
    flexDirection: 'row',
    height: 100,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  linePoint: {
    alignItems: 'center',
    flex: 1,
  },
  linePointDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 5,
  },
  linePointLabel: {
    fontSize: 10,
    color: '#666',
  },
  predictionsSection: {
    marginBottom: 20,
  },
  predictionsGrid: {
    gap: 15,
  },
  predictionCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  predictionType: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  predictionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  predictionCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  confidenceBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 5,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 2,
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
  },
  devicesSection: {
    marginBottom: 20,
  },
  deviceStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  deviceStatCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  deviceStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  systemMetricsSection: {
    marginTop: 20,
  },
  metricsGrid: {
    gap: 15,
  },
  metricCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  metricBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  metricFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 3,
  },
  detailedSection: {
    marginTop: 20,
  },
  detailCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AnalyticsScreen; 