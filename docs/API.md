# AI Automation API Documentation

## Overview
The AI Automation API provides endpoints for managing and monitoring the AI-powered automation system. It includes features for system control, task management, metrics collection, and configuration management.

## Authentication
All endpoints require authentication using OAuth2 with Bearer tokens. To obtain a token:

1. Send a POST request to `/token` with username and password
2. Use the returned token in the Authorization header for subsequent requests

```bash
# Example token request
curl -X POST "http://localhost:8000/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=user&password=pass"

# Example authenticated request
curl -X GET "http://localhost:8000/automation/status" \
     -H "Authorization: Bearer <token>"
```

## Endpoints

### System Control

#### GET /automation/status
Get current automation system status.

**Response:**
```json
{
    "running": true,
    "active_tasks": 2,
    "system_state": {
        "resources": {
            "cpu": 45.2,
            "memory": 60.5,
            "disk": 75.8,
            "network": 30.1
        },
        "performance": {
            "response_time": 85.3,
            "throughput": 950.2,
            "error_rate": 0.02
        },
        "errors": [],
        "tasks": [],
        "timestamp": "2024-03-14T12:00:00Z"
    }
}
```

#### POST /automation/start
Start the automation system.

**Response:**
```json
{
    "status": "started",
    "message": "Automation system started successfully"
}
```

#### POST /automation/stop
Stop the automation system.

**Response:**
```json
{
    "status": "stopped",
    "message": "Automation system stopped successfully"
}
```

### Task Management

#### GET /automation/tasks
Get all automation tasks.

**Response:**
```json
[
    {
        "id": "task-123",
        "type": "optimization",
        "priority": 1,
        "status": "pending",
        "parameters": {
            "target": "cpu",
            "threshold": 80
        },
        "created_at": "2024-03-14T12:00:00Z",
        "updated_at": "2024-03-14T12:00:00Z",
        "result": null
    }
]
```

#### POST /automation/tasks
Create a new automation task.

**Request:**
```json
{
    "id": "task-123",
    "type": "optimization",
    "priority": 1,
    "status": "pending",
    "parameters": {
        "target": "cpu",
        "threshold": 80
    }
}
```

**Response:**
```json
{
    "status": "created",
    "task_id": "task-123"
}
```

### Metrics and Monitoring

#### GET /automation/metrics
Get current system metrics.

**Response:**
```json
{
    "resources": {
        "cpu": 45.2,
        "memory": 60.5,
        "disk": 75.8,
        "network": 30.1
    },
    "performance": {
        "response_time": 85.3,
        "throughput": 950.2,
        "error_rate": 0.02
    },
    "errors": [],
    "timestamp": "2024-03-14T12:00:00Z"
}
```

#### GET /automation/history
Get system state history.

**Response:**
```json
[
    {
        "resources": {
            "cpu": 45.2,
            "memory": 60.5,
            "disk": 75.8,
            "network": 30.1
        },
        "performance": {
            "response_time": 85.3,
            "throughput": 950.2,
            "error_rate": 0.02
        },
        "errors": [],
        "tasks": [],
        "timestamp": "2024-03-14T12:00:00Z"
    }
]
```

#### GET /automation/trends
Get system performance trends.

**Response:**
```json
{
    "resources": {
        "cpu": 45.2,
        "memory": 60.5,
        "disk": 75.8,
        "network": 30.1
    },
    "performance": {
        "response_time": 85.3,
        "throughput": 950.2,
        "error_rate": 0.02
    },
    "errors": {
        "count": 0,
        "trend": "decreasing"
    }
}
```

### Optimization

#### POST /automation/optimize
Trigger system optimization.

**Request:**
```json
{
    "target": "cpu",
    "parameters": {
        "threshold": 80,
        "strategy": "aggressive"
    }
}
```

**Response:**
```json
{
    "status": "optimization_scheduled",
    "task_id": "optimize-123"
}
```

### Configuration

#### GET /automation/config
Get current automation configuration.

**Response:**
```json
{
    "automation_interval": 60,
    "thresholds": {
        "resource_optimization": 80,
        "error_prevention": 0.1,
        "performance_improvement": 0.2
    },
    "max_concurrent_tasks": 5,
    "task_timeout": 300
}
```

#### POST /automation/config
Update automation configuration.

**Request:**
```json
{
    "automation_interval": 60,
    "thresholds": {
        "resource_optimization": 80,
        "error_prevention": 0.1,
        "performance_improvement": 0.2
    },
    "max_concurrent_tasks": 5,
    "task_timeout": 300
}
```

**Response:**
```json
{
    "status": "updated",
    "message": "Configuration updated successfully"
}
```

## Error Handling
All endpoints return appropriate HTTP status codes and error messages:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include a detail message:
```json
{
    "detail": "Error message"
}
```

## Rate Limiting
API requests are limited to:
- 100 requests per minute per IP
- 1000 requests per hour per user

## WebSocket API
The system also provides a WebSocket API for real-time updates:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received:', data);
};

ws.onopen = () => {
    ws.send(JSON.stringify({
        type: 'subscribe',
        channels: ['metrics', 'tasks', 'errors']
    }));
};
```

## SDK Examples

### Python
```python
import requests

