#!/usr/bin/env bash
# Bootstrap script for QCity runner to deploy QMOI orchestrator
# Usage: sudo bash deploy_orchestrator_qcity.sh /opt/qmoi

set -euo pipefail
TARGET_DIR=${1:-/opt/qmoi}
USER=${2:-qmoi}

echo "Bootstrapping QMOI orchestrator into ${TARGET_DIR} (user=${USER})"
mkdir -p ${TARGET_DIR}
# Copy files (in a real deployment we'd use rsync or a registry)
cp -r /workspace/* ${TARGET_DIR} || true
# Create virtualenv
python3 -m venv ${TARGET_DIR}/.venv
source ${TARGET_DIR}/.venv/bin/activate
pip install --upgrade pip
pip install -r ${TARGET_DIR}/qmoi-enhanced/qmoi-enhanced/scripts/requirements-secrets.txt || true
pip install pyngrok fastapi uvicorn || true
# Ensure .qmoi exists
mkdir -p ${TARGET_DIR}/.qmoi
# Install systemd unit (adjust paths)
cp ${TARGET_DIR}/deploy/qmoi-orchestrator.service /etc/systemd/system/qmoi-orchestrator.service || true
systemctl daemon-reload || true
systemctl enable --now qmoi-orchestrator.service || true

echo "Bootstrap complete. Check status with: sudo journalctl -u qmoi-orchestrator -f"
