<!-- QMOI_OWNER_START -->
owner: unknown
role: unknown
updated_at: 2025-11-22T13:51:57Z
<!-- QMOI_OWNER_END -->

# Queue worker supervisor (systemd example)

This document shows a simple systemd unit file example to run the `queue_worker.py` as a supervised service.

Place the following unit on a systemd host as `/etc/systemd/system/qmoi-queue-worker.service`.

```
[Unit]
Description=QMOI Queue Worker
After=network.target

[Service]
Type=simple
User=qmoi
WorkingDirectory=/opt/qmoi
ExecStart=/usr/bin/python3 /opt/qmoi/scripts/queue_worker.py --concurrency 2
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Notes:
- Adjust `WorkingDirectory` and `ExecStart` paths to match where you deploy the repository on your host.
- Use a dedicated unprivileged user (example uses `qmoi`) and ensure the process has permission to write `.qmoi_validation/`.
- For container deployments, run the same command in your container supervisor (or use an init process).

Optional: logrotate the `.qmoi_validation/runs.log` and other artifacts to avoid unbounded disk growth.
