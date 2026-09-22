# QMOI Scripts Documentation

## 📋 Overview

This document provides comprehensive documentation for all QMOI automation scripts, their purposes, usage, and integration points. The QMOI system includes multiple specialized scripts for different aspects of automation, monitoring, and error handling.

## 🚀 Core Automation Scripts

### 1. QMOI Enhanced Master Automation (`scripts/qmoi-enhanced-master-automation.py`)

**Purpose**: Comprehensive automation system with real-time monitoring and advanced error handling.

**Features**:
- Real-time monitoring with WebSocket support
- Comprehensive error fixing across all platforms
- Performance optimization
- Auto-evolution suggestions
- Cross-platform synchronization
- Health monitoring
- Detailed reporting

**Usage**:
```bash
# Run complete automation
python scripts/qmoi-enhanced-master-automation.py

# Run with specific options
python scripts/qmoi-enhanced-master-automation.py --evolution
python scripts/qmoi-enhanced-master-automation.py --sync-only
python scripts/qmoi-enhanced-master-automation.py --deploy-only
```

**Key Functions**:
- `run_comprehensive_fixes()`: Fixes all types of issues
- `run_platform_sync()`: Syncs across all platforms
- `run_deployments()`: Handles all deployments
- `run_notifications()`: Sends comprehensive notifications
- `run_health_checks()`: Performs health monitoring
- `generate_auto_evolution_suggestions()`: Creates improvement suggestions

### 2. QMOI Real-Time Monitor (`scripts/qmoi-real-time-monitor.py`)

**Purpose**: Real-time monitoring and visualization of QMOI automation progress.

**Features**:
- Live system statistics
- WebSocket-based real-time updates
- Dashboard server (port 3001)
- Process monitoring
- Network monitoring
- File system monitoring
- QMOI-specific metrics

**Usage**:
```bash
# Start real-time monitoring
python scripts/qmoi-real-time-monitor.py

# Access dashboard
# Open http://localhost:3001 in browser
```

**Key Functions**:
- `collect_system_stats()`: System resource monitoring
- `collect_qmoi_stats()`: QMOI-specific metrics
- `collect_process_stats()`: Process monitoring
- `collect_network_stats()`: Network monitoring
- `start_websocket_server()`: Real-time updates
- `start_dashboard_server()`: Web dashboard

### 3. QMOI Master Notifications (`scripts/qmoi-master-notifications.py`)

**Purpose**: Comprehensive notification system for all QMOI automation events.

**Features**:
- Multi-platform notifications (GitLab, GitHub, Vercel, Gitpod, QCity)
- Console notifications with color coding
- File logging
- WebSocket notifications
- Queue-based processing
- Retry mechanisms
- Statistics tracking

**Usage**:
```bash
# Start notification system
python scripts/qmoi-master-notifications.py

# Send specific notifications
python -c "
from scripts.qmoi_master_notifications import QMOIMasterNotifications
notifications = QMOIMasterNotifications()
notifications.send_success_notification('Test message')
"
```

**Key Functions**:
- `send_notification()`: Send any type of notification
- `send_platform_notification()`: Platform-specific notifications
- `send_error_notification()`: Error notifications
- `send_success_notification()`: Success notifications
- `process_notification()`: Process notification queue

## 🔧 Platform-Specific Scripts

### 4. QCity Automation (`scripts/qcity-automation.js`)

**Purpose**: Node.js-based QCity automation with comprehensive error handling and monitoring.

**Features**:
- QCity-specific automation
- Error recovery mechanisms
- Health monitoring
- Notification integration
- Performance optimization
- Real-time status updates

**Usage**:
```bash
# Run QCity automation
node scripts/qcity-automation.js

# Run with specific options
node scripts/qcity-automation.js --monitor
node scripts/qcity-automation.js --notify
node scripts/qcity-automation.js --health-check
```

**Key Functions**:
- `runQCityAutomation()`: Main automation function
- `monitorQCityHealth()`: Health monitoring
- `sendQCityNotifications()`: Notification handling
- `handleQCityErrors()`: Error recovery
- `optimizeQCityPerformance()`: Performance optimization

