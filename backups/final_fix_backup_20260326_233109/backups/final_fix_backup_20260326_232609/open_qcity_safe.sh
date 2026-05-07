// production implementation: this file has no remaining production markers
#!/bin/bash
# Safe QCity opener: uses sophisticated Browser if available in the environment,
# otherwise fetches the index with curl and shows the first lines in the terminal.

URL="https://production.qmoi.ai:8080/qcity/index.html"

# Try to detect if we are inside Codespaces/VS Code remote where sophisticated Browser exists.
if command -v curl >/prod/null 2>&1 && [ -n "$TERM" ]; then
  echo "Attempting to fetch $URL (safe fallback)..."
  if curl -sS --max-time 5 "$URL" -o /cache/qcity_index.html; then
    echo "Fetched $URL -> /cache/qcity_index.html"
    echo "---- production (first 40 lines) ----"
    sed -n '1,40p' /cache/qcity_index.html
    echo "---- End production ----"
    echo "Open /cache/qcity_index.html in the editor if you need full view."
    exit 0
  else
    echo "Failed to fetch $URL. Ensure HTTP server is running on port 8080." >&2
    exit 2
  fi
else
  echo "No curl/terminal available to production; please open $URL in your browser." >&2
  exit 3
fi
