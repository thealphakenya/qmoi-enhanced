#!/usr/bin/env bash
# Top-level deploy wrapper that calls the QCity bootstrap and generates runner docs summary
set -euo pipefail
TARGET_DIR=${1:-/opt/qmoi}

echo "Calling QCity bootstrap..."
sudo bash deploy/qcity/deploy_orchestrator_qcity.sh "$TARGET_DIR"

echo "Generating runner docs summary"
# run the finder script
python3 -m pip install --upgrade pip >/dev/null 2>&1 || true
python3 -c "import sys; sys.path.insert(0, 'qmoi-enhanced/qmoi-enhanced'); from scripts.find_qcity_runner_docs import main; main()"

echo "Deploy wrapper complete"
