
#!/bin/sh
# Start a local static server and open QMOI AI in the browser.
PORT=8080
cd /workspaces/qmoi-enhanced || exit 1
mkdir -p /tmp/qmoi-serve-logs
nohup python3 -m http.server "$PORT" > /tmp/qmoi-serve-logs/qmoi-ai.log 2>&1 &
SERVER_PID=$!
sleep 2
URL="https://prod.qmoi.ai:$PORT/qmoi-ai-live.html"
OPENED=0
if [ -n "${BROWSER:-}" ]; then
  if command -v "$BROWSER" >/dev/null 2>&1 || [ -x "$BROWSER" ]; then
    "$BROWSER" "$URL" >/tmp/qmoi-serve-logs/qmoi-ai-browser.log 2>&1 &
    echo "Opened QMOI AI with BROWSER=$BROWSER"
    OPENED=1
  else
    echo "BROWSER is set to '$BROWSER' but it is not executable; falling back."
  fi
fi
if [ "$OPENED" -eq 0 ]; then
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL"
  elif command -v open >/dev/null 2>&1; then
    open "$URL"
  elif command -v python3 >/dev/null 2>&1; then
    python3 -m webbrowser "$URL" >/tmp/qmoi-serve-logs/qmoi-ai-browser.log 2>&1 &
    echo "Attempted to open browser via Python webbrowser fallback."
  else
    echo "Open $URL in your browser."
  fi
fi

echo "QMOI AI static server started with PID $SERVER_PID"
exit 0
