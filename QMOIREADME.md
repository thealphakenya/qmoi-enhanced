# QMOI Model: Quantum Multi-Objective Intelligence

## Overview
QMOI (Quantum Multi-Objective Intelligence) is an advanced AI model and admin system for multi-user, multi-project, and multi-session analytics, enhancement, and automation. It powers the QI (Quantum Intelligence) admin panel and backend, providing:

- **AI Task Logging**: Tracks all admin/AI actions, enhancements, file uploads, and system events.
- **Enhancement Engine**: Supports manual and autonomous enhancements, with background suggestions and auto-improvements.
- **File Upload & Analysis**: Handles all file types, logs uploads, and enables AI-driven analysis and updates.
- **Multi-User/Project Analytics**: Aggregates stats across users, projects, and sessions for deep insight.
- **Advanced Analytics**: Calculates win/loss rates, streaks, best/worst trades, average durations, file type breakdowns, and more.
- **Export & Controls**: Admins can export all data (CSV/JSON), clear logs, trigger enhancements, and download full analytics.
- **Security**: All actions require admin authentication and are logged for audit.

## New Features (2025-06-09)
- **QI State Window**: Floating, draggable, animated window showing live AI state, session/global memory, and recent activity. Appears on both user and admin pages.
- **Device Map & Tracking**: Map of all devices (react-leaflet), with user, status, last-seen, and location. Admins can report devices as lost, which updates their status and highlights them.
- **Device Table & Actions**: Table of all devices with actions (e.g., Report Lost). Tracks device status, user, and location.
- **Awareness Enhancements**: QI can access time, device info, and (with permission) geolocation. Satellite imagery and advanced device controls are planned for native apps.
- **Lost Device Reporting**: Users/admins can mark devices as lost. System tracks and displays last-known location and status.
- **Session & Global State**: QI State window shows per-session and global AI health, memory, and activity.
- **Real-time QI State window with Colab/AI health integration**: Enhanced visibility into AI operations and health status.
- **Device fingerprinting and persistent tracking**: Continues to track device status even after flash or SIM changes.
- **Extension/package/dataset management via Colab**: Streamlined management of resources directly through Colab.
- **Large file/data handling and cloud processing**: Improved capabilities for managing and processing large files and data sets.
- **Health checks, self-healing, and virtual hardware**: Automated system health monitoring and recovery, with support for virtual hardware resources.
- **New hooks**: `useColabJob`, `useDeviceHealth`, `useExtensionManager`, `useLargeFileUpload`, `useAIHealthCheck` for extended functionality and integration.

## Stats & Analytics
- **Total Tasks, Enhancements, Uploads**
- **Enhancement Success Rate**
- **File Type Distribution**
- **Average Task Duration**
- **Per-User/Project Breakdown**
- **Device Map & Status**
- **Export to CSV/JSON**
- **Custom Filters and Controls**

## Security & Audit
- All actions require admin token
- All events are logged and exportable
- Device/location access requires explicit user consent

## Usage
- Use the QI admin panel to view, filter, export, and control all QMOI/AI activity.
- Use the Devices tab to track, filter, and manage all user devices.
- Integrate with `/api/qmoi-model` for programmatic access.

---
*Last updated: June 9, 2025*
