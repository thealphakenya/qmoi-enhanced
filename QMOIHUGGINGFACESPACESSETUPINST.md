# QMOI Hugging Face Spaces Setup & Integration Guide

## 🚀 Overview
QMOI (Quantum Multi-Objective Intelligence) is fully integrated with Hugging Face Spaces, enabling advanced, always-on, self-healing, and observable AI-powered deployments. This guide covers everything from setup to advanced automation, ensuring your QMOI system is always connected, healthy, and operational in Hugging Face Spaces and GitHub.

---

## 1. Prerequisites
- **Hugging Face Account** ([Sign up](https://huggingface.co/join))
- **Hugging Face Token** ([Create token](https://huggingface.co/settings/tokens))
- **Python 3.9+** (for Spaces)
- **Node.js 16+** (for automation scripts)
- **GitHub repository access** (for CI/CD integration)

---

## 2. Environment Variables
QMOI automates environment variable management for both Hugging Face and GitHub. The following variables are required:

```env
# Hugging Face
HF_USERNAME=your-huggingface-username
HF_TOKEN=your-huggingface-token

# WhatsApp Integration (optional)
WHATSAPP_API_TOKEN=your-whatsapp-token
WHATSAPP_WEBHOOK_URL=your-webhook-url

# QMOI System
QMOI_VERSION=2.0.0
QMOI_ENVIRONMENT=production
QMOI_DEBUG=false
```

### Automated Handling
- **scripts/qmoi_env_manager.js**: Checks, auto-fills, and creates `.env` from config, `.env.example`, or safe defaults. Never fails the workflow—logs and continues.
- **.github/workflows/qmoi-autodev.yml**: Always runs environment validation and logs status. If variables are missing, it attempts to auto-populate and never fails the workflow.
- **config/qmoi_huggingface_config.json**: Central config for all Hugging Face and QMOI integration settings.

> **Tip:** If deploying in a new environment (GitHub Actions, Hugging Face, Colab), run `node scripts/qmoi_env_manager.js` to auto-create or fix `.env`.

---

## 3. Setup & Deployment

### A. Local Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/Alpha-Q-ai.git
   cd Alpha-Q-ai
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create/Edit `.env`:**
   - Run: `node scripts/qmoi_env_manager.js`
   - Or manually copy `.env.template` to `.env` and fill in your values.

### B. Deploy to Hugging Face Spaces
- All Hugging Face Space setup and updates are now handled exclusively by GitLab CI/CD automation.

### C. GitHub Actions Integration
- **CI/CD**: `.github/workflows/qmoi-autodev.yml` and `auto-deploy.yml` automate build, test, lint, doc verification, and Hugging Face deployment.
- **Artifacts & Logs**: All logs and status are uploaded as artifacts and shown in the Actions summary.
- **Environment Validation**: Always runs before deploy; never fails the workflow on env errors—logs and continues.

---

## 4. Using QMOI in Hugging Face Spaces

### Access
- Visit: `https://huggingface.co/spaces/<your-username>/qmoi-ai-system`
- Use the multi-tab Gradio UI for:
  - 💬 Chat with QMOI
  - 📊 System Monitoring
  - 🚀 Deployment & Updates
  - 🔄 Conversation Sync
  - ⚙️ Device Optimization

### Features
- **Self-healing**: Auto-repairs and redeploys on failure
- **Real-time Monitoring**: Health, logs, and status always visible
- **Cross-platform Sync**: WhatsApp, Discord, Telegram, and more
- **Manual & Auto Triggers**: Run fixes, redeploy, or sync from the dashboard
- **Advanced Analytics**: Health %, error-fix stats, and more

---

## 5. Advanced Automation & Troubleshooting

### Automated Environment Variable Handling
- **Never fails**: If envs are missing, QMOI auto-fills from config, `.env.example`, or safe defaults, logs the issue, and continues.
- **Status Logging**: See `logs/env_manager_status.json` and GitHub Actions summary for env status.
- **Manual Fix**: Edit `.env` or update GitHub/Hugging Face secrets as needed.

### Common Issues
- **Missing HF_TOKEN/HF_USERNAME**: Run `node scripts/qmoi_env_manager.js` or set in Hugging Face/GitHub secrets.
- **Deployment Fails**: Check logs in `logs/huggingface_spaces.log` or GitHub Actions summary.
- **WhatsApp Integration Fails**: Ensure tokens and webhook URLs are set in `.env` or config.

### Automation Scripts
- `scripts/qmoi_huggingface_spaces.js`: Full-featured deployment, update, and health management for Spaces.
- `scripts/qmoi_env_manager.js`: Automated env management for all platforms.
- `scripts/qmoi_huggingface_backup.js`: Continuous backup and sync to Hugging Face.
- `scripts/auto_env_fix.cjs`: Auto-fix and deploy for Vercel/Node.js environments.

---

## 6. System-wide Hugging Face Integration
- **QMOI is always connected**: All core, chat, monitoring, and backup services are integrated with Hugging Face Spaces.
- **Config-driven**: All integration settings are in `config/qmoi_huggingface_config.json` and `config/qmoi_master_config.json`.
- **Continuous Sync**: Conversation, health, and deployment status are always synced between QMOI, Hugging Face, and GitHub.
- **Auto-healing**: If any part fails, QMOI attempts auto-repair and redeploy, logging all actions.

---

## 7. Further Automation & Enhancement
- **Add new envs**: Update `requiredEnvs` in `scripts/qmoi_env_manager.js` and `.env.template`.
- **Enhance automation**: Extend `qmoi_huggingface_spaces.js` for new features or integrations.
- **Monitor everything**: Use the dashboard and GitHub Actions summary for real-time health and status.
- **Test everything**: Run tests locally or via CI to ensure all integrations and envs are working.

---

## 8. References & Resources
- [Hugging Face Spaces Docs](https://huggingface.co/docs/hub/spaces)
- [QMOI-HUGGINGFACE-ENHANCEMENTS.md](QMOI-HUGGINGFACE-ENHANCEMENTS.md)
- [config/qmoi_huggingface_config.json](config/qmoi_huggingface_config.json)
- [scripts/qmoi_huggingface_spaces.js](scripts/qmoi_huggingface_spaces.js)
- [scripts/qmoi_env_manager.js](scripts/qmoi_env_manager.js)
- [QMOI Dashboard](#)

---

## 9. CI/CD Automation for Hugging Face Integration

The QMOI system now includes full CI/CD automation for Hugging Face integration:

- **Automated Space Deployment:**
  - `node scripts/qmoi_huggingface_spaces.js deploy` is run on every push and after model enhancement.
  - Ensures the latest UI and backend are always live in Hugging Face Spaces.

- **Automated Model Sync:**
  - `python scripts/hf_model_sync.py --repo alphaqmoi/qmoi-ai-system --model-path models/latest` syncs the latest QMOI model to the Hugging Face model repo.
  - Runs after every deployment and model enhancement.

- **Automated UI Feature Test:**
  - `python scripts/test_hf_space_ui.py --space-url https://huggingface.co/spaces/alphaqmoi/qmoi-ai-system` verifies all Gradio UI features are accessible and working.
  - Logs results and triggers auto-repair if needed.

- **Log Uploads:**
  - All automation logs are uploaded as GitHub Actions artifacts for review:
    - `logs/hf_model_sync.log`
    - `logs/huggingface_spaces.log`
    - `logs/test_hf_space_ui.log`

- **Non-Fatal Workflows:**
  - All steps are robust and never fail the workflow. Errors are logged and surfaced in the Actions summary.

- **Visibility:**
  - All results, logs, and health checks are visible in the GitHub Actions dashboard.

See also:
- [scripts/qmoi_huggingface_spaces.js](./scripts/qmoi_huggingface_spaces.js)
- [scripts/hf_model_sync.py](./scripts/hf_model_sync.py)
- [scripts/test_hf_space_ui.py](./scripts/test_hf_space_ui.py)
- [REFERENCES.md](./REFERENCES.md)

---

## 🛡️ Always-On, Always-Healing, Always-Connected
QMOI ensures your Hugging Face Spaces deployment is:
- **Always running**
- **Always fixing itself**
- **Always pushing updates**
- **Always logging and observable**
- **Always documented and verifiable**
- **Always connected to Hugging Face, GitHub, and all supported platforms**

> For any issues, check logs, the dashboard, or run the automation scripts. QMOI will attempt to auto-fix and notify you of any manual steps needed. 

---

## 10. Advanced Health, Error Fixing, and Optimization in QMOI Hugging Face Spaces

QMOI Hugging Face Spaces now includes:

- **/status Endpoint:**
  - Access live health, error, and resource status at `/status` (e.g., `https://huggingface.co/spaces/alphaqmoi/qmoi-ai-system/status`).
  - Returns health, error count, last error, auto-fix attempts, CPU, memory, disk usage, and timestamp.

- **Advanced Error Fixing:**
  - All errors are caught, logged, and auto-fixed if possible (restart, clear cache, optimize memory, etc.).
  - Error status is always visible in `/status` and the dashboard.

- **Device Optimization:**
  - Aggressively optimizes CPU, memory, disk, and prepares the device for large, resource-intensive apps.
  - Optimization is triggered on startup and as needed.

- **Autoevolution & Performance Hooks:**
  - Hooks are triggered on every user interaction for self-improvement, retraining, and dynamic performance tuning.

- **Self-Healing & Observability:**
  - QMOI Spaces is robust and self-healing—even if errors occur, the system attempts auto-repair and exposes all status in `/status` and logs.

**Usage:**
- To check live health/status: `GET /status` on your deployed Space.
- To trigger optimization or error fixing: interact with the Space or restart as needed (auto-triggers on error).

**Relevant scripts:**
- `huggingface_space/app.py` (core logic)
- `scripts/qmoi_huggingface_spaces.js` (deployment/automation)

---

## 11. Advanced Device Error Detection, Auto-Fix, and Health/Accuracy Tracking

QMOI now includes:

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