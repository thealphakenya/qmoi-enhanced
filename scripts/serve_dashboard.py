#!/usr/bin/env python3
"""
Serve a simple dashboard that displays status and logs for the QMOI betting system.
"""
import json
import os
import http.server
import socketserver
from urllib.parse import urlparse

PORT = int(os.environ.get('QMOI_DASHBOARD_PORT', 8001))
LOGS_DIR = os.path.join(os.getcwd(), 'logs')
STATUS_FILE = os.path.join(LOGS_DIR, 'betting_system_status.json')
LOG_FILE = os.path.join(LOGS_DIR, 'qmoi_betting_system.log')

HTML_TEMPLATE = '''<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>QMOI Betting Dashboard</title>
    <style>
      body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; margin: 2rem; }
      pre { background: #f6f8fa; padding: 1rem; border-radius: 6px; overflow:auto; }
      .col { display:flex; gap:1rem; }
      .card { flex:1; min-width:320px; }
    </style>
  </head>
  <body>
    <h1>QMOI Betting Dashboard</h1>
    <div class="col">
      <div class="card">
        <h2>Status</h2>
        <pre id="status">Loading...</pre>
      </div>
      <div class="card">
        <h2>Recent Logs</h2>
        <pre id="logs">Loading...</pre>
      </div>
    </div>
    <script>
      async function refresh() {
        try {
          const s = await fetch('/status');
          const status = await s.json();
          document.getElementById('status').textContent = JSON.stringify(status, null, 2);
        } catch(e) {
          document.getElementById('status').textContent = 'Failed to fetch status: '+e;
        }
        try {
          const r = await fetch('/logs');
          const text = await r.text();
          document.getElementById('logs').textContent = text;
        } catch(e) {
          document.getElementById('logs').textContent = 'Failed to fetch logs: '+e;
        }
      }
      setInterval(refresh, 2000);
      refresh();
    </script>
  </body>
</html>
'''

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/' or parsed.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(HTML_TEMPLATE.encode('utf-8'))
            return
        if parsed.path == '/status':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            if os.path.exists(STATUS_FILE):
                with open(STATUS_FILE, 'r') as f:
                    self.wfile.write(f.read().encode('utf-8'))
            else:
                self.wfile.write(b'{}')
            return
        if parsed.path == '/logs':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain; charset=utf-8')
            self.end_headers()
            if os.path.exists(LOG_FILE):
                with open(LOG_FILE, 'r') as f:
                    # return last 2000 chars so UI doesn't get too big
                    f.seek(0, os.SEEK_END)
                    size = f.tell()
                    start = max(0, size - 20000)
                    f.seek(start)
                    self.wfile.write(f.read().encode('utf-8'))
            else:
                self.wfile.write(b'')
            return
        # Fallback to static serving of files (e.g., logs)
        super().do_GET()

if __name__ == '__main__':
    if not os.path.exists(LOGS_DIR):
        os.makedirs(LOGS_DIR, exist_ok=True)
    with socketserver.TCPServer(('0.0.0.0', PORT), Handler) as httpd:
        print(f"Serving QMOI Dashboard on http://localhost:{PORT}/")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('Shutting down dashboard server...')
            httpd.shutdown()
