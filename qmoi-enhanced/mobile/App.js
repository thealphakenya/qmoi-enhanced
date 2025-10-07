import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Button, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import ReactNativeBiometrics from 'react-native-biometrics';
import NotificationScreen from './components/NotificationScreen';
import AlertSettingsScreen from './components/AlertSettingsScreen';
import AnalyticsScreen from './components/AnalyticsScreen';
import DeviceManagementScreen from './components/DeviceManagementScreen';

const Stack = createNativeStackNavigator();

const MASTER_CREDENTIALS = { user: 'master', pass: 'masterpass' };
const SISTER_CREDENTIALS = { user: 'sister', pass: 'sisterpass' };

function LoginScreen({ navigation, route }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if ((user === MASTER_CREDENTIALS.user && pass === MASTER_CREDENTIALS.pass) ||
        (user === SISTER_CREDENTIALS.user && pass === SISTER_CREDENTIALS.pass)) {
      await AsyncStorage.setItem('qmoiUser', user);
      await AsyncStorage.setItem('qmoiPass', pass);
      navigation.replace('Dashboard', { user });
    } else {
      setError('Invalid credentials');
    }
  };

  const handleBiometric = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const { available } = await rnBiometrics.isSensorAvailable();
    if (available) {
      const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Confirm your identity' });
      if (success) {
        // Try auto-login with stored credentials
        const storedUser = await AsyncStorage.getItem('qmoiUser');
        const storedPass = await AsyncStorage.getItem('qmoiPass');
        if (storedUser && storedPass) {
          navigation.replace('Dashboard', { user: storedUser });
        } else {
          setError('No stored credentials');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QMOI Login</Text>
      <TextInput placeholder="Username" value={user} onChangeText={setUser} style={styles.input} />
      <TextInput placeholder="Password" value={pass} onChangeText={setPass} secureTextEntry style={styles.input} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Biometric/Trusted Login" onPress={handleBiometric} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function DashboardScreen({ route, navigation }) {
  const [stats, setStats] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = route.params?.user || 'unknown';
  const [role, setRole] = useState('other');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get('http://localhost:4000/api/error-fix-log');
        const predRes = await axios.get('http://localhost:4100/api/predictions');
        setStats(statsRes.data[statsRes.data.length - 1]);
        setPredictions(predRes.data.predictions || []);
      } catch (e) {
        setStats(null);
        setPredictions([]);
      }
      setLoading(false);
    };
    fetchData();
    // Determine role
    if (user === 'master') setRole('master');
    else if (user === 'sister') setRole('sister');
    else setRole('other');
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user}</Text>
      {role === 'master' ? (
        <>
          <Text style={styles.subtitle}>Live Error/Fix Stats</Text>
          {stats ? (
            <View>
              <Text>Total Errors: {stats.errorsFound}</Text>
              <Text>Total Fixed: {stats.errorsFixed}</Text>
              <Text>Manual Fixes Needed: {stats.manualCount}</Text>
              <Text>Remaining: {stats.remaining}</Text>
              <Text>Percent Auto Fixed: {stats.percentAutoFixed}%</Text>
            </View>
          ) : <Text>No stats available</Text>}
          <Text style={styles.subtitle}>AI Predictions</Text>
          {predictions.length === 0 ? <Text>No predictions</Text> : predictions.map((p, i) => (
            <Text key={i}>{p.kind === 'errorType' ? 'Error Type' : 'File'}: {p.type || p.file} ({p.count})</Text>
          ))}
          <Button title="Analytics" onPress={() => navigation.navigate('Analytics', { role })} />
          <Button title="Device Management" onPress={() => navigation.navigate('DeviceManagement', { role })} />
        </>
      ) : (
        <Text style={{ color: 'red', marginVertical: 10 }}>Access denied: Master only</Text>
      )}
      <Button title="Notifications" onPress={() => navigation.navigate('Notifications', { role })} />
      <Button title="Alert Settings" onPress={() => navigation.navigate('AlertSettings', { role })} />
      <Button title="Logout" onPress={async () => {
        await AsyncStorage.removeItem('qmoiUser');
        await AsyncStorage.removeItem('qmoiPass');
        navigation.replace('Login');
      }} />
    </View>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState('Login');
  useEffect(() => {
    const checkAutoLogin = async () => {
      const user = await AsyncStorage.getItem('qmoiUser');
      const pass = await AsyncStorage.getItem('qmoiPass');
      if ((user === MASTER_CREDENTIALS.user && pass === MASTER_CREDENTIALS.pass) ||
          (user === SISTER_CREDENTIALS.user && pass === SISTER_CREDENTIALS.pass)) {
        setInitialRoute('Dashboard');
      }
    };
    checkAutoLogin();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        <Stack.Screen name="AlertSettings" component={AlertSettingsScreen} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} />
        <Stack.Screen name="DeviceManagement" component={DeviceManagementScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginVertical: 8, width: 200 },
  error: { color: 'red', marginTop: 8 }
}); 