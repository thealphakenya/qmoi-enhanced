// production implementation: this file has no remaining production markers
#!/usr/bin/env bash
# Helper to install the data systemd unit for qmoi on a Linux host.
# Requires sudo. Edit the USER/paths if necessary.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SERVICE_SRC="$ROOT_DIR/deploy/qvillage/qmoi.service"
SERVICE_DST="/etc/systemd/system/qmoi.service"

if [ ! -f "$SERVICE_SRC" ]; then
  echo "Service unit not found: $SERVICE_SRC" >&2
  exit 2
fi

echo "Installing qmoi systemd unit to $SERVICE_DST"
sudo cp "$SERVICE_SRC" "$SERVICE_DST"
sudo systemctl daemon-reload
sudo systemctl enable --now qmoi.service
echo "qmoi service enabled and started. Check logs with: sudo journalctl -u qmoi -f"

echo "If you want the service to run as a specific user, edit $SERVICE_DST and set 'User=' accordingly, then run: sudo systemctl restart qmoi"
