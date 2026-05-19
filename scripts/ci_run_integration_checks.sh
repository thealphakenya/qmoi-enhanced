#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="reports"
mkdir -p "$OUT_DIR"
OUT="$OUT_DIR/integration_test_results_ci.txt"

echo "Integration tests run at $(date -u)" > "$OUT"

HOSTS=("http://localhost:3000")
MODEL_PATH="/api/qmoi-model"
CHAT_PATH="/api/qmoi/chat"

for h in "${HOSTS[@]}"; do
  echo "Testing $h$MODEL_PATH" | tee -a "$OUT"
  if curl -sS --fail "$h$MODEL_PATH" -o /dev/null; then
    echo "OK: $h$MODEL_PATH" | tee -a "$OUT"
  else
    echo "FAIL: $h$MODEL_PATH" | tee -a "$OUT"
  fi

  echo "Testing POST $h$CHAT_PATH" | tee -a "$OUT"
  if curl -sS -X POST -H "Content-Type: application/json" -d '{"input":"ping","model":"qmoi-prod"}' "$h$CHAT_PATH" -o /dev/null; then
    echo "OK: POST $h$CHAT_PATH" | tee -a "$OUT"
  else
    echo "FAIL: POST $h$CHAT_PATH" | tee -a "$OUT"
  fi
done

echo "Wrote $OUT"
