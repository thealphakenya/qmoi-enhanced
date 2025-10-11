# Q-city API Documentation

## Overview

The Q-city API provides a comprehensive interface for managing and interacting with the Q-city system. This documentation covers all available endpoints, their parameters, and response formats.

## Base URL

## Discovered API Endpoints (Auto-Extracted)

The following endpoints were found in the codebase by automated search. Ensure all are documented above and kept in sync with implementation:

```
/api/analytics/overview
/api/chat/generate
/api/games
/api/games/{game_id}/start
/api/health
/api/projects
/api/qmoi/download-exe
/api/revenue/add
/api/revenue/overview
/api/system/status
/automation/config
/automation/history
/automation/metrics
/automation/optimize
/automation/start
/automation/status
/automation/stop
/automation/tasks
/automation/trends
/health
/model/info
/ping
/predict
/predict/batch
/qmessage
/token
'/api/health'
'/api/media'
'/api/media/:id'
'/api/media/logs'
'/api/predictions'
'/fix_error'
'/health'
'/list'
'/predict'
```

> **Note:** If any endpoint above is missing from the main documentation, please add it with details (method, params, response, auth, etc.).
http://localhost:3000/api

---
## API Coverage & Test Status (2025-10-08)

All endpoints listed above are now exercised by the automated test suite (`qmoi_test.sh`).

- Unused or previously untested endpoints are now included in the test suite and are listed in `UNUSED_API_ENDPOINTS.md` for traceability.
- See `qmoi_autogen_unused_api_tests.sh` for the script that generated and tested these endpoints.
- Test results are logged in `qmoi_test_results.log`.

