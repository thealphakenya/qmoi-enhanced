# Application Routes

**Last Generated:** 2026-06-28T19:35:58.883824Z

Complete reference of all application routes and navigation paths.

## 🤖 Local Ollama AI Routes (Free Production Agent)

**Service:** Running on `localhost:11434` (persistent background daemon)

### Route Mapping

| Service | Route | Port | Status | Persistence |
|---------|-------|------|--------|-------------|
| Ollama Server | `http://localhost:11434` | 11434 | ✅ Running | Docker Volume (`ollama_data`) |
| Model | `qwen2.5-coder:3b` | 11434 | ✅ Loaded in RAM | Persistent across rebuilds |
| Continue Extension | Localhost | 11434 | ✅ Connected | Via VS Code config.json |

### Ollama Service Routes

- **Service Discovery**: `GET http://localhost:11434/api/tags`
- **Code Generation**: `POST http://localhost:11434/api/generate`
- **Chat/Assistance**: `POST http://localhost:11434/api/chat`
- **Embeddings**: `POST http://localhost:11434/api/embed`

### Integration Routes

- **Continue Config File**: `.continue/config.json` → `{ provider: "ollama", model: "qwen2.5-coder:3b" }`
- **Devcontainer Setup**: `.devcontainer/devcontainer.json` → Auto-installs Ollama + model
- **Model Cache**: `/root/.ollama` → Persistent Docker volume (`ollama_data`)

### Startup Sequence

1. **Container Boot** → `.devcontainer/devcontainer.json` postCreateCommand triggers
2. **Ollama Installation** → `curl -fsSL https://ollama.com/install.sh | sh`
3. **Service Start** → `ollama serve > /dev/null 2>&1 &`
4. **Model Pull** → `ollama pull qwen2.5-coder:3b` (auto-downloaded ~2GB)
5. **Environment Setup** → `OLLAMA_KEEP_ALIVE=-1` (keeps model in RAM)
6. **Ready for Continue** → Connect VS Code via `localhost:11434`

---

## Routes

