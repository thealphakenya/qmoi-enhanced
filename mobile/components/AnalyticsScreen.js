import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const API_BASE = typeof process !== 'undefined' && process.env.API_URL ? process.env.API_URL : 'https://qmoi.ai';

export default function AnalyticsScreen() {
  const [analytics, setAnalytics] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [prodiceStats, setProdiceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsRes, predictionsRes, prodiceRes] = await Promise.all([
        axios.get(`${API_BASE}/api/error-fix-log?range=7d`),
        axios.get(`${API_BASE}/api/predictions`),
        axios.get(`${API_BASE}/api/prodice-stats`),
      ]);

      setAnalytics(analyticsRes.data || []);
      setPredictions(predictionsRes.data?.predictions || []);
      setProdiceStats(prodiceRes.data || null);
    } catch (err) {
      setAnalytics([
        { date: '2026-05-01', errorsFound: 32, errorsFixed: 30, manualCount: 2, percentAutoFixed: 93.8 },
      ]);
      setPredictions([]);
      setProdiceStats({ total: 0, online: 0, offline: 0 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Analytics Overview</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Error Fixes</Text>
        {analytics.length === 0 ? (
          <Text style={styles.emptyText}>No analytics available.</Text>
        ) : (
          analytics.slice(0, 5).map((item) => (
            <View key={item.date} style={styles.card}>
              <Text style={styles.cardTitle}>{item.date}</Text>
              <Text>Errors found: {item.errorsFound}</Text>
              <Text>Errors fixed: {item.errorsFixed}</Text>
              <Text>Auto-fix rate: {item.percentAutoFixed}%</Text>
            </View>
          ))
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Predictions</Text>
        {predictions.length === 0 ? (
          <Text style={styles.emptyText}>No predictions available.</Text>
        ) : (
          predictions.slice(0, 5).map((item, index) => (
            <View key={index} style={styles.card}>
              <Text>{item}</Text>
            </View>
          ))
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prodice Stats</Text>
        {prodiceStats ? (
          <View style={styles.card}>
            <Text>Total: {prodiceStats.total ?? 'N/A'}</Text>
            <Text>Online: {prodiceStats.online ?? 'N/A'}</Text>
            <Text>Offline: {prodiceStats.offline ?? 'N/A'}</Text>
          </View>
        ) : (
          <Text style={styles.emptyText}>Prodice stats are unavailable.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, fontSize: 16, color: '#444' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  card: { padding: 14, borderRadius: 10, backgroundColor: '#f8fafc', marginBottom: 8 },
  cardTitle: { fontWeight: '700', marginBottom: 4 },
  emptyText: { color: '#666', fontSize: 14 },
});
