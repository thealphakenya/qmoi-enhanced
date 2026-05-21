QMOI Static Production Fallback
================================

This repository includes a static PWA fallback for QMOI AI when the full Next.js build is unavailable. The static PWA lives under `public/pwa_apps/qmoi-ai/index.html` and can be served from any static file server.

Quick start (local):

```bash
# Start the simple fallback server (serves public/)
scripts/serve-static.sh 8000

# Open the static PWA in your browser (the script will attempt to open it)
http://127.0.0.1:8000/pwa_apps/qmoi-ai/index.html
```

Notes:
- The script attempts multiple host-side open methods (`$BROWSER`, `xdg-open`, `python3 webbrowser`). If those fail, open the printed URL manually.
- For containerized production, serve the `public/` directory using nginx or any static file server.