- `/`
- `/admin`
- `/admin/master`
- `/admin/master/activity`
- `/admin/master/login`
- `/admin/master/security`
- `/admin/master/settings`
- `/api/account-automation`
- `/api/accountability`
- `/api/admin/alerts`
- `/api/admin/audit-logs`
- `/api/admin/autofix/automation`
- `/api/admin/autofix/autoscan`
- `/api/admin/autofix/background-automation`
- `/api/admin/autofix/bootstrap`
- `/api/admin/autofix/config`
- `/api/admin/autofix/errors`
- `/api/admin/autofix/fix-all`
- `/api/admin/autofix/fix/[errorId]`
- `/api/admin/autofix/health`
- `/api/admin/autofix/healthmonitor`
- `/api/admin/autofix/scan`
- `/api/admin/autofix/stream`
- `/api/admin/dashboard`
- `/api/admin/endpoints-discover`
- `/api/admin/financial/global`
- `/api/admin/financial/summary`
- `/api/admin/master/auth`
- `/api/admin/master/logout`
- `/api/admin/metrics`
- `/api/admin/monitoring`
- `/api/admin/rate-limits`
- `/api/admin/tracing`
- `/api/admin/users`
- `/api/ai`
- `/api/ai-anomaly-service`
- `/api/ai-health`
- `/api/ai-self-diagnostics`
- `/api/ai/agents`
- `/api/ai/scan`
- `/api/alerts/webhook`
- `/api/analytics/transactions`
- `/api/analytics/wallets`
- `/api/auth/biometric/capture`
- `/api/auth/biometric/delete/[method]`
- `/api/auth/biometric/status`
- `/api/auth/biometric/verify`
- `/api/auth/check-master`
- `/api/auth/confirm-reset`
- `/api/auth/forgot`
- `/api/auth/forgot-email`
- `/api/auth/forgot-password`
- `/api/auth/login`
- `/api/auth/me`
- `/api/auth/memory`
- `/api/auth/oauth/[provider]`
- `/api/auth/privacy-mask/disable`
- `/api/auth/privacy-mask/enable`
- `/api/auth/privacy-mask/status`
- `/api/auth/profile`
- `/api/auth/rbac`
- `/api/auth/refresh`
- `/api/auth/register`
- `/api/auth/reset-password`
- `/api/auth/roles`
- `/api/auth/session`
- `/api/auth/sessions/[id]/rename`
- `/api/auth/sessions/get-sessions`
- `/api/auth/sessions/terminate-others`
- `/api/auth/sessions/terminate/[id]`
- `/api/auth/settings`
- `/api/auth/signin`
- `/api/auth/signup`
- `/api/auth/totp`
- `/api/auth/universal`
- `/api/auth/verify`
- `/api/auth/verify-email`
- `/api/auth/webauthn/auth/finish`
- `/api/auth/webauthn/auth/options`
- `/api/auth/webauthn/authenticate`
- `/api/auth/webauthn/register`
- `/api/auth/webauthn/register/finish`
- `/api/auth/webauthn/register/options`
- `/api/auto-fix`
- `/api/automation/status`
- `/api/automation/trigger`
- `/api/avatars/[userId]`
- `/api/biometric/templates`
- `/api/biometric/verify`
- `/api/cameras`
- `/api/cameras/infrared`
- `/api/cameras/panoramic`
- `/api/cameras/road`
- `/api/cameras/street`
- `/api/cameras/thermal`
- `/api/cashon`
- `/api/cashon/balance`
- `/api/cashon/deposit`
- `/api/cashon/signals`
- `/api/cashon/start-trading`
- `/api/cashon/stop-trading`
- `/api/cashon/trading-status`
- `/api/chat/enhanced`
- `/api/chat/friendship`
- `/api/colab-job`
- `/api/consciousness`
- `/api/consciousness/health`
- `/api/consciousness/metrics`
- `/api/consciousness/state`
- `/api/datasets`
- `/api/datasets/[id]`
- `/api/datasets/settings`
- `/api/deals`
- `/api/debug/info`
- `/api/debug/users`
- `/api/deploy`
- `/api/deploy/auto-redeploy`
- `/api/deployment-status`
- `/api/device-fingerprint`
- `/api/devices`
- `/api/document-backup`
- `/api/domains`
- `/api/domains/health`
- `/api/earning`
- `/api/emails`
- `/api/emergency/config`
- `/api/emergency/dispatch`
- `/api/emergency/email`
- `/api/emergency/lockdown`
- `/api/emergency/sms`
- `/api/emergency/wipe`
- `/api/employment`
- `/api/employment/megavault`
- `/api/employment/payment`
- `/api/employment/revenue`
- `/api/enhanced-email/analytics`
- `/api/enhanced-email/realtime`
- `/api/enhanced-email/rules`
- `/api/enhanced-email/send`
- `/api/enhanced-email/templates`
- `/api/enhanced-link-domain`
- `/api/evolution/autoclone-evolution`
- `/api/evolution/platform-evolution`
- `/api/files`
- `/api/financial/audit`
- `/api/financial/balances`
- `/api/financial/transactions`
- `/api/financial/verify`
- `/api/friendship`
- `/api/git/branch`
- `/api/git/commit`
- `/api/git/pr`
- `/api/git/push`
- `/api/git/remote`
- `/api/git/status`
- `/api/global`
- `/api/global-links`
- `/api/global-news`
- `/api/global/overview`
- `/api/health/data`
- `/api/knowledge`
- `/api/links`
- `/api/links/[id]/zero-rated`
- `/api/links/validate`
- `/api/lion/workflows/health`
- `/api/master/command`
- `/api/master/domain-health`
- `/api/master/domain-health/refresh`
- `/api/master/domains`
- `/api/master/domains/approve/[domain]`
- `/api/master/domains/emergency-takeover`
- `/api/master/domains/force-refresh`
- `/api/master/domains/remove/[domain]`
- `/api/master/domains/status`
- `/api/master/godaddy-status`
- `/api/master/last`
- `/api/master/links`
- `/api/master/sponsored/add`
- `/api/master/sponsored/analytics`
- `/api/master/sponsored/list`
- `/api/master/sponsored/remove/[userId]`
- `/api/master/sponsored/sync`
- `/api/master/tracks`
- `/api/media/generate`
- `/api/media/search`
- `/api/media/status`
- `/api/metrics`
- `/api/models`
- `/api/monitor/status`
- `/api/monitoring/health`
- `/api/mpesa/callback`
- `/api/payments/initiate`
- `/api/platforms`
- `/api/preview/analyze`
- `/api/preview/execute-tool`
- `/api/production-api`
- `/api/pwa/auto-update`
- `/api/pwa/check-update`
- `/api/qapikey`
- `/api/qcity/audit-log`
- `/api/qcity/devices`
- `/api/qcity/metrics`
- `/api/qcity/plugins`
- `/api/qcity/remote-command`
- `/api/qcity/schedule`
- `/api/qcity/selfheal-npm`
- `/api/qcity/status`
- `/api/qi-spaces`
- `/api/qi-trading`
- `/api/qmoi-database`
- `/api/qmoi-earning-enhanced`
- `/api/qmoi-gitlab/deployments`
- `/api/qmoi-gitlab/errors`
- `/api/qmoi-gitlab/jobs`
- `/api/qmoi-gitlab/pipelines`
- `/api/qmoi-gitlab/trigger`
- `/api/qmoi-model`
- `/api/qmoi-tracks`
- `/api/qmoi/advanced-analysis`
- `/api/qmoi/audio`
- `/api/qmoi/auto-fix/download-report`
- `/api/qmoi/auto-fix/github-status`
- `/api/qmoi/auto-fix/start`
- `/api/qmoi/auto-fix/status`
- `/api/qmoi/auto-fix/stop`
- `/api/qmoi/auto-setup`
- `/api/qmoi/autodev/generate-feature`
- `/api/qmoi/autodev/research`
- `/api/qmoi/autodev/state`
- `/api/qmoi/autodev/suggestions/features`
- `/api/qmoi/autodev/suggestions/improvements`
- `/api/qmoi/autodev/suggestions/optimizations`
- `/api/qmoi/autodev/toggle`
- `/api/qmoi/avatars`
- `/api/qmoi/backup`
- `/api/qmoi/chat`
- `/api/qmoi/chat-enhanced`
- `/api/qmoi/evolution/compare-models`
- `/api/qmoi/evolution/replace-model`
- `/api/qmoi/evolution/track-evolution`
- `/api/qmoi/execute`
- `/api/qmoi/files/[id]`
- `/api/qmoi/fix/all`
- `/api/qmoi/fix/connectivity`
- `/api/qmoi/friendship`
- `/api/qmoi/health`
- `/api/qmoi/health/stream`
- `/api/qmoi/language`
- `/api/qmoi/master-mode`
- `/api/qmoi/memory`
- `/api/qmoi/own-device-logs`
- `/api/qmoi/own-device-logs/export`
- `/api/qmoi/profile-questions`
- `/api/qmoi/projects`
- `/api/qmoi/research`
- `/api/qmoi/revenue`
- `/api/qmoi/revenue-dashboard`
- `/api/qmoi/revenue/reset`
- `/api/qmoi/revenue/start`
- `/api/qmoi/revenue/status`
- `/api/qmoi/revenue/stop`
- `/api/qmoi/revenue/target`
- `/api/qmoi/revenue/transactions`
- `/api/qmoi/revenue/transfer`
- `/api/qmoi/self-work/code-review`
- `/api/qmoi/self-work/debug`
- `/api/qmoi/self-work/run-tests`
- `/api/qmoi/session`
- `/api/qmoi/status`
- `/api/qmoi/suggestions`
- `/api/qmoi/transcribe`
- `/api/qmoi/upload`
- `/api/qmoi/user`
- `/api/qmoi/visuals`
- `/api/qmoi/voice`
- `/api/qmoi/voice-enroll`
- `/api/qmoi/voice-preview`
- `/api/qmoi/voice-profiles`
- `/api/qnews`
- `/api/qradio`
- `/api/qstore`
- `/api/qvillage`
- `/api/qvillage/inference`
- `/api/qvillage/model-card`
- `/api/qvillage/models`
- `/api/qvillage/spaces`
- `/api/qvs`
- `/api/realtime/stream`
- `/api/revenue-streams`
- `/api/revenue-streams/[streamId]`
- `/api/self-training`
- `/api/social-automation`
- `/api/ssh/list`
- `/api/ssh/read`
- `/api/ssh/write`
- `/api/subscriptions`
- `/api/tracks`
- `/api/tracks/[id]`
- `/api/tracks/settings`
- `/api/tracks/stream`
- `/api/trading/status`
- `/api/transactions`
- `/api/tts/generate`
- `/api/tts/stream`
- `/api/users/profile`
- `/api/v1/health`
- `/api/v2/health`
- `/api/version`
- `/api/voice/enroll`
- `/api/voice/verify`
- `/api/wallet`
- `/api/wallets`
- `/api/wallets/[walletId]`
- `/api/webauthn/authenticate`
- `/api/webauthn/register`
- `/api/webhooks/godaddy-domain`
- `/api/webhooks/godaddy-health`
- `/api/webhooks/payments`
- `/api/webhooks/qvillage`
- `/api/whatsapp-bot`
- `/api/whatsapp-business`
- `/api/whatsapp/audit`
- `/api/whatsapp/verify`
- `/api/wifi`
- `/api/wifi-security`
- `/api/wifi/scan`
- `/api/windows`
- `/api/workflow`
- `/api/youtube/download`
- `/dev`
- `/devices`
- `/friendship`
- `/index.html`
- `/master/domain-health`
- `/master/email`
- `/master/links`
- `/master/tracks`
- `/pwa_apps/qmoi-ai/index.html`
- `/pwa_apps/qmoi-ai/preview.html`
- `/pwa_apps/qmoi-space/index.html`
- `/q-alpha.html`
- `/qalpha`
- `/qcity`
- `/qcity/index.html`
- `/qmoi-ai`
- `/qmoi-ai.html`
- `/qmoi-space`
- `/qmoi-space.html`
- `/qvillage`
- `/reset-password`
- `/universal`
- `/verify-email`


## Related Documentation

- [API.md](API.md) - API endpoints
- [ENDPOINTS.md](ENDPOINTS.md) - REST endpoints
- [WEBHOOKS.md](WEBHOOKS.md) - WebSocket routes


<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-28T19:36:41.616306Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 368
- words: 739
- characters: 9330
- headings: 3
- links: 3
- images: 0
- tables: 0
- lion validation block: inserted
<!-- LION_VALIDATION_END -->
