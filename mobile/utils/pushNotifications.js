import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import axios from 'axios';

const API_BASE = typeof process !== 'undefined' && process.env.API_URL ? process.env.API_URL : 'https://qmoi.ai';

export async function registerPushover(userKey, apiToken) {
  if (!userKey || !apiToken) {
    throw new Error('Missing Pushover credentials');
  }

  const payload = { userKey, apiToken };
  await axios.post(`${API_BASE}/api/register-pushover`, payload);
}

export async function registerFCM(onToken) {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    throw new Error('FCM permission denied');
  }

  const fcmToken = await messaging().getToken();

  if (onToken) {
    onToken(fcmToken);
  }

  await axios.post(`${API_BASE}/api/register-fcm`, {
    token: fcmToken,
    platform: Platform.OS,
  });
}

export function onNotificationReceived(callback) {
  if (typeof callback !== 'function') {
    throw new Error('Callback must be a function');
  }

  return messaging().onMessage(async (remoteMessage) => {
    callback(remoteMessage);
  });
}
