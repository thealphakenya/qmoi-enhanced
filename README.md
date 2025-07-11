# QMOI AI Automation System

QMOI (Quantum Multi-Platform Orchestration Intelligence) is a comprehensive AI automation system designed to operate as a developer and automation agent across multiple platforms including GitLab, GitHub, Gitpod, Vercel, and HuggingFace. The system features advanced error recovery, self-healing capabilities, and parallel processing across different platforms.

## 🚀 Features

### Core Capabilities
- **Multi-Platform Support**: GitLab, GitHub, Gitpod, Vercel, HuggingFace
- **Self-Healing**: Automatically fixes errors in its own files and configurations
- **Parallel Processing**: Runs automation tasks simultaneously across platforms
- **Error Recovery**: Comprehensive error detection and automatic fixing
- **Auto-Push**: Intelligent git push with retry logic and error handling
- **Notification System**: Email, Slack, and Discord notifications
- **Persistent Memory**: Learning from past actions and errors

### Advanced Features
- **GitLab CI/CD Integration**: Automated pipeline management
- **Workspace Management**: Gitpod workspace creation and management
- **Fallback Mechanisms**: Automatic failover between platforms
- **JSON Configuration Fixing**: Automatic repair of malformed JSON files
- **Backup and Recovery**: Comprehensive backup system with restore capabilities

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Git
- Access to GitLab, GitHub, Gitpod, Vercel, and/or HuggingFace APIs

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd qmoi-ai-automation
   ```

2. **Run the setup script**:
   ```bash
   npm run qmoi-setup
   ```

3. **Configure environment variables**:
   ```bash
   # GitLab
   export GITLAB_API_URL="https://gitlab.com/api/v4"
   export GITLAB_TOKEN="your-gitlab-token"

   # GitHub
   export GITHUB_TOKEN="your-github-token"

   # Gitpod
   export GITPOD_API_TOKEN="your-gitpod-token"

   # Vercel
   export VERCEL_TOKEN="your-vercel-token"

   # HuggingFace
   export HUGGINGFACE_TOKEN="your-huggingface-token"

   # Notifications (optional)
   export SMTP_HOST="your-smtp-host"
   export SMTP_USERNAME="your-smtp-username"
   export SMTP_PASSWORD="your-smtp-password"
   export SLACK_WEBHOOK_URL="your-slack-webhook"
   export DISCORD_WEBHOOK_URL="your-discord-webhook"
   ```

## 🚀 Quick Start

### Start QMOI Server
```bash
npm start
```

### Development Mode
```bash
npm run dev
```

### Run Auto-Push
```bash
npm run qmoi-auto-push
```

### Run Error Recovery
```bash
npm run qmoi-error-recovery
```

## 📁 Project Structure

```
qmoi-ai-automation/
├── api/                    # API endpoints
│   └── qcity.ts          # Q-City management API
├── scripts/               # Core automation scripts
│   ├── qmoi-auto-push.js      # Auto-push functionality
│   ├── qmoi-error-recovery.js # Error recovery system
│   ├── qmoi-setup.js          # Setup script
│   └── services/              # Service modules
│       └── notification_service.js
├── config/               # Configuration files
│   ├── qmoi.json        # Main QMOI configuration
│   └── notification.json # Notification settings
├── logs/                 # Log files
├── backups/              # Backup files
├── .gitlab-ci.yml        # GitLab CI/CD pipeline
├── package.json          # Node.js dependencies
└── README.md            # This file
```

## 🔧 Configuration

### Main Configuration (`config/qmoi.json`)
```json
{
  "version": "1.0.0",
  "name": "QMOI AI Automation System",
  "platforms": {
    "gitlab": {
      "enabled": true,
      "api_url": "https://gitlab.com/api/v4",
      "token": "your-token"
    },
    "github": {
      "enabled": true,
      "api_url": "https://api.github.com",
      "token": "your-token"
    }
  },
  "features": {
    "auto_push": true,
    "error_recovery": true,
    "notifications": true,
    "parallel_processing": true,
    "self_healing": true
  }
}
```

### Notification Configuration (`config/notification.json`)
```json
{
  "email": {
    "enabled": false,
    "smtp_host": "your-smtp-host",
    "smtp_port": 587,
    "username": "your-username",
    "password": "your-password"
  },
  "slack": {
    "enabled": false,
    "webhook_url": "your-webhook-url"
  },
  "discord": {
    "enabled": false,
    "webhook_url": "your-webhook-url"
  }
}
```

## 🔄 GitLab CI/CD Integration

The system includes comprehensive GitLab CI/CD integration with the following jobs:

- **setup**: Initial environment setup
- **test**: Run tests and validation
- **build**: Build the application
- **deploy**: Deploy to production
- **qmoi-auto-push**: Manual auto-push job
- **qmoi-error-recovery**: Manual error recovery job

### Pipeline Features
- Automatic dependency installation
- Error recovery integration
- Auto-push after successful builds
- Comprehensive logging and notifications

## 🛡️ Error Recovery System

The error recovery system can automatically fix:

- **Package.json issues**: Missing dependencies, scripts, or malformed JSON
- **GitLab CI/CD problems**: Missing stages, variables, or jobs
- **JavaScript syntax errors**: Missing semicolons, quotes, or parentheses
- **Missing files**: Create essential files if they don't exist
- **Dependency issues**: Install missing npm packages

### Recovery Process
1. **Backup creation**: Creates backups before making changes
2. **Error detection**: Identifies specific issues
3. **Automatic fixing**: Applies appropriate fixes
4. **Validation**: Verifies fixes work correctly
5. **Notification**: Sends status notifications

## 📊 Monitoring and Logging

### Log Files
- `logs/qmoi.log`: General system logs
- `logs/error.log`: Error-specific logs
- `logs/audit.log`: Audit trail
- `logs/notification.log`: Notification logs

### API Endpoints
- `GET /api/qcity/status`: System status
- `GET /api/qcity/config`: Configuration
- `POST /api/qcity/start`: Start QMOI
- `POST /api/qcity/stop`: Stop QMOI
- `GET /api/qcity/notifications`: Get notifications
- `GET /api/qcity/logs`: Get logs

## 🔧 Development

### Adding New Platforms
1. Add platform configuration to `config/qmoi.json`
2. Implement platform-specific API client
3. Add platform to error recovery system
4. Update notification system

### Adding New Features
1. Create feature module in `scripts/`
2. Add feature to configuration
3. Update setup and error recovery scripts
4. Add tests and documentation

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Test specific components:
```bash
# Test auto-push
npm run qmoi-auto-push