### 5. GitLab Error Recovery (`scripts/gitlab-error-recovery.js`)

**Purpose**: Specialized GitLab error handling and recovery.

**Features**:
- GitLab-specific error detection
- Automatic error fixing
- Pipeline recovery
- Issue management
- Merge request handling
- Deployment recovery

**Usage**:
```bash
# Run GitLab error recovery
node scripts/gitlab-error-recovery.js

# Specific error fixes
node scripts/gitlab-error-recovery.js --fix-npm
node scripts/gitlab-error-recovery.js --fix-build
node scripts/gitlab-error-recovery.js --fix-tests
node scripts/gitlab-error-recovery.js --fix-git
```

## 🛠️ Utility Scripts

### 6. JSON Configuration Fixer (`scripts/json-config-fixer.py`)

**Purpose**: Fix and validate JSON configuration files.

**Features**:
- JSON syntax validation
- Common error fixing
- Configuration optimization
- Backup creation
- Validation reporting

**Usage**:
```bash
# Fix all JSON files
python scripts/json-config-fixer.py

# Fix specific files
python scripts/json-config-fixer.py --file package.json
python scripts/json-config-fixer.py --file tsconfig.json
```

### 7. Performance Optimizer (`scripts/qmoi-performance-optimizer.py`)

**Purpose**: Optimize QMOI system performance.

**Features**:
- Performance analysis
- Resource optimization
- Build optimization
- Test optimization
- Memory management
- CPU optimization

**Usage**:
```bash
# Run performance optimization
python scripts/qmoi-performance-optimizer.py

# Specific optimizations
python scripts/qmoi-performance-optimizer.py --build
python scripts/qmoi-performance-optimizer.py --test
python scripts/qmoi-performance-optimizer.py --memory
```

### 8. Health Monitor (`scripts/qmoi-health-monitor.py`)

**Purpose**: Comprehensive health monitoring for QMOI system.

**Features**:
- System health checks
- Service monitoring
- Performance monitoring
- Error detection
- Health reporting
- Alert system

**Usage**:
```bash
# Run health monitoring
python scripts/qmoi-health-monitor.py

# Continuous monitoring
python scripts/qmoi-health-monitor.py --continuous
python scripts/qmoi-health-monitor.py --alert
```

## 📊 Monitoring and Analytics Scripts

### 9. Auto-Evolution System (`scripts/qmoi-auto-evolution.py`)

**Purpose**: Generate improvement suggestions and auto-evolution recommendations.

**Features**:
- Performance analysis
- Code quality assessment
- Security analysis
- Optimization suggestions
- Evolution recommendations
- Trend analysis

**Usage**:
```bash
# Generate evolution suggestions
python scripts/qmoi-auto-evolution.py

# Analyze specific areas
python scripts/qmoi-auto-evolution.py --performance
python scripts/qmoi-auto-evolution.py --security
python scripts/qmoi-auto-evolution.py --quality
```

### 10. Statistics Aggregator (`scripts/qmoi-stats-aggregator.py`)

**Purpose**: Aggregate and analyze QMOI system statistics.

**Features**:
- Data collection
- Statistical analysis
- Trend identification
- Performance metrics
- Success rate calculation
- Report generation

**Usage**:
```bash
# Generate statistics report
python scripts/qmoi-stats-aggregator.py

# Specific analysis
python scripts/qmoi-stats-aggregator.py --performance
python scripts/qmoi-stats-aggregator.py --errors
python scripts/qmoi-stats-aggregator.py --success-rate
```

## 🔄 Integration Scripts

### 11. Platform Sync (`scripts/qmoi-platform-sync.py`)

**Purpose**: Synchronize QMOI across multiple platforms.

**Features**:
- Cross-platform synchronization
- GitLab-GitHub sync
- Vercel deployment sync
- Gitpod workspace sync
- QCity integration
- Conflict resolution

**Usage**:
```bash
# Sync all platforms
python scripts/qmoi-platform-sync.py

# Sync specific platforms
python scripts/qmoi-platform-sync.py --gitlab
python scripts/qmoi-platform-sync.py --github
python scripts/qmoi-platform-sync.py --vercel
```

