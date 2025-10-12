# QMOI Monitoring System

## Overview

The QMOI Monitoring System is a comprehensive, automated monitoring solution that provides real-time visibility into all aspects of the QMOI AI system. It includes monitoring for system health, performance, security, backups, cloud resources, API endpoints, and notifications.

## Features

### 🔍 **Comprehensive Monitoring**
- **System Health**: CPU, memory, disk, network monitoring
- **Performance**: Response times, throughput, resource utilization
- **Security**: Real-time threat detection, file integrity, network activity
- **Backups**: Automated backup monitoring and verification
- **Cloud Resources**: AWS, Azure, Google Cloud resource tracking
- **API Endpoints**: Availability, response times, error rates
- **Notifications**: Multi-channel alerting system

### 🚀 **Automated Operations**
- Auto-restart failed components
- Auto-recovery from critical issues
- Rate limiting and cooldown periods
- Dependency management
- Health checks and status reporting

### 📊 **Real-time Dashboard**
- Web-based monitoring dashboard
- Real-time status updates
- Historical data and trends
- Alert management
- Component health visualization

## Architecture

```
QMOI Monitoring System
├── Master Monitor (Orchestrator)
├── System Health Monitor
├── Performance Monitor
├── Security Monitor
├── Backup Monitor
├── Cloud Resources Monitor
├── API Endpoints Monitor
└── Notification Monitor
```

## Components

### 1. Master Monitor (`scripts/monitoring/master_monitor.py`)
- **Purpose**: Orchestrates all monitoring components
- **Features**: 
  - Component lifecycle management
  - Overall health assessment
  - Auto-recovery mechanisms
  - Web dashboard
- **Priority**: Critical

### 2. System Health Monitor (`scripts/monitoring/system_health_monitor.py`)
- **Purpose**: Monitors system resources and health
- **Features**:
  - CPU, memory, disk usage
  - Network connectivity
  - Process monitoring
  - System alerts
- **Priority**: High

### 3. Performance Monitor (`scripts/monitoring/performance_monitor.py`)
- **Purpose**: Tracks system performance metrics
- **Features**:
  - Response time monitoring
  - Throughput analysis
  - Resource optimization
  - Performance alerts
- **Priority**: High

### 4. Security Monitor (`scripts/qmoi_security_monitor.py`)
- **Purpose**: Real-time security monitoring
- **Features**:
  - Threat detection
  - File integrity monitoring
  - Network activity analysis
  - Security alerts
- **Priority**: Critical

### 5. Backup Monitor (`scripts/monitoring/backup_monitor.py`)
- **Purpose**: Monitors backup operations
- **Features**:
  - Backup status tracking
  - Verification and testing
  - Recovery procedures
  - Backup alerts
- **Priority**: Medium

### 6. Cloud Resources Monitor (`scripts/monitoring/cloud_resources_monitor.py`)
- **Purpose**: Monitors cloud infrastructure
- **Features**:
  - AWS, Azure, GCP monitoring
  - Resource utilization
  - Cost tracking
  - Cloud alerts
- **Priority**: Medium

### 7. API Endpoints Monitor (`scripts/monitoring/api_endpoints_monitor.py`)
- **Purpose**: Monitors API availability and performance
- **Features**:
  - Endpoint health checks
  - Response time monitoring
  - Error rate tracking
  - API alerts
- **Priority**: High

### 8. Notification Monitor (`scripts/monitoring/notification_monitor.py`)
- **Purpose**: Manages notifications and alerts
- **Features**:
  - Multi-channel notifications
  - Priority-based routing
  - Rate limiting
  - Notification history
- **Priority**: Critical

## Quick Start

### 1. Start the Monitoring System

```bash
# Start all monitoring components
python scripts/start_monitoring_system.py
```

### 2. Access the Dashboard

Open your browser and navigate to:
```
http://localhost:8080
```

### 3. Check Status

```bash
# View current status
python scripts/monitoring/master_monitor.py --status

# View logs
tail -f logs/master_monitor.log
```

## Configuration

### Master Configuration (`config/master_monitor_config.json`)

```json
{
  "monitoring_components": {
    "system_health": {
      "enabled": true,
      "interval": 60
    },
    "performance": {
      "enabled": true,
      "interval": 120
    }
  },
  "dashboard": {
    "port": 8080,
    "host": "0.0.0.0"
  },
  "alerts": {
    "critical_threshold": 3,
    "warning_threshold": 5,
    "auto_restart": true
  }
}
```

### Notification Configuration (`config/notification_config.json`)

```json
{
  "channels": {
    "email": {
      "enabled": true,
      "smtp_server": "smtp.gmail.com",
      "smtp_port": 587,
      "username": "your-email@gmail.com",
      "password": "your-app-password"
    },
    "webhook": {
      "enabled": true,
      "urls": [
        "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
      ]
    }
  },
  "priorities": {
    "critical": {
      "channels": ["email", "sms", "webhook"],
      "retry_attempts": 5
    }
  }
}
```

## Monitoring Endpoints

### System Health
- **Endpoint**: `/api/monitor/status`
- **Method**: GET
- **Description**: Current system health status

### Performance Metrics
- **Endpoint**: `/api/monitor/performance`
- **Method**: GET
- **Description**: Performance metrics and trends

### Security Status
- **Endpoint**: `/api/monitor/security`
- **Method**: GET
- **Description**: Security monitoring status

### Backup Status
- **Endpoint**: `/api/monitor/backup`
- **Method**: GET
- **Description**: Backup operations status

