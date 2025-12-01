#!/usr/bin/env python3
"""
Serve static frontend files (dashboard/public) on port 3000.
"""
import http.server
import socketserver
import os

PORT = int(os.environ.get('QMOI_FRONTEND_PORT', 3000))
FRONTEND_DIR = os.path.join(os.getcwd(), 'dashboard', 'public')

if __name__ == '__main__':
    if not os.path.exists(FRONTEND_DIR):
        print('Dashboard public directory not found:', FRONTEND_DIR)
        raise SystemExit(1)
    os.chdir(FRONTEND_DIR)
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(('0.0.0.0', PORT), handler) as httpd:
        print(f"Serving frontend on http://localhost:{PORT}/")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('Shutting down frontend server...')
            httpd.shutdown()
