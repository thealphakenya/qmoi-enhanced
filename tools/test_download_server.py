#!/usr/bin/env python3
"""Simple local HTTP server to serve test artifacts for download tests.

Usage:
  python tools/test_download_server.py --dir tools/test_server_files --port 8000

This is intentionally minimal and only for local dry-run testing.
"""

import argparse
import http.server
import socketserver
import os


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--dir', default='tools/test_server_files')
    p.add_argument('--port', type=int, default=8000)
    args = p.parse_args()

    root = os.path.abspath(args.dir)
    if not os.path.exists(root):
        os.makedirs(root, exist_ok=True)

    os.chdir(root)
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(('127.0.0.1', args.port), handler) as httpd:
        print(f"Serving {root} at http://127.0.0.1:{args.port}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('Stopping server')


if __name__ == '__main__':
    main()