### 12. Deployment Manager (`scripts/qmoi-deployment-manager.py`)

**Purpose**: Manage deployments across multiple platforms.

**Features**:
- Multi-platform deployment
- Deployment monitoring
- Rollback capabilities
- Health checks
- Notification integration
- Status tracking

**Usage**:
```bash
# Deploy to all platforms
python scripts/qmoi-deployment-manager.py

# Deploy to specific platform
python scripts/qmoi-deployment-manager.py --gitlab
python scripts/qmoi-deployment-manager.py --vercel
python scripts/qmoi-deployment-manager.py --qcity
```

## 🚨 Error Handling Scripts

### 13. Error Handler (`scripts/qmoi-error-handler.py`)

**Purpose**: Comprehensive error handling and recovery.

**Features**:
- Error detection
- Automatic recovery
- Error classification
- Recovery strategies
- Error reporting
- Prevention mechanisms

**Usage**:
```bash
# Run error handling
python scripts/qmoi-error-handler.py

# Handle specific errors
python scripts/qmoi-error-handler.py --npm-errors
python scripts/qmoi-error-handler.py --build-errors
python scripts/qmoi-error-handler.py --test-errors
```

### 14. Error Recovery (`scripts/qmoi-error-recovery.py`)

**Purpose**: Advanced error recovery with multiple strategies.

**Features**:
- Multiple recovery strategies
- Progressive error handling
- Context-aware recovery
- Learning from errors
- Prevention mechanisms
- Recovery reporting

**Usage**:
```bash
# Run error recovery
python scripts/qmoi-error-recovery.py

# Specific recovery
python scripts/qmoi-error-recovery.py --aggressive
python scripts/qmoi-error-recovery.py --conservative
python scripts/qmoi-error-recovery.py --learning
```

## 📈 Testing and Validation Scripts

### 15. Test Runner (`scripts/qmoi-test-runner.py`)

**Purpose**: Comprehensive test execution and validation.

**Features**:
- Multi-test execution
- Coverage analysis
- Performance testing
- Integration testing
- Test reporting
- Failure analysis

**Usage**:
```bash
# Run all tests
python scripts/qmoi-test-runner.py

# Run specific tests
python scripts/qmoi-test-runner.py --unit
python scripts/qmoi-test-runner.py --integration
python scripts/qmoi-test-runner.py --performance
```

### 16. Validation System (`scripts/qmoi-validation-system.py`)

**Purpose**: Validate QMOI system integrity and functionality.

**Features**:
- System validation
- Configuration validation
- Dependency validation
- Security validation
- Performance validation
- Quality validation

**Usage**:
```bash
# Run validation
python scripts/qmoi-validation-system.py

# Specific validation
python scripts/qmoi-validation-system.py --config
python scripts/qmoi-validation-system.py --security
python scripts/qmoi-validation-system.py --performance
```

## 🔧 Configuration Scripts

### 17. Configuration Manager (`scripts/qmoi-config-manager.py`)

**Purpose**: Manage QMOI system configuration.

**Features**:
- Configuration validation
- Configuration optimization
- Environment management
- Secret management
- Configuration backup
- Configuration sync

**Usage**:
```bash
# Manage configuration
python scripts/qmoi-config-manager.py

# Specific operations
python scripts/qmoi-config-manager.py --validate
python scripts/qmoi-config-manager.py --optimize
python scripts/qmoi-config-manager.py --backup
```

### 18. Environment Setup (`scripts/qmoi-environment-setup.py`)

**Purpose**: Set up QMOI environment and dependencies.

**Features**:
- Environment setup
- Dependency installation
- Configuration setup
- Service initialization
- Health verification
- Setup validation

**Usage**:
```bash
# Setup environment
python scripts/qmoi-environment-setup.py

# Specific setup
python scripts/qmoi-environment-setup.py --dev
python scripts/qmoi-environment-setup.py --prod
python scripts/qmoi-environment-setup.py --test
```

## 📊 Reporting Scripts

