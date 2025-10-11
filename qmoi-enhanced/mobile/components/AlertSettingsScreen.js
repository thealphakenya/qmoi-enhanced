import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Button, StyleSheet, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AlertSettingsScreen() {
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [errorTypes, setErrorTypes] = useState('');
  const [quietHours, setQuietHours] = useState('');
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await axios.get('http://localhost:4200/api/alert-prefs');
        setCriticalOnly(res.data.criticalOnly || false);
        setErrorTypes((res.data.errorTypes || []).join(','));
        setQuietHours(res.data.quietHours || '');
        await AsyncStorage.setItem('qmoiAlertPrefs', JSON.stringify(res.data));
        setOffline(false);
      } catch {
        setOffline(true);
        const cached = await AsyncStorage.getItem('qmoiAlertPrefs');
        if (cached) {
          const prefs = JSON.parse(cached);
          setCriticalOnly(prefs.criticalOnly || false);
          setErrorTypes((prefs.errorTypes || []).join(','));
          setQuietHours(prefs.quietHours || '');
        }
      }
      setLoading(false);
    };
    fetchPrefs();
  }, []);

  const savePrefs = async () => {
    const prefs = {
      criticalOnly,
      errorTypes: errorTypes.split(',').map(e => e.trim()).filter(Boolean),
      quietHours
    };
    await AsyncStorage.setItem('qmoiAlertPrefs', JSON.stringify(prefs));
    try {
      await axios.post('http://localhost:4200/api/alert-prefs', prefs);
      Alert.alert('Saved', 'Alert preferences updated!');
    } catch {
      Alert.alert('Offline', 'Preferences saved locally and will sync when online.');
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Alert Rules {offline ? '(Offline)' : ''}</Text>
      <View style={styles.row}><Text>Critical Errors Only</Text><Switch value={criticalOnly} onValueChange={setCriticalOnly} /></View>
      <View style={styles.row}><Text>Alert for Error Types (comma separated)</Text></View>
      <TextInput value={errorTypes} onChangeText={setErrorTypes} [PRODUCTION IMPLEMENTATION REQUIRED]="TypeError,ReferenceError" style={styles.input} />
      <View style={styles.row}><Text>Quiet Hours (e.g. 22:00-07:00)</Text></View>
      <TextInput value={quietHours} onChangeText={setQuietHours} [PRODUCTION IMPLEMENTATION REQUIRED]="22:00-07:00" style={styles.input} />
      <Button title="Save Preferences" onPress={savePrefs} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginVertical: 8, width: '100%' }
}); 