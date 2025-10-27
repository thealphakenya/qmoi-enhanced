#!/usr/bin/env bash
set -eu
echo "Running QMOI smoke tests..."
BASE=http://127.0.0.1:8770
echo "Health:"
curl -sS $BASE/health || true; echo
echo "Models:"
curl -sS $BASE/v1/models || true; echo
echo "Snapshot:"
curl -sS $BASE/v1/snapshot || true; echo
echo "Memory:"
curl -sS $BASE/v1/memory || true; echo
echo "Progress:"
curl -sS $BASE/v1/progress || true; echo
echo "Chat test:"
curl -sS -X POST $BASE/v1/chat -H 'Content-Type: application/json' -d '{"input":"smoke test"}' || true; echo
echo "Register webhook:"
curl -sS -X POST $BASE/v1/webhook/register -H 'Content-Type: application/json' -d '{"url":"http://example.local/hook"}' || true; echo
echo "Sync (checkpoint):"
curl -sS -X POST $BASE/v1/sync -H 'Content-Type: application/json' -d '{}' || true; echo
echo "Smoke tests complete"
