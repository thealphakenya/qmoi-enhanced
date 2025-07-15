# QMOI QCity Automatic System

## 🚀 Overview

The QMOI QCity Automatic System is a comprehensive automation platform that provides continuous monitoring, automatic GitLab CI/CD triggering, real-time visualization, and self-healing capabilities. The system runs continuously and automatically manages all aspects of the QMOI QCity platform.

## 🎯 Key Features

### 🔄 Continuous Automation
- **Always Running**: The system runs continuously in the background
- **Auto-Triggering**: Automatically triggers GitLab CI/CD when files change
- **Scheduled Tasks**: Runs automation at regular intervals
- **File Monitoring**: Watches for file changes and triggers automation

### 📊 Real-Time Monitoring
- **Live Dashboard**: Real-time visualization at http://localhost:3010
- **WebSocket Updates**: Live updates via WebSocket connections
- **Performance Charts**: Visual charts showing automation performance
- **Status Indicators**: Real-time status of all platforms

### 🔧 GitLab CI/CD Integration
- **Automatic Triggers**: Triggers GitLab CI/CD automatically
- **Pipeline Monitoring**: Monitors GitLab pipeline status
- **Deployment Tracking**: Tracks successful and failed deployments
- **Error Recovery**: Automatic error recovery and retry mechanisms

### 🌐 Multi-Platform Support
- **GitLab**: Primary CI/CD platform
- **GitHub**: Fallback and sync platform
- **Vercel**: Deployment platform
- **Gitpod**: Development environment integration

### 🧬 Self-Healing & Evolution
- **Auto-Evolution**: Continuous improvement suggestions
- **Error Recovery**: Automatic error fixing
- **Health Monitoring**: Comprehensive health checks
- **Performance Optimization**: Continuous performance monitoring

## 🚀 Quick Start

### Start the Complete System
```bash
# Start the comprehensive QMOI QCity automatic system
python scripts/qmoi-qcity-automatic.py
```

### Start Individual Components
```bash
# Start enhanced dashboard
python scripts/qmoi-dashboard-enhance.py

# Start GitLab CI automation
python scripts/qmoi-gitlab-ci-automation.py

# Start master automation
python scripts/qmoi-enhanced-master-automation.py
```

## 📊 Dashboard Features

### Real-Time Visualization
- **Live Stats**: Real-time automation statistics
- **Performance Charts**: Visual charts showing deployment success/failure
- **Platform Status**: Status of all connected platforms
- **Log Streaming**: Real-time log streaming

### Interactive Controls
- **Manual Triggers**: Manually trigger GitLab CI/CD
- **Health Checks**: Run health checks on demand
- **Auto-Evolution**: Trigger auto-evolution manually
- **Log Management**: Clear and manage logs

### Status Indicators
- **Running**: Yellow indicator (automation in progress)
- **Success**: Green indicator (completed successfully)
- **Failed**: Red indicator (failed)
- **Idle**: Gray indicator (waiting)

## 🔧 Automation Components

### 1. QMOI QCity Automatic System (`qmoi-qcity-automatic.py`)
- **Main Controller**: Orchestrates all automation
- **File Watcher**: Monitors file changes
- **Scheduler**: Runs scheduled tasks
- **Platform Integration**: Manages all platforms

### 2. Enhanced Dashboard (`qmoi-dashboard-enhance.py`)
- **Flask Server**: Web-based dashboard
- **WebSocket**: Real-time communication
- **Chart.js**: Performance visualization
- **Auto-Refresh**: Automatic updates

### 3. GitLab CI Automation (`qmoi-gitlab-ci-automation.py`)
- **CI/CD Pipeline**: Manages GitLab CI/CD
- **Auto-Triggering**: Automatic pipeline triggers
- **Error Recovery**: Handles pipeline failures
- **Status Monitoring**: Tracks pipeline status

## ⏰ Scheduled Tasks

### Automation Schedule
- **Comprehensive Automation**: Every 10 minutes
- **GitLab CI Trigger**: Every 5 minutes
- **Health Check**: Every 3 minutes
- **Platform Sync**: Every 15 minutes
- **Auto-Evolution**: Every 30 minutes
- **Dashboard Update**: Every 2 minutes

### File Change Triggers
- **Python Files**: `.py` files
- **JavaScript Files**: `.js`, `.ts`, `.tsx` files
- **Configuration**: `.json` files
- **Documentation**: `.md` files

## 🔄 Automation Workflow

### 1. File Change Detection
```python
# File watcher detects changes
if event.src_path.endswith(('.py', '.js', '.ts', '.tsx', '.json', '.md')):
    auto_trigger_qcity()
```

