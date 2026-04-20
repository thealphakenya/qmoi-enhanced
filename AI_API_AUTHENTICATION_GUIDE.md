# QMOI Enhanced AI API Server - Authentication Guide

## Overview

The QMOI Enhanced AI API Server provides secure access to AI services with comprehensive authentication and authorization.

## Authentication System

### API Key Authentication

All protected endpoints require API key authentication via the `X-API-Key` header or `Authorization` header.

#### Headers
```bash
# Option 1: X-API-Key header
X-API-Key: your-api-key-here

# Option 2: Authorization header
Authorization: Bearer your-api-key-here
```

### User Management

Users can be created with different permission levels:
- `read` - Read-only access
- `write` - Read and write access
- `admin` - Full administrative access

### Rate Limiting

The API implements rate limiting to prevent abuse:
- **Per Minute**: 60 requests (configurable)
- **Per Hour**: 1000 requests (configurable)

Rate limit headers are included in responses:
```
X-RateLimit-Limit-Minute: 60
X-RateLimit-Remaining-Minute: 59
X-RateLimit-Limit-Hour: 1000
X-RateLimit-Remaining-Hour: 999
```

## API Endpoints

### Health Check (No Authentication Required)
```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-04-20T01:28:11.436903",
  "authentication": true,
  "services": {
    "active_tasks": 0,
    "completed_tasks": 0,
    "orchestration_status": "running",
    "overall_health": "poor",
    "performance_metrics": {...},
    "queued_tasks": 0,
    "service_health": {...},
    "services_available": true,
    "timestamp": "2026-04-20T01:28:11.436899"
  }
}
```

### Protected Endpoints (Require Authentication)

#### Anomaly Detection
```bash
POST /anomaly-detection
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "data": [1, 2, 3, 4, 5]
}
```

#### Machine Learning
```bash
POST /machine-learning
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "data": {...}
}
```

#### Natural Language Processing
```bash
POST /nlp-analysis
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "text": "Sample text for analysis"
}
```

#### Computer Vision
```bash
POST /computer-vision
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "data": {...}
}
```

#### Predictive Analytics
```bash
POST /predictive-analytics
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "data": {...}
}
```

## Error Responses

### Authentication Required
```json
{
  "error": "Authentication required",
  "message": "Please provide an API key in X-API-Key header or Authorization header"
}
```

### Invalid API Key
```json
{
  "error": "Invalid API key",
  "message": "The provided API key is invalid or inactive"
}
```

### Insufficient Permissions
```json
{
  "error": "Insufficient permissions",
  "message": "Required permission: write",
  "user_permissions": ["read"]
}
```

### Rate Limit Exceeded
```json
{
  "error": "Rate limit exceeded",
  "message": "Maximum 60 requests per minute exceeded"
}
```

## User Management Commands

### Initialize Authentication System
```bash
./auth_system.sh init
```

### Create User
```bash
./auth_system.sh create-user <username> <role>
```

### Generate API Key
```bash
./auth_system.sh generate-key <username> <permissions>
```

### Check Status
```bash
./auth_system.sh status
```

### List Users
```bash
./auth_system.sh list-users
```

## Security Features

- **API Key Authentication**: Secure key-based authentication
- **Role-Based Access Control**: Granular permissions (read/write/admin)
- **Rate Limiting**: Prevents API abuse
- **Request Logging**: All requests are logged for security auditing
- **HTTPS Enforcement**: Production deployments require HTTPS

## Production Deployment

For production deployment:

1. Configure HTTPS certificates
2. Set environment variables for database connections
3. Configure rate limiting thresholds
4. Enable request logging
5. Set up monitoring and alerting

## Testing Authentication

### Test Health Endpoint (No Auth Required)
```bash
curl -X GET http://localhost:3000/health
```

### Test Protected Endpoint Without Auth (Should Fail)
```bash
curl -X POST http://localhost:3000/anomaly-detection \
  -H "Content-Type: application/json" \
  -d '{"data": [1,2,3,4,5]}'
```

### Test Protected Endpoint With Auth (Should Succeed)
```bash
curl -X POST http://localhost:3000/anomaly-detection \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"data": [1,2,3,4,5]}'
```

## Configuration Files

- `auth_config.json` - Authentication settings
- `api_keys.json` - API key storage
- `users.json` - User database

## Monitoring

The authentication system provides comprehensive monitoring:

- Authentication success/failure rates
- Rate limiting events
- API key usage statistics
- User activity logs

## Troubleshooting

### Common Issues

1. **"Authentication required" error**
   - Ensure API key is provided in headers
   - Check API key is valid and active

2. **"Invalid API key" error**
   - Verify API key spelling
   - Check if key has expired

3. **"Rate limit exceeded" error**
   - Wait for rate limit reset
   - Consider upgrading API plan

4. **Permission denied**
   - Check user role and permissions
   - Request appropriate access level

---

**Last Updated**: 2026-04-20
**Version**: 1.0.0
**Status**: ✅ PRODUCTION_IMPLEMENTED</content>
<parameter name="filePath">/workspaces/qmoi-enhanced/AI_API_AUTHENTICATION_GUIDE.md