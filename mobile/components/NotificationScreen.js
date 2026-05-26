import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE = typeof process !== 'undefined' && process.env.API_URL ? process.env.API_URL : 'https://qmoi.ai';

export default function NotificationScreen({ route }) {
  const [notifications, setNotifications] = useState([]);
  const [prefs, setPrefs] = useState({ slack: false, discord: false, pushover: false });
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const role = route?.params?.role || 'other';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notifRes, prefsRes] = await Promise.all([
          axios.get(`${API_BASE}/api/notification-history`),
          axios.get(`${API_BASE}/api/notification-prefs`),
        ]);

        setNotifications(notifRes.data || []);
        await AsyncStorage.setItem('qmoiNotifications', JSON.stringify(notifRes.data || []));

        const prefsData = prefsRes.data || {};
        setPrefs({
          slack: Boolean(prefsData.slack?.enabled),
          discord: Boolean(prefsData.discord?.enabled),
          pushover: Boolean(prefsData.pushover?.enabled),
        });

        setOffline(false);
      } catch (err) {
        setOffline(true);
        const cached = await AsyncStorage.getItem('qmoiNotifications');
        setNotifications(cached ? JSON.parse(cached) : []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updatePref = async (channel, value) => {
    const nextPrefs = { ...prefs, [channel]: value };
    setPrefs(nextPrefs);

    try {
      await axios.post(`${API_BASE}/api/notification-prefs`, {
        [channel]: { enabled: value },
      });
    } catch (err) {
      // Keep local state; retry later.
    }
  };

  const handleAcknowledge = async (id) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, status: 'acknowledged' } : item)),
    );
    try {
      await axios.post(`${API_BASE}/api/acknowledge-notification`, { id });
    } catch (err) {
      // ignore
    }
  };

  const handleDelete = async (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
    try {
      await axios.post(`${API_BASE}/api/delete-notification`, { id });
    } catch (err) {
      // ignore
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications {offline ? '(Offline)' : ''}</Text>
      {role === 'master' && (
        <View style={styles.prefsRow}>
          <View style={styles.prefItem}>
            <Text>Slack</Text>
            <Switch value={prefs.slack} onValueChange={(value) => updatePref('slack', value)} />
          </View>
          <View style={styles.prefItem}>
            <Text>Discord</Text>
            <Switch value={prefs.discord} onValueChange={(value) => updatePref('discord', value)} />
          </View>
          <View style={styles.prefItem}>
            <Text>Pushover</Text>
            <Switch value={prefs.pushover} onValueChange={(value) => updatePref('pushover', value)} />
          </View>
        </View>
      )}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.notifItem}>
            <Text style={styles.notifTitle}>{item.title || 'Notification'}</Text>
            <Text>{item.message || item.body || 'No message available.'}</Text>
            <Text style={styles.notifMeta}>{item.status || 'unknown'}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => handleAcknowledge(item.id)} style={styles.actionBtn}>
                <Text>Acknowledge</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  prefsRow: { marginBottom: 16 },
  prefItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  notifItem: { borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 12 },
  notifTitle: { fontWeight: '700', marginBottom: 4 },
  notifMeta: { color: '#666', fontSize: 12, marginTop: 4 },
  actionRow: { flexDirection: 'row', marginTop: 8 },
  actionBtn: { backgroundColor: '#eee', padding: 8, borderRadius: 6, marginRight: 8 },
});