### 2. Comprehensive Automation
```bash
# Runs all automation steps
npm run qmoi:setup
npm run qmoi:test
npm run qmoi:build
npm run qmoi:deploy
npm run gitlab:full-pipeline
npm run qmoi:gitpod
npm run qmoi:github-fallback
npm run qmoi:platform-monitor
npm run qmoi:health
npm run qmoi:notify
npm run qmoi:recovery
```

### 3. GitLab CI/CD Pipeline
```bash
# GitLab CI/CD commands
npm run gitlab:push
npm run gitlab:deploy
npm run gitlab:notify
```

### 4. Health Monitoring
```bash
# Health check commands
npm run qmoi:health
npm run gitlab:health
npm run github:monitor
npm run gitpod:monitor
```

## 📈 Performs**: Number of automation runs
- **Successful Deployments**: Successful deployments ance Metrics

### Automation Statistics
- **Total Runcount
- **Failed Deployments**: Failed deployments count
- **GitLab CI Triggers**: Number of CI/CD triggers
- **GitHubployments**: Number of Vercel deployments
- **Gitpod Integrations**: Number of Gitpod integrations
- **Auto-Evolutions**: Number of auto-evolution runs
- **Health Checks**: Number of health checks
 Syncs**: Number of GitHub syncs
- **Vercel De
### Platform Status
- **GitLab**: Connected/Disconnected
- **GitHub**: Connected/Disconnected
- **Vercel**: Connected/Disconnected
- **Gitpod**: Connected/Disconnected

## 🛠️ Configuration

### Environment Variables
```bash
# GitLab Configuration
export GITLAB_TOKEN="your-gitlab-token"
export GITLAB_PROJECT_ID="your-project-id"
export GITLAB_URL="https://gitlab.com"

# GitHub Configuration
export GITHUB_TOKEN="your-github-token"
export GITHUB_REPOSITORY="username/repository"

# QMOI Configuration
export QMOI_AUTO_FIX="true"
export QMOI_NOTIFICATIONS="true"
export QMOI_ERROR_RECOVERY="true"
```

### Log Files
- `logs/qmoi-qcity-automatic.log`: Main automation logs
- `logs/qmoi-dashboard.log`: Dashboard logs
- `logs/qmoi-gitlab-ci.log`: GitLab CI logs
- `logs/qcity-automatic-stats.json`: Automation statistics
- `logs/gitlab-ci-stats.json`: GitLab CI statistics

## 🔍 Monitoring & Debugging

### Dashboard Access
- **URL**: http://localhost:3010
- **WebSocket**: ws://localhost:3010
- **Real-time Updates**: Automatic updates every 2 minutes

### Log Monitoring
```bash
# View real-time logs
tail -f logs/qmoi-qcity-automatic.log

# View dashboard logs
tail -f logs/qmoi-dashboard.log

# View GitLab CI logs
tail -f logs/qmoi-gitlab-ci.log
```

### Statistics Monitoring
```bash
# View automation stats
cat logs/qcity-automatic-stats.json

# View GitLab CI stats
cat logs/gitlab-ci-stats.json
```

## 🚨 Error Handling

### Automatic Error Recovery
- **Timeout Handling**: Handles command timeouts
- **Retry Logic**: Automatic retry for failed commands
- **Error Logging**: Comprehensive error logging
- **Status Tracking**: Tracks error status

### Error Types
- **Command Timeout**: Commands taking too long
- **Network Issues**: Connection problems
- **Authentication Errors**: Token/credential issues
- **Platform Errors**: Platform-specific errors

## 🔧 Advanced Features

### Auto-Evolution
- **Performance Analysis**: Analyzes performance trends
- **Improvement Suggestions**: Suggests improvements
- **Architecture Optimization**: Optimizes system architecture
- **Dependency Updates**: Suggests dependency updates

### Platform Integration
- **Cross-Platform Sync**: Syncs between platforms
- **Fallback Mechanisms**: Automatic fallback to alternative platforms
- **Status Monitoring**: Monitors all platform statuses
- **Error Propagation**: Handles errors across platforms

### Self-Healing
- **Automatic Recovery**: Recovers from errors automatically
- **Health Monitoring**: Continuous health monitoring
- **Performance Optimization**: Optimizes performance automatically
- **Resource Management**: Manages system resources

## 📊 Dashboard Interface

### Main Dashboard
- **Statistics Cards**: Display key metrics
- **Performance Chart**: Real-time performance visualization
- **Status Indicators**: Visual status indicators
- **Control Buttons**: Manual control buttons

