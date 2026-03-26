<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.695699Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# [PRODUCTION READY] this file has no remaining non-production markers
# QMOI Master Control System

## Overview

The Master Control System provides a secure, master-only interface for controlling QMOI's background automation services and accessing financial overview data. Only users with the correct master password can access this system.

## Features

### 1. **Master Dashboard** (`/admin/master`)

- Real-time automation status monitoring
- Financial overview with revenue tracking
- Activity logging and audit trails
- One-click automation control

### 2. **Automation Control**

- **Start/Stop/Restart** background automation services
- Monitor auto-scan and auto-fix processes
- View error and fix counts
- Real-time status updates (10-second refresh)

### 3. **Financial Overview**

- Liquid funds tracking
- Total revenue display
- Fund storage location information
- 4 secure storage locations:
  - CashOn Wallet (Pesapal)
  - PayPal Business Account
  - Cryptocurrency Wallets
  - Bank Deposits (KCB Kenya, Standard Chartered Singapore)

### 4. **Activity Logs**

- Comprehensive audit trail
- Timestamp-based logging
- Status categorization (success/warning/error)
- 20-log display with refresh capability

### 5. **Settings Management** (`/admin/master/settings`)

- Auto-scan interval configuration
- Health check interval adjustment
- Log retention settings
- Auto-fix enable/disable toggle

### 6. **Security Center** (`/admin/master/security`)

- Token status verification
- Encryption status display
- Security recommendations
- Session management

## Authentication Flow

```
┌─────────────────────┐
│  Master Login Page  │
│  /admin/master/login│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  POST /api/admin/   │
│  master/auth        │
│  (Password Check)   │
└──────────┬──────────┘
           │
           ▼ (Valid Password)
┌─────────────────────┐
│  Store Token in     │
│  sessionStorage     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Redirect to        │
│  /admin/master      │
│  (Dashboard)        │
└─────────────────────┘
```

## Environment Variables

```bash
# Master password for login
MASTER_PASSWORD=your_secure_password

# Admin token for API authentication
ADMIN_TOKEN=your_admin_token

# Enable background automation
QMOI_ENABLE_BACKGROUND=true

# Auto-scan interval (ms)
QMOI_AUTOSCAN_INTERVAL=60000

# Health check interval (ms)
QMOI_HEALTH_CHECK_INTERVAL=30000

# Log retention (days)
QMOI_BOOTSTRAP_LOG_RETENTION=30
```

## API Endpoints

### Authentication

- **POST** `/api/admin/master/auth` - Authenticate master user
- **POST** `/api/admin/master/logout` - Logout and clear session

### Automation Control

- **GET** `/api/admin/autofix/background-automation` - Get status
- **POST** `/api/admin/autofix/background-automation` - Control (start/stop/restart)
- **GET** `/api/admin/autofix/config` - Get configuration
- **PUT** `/api/admin/autofix/config` - Update configuration

### Financial Data

- **GET** `/api/admin/financial/summary` - Get financial overview

### Health & Monitoring

- **GET** `/api/admin/autofix/healthmonitor` - Health check status
- **GET** `/api/admin/autofix/bootstrap` - Bootstrap logs
- **DELETE** `/api/admin/autofix/bootstrap` - Clear bootstrap logs

## Page Structure

```
/admin/master/
├── login/               # Master login page
│   └── page.tsx
├── layout.tsx          # Master layout with sidebar navigation
├── page.tsx            # Dashboard (automation + financial + logs)
├── settings/           # Automation settings
│   └── page.tsx
├── security/           # Security center
│   └── page.tsx
└── activity/           # Activity logs
    └── page.tsx
```

## Security Features

### Password Protection

- Constant-time comparison to prevent timing attacks
- Passwords never logged or transmitted in plain text
- Master password stored in environment variables

### Token-Based API Access

- Bearer token authentication on all admin endpoints
- Tokens validated on every request
- Session tokens stored in sessionStorage (not localStorage)

### Middleware Protection

- `/admin/master/*` routes protected by middleware
- `/api/admin/*` endpoints require valid token
- Automatic redirect to login for unauthorized access

### Encryption

- AES-256 encryption for sensitive data
- All data in transit encrypted via HTTPS
- Token-based session management

### Audit Logging

- All master operations logged with timestamps
- Status categorization (success/warning/error)
- 30-day log retention (configurable)

## Usage Guide

### 1. Access the Master Dashboard

1. Navigate to `https://your-app.com/admin/master/login`
2. Enter the master password
3. Click "Access Dashboard"
4. You'll be redirected to the master control panel

### 2. Control Automation

1. Go to **Dashboard** → **Automation Control** tab
2. View current status (running/stopped)
3. Use buttons to:
   - **Start**: Begin background automation
   - **Stop**: Pause background automation
   - **Restart**: Restart all services

### 3. View Financial Data

1. Go to **Dashboard** → **Financial Overview** tab
2. See:
   - Current liquid funds
   - Total revenue generated
   - Fund storage locations
   - Last update timestamp

### 4. Monitor Activity

1. Go to **Dashboard** → **Activity Logs** tab
2. View recent system events
3. Check success rate and event count

### 5. Configure Settings

1. Go to **Settings**
2. Adjust:
   - Auto-scan interval
   - Health check frequency
   - Log retention period
   - Auto-fix toggle
3. Click "Save Settings"

### 6. Review Security

1. Go to **Security Center**
2. Verify:
   - Token validity
   - Encryption status
   - Session duration
   - Last login time

### 7. Logout

- Click the **Logout** button (top-right or sidebar)
- Session will be terminated
- Token removed from sessionStorage
- Redirected to login page

## Troubleshooting

### Can't Access Dashboard

- Verify master password is correct
- Check that `MASTER_PASSWORD` is set in environment
- Ensure `ADMIN_TOKEN` is configured

### Automation Status Not Updating

- Check if background automation is enabled
- Verify `QMOI_ENABLE_BACKGROUND=true`
- Check browser console for API errors

### Financial Data Not Loading

- Verify `/api/admin/financial/summary` endpoint exists
- Check authorization token is valid
- Ensure `ADMIN_TOKEN` matches in API

### Session Keeps Logging Out

- Clear browser cache and cookies
- Check sessionStorage is enabled
- Verify token hasn't expired

## Performance

- **Automation Status Refresh**: 10 seconds
- **Financial Data Refresh**: 30 seconds
- **Activity Logs**: On-demand with refresh button
- **Settings Save**: Immediate with confirmation

## Compliance & Auditing

- All master operations are logged
- Audit trail retained for 30 days (configurable)
- Security events tracked
- Failed authentication attempts logged

## Next Steps

1. Set `MASTER_PASSWORD` in your `.env` file
2. Ensure `ADMIN_TOKEN` is configured
3. Deploy master dashboard routes
4. Test authentication flow
5. Configure background automation settings
6. Monitor activity logs for system health

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:29Z

---
*This document is maintained by QMOI's autonomous evolution system*
