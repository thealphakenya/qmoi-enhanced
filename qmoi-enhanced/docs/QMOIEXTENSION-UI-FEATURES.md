# QMOI Extension: UI Features & Components

This document describes the core UI features and reusable components for all QMOI extension variations.

## Core UI Features

- Universal chat interface (AI chat, Copilot-style)
- Floating windows and draggable panels
- Animated icons and platform-specific branding
- Real-time graphs for automation, revenue, and device health
- Device Health Panel (see `components/DeviceHealthPanel.tsx`)
- Master/sister-only advanced controls
- Platform-specific settings and appearance
- Error-resilient notifications and fallback UIs

## Reusable Components

- `DeviceHealthPanel.tsx`: Device stats and suggestions
- `AuditLogPanel.tsx`: Audit logs and export
- `QMoiAutoDevPanel.tsx`: Automation controls
- `QCityDevicePanel.tsx`: Device management
- And more, per platform

## Usage

All components are designed to be imported and reused in any extension variation. See the `components/` directory for implementation details.

---