### Real-Time Logs
- **Log Streaming**: Real-time log display
- **Log Filtering**: Filter logs by type
- **Log Clearing**: Clear log display
- **Auto-Scroll**: Automatic scrolling to latest logs

### Interactive Controls
- **Trigger GitLab CI**: Manually trigger CI/CD
- **Health Check**: Run health check manually
- **Auto Evolution**: Trigger auto-evolution
- **Clear Logs**: Clear log display

## 🔄 Integration with Other Systems

### GitLab Integration
- **CI/CD Pipeline**: Automatic pipeline triggering
- **Merge Requests**: Automatic merge request creation
- **Deployments**: Automatic deployments
- **Notifications**: GitLab notifications

### GitHub Integration
- **Repository Sync**: Sync with GitHub repositories
- **Fallback System**: Use GitHub as fallback
- **Issue Tracking**: Track issues across platforms
- **Pull Requests**: Manage pull requests

### Vercel Integration
- **Automatic Deployments**: Deploy to Vercel automatically
- **Environment Management**: Manage Vercel environments
- **Domain Management**: Manage custom domains
- **Performance Monitoring**: Monitor Vercel performance

### Gitpod Integration
- **Workspace Management**: Manage Gitpod workspaces
- **Environment Sync**: Sync development environments
- **Collaboration**: Enable team collaboration
- **Resource Management**: Manage workspace resources

## 🚀 Deployment

### Local Deployment
```bash
# Clone repository
git clone <repository-url>
cd Alpha-Q-ai

# Install dependencies
npm install

# Start automation system
python scripts/qmoi-qcity-automatic.py
```

### Production Deployment
```bash
# Set environment variables
export NODE_ENV=production
export QMOI_AUTO_FIX=true

# Start with PM2
pm2 start scripts/qmoi-qcity-automatic.py --name qmoi-automation

# Monitor with PM2
pm2 monit
```

## 📈 Performance Optimization

### Resource Management
- **Memory Usage**: Optimized memory usage
- **CPU Usage**: Efficient CPU utilization
- **Network Usage**: Optimized network requests
- **Disk Usage**: Efficient log management

### Scalability
- **Horizontal Scaling**: Scale across multiple instances
- **Load Balancing**: Distribute load across instances
- **Resource Pooling**: Pool resources efficiently
- **Caching**: Implement intelligent caching

## 🔒 Security

### Authentication
- **Token Management**: Secure token handling
- **Credential Encryption**: Encrypt sensitive credentials
- **Access Control**: Control access to automation
- **Audit Logging**: Comprehensive audit logging

### Data Protection
- **Log Encryption**: Encrypt sensitive logs
- **Data Backup**: Regular data backups
- **Access Logging**: Log all access attempts
- **Error Masking**: Mask sensitive information in errors

## 📚 API Reference

### Dashboard API
- `GET /api/stats`: Get automation statistics
- `POST /api/trigger-gitlab-ci`: Trigger GitLab CI
- `GET /api/automation-status`: Get automation status

### WebSocket Events
- `status_update`: Real-time status updates
- `automation_update`: Automation completion updates
- `automation_error`: Error notifications
- `automation_progress`: Progress updates
- `health_update`: Health check updates
- `evolution_update`: Auto-evolution updates

## 🎯 Best Practices

### Automation Best Practices
1. **Start with Comprehensive System**: Use `qmoi-qcity-automatic.py`
2. **Monitor Dashboard**: Check dashboard regularly
3. **Review Logs**: Monitor logs for issues
4. **Test Changes**: Test changes before deployment
5. **Backup Data**: Regular data backups

### Development Best Practices
1. **Use Version Control**: Commit changes regularly
2. **Test Locally**: Test changes locally first
3. **Monitor Performance**: Monitor system performance
4. **Update Dependencies**: Keep dependencies updated
5. **Document Changes**: Document all changes

### Deployment Best Practices
1. **Use Production Environment**: Set NODE_ENV=production
2. **Monitor Resources**: Monitor system resources
3. **Backup Configuration**: Backup configuration files
4. **Test Deployments**: Test deployments thoroughly
5. **Rollback Plan**: Have rollback plan ready

## 🚨 Troubleshooting

### Common Issues

#### Dashboard Not Loading
```bash
# Check if dashboard is running
ps aux | grep qmoi-dashboard-enhance

# Restart dashboard
python scripts/qmoi-dashboard-enhance.py
```

#### GitLab CI Not Triggering
```bash
# Check GitLab configuration
echo $GITLAB_TOKEN
echo $GITLAB_PROJECT_ID

# Test GitLab connection
npm run gitlab:health
```

