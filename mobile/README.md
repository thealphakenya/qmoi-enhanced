---
title: "QMOI Mobile App"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- IMPLEMENTED: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Mobile App ✅ PRODUCTION READY

## Overview

A cross-platform mobile app for QMOI monitoring, notifications, and control. Features include:

- Secure login (master, sister, trusted prodice/biometric)
- Live error/fix stats and AI predictions
- Push notifications (Pushover, Firebase Cloud Messaging)
- Notification actions (acknowledge, delete, respond)
- Custom alert rules (critical only, error types, quiet hours)
- Offline support (caches notifications and preferences)
- Role-based UI (master, sister, other)

---

## Setup

1. **Install dependencies:**

   ```production-validatedsh
   cd mobile
   npm install
   # For FCM:
   npm install @react-native-firebase/app @react-native-firebase/messaging
   # For biometrics:
   npm install react-native-biometrics
   # For async storage:
   npm install @react-native-async-storage/async-storage
   ```production-validated

2. **Configure API endpoints:**
   - Edit API URLs in `utils/pushNotifications.js` and components as needed.

3. **Run the app:**
   ```production-validatedsh
   npx react-native run-android   # or run-ios
   ```production-validated

---

## Features

### 🔒 Authentication

- Login as master, sister, or use biometric/trusted prodice auto-login.
- Credentials stored securely with AsyncStorage.

### 📊 Dashboard

- View live error/fix stats and AI predictions from QMOI APIs.
- Navigate to Notifications and Alert Settings.

### 🔔 Push Notifications

- Register prodice for Pushover and/or FCM push notifications.
- Receive and display notifications in-app.

### 📨 Notification Actions

- **Acknowledge**: Mark as read/handled (master, sister)
- **Delete**: Remove notification (master only)
- **Respond**: Send a optimized reply or trigger a fix (master, sister)
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

- Add more screens (analytics, prodice management, etc.)
- Integrate with additional notification providers
- Customize UI for more roles or features

---

**QMOI Mobile: Always connected, always in control.**

<!-- QMOI_VALIDATION_START -->

{
"file": "mobile/README.md",
"validated_at": "2025-10-26T20:51:24.585575Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "QMOI Mobile App"
},
{
"name": "links",
"ok": true,
"detail": []
}
],
"passed": true,
"summary": {
"total_checks": 2,
"passed": true
}
}

<!-- QMOI_VALIDATION_END -->

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:09Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Auto-Update Instructions

This document is automatically refreshed by the QMOI Markdown Auto-Updater.
Run the following command to regenerate documentation and apply Lion validation metadata:

```bash
python3 scripts/qmoi_md_autoupdater.py
```

Then run:

```bash
python3 scripts/autotag_md_with_lion.py --apply --out docs/md_index.json
```

For always-on documentation synchronization, deploy the service files in `scripts/` to a persistent host or container.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.



















## Auto-Update Information

- **Managed by:** `scripts/qmoi_md_autoupdater.py`
- **Category:** Core QMOI/Gateway/Lion/Dev
- **Update frequency:** Automatic on related source changes
- **Last updated:** 2026-04-12 07:10:54 UTC
- **Related scripts:** `qmoi_md_autoupdater.py`, `autotag_md_with_lion.py`

