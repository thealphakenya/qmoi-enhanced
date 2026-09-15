Deploy helpers for qvillage and keeping `qmoi` running

Files:
- `deploy/qvillage/run_qmoi.sh` — simple supervisor loop to restart `scripts/qmoi_local_server.py` on failure and log to `logs/qmoi.log`.
- `deploy/qvillage/qmoi.service` — example `systemd` unit file; edit the `User=` line when installing.

Quick start (systemd):

1. Copy the service to systemd and enable

```bash
sudo cp deploy/qvillage/qmoi.service /etc/systemd/system/qmoi.service
sudo systemctl daemon-reload
sudo systemctl enable --now qmoi.service
sudo journalctl -u qmoi -f
```

2. Or run supervisor loop directly (development):

```bash
cd /workspaces/qmoi-enhanced
nohup deploy/qvillage/run_qmoi.sh >/workspaces/qmoi-enhanced/logs/qmoi.out 2>&1 &
```

Notes:
- The server forces `QMOI_MODEL=qmoi` by default. To allow overrides, set `QMOI_ALLOW_MODEL_OVERRIDE=1` in the environment (not recommended for production unless deliberate).
- Protect `/sync/*` endpoints by setting `QMOI_SYNC_API_KEY` and only calling /sync endpoints using the bearer token.