If any endpoint is not covered, please update the test suite or report a gap.
```

## Authentication

All API endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Endpoints

### System Management

#### Get System Status
```http
GET /qcity/status
```

Returns the current status of the Q-city system.

**Response:**
```json
{
  "running": true,
  "platforms": {
    "colab": {
      "connected": true,
      "gpu_available": true,
      "gpu_count": 1,
      "drive_mounted": true
    },
    "cloud": {
      "connected": false,
      "providers": []
    },
    "local": {
      "connected": true,
      "os": "Windows",
      "cpu_count": 8,
      "memory_total": 16777216,
      "disk_total": 1073741824
    }
  },
  "features": {
    "trading": true,
    "whatsapp": true,
    "projects": true,
    "updates": true
  },
  "resources": {
    "cpu": 45.2,
    "memory": 60.5,
    "disk": 75.3,
    "network": 1024
  },
  "tasks": [
    {
      "id": "task-1",
      "type": "optimization",
      "status": "completed",
      "start_time": "2024-03-15T10:00:00Z",
      "end_time": "2024-03-15T10:01:00Z"
    }
  ]
}
```

#### Get System Configuration
```http
GET /qcity/config
```

Returns the current system configuration.

**Response:**
```json
{
  "platforms": {
    "colab": true,
    "cloud": true,
    "local": true
  },
  "features": {
    "trading": true,
    "whatsapp": true,
    "projects": true,
    "updates": true
  },
  "resources": {
    "max_cpu": 90,
    "max_memory": 0.9,
    "max_disk": 0.9,
    "max_network": 1000,
    "auto_scale": true
  },
  "security": {
    "encryption": true,
    "firewall": true,
    "vpn": true,
    "access_control": true,
    "audit_logging": true
  }
}
```

#### Start System
```http
POST /qcity/start
```

Starts the Q-city system.

**Response:**
```json
{
  "message": "Q-city started successfully"
}
```

#### Stop System
```http
POST /qcity/stop
```

Stops the Q-city system.

**Response:**
```json
{
  "message": "Q-city stopped successfully"
}
```

### Platform Management

#### Configure Platforms
```http
POST /qcity/configure-platforms
```

Configure system platforms.

**Request Body:**
```json
{
  "colab": true,
  "cloud": true,
  "local": true
}
```

**Response:**
```json
{
  "message": "Platforms configured successfully"
}
```

#### Get Platform Status
```http
GET /qcity/platforms/{platform_id}/status
```

Get status of a specific platform.

**Response:**
```json
{
  "type": "colab",
  "connected": true,
  "gpu_available": true,
  "gpu_count": 1,
  "drive_mounted": true
}
```

### Feature Management

#### Enable Features
```http
POST /qcity/enable-features
```

Enable specific features.

**Request Body:**
```json
{
  "features": ["trading", "whatsapp", "projects", "updates"]
}
```

**Response:**
```json
{
  "message": "Features enabled successfully"
}
```

#### Get Feature Status
```http
GET /qcity/features/{feature_id}/status
```

Get status of a specific feature.

**Response:**
```json
{
  "enabled": true,
  "status": "active",
  "last_update": "2024-03-15T10:00:00Z",
  "metrics": {
    "performance": 95.5,
    "reliability": 99.9,
    "usage": 45.2
  }
}
```

### Resource Management

#### Monitor Resources
```http
POST /qcity/monitor-resources
```

Start resource monitoring.

**Response:**
```json
{
  "message": "Resource monitoring started successfully"
}
```

#### Get Resource Usage
```http
GET /qcity/resources
```

Get current resource usage.

**Response:**
```json
{
  "cpu": {
    "usage": 45.2,
    "cores": 8,
    "temperature": 65.5
  },
  "memory": {
    "total": 16777216,
    "used": 10158080,
    "free": 6619136,
    "percent": 60.5
  },
  "disk": {
    "total": 1073741824,
    "used": 807403520,
    "free": 266338304,
    "percent": 75.3
  },
  "network": {
    "bytes_sent": 1024000,
    "bytes_recv": 2048000,
    "packets_sent": 1000,
    "packets_recv": 2000
  }
}
```

### Task Management

#### Get Tasks
```http
GET /qcity/tasks
```

Get list of current tasks.

**Response:**
```json
{
  "tasks": [
    {
      "id": "task-1",
      "type": "optimization",
      "status": "completed",
      "start_time": "2024-03-15T10:00:00Z",
      "end_time": "2024-03-15T10:01:00Z",
      "result": {
        "success": true,
        "metrics": {
          "cpu_improvement": 15.5,
          "memory_improvement": 20.3
        }
      }
    }
  ]
}
```

#### Create Task
```http
POST /qcity/tasks
```

Create a new task.

**Request Body:**
```json
{
  "type": "optimization",
  "parameters": {
    "target": "cpu",
    "threshold": 80
  }
}
```

**Response:**
```json
{
  "task_id": "task-1",
  "message": "Task created successfully"
}
```

### Error Management

#### Get Errors
```http
GET /qcity/errors
```

Get list of system errors.

**Response:**
```json
{
  "errors": [
    {
      "id": "error-1",
      "type": "system",
      "severity": "high",
      "message": "High CPU usage detected",
      "timestamp": "2024-03-15T10:00:00Z",
      "status": "resolved",
      "resolution": "System optimized"
    }
  ]
}
```

#### Track Error
```http
POST /qcity/track-error
```

Track a new error.

**Request Body:**
```json
{
  "type": "system",
  "severity": "high",
  "message": "High CPU usage detected",
  "context": {
    "cpu_usage": 95.5,
    "memory_usage": 80.2
  }
}
```

**Response:**
```json
{
  "error_id": "error-1",
  "message": "Error tracked successfully"
}
```

### Backup Management

#### Get Backups
```http
GET /qcity/backups
```

Get list of system backups.

**Response:**
```json
{
  "backups": [
    {
      "id": "backup-1",
      "timestamp": "2024-03-15T10:00:00Z",
      "size": 1073741824,
      "type": "full",
      "status": "completed"
    }
  ]
}
```

#### Create Backup
```http
POST /qcity/backups
```

Create a new system backup.

**Request Body:**
```json
{
  "type": "full",
  "description": "Daily backup"
}
```

**Response:**
```json
{
  "backup_id": "backup-1",
  "message": "Backup created successfully"
}
```

#### Restore Backup
```http
POST /qcity/backups/{backup_id}/restore
```

Restore a system backup.

**Response:**
```json
{
  "message": "Backup restored successfully"
}
```

### Logging

#### Get Logs
```http
GET /qcity/logs
```

Get system logs.

**Query Parameters:**
- `level`: Log level (debug, info, warning, error, critical)
- `start_time`: Start time in ISO format
- `end_time`: End time in ISO format
- `limit`: Maximum number of logs to return

**Response:**
```json
{
  "logs": [
    {
      "timestamp": "2024-03-15T10:00:00Z",
      "level": "info",
      "message": "System started",
      "context": {
        "component": "system",
        "action": "start"
      }
    }
  ]
}
```

### Notifications

#### Get Notifications
```http
GET /qcity/notifications
```

Get system notifications.

**Response:**
```json
{
  "notifications": [
    {
      "id": "notification-1",
      "type": "system",
      "priority": "high",
      "message": "System optimization required",
      "timestamp": "2024-03-15T10:00:00Z",
      "read": false
    }
  ]
}
```

#### Send Notification
```http
POST /qcity/notifications
```

Send a new notification.

**Request Body:**
```json
{
  "type": "system",
  "priority": "high",
  "message": "System optimization required",
  "channels": ["email", "whatsapp"]
}
```

**Response:**
```json
{
  "notification_id": "notification-1",
  "message": "Notification sent successfully"
}
```

### Self-Healing & Automation

#### Trigger NPM Self-Heal
```http
POST /qcity/selfheal-npm
```

Runs the QCity NPM self-heal script on the appropriate environment (auto-detects Windows/Linux/Mac).

**Authentication:**
- Requires JWT token with admin/master role.

**Request Body (JSON, optional):**
```
{
  "forceClean": true,           // (optional) Remove all node_modules/lock files and clean cache before install
  "essentialsOnly": false,      // (optional) Only install/upgrade essential global packages
  "upgradeAll": false,          // (optional) Upgrade all dependencies
  "diagnosticsOnly": false      // (optional) Only run diagnostics, no install
}
```

**Response:**
- Streams logs/results in real time using Server-Sent Events (SSE):
  - Each log line: `data: ...`
  - Errors: `data: [ERROR] ...`
  - End of stream: `data: [DONE]`

**Example (SSE):**
```
data: ==== QCity NPM Self-Heal Run: ...
data: Running: npm ci
...
data: [DONE]
```

**Audit Logging:**
- All triggers and results are logged to `logs/qcity_audit.log` with user, options, and status.

**Auto-Triggering:**
- This endpoint may be called automatically by the error detection service on failed installs/errors.

**Scheduling/Automation:**
- Nightly runs and on-push triggers are supported via Task Scheduler (Windows), cron (Linux/Mac), or CI/CD (GitHub Actions).

**Example Request:**
```bash
curl -N -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -X POST -d '{"forceClean":true}' http://localhost:3000/api/qcity/selfheal-npm
```

### QCity Device Management (Enhanced)

#### Atomic/Temp Install
```http
POST /qcity/device/atomic-install
```
Atomically installs dependencies to a temp directory, then moves to node_modules.

#### Background/Parallel Install
```http
POST /qcity/device/background-install
```
Runs install in the background or in parallel (optionally offloaded to cloud).

#### Deduplication
```http
POST /qcity/device/dedupe
```
Runs npm dedupe to remove duplicate dependencies.

#### Artifact Sync
```http
POST /qcity/device/sync-artifacts
```
Syncs build artifacts and node_modules to cloud storage.

#### Install/Build Status
```http
GET /qcity/device/install-status
```
Returns current install/build status.

#### Health Monitor
```http
GET /qcity/device/health
```
Returns health info (unused, outdated, vulnerable packages).

### Device & Resource Optimization (Enhanced)

#### Get Resource Stats
```http
GET /qcity/device/resources
```
Returns real-time CPU, memory, disk, and network usage.

#### Get Environments Status
```http
GET /qcity/device/envs
```
Returns detected programming environments (Node, Python, Java, Go, Rust, C++, etc.).

#### Install Dependencies for All Envs
```http
POST /qcity/device/install-all-envs
```
Installs dependencies for all detected environments in an atomic, isolated, and resource-aware way.

#### Get Offload Status
```http
GET /qcity/device/offload-status
```
Returns current offload/throttle status.

## QMOI Avatars API
- `GET /api/qmoi/avatars` — List all available avatars and their metadata.
- `POST /api/qmoi/avatars` — Switch avatar (body: { action: 'switch', avatarId })

## QMOI Voice API (Planned)
- `GET /api/qmoi/voice-profiles` — List available voice profiles.
- `POST /api/qmoi/voice-profiles` — Switch voice profile (body: { action: 'switch', voiceId })

## QMOI Memory API (Planned)
- `GET /api/qmoi/memory` — Query memory (conversations, preferences, project history, etc.)
- `POST /api/qmoi/memory` — Save/update memory (body: { type, data })

## Extensibility
- All APIs are designed for easy addition of new avatars, voices, and memory modules.

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters",
  "details": {
    "parameter": "type",
    "message": "Invalid value"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "Error message"
}
```

