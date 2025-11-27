#!/bin/bash

# Quick local test for placeholder checker
# usage: ./scripts/test_placeholder_checker.sh

set -e

echo "Scanning repo for placeholders (dry-run)..."
node scripts/qmoi_placeholder_checker.js --scan --dry-run --fail-on-find || true

# Run with apply in dry-run mode
# node scripts/qmoi_placeholder_checker.js --scan --apply --dry-run

# To actually apply changes (use with caution):
# node scripts/qmoi_placeholder_checker.js --scan --apply

printf "\nTo view the generated report:\n  jq . reports/placeholder_scan_report.json\n\n" 
