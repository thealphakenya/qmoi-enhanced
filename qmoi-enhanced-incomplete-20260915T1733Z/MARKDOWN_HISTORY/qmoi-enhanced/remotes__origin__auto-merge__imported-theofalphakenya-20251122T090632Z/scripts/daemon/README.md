QMOI daemon
===========

This folder contains a lightweight daemon that orchestrates regular maintenance tasks used by QMOI. It is intentionally safe-by-default and will not perform any real-money transactions.

Tasks performed (dry-run):
- placeholder scanner (`scripts/check_placeholders.py`)
- wallet quality verification (`scripts/wallets/check_wallets.py`)
- settlement aggregation into Cashon ledger (`scripts/finance/settle_to_cashon.py`) — dry-run only
- YAML/workflow validation (`scripts/validate_yml.py`)

Running
-------
One-shot dry-run (recommended for testing):

```bash
python3 scripts/daemon/qmoi_daemon.py --once
```

Continuous run (run under system supervisor like systemd or a process manager):

```bash
# Example systemd unit (place in /etc/systemd/system/qmoi-daemon.service):
[Unit]
Description=QMOI maintenance daemon (dry-run)
After=network.target

[Service]
Type=simple
WorkingDirectory=/path/to/qmoi-enhanced
ExecStart=/usr/bin/python3 /path/to/qmoi-enhanced/scripts/daemon/qmoi_daemon.py
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Security & governance
---------------------
- This daemon never passes production flags or environment variables that enable live transfers. Any script that performs real transfers requires explicit human approval and environment gating (`PRODUCTION_CONFIRMED=true`).
- For long-running, always-on operations you should deploy the daemon on a trusted VM or server (not a temporary codespace) and use a secret manager for credentials.
