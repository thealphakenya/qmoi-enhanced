# QCITYUI.md - QCity User Interface Documentation ✅ production_IMPLEMENTED

**Version:** 1.0.0 - production_IMPLEMENTED
**Date:** May 4, 2026
**Status:** ✅ Complete UI Documentation for QCity App
**Scope:** All visible UI elements, screens, interactions, and user flows for QCity

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [App Overview](#app-overview)
3. [Screen Analysis](#screen-analysis)
4. [Component Documentation](#component-documentation)
5. [Navigation Flow](#navigation-flow)
6. [Feature Instructions](#feature-instructions)
7. [Settings & Configuration](#settings--configuration)
8. [Error States & Edge Cases](#error-states--edge-cases)

---

## Executive Summary

### QCity App Overview
QCity is a React-based dashboard application providing command center functionality for Quantum multi orchestra intelligence (QMOI) operations. It features role-based access control, real-time system monitoring, incident reporting, and cross-app navigation in a dark theme with cyan accents.

### Key UI Characteristics
- **Theme:** Dark slate background (#0b1220) with cyan accents (#06b6d4)
- **Layout:** Grid-based responsive design with card components
- **Access:** Role-based permissions (Master, Sister, User, Guest)
- **Features:** Real-time metrics, service monitoring, incident management

---

## App Overview

### What Users See When Opening QCity

Upon launching QCity, users see:

- **Header Section:** "QCity Command Center" title with user info and role display
- **Role Summary:** Access level description based on user role
- **Metrics Grid:** Real-time system statistics (Connected Nodes, Active Services, Open Alerts, Incident Response)
- **Service Operations Panel:** Operational status of city services
- **Incident Reports Panel:** Active issues requiring attention
- **Navigation Buttons:** Links to QVillage and QMOI Space

---

## Screen Analysis

### Main Command Center Screen

#### What the user sees:
- Large header with title and user information
- Role-based access description
- Grid of metric cards with real-time data
- Service status panel with operational indicators
- Incident reports panel with active alerts
- Navigation buttons for cross-app access

#### UI Elements:
- **Main Header (top):**
  - Title: "QCity Command Center" (large, white text)
  - User Display: "Current user" with name and role
  - Role Badge: Colored indicator (emerald for active users)

- **Role Summary Text (top-center):**
  - Dynamic description based on user role:
    - Master: "Full enterprise control, deployment, and monitoring access."
    - Sister: "Personal insights, collaboration, and creative workspace access."
    - User: "General QMOI features, chat, help, and view-only dashboards."
    - Guest: "Guest access with limited AI and help support."

- **Metrics Grid (center-top):**
  - Connected Nodes: "128" with "+4%" delta (good status - green)
  - Active Services: "34" with "+1%" delta (good status - green)
  - Open Alerts: "3" with "-18%" delta (warning status - amber)
  - Incident Response: "2m 30s" with "-12%" delta (good status - green)

- **Service Operations Panel (left-center):**
  - Title: "Service Operations"
  - Subtitle: "Operational status for core city controls."
  - Status Badge: "Updated just now"
  - Service List:
    - Water Supply Control: operational (emerald badge)
    - Transit Management: operational (emerald badge)
    - Energy Grid Monitoring: degraded (amber badge)
    - Public Safety Sensors: operational (emerald badge)

- **Active Incident Reports Panel (right-center):**
  - Title: "Active Incident Reports"
  - Subtitle: "Immediate issues requiring coordination."
  - Incident List:
    - IQ-921: Grid Load - "Power surge detected in sector 7" (high severity - rose)
    - IQ-913: Traffic - "Signal sync disruption on 5th Avenue" (medium severity - amber)

- **Navigation Buttons (bottom):**
  - "Switch to Master Role" (cyan, for non-master users)
  - "Open QVillage" (emerald, for users with access)
  - "Open QMOI Space" (violet, for users with access)

#### User Actions:
- **Role Switching:** Non-master users can switch to master role
- **QVillage Access:** Opens QVillage workspace (if permitted)
- **QMOI Space Access:** Opens marketplace (if permitted)
- **View Metrics:** Real-time system statistics
- **Monitor Services:** Check operational status
- **Review Incidents:** Examine active alerts and reports

---

## Component Documentation

### Header Section
**Purpose:** App branding and user identification
**Location:** Top of screen
**Components:**
  - Title: Large heading text
  - User Card: Current user info with role
**Visual:** Dark background with white text, cyan accents

### Role Summary
**Purpose:** Display access level and permissions
**Location:** Below header
**Props:** user.role (string)
**Visual:** Descriptive text paragraph
**Behavior:** Dynamic content based on user role

### Metrics Grid
**Purpose:** Real-time system monitoring
**Location:** Center-top of screen
**Props:**
  - metrics: array of metric objects
**Visual:** 4-column grid of metric cards
**Behavior:** Updates with real-time data

### Service Operations Panel
**Purpose:** Monitor city service status
**Location:** Left side of main content
**Components:**
  - Panel Header: Title and update status
  - Service List: Array of service status items
**Visual:** Card with service items and status badges

### Incident Reports Panel
**Purpose:** Display active system alerts
**Location:** Right side of main content
**Components:**
  - Panel Header: Title and description
  - Incident List: Array of incident items
**Visual:** Card with incident details and severity indicators

### Navigation Buttons
**Purpose:** Cross-app navigation
**Location:** Bottom of screen
**Props:**
  - Conditional display based on user role
  - onClick handlers for navigation
**Visual:** Colored buttons with hover effects

---

## Navigation Flow

### Entry Point
- User accesses /qcity route
- Authentication check via useAuth hook
- Loads dashboard based on user role

### Main Navigation Paths
```
QCity Dashboard
├── Switch to Master Role → Reload with master permissions
├── Open QVillage → Navigate to /qvillage
├── Open QMOI Space → Navigate to /qmoi-space.html
└── Role-based feature access
```

### Back Behavior
- Browser back button navigation
- React Router history management
- Maintains user session state

### Deep Links
- /qcity → Main command center
- /qvillage → Community workspace
- /qmoi-space.html → Marketplace PWA

---

## Feature Instructions

### Accessing QCity Dashboard
1. Navigate to QCity application
2. Authentication automatically determines user role
3. Dashboard loads with role-appropriate features

### Switching User Roles
1. If not master user, "Switch to Master Role" button appears
2. Click button to change role to master
3. Dashboard reloads with full access permissions

### Monitoring System Metrics
1. View real-time metrics in top grid
2. Each card shows current value and trend
3. Color coding indicates status (green=good, amber=warning)

### Checking Service Status
1. Review Service Operations panel
2. Each service shows operational status
3. Color badges: green=operational, amber=degraded, red=offline

### Reviewing Incident Reports
1. Check Active Incident Reports panel
2. Each incident shows category, summary, and severity
3. Severity levels: high (red), medium (amber)

### Cross-App Navigation
1. Use navigation buttons at bottom
2. "Open QVillage" for community features (if permitted)
3. "Open QMOI Space" for marketplace (if permitted)

---

## Settings & Configuration

### Role-Based Access Control
- **Master:** Full system control and monitoring
- **Sister:** Personal and collaborative features
- **User:** General QMOI features and view-only access
- **Guest:** Limited AI and help functionality

### Display Settings
- **Theme:** Fixed dark slate theme
- **Layout:** Responsive grid system
- **Real-time Updates:** Automatic data refresh

### Navigation Settings
- **QVillage Access:** Conditional based on permissions
- **QMOI Space Access:** Conditional based on permissions
- **Role Switching:** Available for non-master users

---

## Error States & Edge Cases

### Authentication Failure
- Redirect to login if not authenticated
- Guest access with limited features
- Clear error messaging

### Permission Denied
- Hide restricted features based on role
- Show appropriate access messages
- Maintain secure operation

### Data Loading Errors
- Graceful fallback for failed metrics
- Loading indicators during data fetch
- Error states with retry options

### Network Issues
- Offline indicators for real-time features
- Cached data when available
- Clear offline status messaging

---

## Visual Description (Accessibility)

QCity uses a professional dark theme optimized for monitoring and control:

- **Background:** Deep slate (#0f1724)
- **Text:** White (#ffffff) for primary content
- **Accents:** Cyan (#06b6d4) for interactive elements
- **Status Colors:** 
  - Green (#10b981) for operational/good status
  - Amber (#f59e0b) for warnings/degraded status
  - Red (#ef4444) for errors/high severity

The interface employs a grid-based layout with clear visual hierarchy. Metric cards use large numbers with trend indicators. Status badges provide immediate visual feedback. Panels are well-spaced with consistent typography and border treatments. The design supports extended monitoring sessions with comfortable contrast and readable text at all sizes.