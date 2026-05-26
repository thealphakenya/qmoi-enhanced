import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'qmoi_devices';

export default function DeviceManagementScreen() {
  const [devices, setDevices] = useState([]);
  const [newDeviceName, setNewDeviceName] = useState('');

  useEffect(() => {
    const loadDevices = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      setDevices(stored ? JSON.parse(stored) : []);
    };
    loadDevices();
  }, []);

  const saveDevices = async (nextDevices) => {
    setDevices(nextDevices);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextDevices));
  };

  const addDevice = () => {
    if (!newDeviceName.trim()) {
      Alert.alert('Name required', 'Please enter a device name.');
      return;
    }
    const nextDevices = [
      ...devices,
      {
        id: Date.now().toString(),
        name: newDeviceName.trim(),
        status: 'online',
      },
    ];
    saveDevices(nextDevices);
    setNewDeviceName('');
  };

  const removeDevice = (id) => {
    const nextDevices = devices.filter((device) => device.id !== id);
    saveDevices(nextDevices);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Management</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={newDeviceName}
          onChangeText={setNewDeviceName}
          placeholder="New device name"
          style={styles.input}
        />
        <Button title="Add" onPress={addDevice} />
      </View>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceRow}>
            <View>
              <Text style={styles.deviceName}>{item.name}</Text>
              <Text style={styles.deviceStatus}>{item.status}</Text>
            </View>
            <TouchableOpacity onPress={() => removeDevice(item.id)} style={styles.removeButton}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No devices registered.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginRight: 10 },
  deviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  deviceName: { fontWeight: '600' },
  deviceStatus: { color: '#666' },
  removeButton: { backgroundColor: '#f87171', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  removeText: { color: '#fff' },
  emptyText: { color: '#666', marginTop: 10 },
});
