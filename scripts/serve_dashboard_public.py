#!/usr/bin/env python3
"""
Serve the static 'dashboard/public' directory on port 3000 so the frontend can be viewed without Node.
"""
import os
import http.server
import socketserver

PORT = int(os.environ.get('QMOI_DASHBOARD_PUBLIC_PORT', 3000))
PUBLIC_DIR = os.path.join(os.getcwd(), 'dashboard', 'public')

if __name__ == '__main__':
    if not os.path.exists(PUBLIC_DIR):
        print(f"Public static directory not found: {PUBLIC_DIR}")
        raise SystemExit(1)
    os.chdir(PUBLIC_DIR)
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(('0.0.0.0', PORT), handler) as httpd:
        print(f"Serving static dashboard at http://localhost:{PORT}/")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('Shutting down static dashboard...')
            httpd.shutdown()