## Rate Limiting

API requests are rate limited to:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1615809600
```

## WebSocket API

The Q-city system also provides a WebSocket API for real-time updates.

### Connection
```
ws://localhost:3000/api/ws
```

### Events

#### System Status Updates
```json
{
  "type": "system_status",
  "data": {
    "running": true,
    "resources": {
      "cpu": 45.2,
      "memory": 60.5,
      "disk": 75.3
    }
  }
}
```

#### Task Updates
```json
{
  "type": "task_update",
  "data": {
    "task_id": "task-1",
    "status": "completed",
    "result": {
      "success": true
    }
  }
}
```

#### Error Alerts
```json
{
  "type": "error_alert",
  "data": {
    "error_id": "error-1",
    "type": "system",
    "severity": "high",
    "message": "High CPU usage detected"
  }
}
```

#### Notification Updates
```json
{
  "type": "notification",
  "data": {
    "notification_id": "notification-1",
    "type": "system",
    "priority": "high",
    "message": "System optimization required"
  }
}
```

## SDK Examples

### Python
```python
import requests

class QCityClient:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

    def get_status(self):
        response = requests.get(
            f'{self.base_url}/qcity/status',
            headers=self.headers
        )
        return response.json()

    def start_system(self):
        response = requests.post(
            f'{self.base_url}/qcity/start',
            headers=self.headers
        )
        return response.json()

    def stop_system(self):
        response = requests.post(
            f'{self.base_url}/qcity/stop',
            headers=self.headers
        )
        return response.json()
