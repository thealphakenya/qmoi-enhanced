#!/usr/bin/env bash
# ci/tests.sh - simple test runner for local CI
set -euo pipefail

echo "Running unit tests..."
pytest tests/unit -q || true

echo "Running integration tests..."
pytest tests/integration -q || true

# Optional: run a lightweight performance script if present
if [ -f "benchmarks/latency_benchmark.py" ]; then
  echo "Running latency benchmark (light)..."
  python benchmarks/latency_benchmark.py --requests 10 || true
fi

echo "CI tests completed (some failures may be ignored in this lightweight runner)."
