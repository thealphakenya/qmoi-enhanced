# QMOI Universal AI System

## Features
- **Auto-distribution**: Distributes all projects to any platform, as instructed by master
- **Platform discovery**: AI finds new distribution and monetization platforms
- **Asset generation**: AI creates trailers, docs, banners, and ads for every project
- **Deal and revenue management**: Sets up deals, pricing, and revenue channels, integrating with Cashon
- **Analytics and optimization**: Tracks downloads, views, revenue, and engagement, and suggests optimizations
- **Master-only controls**: Only master can approve new platforms, deals, and distribution contexts

## Advanced Enhancements
- **Multi-Platform Integrations**: App stores, code repos, video/content platforms, cloud storage, payment providers
- **Localization & AI Translation**: Auto-translate and localize all assets and UI
- **Predictive Analytics & A/B Testing**: Forecast trends, run experiments, and auto-optimize
- **Dynamic Pricing & Revenue Models**: AI-driven pricing, subscriptions, affiliate/referral management
- **Team Roles & Approval Workflows**: Role-based access, multi-step approvals, audit trails
- **Community & Feedback Management**: Automated group management, feedback collection, support bots
- **API & Webhooks**: Public API and webhooks for external automation
- **Security, Compliance, & Self-Healing**: Automated compliance checks, security monitoring, and error/problem auto-fixing

## Documentation
- See `QMOIAUTODISTRIBUTEMARKET.md`, `QMOIAUTOPROJECTSAUTODISTRIBUTEMARKET.md`, `QMOIAUTOPROJECTS.md`, `QMOIAUTOREVENUEEARN.md`, and `QMOIALLPROJECTSADDSTRAILERSDOCS.md` for details
- See `scripts/services/` for backend service stubs and workflows

---

*QMOI - AI-powered automation, distribution, and accessibility for all projects, everywhere, with self-healing and team intelligence.*

# Alpha-Q AI System

## 🚀 New Directory Structure & Automation Philosophy

The Alpha-Q AI system is now fully modular, automated, and future-proof. The new structure is designed for maximum error-fixing, performance, and extensibility:

- `automation/` or `tools/`: All automation, linting, error-fixing, and evolution scripts
- `ai_core/`: QMOI AI core, model, and evolution logic
- `earnvault/`: All EarnVaults backend, strategies, and UI
- `finance/`: Financial integrations (Mpesa, Airtel, etc.)
- `config/`: All configs, with schema validation
- `logs/`, `reports/`, `tests/`: Strict separation for logs, reports, and tests
- `src/`: All TypeScript/React UI, hooks, and services

**Automation Philosophy:**
- All error-fixing, linting, and evolution is fully automated and AI-driven
- Master-only controls for sensitive features (e.g., EarnVaults, financial actions)
- Modular, pluggable AI core and model management
- Secure, encrypted, and auditable for all sensitive actions

See the respective directories for detailed documentation and code for each subsystem.

## 🚀 Features

### Core AI Capabilities
- **Advanced Error Detection & Fixing**: Automatically detects and fixes code errors, syntax issues, and runtime problems
- **Multi-User Session Management**: Supports multiple users, groups, and collaborative environments
- **Intelligent Context Management**: Maintains user context and preferences across sessions
- **Self-Healing System**: Automatically recovers from errors and system failures

### Testing & Quality Assurance
- **Comprehensive Test Suite**: Unit, integration, and end-to-end tests
- **Continuous Testing**: Automated test execution with real-time monitoring
- **Performance Testing**: Load testing and performance benchmarking
- **Error Recovery Testing**: Validates system resilience and recovery capabilities