```

### JavaScript
```javascript
class QCityClient {
    constructor(baseUrl, token) {
        this.baseUrl = baseUrl;
        this.headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    async getStatus() {
        const response = await fetch(
            `${this.baseUrl}/qcity/status`,
            { headers: this.headers }
        );
        return response.json();
    }

    async startSystem() {
        const response = await fetch(
            `${this.baseUrl}/qcity/start`,
            {
                method: 'POST',
                headers: this.headers
            }
        );
        return response.json();
    }

    async stopSystem() {
        const response = await fetch(
            `${this.baseUrl}/qcity/stop`,
            {
                method: 'POST',
                headers: this.headers
            }
        );
        return response.json();
    }
}
```

## Best Practices

1. **Error Handling**
   - Always check for error responses
   - Implement retry logic for transient errors
   - Handle rate limiting appropriately

2. **Authentication**
   - Store tokens securely
   - Refresh tokens before expiration
   - Handle authentication errors gracefully

3. **Performance**
   - Use pagination for large data sets
   - Implement caching where appropriate
   - Use WebSocket for real-time updates

4. **Security**
   - Use HTTPS for all API calls
   - Validate all input data
   - Implement proper access control

5. **Monitoring**
   - Monitor API response times
   - Track error rates
   - Log important events

## Support

For API support, please contact:
- Email: support@qcity.ai
- Documentation: https://docs.qcity.ai
- GitHub: https://github.com/qcity/ai

## Unused Endpoints Integration Plan

The following endpoints were previously unused and are now prioritized for integration:

- /api/media
- /api/media/:id
- /api/media/logs
- /api/predictions
- /fix_error
- /list
- /automation/optimize
- /automation/trends
- /automation/history
- /automation/metrics
- /automation/config
- /automation/start
- /automation/stop
- /automation/tasks
- /automation/status
- /automation
- /model/info
- /ping
- /qmessage
- /token

For each endpoint, QMOI will:
- Generate backend and UI integration stubs
- Add automated tests in qmoi_test.sh
- Update documentation and usage scripts
- Rerun endpoint usage checks after integration

All endpoints will be used and documented for full coverage and automation.