## Alert Levels

### 🔴 Critical
- System down or unresponsive
- Security breaches detected
- Critical component failures
- Data loss or corruption

### 🟡 Warning
- High resource usage
- Performance degradation
- Backup failures
- API endpoint issues

### 🟢 Info
- Normal operations
- Status updates
- Scheduled maintenance
- System optimizations

## Notification Channels

### Email
- SMTP configuration
- HTML and text templates
- Priority-based routing
- Rate limiting

### Webhooks
- Slack integration
- Discord integration
- Custom webhook support
- JSON payload formatting

### SMS
- Twilio integration
- Emergency notifications
- Critical alerts only
- Rate limiting

### Internal
- Log file storage
- Dashboard notifications
- In-app alerts
- Historical tracking

## Reports and Logs

### Report Locations
- **Latest Reports**: `logs/*_latest.json`
- **Historical Reports**: `logs/*_report_YYYYMMDD_HHMMSS.json`
- **Startup Reports**: `logs/monitoring_startup_*.json`

### Log Files
- **Master Monitor**: `logs/master_monitor.log`
- **System Health**: `logs/system_health_monitor.log`
- **Performance**: `logs/performance_monitor.log`
- **Security**: `logs/qmoi_security_monitor.log`
- **Backup**: `logs/backup_monitor.log`
- **Cloud Resources**: `logs/cloud_resources_monitor.log`
- **API Endpoints**: `logs/api_endpoints_monitor.log`
- **Notifications**: `logs/notification_monitor.log`

## Troubleshooting

### Common Issues

#### 1. Component Not Starting
```bash
# Check dependencies
python -c "import requests, psutil, boto3"

# Check script permissions
chmod +x scripts/monitoring/*.py

# Check logs
tail -f logs/monitoring_startup.log
```

#### 2. High Resource Usage
```bash
# Check system resources
python scripts/monitoring/system_health_monitor.py --check

# Adjust monitoring intervals
# Edit config files to increase intervals
```

#### 3. Notification Failures
```bash
# Check notification configuration
cat config/notification_config.json

# Test email configuration
python scripts/monitoring/notification_monitor.py --test-email

# Check webhook URLs
python scripts/monitoring/notification_monitor.py --test-webhook
```

#### 4. Dashboard Not Accessible
```bash
# Check if dashboard is running
netstat -tlnp | grep 8080

# Check dashboard logs
tail -f logs/master_monitor.log

# Restart dashboard
python scripts/monitoring/master_monitor.py --restart-dashboard
```

### Recovery Procedures

#### Auto-Recovery
The system automatically attempts recovery for:
- Failed component restarts
- High resource usage
- Network connectivity issues
- Temporary service outages

#### Manual Recovery
```bash
# Restart specific component
python scripts/monitoring/master_monitor.py --restart-component system_health

# Restart all components
python scripts/start_monitoring_system.py --restart

# Reset monitoring state
python scripts/monitoring/master_monitor.py --reset
```

## Performance Optimization

### Monitoring Intervals
- **Critical Components**: 30-60 seconds
- **High Priority**: 1-5 minutes
- **Medium Priority**: 5-15 minutes
- **Low Priority**: 15-60 minutes

### Resource Usage
- **CPU**: < 5% average
- **Memory**: < 100MB per component
- **Disk**: < 50MB logs per day
- **Network**: < 1MB per minute

### Scaling
- **Horizontal**: Add monitoring nodes
- **Vertical**: Increase resource limits
- **Load Balancing**: Distribute monitoring load
- **Caching**: Cache frequently accessed data

## Security Considerations

### Access Control
- Dashboard authentication
- API endpoint protection
- Log file permissions
- Configuration file security

### Data Protection
- Encrypted notifications
- Secure webhook URLs
- Masked sensitive data
- Audit logging

### Network Security
- Firewall rules
- VPN access
- SSL/TLS encryption
- Rate limiting

## Integration

### External Systems
- **Slack**: Real-time notifications
- **Discord**: Community alerts
- **Email**: Formal notifications
- **SMS**: Emergency alerts
- **Webhooks**: Custom integrations

### APIs
- **REST API**: Status endpoints
- **WebSocket**: Real-time updates
- **GraphQL**: Flexible queries
- **gRPC**: High-performance communication

### Data Export
- **JSON**: Standard format
- **CSV**: Spreadsheet import
- **Prometheus**: Metrics collection
- **Grafana**: Visualization

## Maintenance

### Daily Tasks
- Review alert logs
- Check component health
- Verify backup status
- Monitor resource usage

### Weekly Tasks
- Analyze performance trends
- Review security logs
- Update configurations
- Clean old logs

### Monthly Tasks
- Performance optimization
- Security assessment
- Capacity planning
- Documentation updates

## Support

### Documentation
- **User Guide**: This document
- **API Reference**: `/docs/API.md`
- **Configuration**: `/docs/CONFIG.md`
- **Troubleshooting**: `/docs/TROUBLESHOOTING.md`

### Logs and Debugging
- **Debug Mode**: `--debug` flag
- **Verbose Logging**: `--verbose` flag
- **Log Rotation**: Automatic
- **Log Analysis**: Built-in tools

### Community
- **GitHub Issues**: Bug reports
- **Discussions**: Feature requests
- **Wiki**: Community documentation
- **Discord**: Real-time support

## License

This monitoring system is part of the QMOI AI project and is licensed under the same terms as the main project.

---

**QMOI Monitoring System** - Comprehensive monitoring for the QMOI AI platform 