### Multi-User Features
- **Session Management**: Handle multiple users simultaneously
- **Group Collaboration**: Support for teams, classes, and project groups
- **Role-Based Access**: Master, admin, user, and guest roles
- **Context Persistence**: Maintain user preferences and session state

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Installation](#installation)
3. [Testing](#testing)
4. [Multi-User Setup](#multi-user-setup)
5. [Configuration](#configuration)
6. [API Documentation](#api-documentation)
7. [Contributing](#contributing)
8. [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/alpha-q-ai.git
cd alpha-q-ai

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install

# Setup test environment
python scripts/setup_test_environment.py
```

### Running the System

```bash
# Start the main application
python ai_self_update.py

# Start the web interface
npm run dev

# Run tests
python scripts/enhanced_test_runner.py
```

## 🧪 Testing

### Test Categories

1. **Unit Tests**: Test individual components
   ```bash
   python tests/unit/test_error_fixing.py
   python tests/unit/test_multi_user_session.py
   ```

2. **Integration Tests**: Test component interactions
   ```bash
   python tests/integration/test_error_fixing_integration.py
   python tests/integration/test_session_integration.py
   ```

3. **End-to-End Tests**: Test complete workflows
   ```bash
   python tests/e2e/test_full_workflow.py
   python tests/e2e/test_performance.py
   ```

### Continuous Testing

```bash
# Start continuous testing system
python scripts/continuous_testing.py

# Run with specific configuration
python scripts/continuous_testing.py --config config/test_config.json --interval 300
```

### Test Reports

- **JSON Reports**: Detailed test results with timestamps
- **HTML Reports**: Visual test reports with charts
- **Summary Reports**: Quick overview of test status
- **Performance Metrics**: System performance under test conditions

### Test Configuration

```json
{
  "test_timeout": 300,
  "max_retries": 3,
  "parallel_tests": 4,
  "coverage_threshold": 80,
  "performance_threshold": 1000
}
```

## 👥 Multi-User Setup

### User Roles

1. **Master**: Full system control and administration
2. **Admin**: Group management and user administration
3. **User**: Standard access with project management
4. **Guest**: Limited read-only access

### Session Management

```typescript
// Create a new session
const sessionManager = new MultiUserSessionManager();
const session = sessionManager.createSession("project_session_123");

// Join session as user
const user = sessionManager.joinSession("user_123", "project_session_123", {
  name: "John Doe",
  role: "user",
  preferences: {
    theme: "dark",
    language: "en",
    aiResponseStyle: "detailed"
  }
});

// Create group
const group = sessionManager.createGroup("project_session_123", {
  name: "Development Team",
  type: "team",
  settings: {
    maxMembers: 10,
    sharedContext: true,
    aiMode: "collaborator"
  }
});
```

### Group Types

- **Class**: Educational environment with teacher-student relationships
- **Team**: Collaborative work environment
- **Project**: Task-focused group with specific goals
- **Study**: Learning groups with shared resources

## ⚙️ Configuration

### Environment Variables

```bash
export TEST_ENVIRONMENT=development
export TEST_DATABASE_URL=sqlite:///test.db
export TEST_LOG_LEVEL=DEBUG
export TEST_TIMEOUT=300
```

### Test Configuration

See `config/test_config.json` for detailed configuration options including:
- Test timeouts and retries
- Performance thresholds
- Notification settings
- Security configurations

## 📚 API Documentation

### Error Fixing API

```typescript
// Detect errors in code
const errorHandler = new ErrorHandler();
const result = await errorHandler.detectError(code);

// Auto-fix errors
const autoFixService = new AutoFixService();
const fixedCode = await autoFixService.fixCode(brokenCode);

// Handle system errors
const recoveryResult = await errorHandler.handleSystemError(error);
```

### Multi-User API

```typescript
// Get AI relationship context
const relationshipContext = sessionManager.getAIRelationshipContext(userId, targetUserId);

// Update shared context
sessionManager.updateSharedContext(groupId, context);

// Get session users
const users = sessionManager.getSessionUsers(sessionId);
```

## 🔧 Troubleshooting

### Common Issues

1. **Test Failures**
   ```bash
   # Check test logs
   tail -f tests/reports/test_results.log
   
   # Run tests with debug output
   python tests/unit/test_error_fixing.py -v --debug
   ```

2. **Performance Issues**
   ```bash
   # Monitor system performance
   python scripts/monitor_performance.py
   
   # Check memory usage
   python scripts/check_memory_usage.py
   ```

3. **Session Issues**
   ```bash
   # Reset session state
   python scripts/reset_sessions.py
   
   # Clean up inactive sessions
   python scripts/cleanup_sessions.py
   ```

### Debug Mode

```bash
# Enable debug mode
export DEBUG_MODE=true
export LOG_LEVEL=DEBUG

# Run with debug output
python scripts/enhanced_test_runner.py --debug
```

## 📊 Performance Metrics

### Benchmarks

- **Response Time**: < 100ms for error detection
- **Fix Success Rate**: > 95% for common errors
- **Concurrent Users**: Support for 100+ simultaneous users
- **Test Coverage**: > 95% code coverage

### Monitoring

```bash
# Monitor real-time metrics
python scripts/monitor_metrics.py

# Generate performance report
python scripts/generate_performance_report.py
```

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

### Testing Guidelines

- Write tests for all new features
- Maintain > 95% test coverage
- Include performance tests for new components
- Update documentation for API changes

### Code Quality

```bash
# Run code quality checks
python scripts/check_code_quality.py

# Run security scans
python scripts/security_scan.py

# Generate coverage report
python scripts/generate_coverage_report.py
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [TESTREADME.md](TESTREADME.md)
- **Issues**: [GitHub Issues](https://github.com/your-org/alpha-q-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/alpha-q-ai/discussions)

## 🔄 Changelog

### Version 2.0.0
- Added comprehensive testing system
- Implemented multi-user session management
- Enhanced error fixing capabilities
- Added continuous testing and monitoring
- Improved performance and reliability

### Version 1.0.0
- Initial release with basic AI capabilities
- Error detection and fixing
- Basic user interface

---

*Last updated: January 2024*
*Test coverage: 95%*
*Total test cases: 150+*

# Production Setup Checklist

1. **Add Notification Credentials**
   - Edit `test_config.json` and fill in your real Slack webhook and SMTP email credentials.
   - Do NOT commit secrets to version control. Use environment variables or GitHub Secrets in production.
2. **Validate Notification Config**
   - Run `npm run validate-notification-config` to check for missing or placeholder credentials.
3. **Grant Notification Permissions**
   - Allow browser notifications when prompted by the dashboard.
4. **Test the System**
   - Trigger a problem (e.g., a lint or license error) and push to CI/CD.
   - Confirm you receive WhatsApp, Slack, and email notifications for all AI-driven fixes.
5. **Monitor the Dashboard**
   - Use the NotificationPanel on the admin dashboard for real-time visibility of all notifications and system health.
6. **Check Logs**
   - Review `logs/ai_error_fix.log` for a full audit trail.

## QMOI Permission Self-Healing, Notification, and Audit System

### Features
- **Automatic Permission Self-Healing:** QMOI checks and fixes its own file permissions at startup and periodically. If it cannot fix permissions, it runs a utility script and notifies the master.
- **Multi-Channel Notifications:** Notifies the master via desktop, WhatsApp, and email (configurable in `config/qmoi_config.json`).
- **Audit Logging:** All permission checks, fixes, and notifications are logged in `logs/qmoi_permission_audit.log`.

### Configuration
Edit `config/qmoi_config.json`:
```json
"notification_settings": {
  "desktop_notifications": true,
  "whatsapp_notifications": true,
  "email_notifications": true,
  "critical_only": false
},
"email_settings": {
  "enabled": true,
  "smtp_server": "smtp.gmail.com",
  "smtp_port": 587,
  "sender_email": "your_email@gmail.com",
  "sender_password": "your_password",
  "recipient_emails": ["master_email@gmail.com"]
}
```

### Audit Log
- All permission and notification actions are logged in `logs/qmoi_permission_audit.log`.

### Manual Permission Fix
- You can run `python scripts/qmoi_permission_fix.py` to manually fix permissions for all critical QMOI files.

### Periodic Self-Check
- QMOI checks permissions for all critical files every 10 minutes and self-heals as needed.

## QMOI Dashboard Remote Access, Authentication, and Health Checks

- The dashboard can be accessed remotely or locally, with optional HTTP Basic Auth.
- Configure in `config/qmoi_config.json`:

```json
"dashboard_settings": {
  "host": "0.0.0.0", // Use "127.0.0.1" for local only, "0.0.0.0" for remote
  "port": 5000,
  "enable_auth": false,
  "auth_username": "admin",
  "auth_password": "changeme"
},
"dashboard_health_check_interval": 60, // seconds
"dashboard_downtime_notify_threshold": 180 // seconds
```

- The controller will check dashboard health every `dashboard_health_check_interval` seconds.
- If the dashboard is down for more than `dashboard_downtime_notify_threshold` seconds, it will be restarted and a notification sent.
- All dashboard uptime/downtime events are logged and auditable.

## License Compliance

This project enforces license compliance during CI/CD. The following licenses are explicitly allowed for dependencies:

- MIT
- Apache-2.0
- BSD-2-Clause
- BSD-3-Clause
- CC0-1.0
- CCO-1.0

The allow list is managed in `.github/workflows/auto-deploy.yml` using `license-checker`. Any non-compliant license will trigger an AI error fixer and halt deployment until resolved.

## Deployment Monitoring & Uptime Alerting

- Uptime and deployment status are continuously monitored.
- Any deployment or runtime errors are logged and surfaced to the master user.
- Logs are accessible via the Vercel dashboard and system logs.
- Uptime monitoring and alerting can be configured with services like UptimeRobot, BetterStack, or Vercel's built-in analytics.

## Master-Only Dashboards & Controls

- Sensitive actions (trading, withdrawals, overrides) are only accessible to the master user.
- All such actions require explicit master approval and are logged for auditability.
- Master-only dashboards provide oversight for trading, project management, and system health.
- Unauthorized access attempts are logged and trigger alerts.

# Alpha-Q AI

## Latest Enhancements
- QMOI kernel is now modular, persistent, and fully integrated
- Master/admin UI panels for QMOI control in QCity and QI
- API endpoints for QMOI status and payloads
- Automated compliance checks in CI/CD

See QVS/QVSREADME.md for details.