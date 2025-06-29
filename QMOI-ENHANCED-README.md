# QMOI Enhanced System

## Overview

QMOI Enhanced is a comprehensive AI-powered development and automation platform featuring advanced documentation management, self-testing capabilities, and intelligent error fixing.

## 🚀 Key Features

- **📚 Auto-Documentation**: Creates and verifies documentation automatically
- **🧪 Self-Testing**: Simulates errors and tests auto-fix capabilities
- **🔧 Intelligent Error Fixing**: Handles build, Vercel, test, lint, and license issues
- **🤖 GitHub Actions Integration**: Automated workflows with comprehensive reporting
- **📊 Health Monitoring**: Continuous system health monitoring
- **🔔 Multi-Channel Notifications**: Slack, Discord, and email alerts

## Quick Start

```bash
# Install dependencies
npm install

# Run full automation
npm run qmoi:autodev:full

# Verify documentation
npm run qmoi:docs:verify

# Run self-tests
npm run qmoi:test:all

# Fix errors comprehensively
npm run qmoi:fix:comprehensive
```

## 📋 Available Scripts

### Documentation
```bash
npm run qmoi:docs:verify    # Verify all documentation
npm run qmoi:docs:create    # Create new documentation
npm run qmoi:docs:test      # Test documentation system
npm run qmoi:docs:simulate  # Simulate documentation errors
```

### Self-Testing
```bash
npm run qmoi:test:all       # Run all self-tests
npm run qmoi:test:list      # List available tests
npm run qmoi:test:run       # Run specific test
```

### Error Fixing
```bash
npm run qmoi:fix:comprehensive  # Fix all error types
npm run qmoi:fix:build          # Fix build errors
npm run qmoi:fix:vercel         # Fix Vercel errors
npm run qmoi:fix:test           # Fix test errors
npm run qmoi:fix:lint           # Fix lint errors
npm run qmoi:fix:license        # Fix license errors
```

### Automation
```bash
npm run qmoi:autodev:full   # Full automation
npm run qmoi:autodev:docs   # Documentation automation
npm run qmoi:autodev:test   # Testing automation
npm run qmoi:autodev:deploy # Deployment automation
```

## 🔧 Configuration

### Environment Variables
```bash
QMOI_AUTODEV_ENABLED=true
VERCEL_TOKEN=your_vercel_token
SLACK_WEBHOOK_URL=your_slack_webhook
DISCORD_WEBHOOK_URL=your_discord_webhook
```

### test_config.json
```json
{
  "notifications": {
    "slack": { "enabled": true, "webhook_url": "your_webhook" },
    "discord": { "enabled": true, "webhook_url": "your_webhook" },
    "email": { "enabled": true, "smtp_server": "smtp.gmail.com" }
  },
  "qmoi": {
    "auto_fix_enabled": true,
    "self_test_enabled": true,
    "doc_verification_enabled": true
  }
}
```

## 📊 Test Scenarios

The self-test system includes:

- **Build Errors**: Missing dependencies, TypeScript errors
- **Lint Errors**: Unused variables, code style issues
- **Config Errors**: Invalid JSON, malformed configs
- **Environment Errors**: Missing environment variables
- **Deployment Errors**: Invalid Vercel configuration

## 📁 File Structure

```
scripts/
├── qmoi_doc_verifier.js          # Documentation verification
├── qmoi_self_test_runner.js      # Self-testing system
├── enhanced-error-fix.js         # Error fixing system
└── deploy/
    ├── health-check.js           # Health monitoring
    └── vercel_auto_deploy.js     # Deployment automation

docs/
├── verification-report.json      # Documentation reports
└── *.md                          # Auto-generated docs

logs/
├── self-test-report.json         # Test reports
├── ai_error_fix.log              # Error fix logs
└── deployment-health.log         # Health logs
```

## 🤖 GitHub Actions

The system includes enhanced GitHub Actions workflows:

- **Automated Triggers**: Push, PR, scheduled, manual
- **Comprehensive Reporting**: Documentation, tests, deployment
- **Artifact Storage**: All reports saved as artifacts
- **Multi-Channel Notifications**: Status updates via Slack/Discord/Email

## 🔍 Troubleshooting

### Common Issues

```bash
# Check system health
npm run deploy:health

# Run with debug
DEBUG=true npm run qmoi:autodev:full

# Check logs
tail -f logs/ai_error_fix.log
tail -f logs/self-test-report.json
```

### Debug Mode
```bash
export DEBUG=true
npm run qmoi:autodev:full -- --debug
```

## 📈 Performance

The system tracks:
- Documentation creation time
- Test execution time
- Error fix success rate
- Deployment success rate

## 🔒 Security

- Master mode for restricted features
- Secure API key management
- Environment variable protection
- Comprehensive audit logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Run tests: `npm run qmoi:test:all`
4. Update docs: `npm run qmoi:docs:verify`
5. Submit pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

