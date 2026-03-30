// // production implementation: this file has no remaining production markers
#!/usr/bin/env bash
set -euo pipefail
if [ "$(id -u)" -ne 0 ]; then
  echo "This script must be run as root to install a systemd service. Use sudo."
  exit 1
fi
APP_DIR=${1:-/opt/qmoi}
SERVICE_FILE=/etc/systemd/system/qmoi.service
mkdir -p "$APP_DIR"
cat > "$SERVICE_FILE" <<'EOF'
[Unit]
Description=QMOI Next.js App
After=network.target

[Service]
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/env NODE_ENV=production /usr/bin/npm start
Restart=always
RestartSec=5
User=www-data
Environment=PORT=3000
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable qmoi.service
systemctl start qmoi.service
systemctl status qmoi.service --no-pager

echo "Installed and started qmoi.service (working dir: $APP_DIR)"