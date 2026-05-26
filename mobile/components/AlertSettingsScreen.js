import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE = typeof process !== 'undefined' && process.env.API_URL ? process.env.API_URL : 'https://qmoi.ai';

export default function AlertSettingsScreen() {
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [errorTypes, setErrorTypes] = useState('');
  const [quietHours, setQuietHours] = useState('');
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/alert-prefs`);
        const data = res.data || {};
        setCriticalOnly(Boolean(data.criticalOnly));
        setErrorTypes((data.errorTypes || []).join(','));
        setQuietHours(data.quietHours || '');
        await AsyncStorage.setItem('qmoiAlertPrefs', JSON.stringify(data));
        setOffline(false);
      } catch (err) {
        setOffline(true);
        const cached = await AsyncStorage.getItem('qmoiAlertPrefs');
        if (cached) {
          const prefs = JSON.parse(cached);
          setCriticalOnly(Boolean(prefs.criticalOnly));
          setErrorTypes((prefs.errorTypes || []).join(','));
          setQuietHours(prefs.quietHours || '');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrefs();
  }, []);

  const savePrefs = async () => {
    const prefs = {
      criticalOnly,
      errorTypes: errorTypes.split(',').map((entry) => entry.trim()).filter(Boolean),
      quietHours,
    };

    await AsyncStorage.setItem('qmoiAlertPrefs', JSON.stringify(prefs));

    try {
      await axios.post(`${API_BASE}/api/alert-prefs`, prefs);
      Alert.alert('Saved', 'Alert preferences updated!');
      setOffline(false);
    } catch (err) {
      Alert.alert('Offline', 'Preferences saved locally and will sync when online.');
      setOffline(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading alert settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Alert Rules {offline ? '(Offline)' : ''}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Critical Errors Only</Text>
        <Switch value={criticalOnly} onValueChange={setCriticalOnly} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Error Types (comma separated)</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.smallText}>{errorTypes || 'None configured'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Quiet Hours</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.smallText}>{quietHours || 'Not set'}</Text>
      </View>
      <Button title="Save Preferences" onPress={savePrefs} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  row: { marginBottom: 12 },
  label: { fontSize: 16, marginBottom: 4 },
  smallText: { fontSize: 14, color: '#666' },
});