# Test error recovery
npm run qmoi-error-recovery

# Test notifications
node -e "const {NotificationService} = require('./scripts/services/notification_service'); new NotificationService().testNotifications()"
```

## 📈 Performance

### Optimization Features
- **Parallel Processing**: Multiple tasks run simultaneously
- **Caching**: Intelligent caching of API responses
- **Retry Logic**: Automatic retry with exponential backoff
- **Resource Monitoring**: Track system resource usage

### Monitoring
- Real-time performance metrics
- Resource usage tracking
- Error rate monitoring
- Response time analysis

## 🔒 Security

### Security Features
- **Token Management**: Secure storage of API tokens
- **Audit Logging**: Comprehensive audit trail
- **Backup Encryption**: Encrypted backup storage
- **Access Control**: Role-based access control

### Best Practices
- Use environment variables for sensitive data
- Regularly rotate API tokens
- Monitor audit logs
- Keep dependencies updated

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues

**Q: Auto-push fails with authentication errors**
A: Check your GitLab/GitHub tokens and ensure they have proper permissions.

**Q: Error recovery doesn't fix all issues**
A: The system focuses on common issues. For complex problems, check the logs and consider manual intervention.

**Q: Notifications aren't working**
A: Verify your notification configuration and check the notification logs.

### Getting Help
- Check the logs in the `logs/` directory
- Review the configuration files
- Test individual components
- Contact support with detailed error information

## 🔮 Roadmap

### Planned Features
- **Machine Learning Integration**: AI-powered error prediction
- **Advanced Analytics**: Detailed performance analytics
- **Plugin System**: Extensible plugin architecture
- **Web Dashboard**: Web-based management interface
- **Mobile App**: Mobile management application

### Upcoming Platforms
- **Bitbucket**: Atlassian Bitbucket integration
- **Azure DevOps**: Microsoft Azure DevOps support
- **Jenkins**: Jenkins CI/CD integration
- **CircleCI**: CircleCI pipeline management

---

**QMOI AI Automation System** - Empowering developers with intelligent automation across multiple platforms.