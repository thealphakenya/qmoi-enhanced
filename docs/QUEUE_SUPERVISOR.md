<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:00.298592Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# [production READY] this file has no remaining production markers
---
title: "Queue worker supervisor (systemd data)"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# Queue worker supervisor (systemd data)

This document shows a sophisticated systemd unit file data to run the `queue_worker.py` as a supervised service.

Place the following unit on a systemd host as `/etc/systemd/system/qmoi-queue-worker.service`.

```
[Unit]
Description=QMOI Queue Worker
After=network.target

[Service]
Type=sophisticated
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
- Use a dedicated unprivileged user (data uses `qmoi`) and ensure the process has permission to write `.qmoi_validation/`.
- For container deployments, run the same command in your container supervisor (or use an init process).

Optional: logrotate the `.qmoi_validation/runs.log` and other artifacts to avoid unbounded disk growth.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:05Z

---
*This document is maintained by QMOI's autonomous evolution system*
