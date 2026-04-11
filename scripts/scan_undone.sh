#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
python3 "$SCRIPT_DIR/../comprehensive_production_scanner.py"
echo "✔ undone.txt refreshed by enhanced production scanner"
