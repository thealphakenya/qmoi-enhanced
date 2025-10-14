# QMOI Mobile App

## Overview

A cross-platform mobile app for QMOI monitoring, notifications, and control. Features include:

- Secure login (master, sister, trusted device/biometric)
- Live error/fix stats and AI predictions
- Push notifications (Pushover, Firebase Cloud Messaging)
- Notification actions (acknowledge, delete, respond)
- Custom alert rules (critical only, error types, quiet hours)
- Offline support (caches notifications and preferences)
- Role-based UI (master, sister, other)

---

## Setup

1. **Install dependencies:**

   ```sh
   cd mobile
   npm install
   # For FCM:
   npm install @react-native-firebase/app @react-native-firebase/messaging
   # For biometrics:
   npm install react-native-biometrics
   # For async storage:
   npm install @react-native-async-storage/async-storage
   ```

2. **Configure API endpoints:**
   - Edit API URLs in `utils/pushNotifications.js` and components as needed.

3. **Run the app:**
   ```sh
   npx react-native run-android   # or run-ios
   ```

---

## Features

### 🔒 Authentication

- Login as master, sister, or use biometric/trusted device auto-login.
- Credentials stored securely with AsyncStorage.

### 📊 Dashboard

- View live error/fix stats and AI predictions from QMOI APIs.
- Navigate to Notifications and Alert Settings.

### 🔔 Push Notifications

- Register device for Pushover and/or FCM push notifications.
- Receive and display notifications in-app.

### 📨 Notification Actions

- **Acknowledge**: Mark as read/handled (master, sister)
- **Delete**: Remove notification (master only)
- **Respond**: Send a quick reply or trigger a fix (master, sister)
- **View only**: Other users

### ⚙️ Custom Alerts

- Set alert rules: critical only, error types, quiet hours.
- Preferences stored locally and synced with backend.

### 📴 Offline Support

- Notifications and preferences cached with AsyncStorage.
- All actions work offline and sync when back online.

### 🧑‍💼 Role-based UI

- Master: full control (delete, set global rules, manage channels)
- Sister: acknowledge/respond
- Other: view only

---

## Troubleshooting

- **Network errors:** Ensure API endpoints are reachable and backend is running.
- **Push notifications:** For FCM, configure Firebase project and add `google-services.json`/`GoogleService-Info.plist`.
- **Offline mode:** App will show cached data and sync when online.
- **Role issues:** Ensure you log in with correct credentials for master/sister.

---

## Extending

- Add more screens (analytics, device management, etc.)
- Integrate with additional notification providers
- Customize UI for more roles or features

---

**QMOI Mobile: Always connected, always in control.**
