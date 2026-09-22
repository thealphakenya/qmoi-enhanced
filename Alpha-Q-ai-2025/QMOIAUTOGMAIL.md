# QMOI Automated Gmail Notification System

## Overview
QMOI provides a fully automated Gmail notification system for all automation, error fixing, deployments, and platform events. Notifications are sent in real time to all configured recipients, even when running in the cloud (Colab, Dagshub, QCity, etc.).

## Features
- **Automated Email Alerts:** Receive notifications for doc fixing, deployments, errors, and more.
- **Multiple Recipients:** Supports comma-separated recipient list (e.g., rovicviccy@gmail.com,qmoi@gmail.com).
- **Secure Credential Management:** QMOI auto-manages Gmail credentials using environment variables. Never expose secrets in public repos.
- **Cloud-Ready:** Works in Colab, Dagshub, and other cloud environments for always-on notifications.
- **Parallel Integration:** Tightly integrated with QMOI's parallel engine for real-time, platform-specific alerts.
- **Lightweight:** Designed to be resource-efficient and not slow down or hang devices.

## Setup
1. **Set Environment Variables:**
   - `GMAIL_USER`: Your Gmail address (e.g., rovicviccy@gmail.com)
   - `GMAIL_PASS`: Gmail App Password (never your main password)
   - `GMAIL_RECIPIENT`: Comma-separated list of recipients
2. **Security:**
   - Use Gmail App Passwords for automation.
   - Never commit secrets to public repositories.
   - For production/cloud, use a secrets manager or environment variable injection.
3. **Cloud/Always-On:**
   - QMOI can run in Colab, Dagshub, or any always-on environment for 24/7 notifications.
   - Notifications are sent even if your local device is offline or powered off.

## Best Practices
- Rotate app passwords regularly.
- Use a secrets manager for production.
- Monitor notification logs for delivery status.
- Add/Remove recipients as needed in the `GMAIL_RECIPIENT` variable.

## Integration with QMOI Parallel Engine
- All parallel jobs (error fixing, deployments, etc.) trigger notifications independently.
- Platform-specific alerts are sent for GitLab, GitHub, Vercel, HuggingFace, and more.
- Notifications are categorized by event type and platform for clarity.

## 📊 Dashboard Integration for Notifications

- The QMOI dashboard (`python scripts/qmoi-dashboard.py`) now displays Gmail and multi-channel notification status, delivery logs, and allows master users to trigger test notifications.
- All notification events (success, failure, delivery, etc.) are visualized and logged in real time in the dashboard.
- Notification analytics and history are available alongside automation logs and reports.
- This integration is always-on, cloud-offloaded, and works in Colab, Dagshub, and all cloud environments.

---
**QMOI Automated Gmail Notification System**
- Always-on, secure, and fully integrated with QMOI's automation and parallel processing. 