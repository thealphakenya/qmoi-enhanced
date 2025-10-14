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

## 🩺 Advanced Health, Error Fixing, and Optimization in QMOI Hugging Face Spaces

- **/status Endpoint:**
  - Live health, error, and resource status at `/status` (e.g., `/status` on your deployed Space)
- **Advanced Error Fixing:**
  - All errors are caught, logged, and auto-fixed if possible; status is always visible in `/status` and the dashboard
- **Device Optimization:**
  - Aggressively optimizes CPU, memory, disk, and prepares for large apps
- **Autoevolution & Performance Hooks:**
  - Hooks for self-improvement, retraining, and dynamic performance tuning
- **Self-Healing & Observability:**
  - QMOI Spaces is robust and self-healing—even if errors occur, the system attempts auto-repair and exposes all status in `/status` and logs

**Relevant scripts:**

- `huggingface_space/app.py`
- `scripts/qmoi_huggingface_spaces.js`

---

## 🛡️ Advanced Device Error Detection, Auto-Fix, and Health/Accuracy Tracking

- **Proactive Health Checks:**
  - Monitors event loop lag, memory/CPU spikes, and process responsiveness in real time.
  - Detects and prevents device errors like 'not responding' or 'crashed' before they impact the system.

- **Auto-Fix & Recovery:**
  - Automatically attempts to fix or restart any process that becomes unresponsive or crashes.
  - Aggressively cleans up resources and optimizes device health.
  - All auto-fix actions are logged and surfaced in `/status`, dashboard, and logs.

- **Health & Accuracy Stats:**
  - Tracks total errors, errors remaining, errors fixed, percent fixed, auto-fix attempts, and success rate.
  - All health and fix stats are automatically saved to a file (`qmoi_health_status.json`) for dashboard and analytics.
  - `/status` endpoint and dashboard now show these metrics for full observability and accuracy tracking.

- **Development Safe Mode:**
  - In development, QMOI never destabilizes the device and always logs before taking action.

---

## Documentation Automation & Resilience (2025-06-11)

- **Self-Healing Doc Verifier:** Node.js and Python verifiers run in sequence; if one fails, the other auto-fixes and logs all issues.
- **Error Simulation:** Simulates permission, corruption, and missing directory errors to ensure resilience.
- **Persistent Logging:** All doc verification and fixes are logged and synced to the cloud.
- **Notification Triggers:** Sends notifications for verification/fix failures.
- **.md File Update Automation:** All .md files are auto-updated with verification/fix metadata and checked for up-to-date status after every run.
- **CI/CD Integration:** Both verifiers run in CI, and logs/reports are uploaded as artifacts. The workflow never fails for doc issues, only for true system errors.

---

## Optimization & Data Efficiency

- QMOI now features a Data Saver mode for minimal data usage, with adaptive quality based on network and device conditions.
- Heavy features and computations are offloaded to cloud environments (Colab, Dagshub), keeping the local app lightweight and responsive.
- Device management dashboard shows all devices (local/cloud), their status, and optimization tips.
- Auto-offloading ensures tasks migrate to the cloud when local resources are low.
- See `AUTOOPTIMIZEALPHAQMOIENGINE.md` for full details on optimization strategies.

---

## Parallel Error Fixing & Pre-Activity Automation

- QMOI now runs all error fixes (build, lint, deploy, connectivity, cloud, etc.) in parallel for maximum speed and accuracy.
- Pre-activity checks are run before every commit, push, deploy, and in all CI/CD pipelines. If any check fails, QMOI auto-fixes and blocks the action until all pass.
- All results are logged and auditable.

## System Health Dashboard

- A new System Health panel in the QCity dashboard shows real-time pre-activity, connectivity, and cloud status/logs.
- Manual test/repair buttons and real-time updates ensure you always know the system state.

## Aggressive Self-Healing

- QMOI aggressively attempts to repair any error, cycling through all methods, updating endpoints, and retrying until fixed.
- Connectivity, VPN, zero-rated, and cloud issues are auto-repaired and logged.

## Usage

- Use the dashboard to monitor and trigger checks/repairs.
- All pre-activity checks run automatically before any critical action.

## Troubleshooting

- If a check fails, see logs/pre-activity-check.json and the System Health panel for details.
- Manual repair options are available in the dashboard.

## Reliability

- QMOI is designed to be always-on, self-healing, and reliable, with parallel error fixing and aggressive automation.
- All actions are logged for audit and compliance.

## 🚀 Always Fix All Automation

QMOI Enhanced now features a robust always-fix-all system:

- **Script:** `npm run qmoi:always-fix-all`
- **How it works:**
  - Runs all fixers and retries up to 3 times
  - Logs all attempts and results
  - Sends notifications on success or persistent failure
  - Integrated with Husky pre-commit and pre-push hooks for error-free commits and pushes
- **Best Practice:**
  - Use this script in CI/CD, before commits, and before pushes for maximum reliability

See [QMOIAUTOFIXREADME.md](./QMOIAUTOFIXREADME.md) for full details.

## 🤖 AI Error Prediction & Enhanced Notifications

- AI error prediction system analyzes logs and predicts likely error types/files
- Notification preferences and history are managed via dashboard and REST API
- Dashboard displays predictions, notification preferences, and notification history
- See [QMOIAUTOFIXREADME.md](./QMOIAUTOFIXREADME.md) for full details
