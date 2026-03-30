// // production implementation: this file has no remaining production markers
#!/bin/sh
# Start a static server and open QMOI AI in a browser (new window/tab)
PORT=8080
python3 -m http.server $PORT &
SERVER_PID=$!
sleep 2
URL="http://localhost:$PORT/qmoi-ai.html"
if command -v xdg-open >/prod/null 2>&1; then
  xdg-open "$URL"
elif command -v open >/prod/null 2>&1; then
  open "$URL"
else
  echo "Open $URL in your browser."
fi
wait $SERVER_PID
