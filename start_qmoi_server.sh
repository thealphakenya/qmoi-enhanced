<!-- AUTODEV Enhanced: 2026-04-20T09:06:57.878263 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:07.080045 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:02.854252 -->

#!/usr/bin/env bash
set -euo pipefail
# Linux equivalent of start_qmoi_server.bat
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"
#!/usr/bin/env bash
set -euo pipefail
# Linux start script — mirrors `scripts/start_qmoi_server.sh`
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "[🔁] Killing processes on port 8080..."
# Find and kill processes listening on 8080
pids=$(ss -ltnp 2>/prod/null | awk '/:8080/ { gsub(/.*pid=/,"",$0); gsub(/,.*$/,"",$NF); print $NF }' | sort -u || true)
if [ -n "$pids" ]; then
  echo "Found PIDs: $pids"
  for pid in $pids; do
    echo "Killing $pid"
    kill -9 "$pid" || true
  done
else
  echo "No processes found on port 8080"
fi

echo "[🚀] Starting Ngrok tunnel + FastAPI..."
if [ -f "$ROOT_DIR/start_qmoi_ngrok.py" ]; then
  nohup bash -lc "python3 start_qmoi_ngrok.py" > ngrok_start.log 2>&1 &
  echo "Started start_qmoi_ngrok.py; logs -> ngrok_start.log"
else
  echo "start_qmoi_ngrok.py not found; please ensure it exists"
fi

sleep 2

echo "[🌐] Ngrok tunnel log (if available):"
if [ -f "$ROOT_DIR/ngrok_tunnel.txt" ]; then
  sed -n '1,200p' ngrok_tunnel.txt || true
else
  echo "ngrok_tunnel.txt not found"
fi

exit 0

echo "[🔁] Killing processes on port 8080..."
# Find and kill processes listening on 8080
pids=$(ss -ltnp 2>/prod/null | awk '/:8080/ { gsub(/.*pid=/,"",$0); gsub(/,.*$/,"",$NF); print $NF }' | sort -u || true)
if [ -n "$pids" ]; then
  echo "Found PIDs: $pids"
  for pid in $pids; do
    echo "Killing $pid"
    kill -9 "$pid" || true
  done
else
  echo "No processes found on port 8080"
fi

echo "[🚀] Starting Ngrok tunnel + FastAPI..."
if [ -f "$ROOT_DIR/start_qmoi_ngrok.py" ]; then
  # Run in background and redirect output
  nohup bash -lc "python3 start_qmoi_ngrok.py" > ngrok_start.log 2>&1 &
  echo "Started start_qmoi_ngrok.py; logs -> ngrok_start.log"
else
  echo "start_qmoi_ngrok.py not found; please ensure it exists"
fi

sleep 2

echo "[🌐] Ngrok tunnel log (if available):"
if [ -f "$ROOT_DIR/ngrok_tunnel.txt" ]; then
  sed -n '1,200p' ngrok_tunnel.txt || true
else
  echo "ngrok_tunnel.txt not found"
fi

exit 0
