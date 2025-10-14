#!/bin/bash
# QMOI Cloud Deploy Script
# Deploys and keeps QMOI automation, live status, and dashboard running in Colab, DagsHub, or any cloud

set -e

# Install Python dependencies
pip install --upgrade pip
pip install flask

# Enforce cloud-offloading and cloud_optimized mode
export QMOI_CLOUD_OPTIMIZED=true
export QMOI_DEVICE_INDEPENDENT=true
export QMOI_AUTO_RESTART=true
export QMOI_DASHBOARD_CLOUD_MODE=true
# Log cloud-offload status
echo "[QMOI] Cloud-offload mode enabled. All automation and dashboard will auto-restart in cloud if stopped."

# Auto-restart logic (pseudo)
while true; do
  # Start main automation/dashboard
  python3 scripts/qmoi-master-automation.py &
  pid=$!
  wait $pid
  echo "[QMOI] Automation stopped. Restarting in 5 seconds..."
  sleep 5
  # Optionally check for device offline and re-run in cloud
  # (Add device check logic here)
done

# Start QMOI live status (auto-restart)
nohup bash -c 'while true; do python scripts/qmoi-live-status.py; sleep 5; done' > logs/live-status.out 2>&1 &

# Start QMOI dashboard (auto-restart)
nohup bash -c 'while true; do python scripts/qmoi-dashboard.py; sleep 5; done' > logs/dashboard.out 2>&1 &

# Print URLs
echo "QMOI Dashboard: http://localhost:5055"
echo "QMOI Live Status: see logs/live-status.out"
echo "QMOI Automation: see logs/automation.out" 