### 19. Report Generator (`scripts/qmoi-report-generator.py`)

**Purpose**: Generate comprehensive QMOI system reports.

**Features**:
- Performance reports
- Error reports
- Success reports
- Health reports
- Trend reports
- Custom reports

**Usage**:
```bash
# Generate reports
python scripts/qmoi-report-generator.py

# Specific reports
python scripts/qmoi-report-generator.py --performance
python scripts/qmoi-report-generator.py --errors
python scripts/qmoi-report-generator.py --health
```

### 20. Analytics Engine (`scripts/qmoi-analytics-engine.py`)

**Purpose**: Advanced analytics and insights for QMOI system.

**Features**:
- Data analysis
- Trend identification
- Performance insights
- Error patterns
- Success metrics
- Predictive analytics

**Usage**:
```bash
# Run analytics
python scripts/qmoi-analytics-engine.py

# Specific analysis
python scripts/qmoi-analytics-engine.py --trends
python scripts/qmoi-analytics-engine.py --patterns
python scripts/qmoi-analytics-engine.py --predictions
```

## 🚀 Quick Start Commands

### Master Automation
```bash
# Complete QMOI automation
python scripts/qmoi-enhanced-master-automation.py

# Real-time monitoring
python scripts/qmoi-real-time-monitor.py

# Master notifications
python scripts/qmoi-master-notifications.py
```

### Platform Automation
```bash
# QCity automation
node scripts/qcity-automation.js

# GitLab error recovery
node scripts/gitlab-error-recovery.js

# Platform sync
python scripts/qmoi-platform-sync.py
```

### Monitoring and Health
```bash
# Health monitoring
python scripts/qmoi-health-monitor.py

# Performance optimization
python scripts/qmoi-performance-optimizer.py

# Error handling
python scripts/qmoi-error-handler.py
```

### Testing and Validation
```bash
# Test runner
python scripts/qmoi-test-runner.py

# Validation system
python scripts/qmoi-validation-system.py

# Configuration management
python scripts/qmoi-config-manager.py
```

## 📁 Script Organization

### Core Scripts
- `qmoi-enhanced-master-automation.py` - Main automation system
- `qmoi-real-time-monitor.py` - Real-time monitoring
- `qmoi-master-notifications.py` - Notification system

### Platform Scripts
- `qcity-automation.js` - QCity automation
- `gitlab-error-recovery.js` - GitLab error handling

### Utility Scripts
- `json-config-fixer.py` - JSON configuration fixing
- `qmoi-performance-optimizer.py` - Performance optimization
- `qmoi-health-monitor.py` - Health monitoring

### Integration Scripts
- `qmoi-platform-sync.py` - Platform synchronization
- `qmoi-deployment-manager.py` - Deployment management

### Error Handling Scripts
- `qmoi-error-handler.py` - Error handling
- `qmoi-error-recovery.py` - Error recovery

### Testing Scripts
- `qmoi-test-runner.py` - Test execution
- `qmoi-validation-system.py` - System validation

### Configuration Scripts
- `qmoi-config-manager.py` - Configuration management
- `qmoi-environment-setup.py` - Environment setup

### Reporting Scripts
- `qmoi-report-generator.py` - Report generation
- `qmoi-analytics-engine.py` - Analytics engine

## 🔧 Script Dependencies

### Python Dependencies
```bash
pip install requests psutil websockets aiohttp asyncio
```

### Node.js Dependencies
```bash
npm install axios ws express
```

### System Dependencies
- Python 3.7+
- Node.js 14+
- Git
- NPM

## 📊 Monitoring and Logging

### Log Files
- `logs/qmoi-enhanced-automation.log` - Master automation logs
- `logs/real-time-monitor.log` - Real-time monitoring logs
- `logs/qmoi-notifications.log` - Notification system logs
- `logs/fixes-log.json` - Fix application logs
- `logs/real-time-stats.json` - Real-time statistics
- `logs/comprehensive-report.json` - Comprehensive reports

### Dashboard Access
- Real-time dashboard: http://localhost:3001
- WebSocket server: ws://localhost:8080
- API endpoints: Various script-specific endpoints