## 🆘 Support

- Check documentation and logs
- Run self-tests for diagnostics
- Create GitHub issues
- Use GitHub Discussions

## Secure Credential Handling

- All sensitive credentials (M-Pesa number, production secrets) are stored in `.env.production` (excluded from git).
- Never commit `.env.production` to version control.
- Reference credentials in code via `process.env` only.

## M-Pesa Integration

- QMOI automatically syncs earnings to the Cashon wallet and periodically transfers to the M-Pesa account.
- M-Pesa number: stored as `CASHON_MPESA_NUMBER` in `.env.production`.
- All transfers are logged and auditable.

## Revenue Automation

- QMOI's earning engine is fully automated and credits all profits to Cashon.
- Analytics and transaction history are available in the dashboard.

## Credential Rotation & Backup

- To rotate credentials, update `.env.production` and restart the service.
- Optionally, encrypt and back up `.env.production` to a secure location (never in git).
- If credentials are missing, QMOI will alert the master and block sensitive actions.

## M-Pesa Dashboard & Analytics

- The master dashboard displays:
  - Masked M-Pesa number
  - Real-time balance and transaction history
  - Manual and auto-withdrawal controls
  - Transfer logs and error reports
- All sensitive actions require master authentication.

## M-Pesa API Integration

QMOI now includes full M-Pesa API integration for real money transfers:

### Environment Variables Required

Add these to your `.env.production` file:

```bash
# M-Pesa Configuration
CASHON_MPESA_NUMBER=0725382624
QMOI_PROD_CREDENTIAL=your_production_credential

# M-Pesa API Credentials
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=your_shortcode
MPESA_ENVIRONMENT=production
MPESA_INITIATOR_NAME=QMOI
MPESA_SECURITY_CREDENTIAL=your_security_credential

# QMOI Master Token
QMOI_MASTER_TOKEN=your_master_token

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Features

- **Real M-Pesa Integration**: Uses official Safaricom M-Pesa API
- **STK Push**: Initiates payments directly to user's phone
- **Transaction Verification**: Checks payment status automatically
- **Automatic Transfers**: QMOI transfers earnings to M-Pesa automatically
- **Transaction Reversal**: Can reverse failed transactions
- **Callback Handling**: Processes payment confirmations

## QMOI Revenue Engine

QMOI continuously generates revenue through multiple streams:

### Revenue Streams

1. **AI Trading Bot** (Target: 2000 KES/day)
   - Automated cryptocurrency and forex trading
   - Market analysis and prediction
   - Risk management and portfolio optimization

2. **Affiliate Marketing** (Target: 1000 KES/day)
   - Product promotion and commission earning
   - Automated affiliate link generation
   - Performance tracking and optimization

3. **SaaS Subscriptions** (Target: 800 KES/day)
   - Software-as-a-Service revenue
   - Recurring subscription management
   - Customer retention optimization

4. **Content Monetization** (Target: 500 KES/day)
   - Ad revenue from content
   - Sponsorship and partnership deals
   - Premium content sales

5. **Automation Services** (Target: 400 KES/day)
   - Process automation for clients
   - Workflow optimization services
   - Custom automation solutions

6. **AI Consulting** (Target: 300 KES/day)
   - Expert AI implementation advice
   - Technical consulting services
   - Project management and support

### Revenue Dashboard

The master dashboard shows:
- Real-time earnings from all streams
- Daily progress towards targets
- Transaction history and analytics
- M-Pesa transfer status
- Revenue engine controls (start/stop/transfer)

### Automatic Money Flow

1. QMOI generates revenue continuously
2. All earnings are credited to Cashon wallet
3. When balance reaches 1000 KES, automatic transfer to M-Pesa
4. All transactions are logged and auditable
5. Master can manually trigger transfers anytime

## Security & Compliance

- All M-Pesa credentials stored securely in environment variables
- Transaction logging and audit trails
- Error handling and retry mechanisms
- Master-only access to financial controls
- Automatic alerts for failed transactions

## Getting Started

1. Set up M-Pesa API credentials with Safaricom
2. Configure all environment variables in `.env.production`
3. Deploy the application
4. Start the revenue engine from the master dashboard
5. Monitor earnings and transfers in real-time

## API Endpoints

- `GET /api/qmoi/revenue` - Get revenue status and streams
- `POST /api/qmoi/revenue` - Control revenue engine
- `POST /api/mpesa/callback` - Handle M-Pesa payment confirmations

## Troubleshooting

- Check M-Pesa API credentials if transfers fail
- Verify callback URLs are accessible
- Monitor logs for transaction errors
- Ensure master token is configured correctly

---

**QMOI Enhanced System** - Always learning, always improving, always automating! 🚀 