---
title: "Issue draft for mobile/utils/pushNotifications.js"
generated: 2025-11-08T16:06:38.396677Z
---

# Review needed: mobile/utils/pushNotifications.js

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

// Pushover registration (requires userKey and apiToken)
export async function registerPushover(userKey, apiToken) {
  // Register device with your backend for Pushover notifications
  await axios.post('http://localhost:4200/api/register-pushover', { userKey, apiToken });
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
    await axios.post('http://localhost:4200/api/register-fcm', { token: fcmToken, platform: Platform.OS });
  }
}

export function onNotificationReceived(callback) {
  messaging().onMessage(async remoteMessage => {
    callback(remoteMessage);
  });
} 
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