## 🚨 Error Handling

### Error Types
1. **NPM Errors** - Package management issues
2. **Build Errors** - Compilation and build issues
3. **Test Errors** - Test execution failures
4. **Git Errors** - Version control issues
5. **Environment Errors** - System configuration issues
6. **Script Errors** - Automation script failures
7. **Configuration Errors** - JSON and config file issues

### Recovery Strategies
1. **Automatic Recovery** - Immediate fix attempts
2. **Progressive Recovery** - Step-by-step recovery
3. **Learning Recovery** - Adaptive error handling
4. **Preventive Recovery** - Error prevention mechanisms

## 📈 Performance Optimization

### Optimization Areas
1. **Build Optimization** - Faster compilation
2. **Test Optimization** - Efficient test execution
3. **Memory Optimization** - Resource management
4. **CPU Optimization** - Processing efficiency
5. **Network Optimization** - Communication efficiency

### Monitoring Metrics
1. **System Metrics** - CPU, memory, disk usage
2. **Application Metrics** - Response times, throughput
3. **Error Metrics** - Error rates, recovery times
4. **Success Metrics** - Success rates, completion times

## 🔄 Continuous Integration

### CI/CD Integration
- GitLab CI/CD pipeline integration
- GitHub Actions integration
- Vercel deployment integration
- Gitpod workspace integration
- QCity automation integration

### Automation Workflow
1. **Setup** - Environment preparation
2. **Validation** - Code quality checks
3. **Testing** - Comprehensive testing
4. **Building** - Production builds
5. **Deployment** - Multi-platform deployment
6. **Monitoring** - Health and performance monitoring
7. **Notification** - Status notifications
8. **Evolution** - Continuous improvement

## 📚 Additional Documentation

### Related Documents
- `CMDCOMMANDS.md` - Command reference
- `MASTERGUIDE.md` - Master automation guide
- `INDEPENDENTQMOI.md` - Independent operation guide
- `QMOIQCITYAUTOMATIC.md` - QCity automation guide

### Configuration Files
- `config/ai_automation_config.json` - AI automation configuration
- `config/auto_fix.json` - Auto-fix configuration
- `config/qmoi_enhanced_config.json` - Enhanced system configuration
- `config/qmoi_monitor_config.json` - Monitoring configuration
- `config/qmoi_notifications_config.json` - Notification configuration

## 🤗 Hugging Face Integration Scripts

### QMOI Hugging Face Sync (`scripts/qmoi-hf-sync.py`)
- **Purpose:** Syncs latest QMOI model and code to Hugging Face (`alphaqmoi/qmoi`), verifies deployment, manages permissions.
- **Usage:**
  ```bash
  python scripts/qmoi-hf-sync.py
  ```
- **Logs:** `logs/qmoi-hf-sync.log`

### QMOI Hugging Face Test (`scripts/qmoi-hf-test.py`)
- **Purpose:** Tests Hugging Face Space/model, runs API/UI tests, logs results, auto-fixes on failure.
- **Usage:**
  ```bash
  python scripts/qmoi-hf-test.py
  ```
- **Logs:** `logs/qmoi-hf-test.log`

## 🌐 Platform Management & Developer Actions

### QMOI Platform Manager (`scripts/qmoi-platform-manager.py`)
- **Purpose:** Manages all platform integrations, permissions, and sync (GitHub, GitLab, Hugging Face, Vercel, etc).
- **Usage:**
  ```bash
  python scripts/qmoi-platform-manager.py
  ```
- **Logs:** `logs/qmoi-platform-manager.log`

### QMOI Developer Actions (`scripts/qmoi-dev-actions.py`)
- **Purpose:** Simulates real developer actions (PRs, issues, reviews, comments, etc.) on all platforms. Logs all actions and allows master control.
- **Usage:**
  ```bash
  python scripts/qmoi-dev-actions.py
  ```
- **Logs:** `logs/qmoi-dev-actions.log`

---

**Generated by QMOI Automation System**

This documentation is automatically generated and updated by the QMOI automation system. For the latest information, check the script files directly or run the documentation generation scripts. 