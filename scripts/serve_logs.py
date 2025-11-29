#!/usr/bin/env python3
"""
Serve the logs directory on port 8000 so you can open logs in the browser.
"""
import http.server
import socketserver
import os

PORT = int(os.environ.get('QMOI_LOG_PORT', 8000))

if __name__ == '__main__':
    logs_dir = os.path.join(os.getcwd(), 'logs')
    if not os.path.exists(logs_dir):
        print('No logs directory found, creating...')
        os.makedirs(logs_dir, exist_ok=True)
    os.chdir(logs_dir)

    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(('0.0.0.0', PORT), handler) as httpd:
        print(f"Serving logs at http://localhost:{PORT}/")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('Shutting down log server...')
            httpd.shutdown()