#### Automation Not Running
```bash
# Check automation logs
tail -f logs/qmoi-qcity-automatic.log

# Restart automation
python scripts/qmoi-qcity-automatic.py
```

#### Performance Issues
```bash
# Check system resources
top
df -h
free -h

# Check log sizes
du -sh logs/*
```

### Error Recovery
```bash
# Restart all components
pkill -f qmoi
python scripts/qmoi-qcity-automatic.py

# Clear logs
rm -f logs/*.log

# Reset statistics
rm -f logs/*-stats.json
```

## 📞 Support

### Documentation
- **README.md**: Main documentation
- **CMDCOMMANDS.md**: Command reference
- **SCRIPTSREADME.md**: Scripts documentation

### Logs
- **Automation Logs**: `logs/qmoi-qcity-automatic.log`
- **Dashboard Logs**: `logs/qmoi-dashboard.log`
- **GitLab CI Logs**: `logs/qmoi-gitlab-ci.log`

### Statistics
- **Automation Stats**: `logs/qcity-automatic-stats.json`
- **GitLab CI Stats**: `logs/gitlab-ci-stats.json`

---

**Generated by QMOI QCity Automatic System**  
**Last Updated**: 2025-07-13  
**Version**: 2.0.0 

---

## 1. **Environment Variables & Secrets Management**
- **QMOI automatically manages all environment variables and secrets.**
- You do not need to manually set or expose sensitive credentials; QMOI will securely inject and manage them for all notification and cloud features.

---

## 2. **Sending Notifications via WhatsApp or Slack**

### a. **Set Up Environment Variables (Handled by QMOI)**
- For WhatsApp (Twilio):
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_WHATSAPP_FROM`
  - `WHATSAPP_RECIPIENT`
- For Slack:
  - `SLACK_WEBHOOK_URL`
- QMOI will auto-inject these as needed.

### b. **Send Test Messages**
- Use the notification manager:
  ```bash
  python scripts/qmoi_notification_manager.py "Test message from QMOI" gmail whatsapp slack
  ```
- This will send the message to all configured channels and log the activity.

---

## 3. **Uploading Installers to Google Drive**

### a. **Ensure `pydrive2` is Installed**
- QMOI will auto-install dependencies, but you can manually run:
  ```bash
  pip install pydrive2
  ```

### b. **Authenticate Google Drive (First Time Only)**
- QMOI will prompt for authentication if needed.
- Follow the browser prompt to grant access.

### c. **Run the Packaging Script**
  ```bash
  python scripts/qmoi-package-installer.py
  ```
- QMOI will package the app, upload to Google Drive, and log the real download link.

---

## 4. **Monitor All QMOI Activities**
- Check the log:
  ```bash
  cat logs/qmoi-activity-log.json
  ```
- This file contains a real-time, timestamped history of all QMOI actions, including notifications, packaging, uploads, and more.

---

## 5. **Keep QMOI Always Running**
- Use the start script on any device or in the cloud:
  ```bash
  python scripts/qmoi-start.py
  ```
- QMOI will check if it’s already running, show status, and start/resume all automation and cloud features if needed.

---

## 6. **Extra: Templates for Telegram/Discord/Other Chat Integration**

### Telegram (using python-telegram-bot)
```python
import os
import requests

def send_telegram(message):
    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    if not (token and chat_id):
        print("Missing Telegram credentials.")
        return
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    requests.post(url, data={"chat_id": chat_id, "text": message})
```

### Discord (using webhook)
```python
def send_discord(message):
    webhook_url = os.environ.get('DISCORD_WEBHOOK_URL')
    if not webhook_url:
        print("Missing Discord webhook URL.")
        return
    requests.post(webhook_url, json={"content": message})
```

---

## 7. **Best Practices & Automation**

- QMOI will always:
  - Securely manage all credentials and secrets.
  - Log every action in real time.
  - Keep all automation, error fixing, and notifications running in the cloud, even if your device is offline.
  - Provide you with real download links and status updates via all channels.

---

**You are now fully set up for:**
- Multi-channel notifications (Gmail, WhatsApp, Slack, and more)
- Secure, automated secrets management
- Real-time monitoring and logging
- Always-on, cloud-based operation
- Automated packaging and distribution

---

Would you like to:
- See a live test of a notification to all channels?
- Add more chat integrations (Telegram, Discord, etc.)?
- Further customize notification content or triggers?
- Automate even more QMOI features?

Let me know your next priority, or simply run the scripts as described above to see everything in action! 