class AutomationClient:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {'Authorization': f'Bearer {token}'}

    def get_status(self):
        response = requests.get(f'{self.base_url}/automation/status', headers=self.headers)
        return response.json()

    def start_automation(self):
        response = requests.post(f'{self.base_url}/automation/start', headers=self.headers)
        return response.json()

    def stop_automation(self):
        response = requests.post(f'{self.base_url}/automation/stop', headers=self.headers)
        return response.json()

# Usage
client = AutomationClient('http://localhost:8000', 'your-token')
status = client.get_status()
```

### JavaScript
```javascript
class AutomationClient {
    constructor(baseUrl, token) {
        this.baseUrl = baseUrl;
        this.headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    async getStatus() {
        const response = await fetch(`${this.baseUrl}/automation/status`, {
            headers: this.headers
        });
        return response.json();
    }

    async startAutomation() {
        const response = await fetch(`${this.baseUrl}/automation/start`, {
            method: 'POST',
            headers: this.headers
        });
        return response.json();
    }

    async stopAutomation() {
        const response = await fetch(`${this.baseUrl}/automation/stop`, {
            method: 'POST',
            headers: this.headers
        });
        return response.json();
    }
}

// Usage
const client = new AutomationClient('http://localhost:8000', 'your-token');
client.getStatus().then(console.log);
```

## Best Practices

1. **Error Handling**
   - Always check response status codes
   - Implement retry logic for failed requests
   - Handle rate limiting gracefully

2. **Authentication**
   - Store tokens securely
   - Implement token refresh logic
   - Never expose tokens in client-side code

3. **Performance**
   - Use WebSocket for real-time updates
   - Implement request caching where appropriate
   - Batch requests when possible

4. **Security**
   - Use HTTPS in production
   - Validate all input data
   - Implement proper access control

5. **Monitoring**
   - Track API usage and performance
   - Monitor error rates
   - Set up alerts for critical issues 

# API Enhancements

## Account Verification & Linking
- Automated verification for WhatsApp, Airtel Money, Mpesa, Facebook, Instagram, YouTube, Google.
- Uses master email (rovicviccy@gmail.com) and WhatsApp (+254786322855).
- Sends WhatsApp notification to master on successful verification.

## Financial Integration (QMOIEARNING)
- Supports earning and depositing to Airtel Money and Mpesa.
- Only master can authorize outgoing transactions.
- All actions are logged for auditability.

## QMOI Earning Daemon (Always-On Automation)
- Keeps QMOI Earning Enhanced always running and earning in the background.
- Periodically deposits to Airtel Money (if authorized by master).
- **Run with:** `yarn qmoi:earning:daemon`
- Logs all actions for audit and transparency.

## Master-Only Controls
- Sensitive features (financial, account linking) are only visible to the master user in the UI.
- Audit logs are displayed for transparency.

## Security Notes
- All sensitive actions require master authorization.
- Data is securely stored and auditable.

## Usage
- Run account verification: `python scripts/account_verification.py`
- Use QMOIEARNING features: `python scripts/qmoi_earning_enhanced.py`
- Start always-on earning: `yarn qmoi:earning:daemon`
- Master-only UI: See QIStateWindow in the app.

## Gmail Notification Integration

- All progress and result notifications for self-healing and autotest are sent to rovicviccy@gmail.com via Gmail.
- Environment variables are managed by scripts/qmoi-environment-setup.js.
- See scripts/ci-self-heal.js and scripts/autotest/advanced_autotest_system.py for implementation details.

### Workspace Management (Audit & Notification)
- All workspace management endpoints (start, stop, clone, sync, etc.) log actions to logs/qcity_audit.log with timestamp, user, action, status, and error (if any).
- Notifications for all workspace events and errors are sent via all configured channels (email, Slack, WhatsApp, Telegram, Discord, etc.).
- Real-time log streaming is available via /api/qcity/workspace-logs (SSE).

# QCity API Endpoints

## /api/qcity/remote-command
- **POST**
- Requires header: `x-qcity-admin-key`
- Body: `{ cmd: string, deviceId?: string, stream?: boolean }`
- Runs a shell command on the selected device. If `stream` is true, returns Server-Sent Events (SSE) log stream. Otherwise, returns `{ output, code }`.
- All actions are audit logged. Sensitive commands are masked.
- 401 if API key is missing/invalid.

## /api/qcity/audit-log
- **GET**
- Requires header: `x-qcity-admin-key`
- Query: `format=json|csv`, `limit`, `offset`, `action`, `user`, `deviceId`, `status`
- Returns filtered audit logs as JSON or CSV. Supports pagination.
- 401 if API key is missing/invalid.

## /api/qcity/status
- **GET**
- Returns device/resource info, offloading state, and active devices.
- **POST**: `{ offloading: boolean }` to toggle offloading state.

# Settings Export/Import

- QMOI, QAvatar, and command panels store user preferences, history, and pins in localStorage.
- The QMoiSettingsPanel provides export/import buttons to backup or transfer all settings as a JSON file.
- Importing settings restores all preferences, history, and pins.