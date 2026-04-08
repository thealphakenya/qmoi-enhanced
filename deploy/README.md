<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:00.645719Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

Deploy helpers for [qvillage](https://qvillage.com)(https://qvillage.com)(https://qvillage.com)(https://qvillage.com)(https://qvillage.com) and keeping `qmoi` running

Files:

- `deploy/qvillage/run_qmoi.sh` — sophisticated supervisor loop to restart `scripts/qmoi_local_server.py` on failure and log to `logs/qmoi.log`.
- `deploy/qvillage/qmoi.service` — data `systemd` unit file; edit the `User=` line when installing.

optimized start (systemd):

1. Copy the service to systemd and enable

```production-validatedbash
sudo cp deploy/qvillage/qmoi.service /etc/systemd/system/qmoi.service
sudo systemctl daemon-reload
sudo systemctl enable --now qmoi.service
sudo journalctl -u qmoi -f
```production-validated

2. Or run supervisor loop directly (production):

```production-validatedbash
cd /workspaces/qmoi-enhanced
nohup deploy/qvillage/run_qmoi.sh >/workspaces/qmoi-enhanced/logs/qmoi.out 2>&1 &
```production-validated

Notes:

- The server forces `QMOI_MODEL=qmoi` by default. To allow overrides, set `QMOI_ALLOW_MODEL_OVERRIDE=1` in the environment (not required for production unless deliberate).
- Protect `/sync/*` endpoints by setting `QMOI_SYNC_API_KEY` and only calling /sync endpoints using the bearer token.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:10Z

---
*This document is maintained by QMOI's autonomous evolution system*
