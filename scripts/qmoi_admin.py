#!/usr/bin/env python3
"""Simple read-only admin HTTP server to expose .qmoi logs and status for master.

Security: this server binds to localhost only and serves read-only files from .qmoi.
Use a reverse-proxy or SSH port-forward for remote access. It does not execute commands.
"""
import http.server
import socketserver
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PORT = int(os.environ.get('QMOI_ADMIN_PORT', '8780'))
SERVE_DIR = ROOT / '.qmoi'

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SERVE_DIR), **kwargs)

    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    SERVE_DIR.mkdir(parents=True, exist_ok=True)
    with socketserver.TCPServer(('127.0.0.1', PORT), QuietHandler) as httpd:
        print(f'QMOI admin server serving {SERVE_DIR} on http://127.0.0.1:{PORT}/')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('admin server stopped')
