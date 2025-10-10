#!/bin/bash
# Script: find_qmoi_api_endpoints.sh
# Purpose: Locate all API endpoints in the QMOI codebase and output a summary for documentation cross-checking.

# Find all HTTP method routes in TypeScript, JavaScript, and Python files
find ./qmoi-enhanced -type f \( -name '*.ts' -o -name '*.js' -o -name '*.py' \) | \
  xargs grep -E "(app\\.(get|post|put|delete)|router\\.(get|post|put|delete)|@app\\.(get|post|put|delete))" | \
  grep -v node_modules | \
  tee qmoi-enhanced/all_api_endpoints_found.txt

echo "\nSummary of unique endpoints:"
cat qmoi-enhanced/all_api_endpoints_found.txt | \
  grep -oE "['\"]/[^'\"]+['\"]" | \
  sort | uniq

echo "\nCompare this list with API.md and update as needed."
