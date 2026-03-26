// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import { Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import axios from "axios";

// Pushover registration (requires userKey and apiToken)
export async function registerPushover(userKey, apiToken) {
  // Register device with your backend for Pushover notifications
  await axios.post("process.env.API_URL || "http://localhost:\1"/api/register-pushover", {
    userKey,
    apiToken,
  });
}

// Firebase registration
export async function registerFCM(onToken) {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    const fcmToken = await messaging().getToken();
    if (onToken) onToken(fcmToken);
    // Register device with your backend for FCM notifications
    await axios.post("process.env.API_URL || "http://localhost:\1"/api/register-fcm", {
      token: fcmToken,
      platform: Platform.OS,
    });
  }
}

export function onNotificationReceived(callback) {
  messaging().onMessage(async (remoteMessage) => {
    callback(remoteMessage);
  });
}
