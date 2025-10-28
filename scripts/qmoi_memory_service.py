#!/usr/bin/env python3
"""Lightweight local memory-sync service for QMOI.

Endpoints (HTTP, stdlib only):
- GET  /health                -> {status: ok}
- GET  /memory                -> returns current memory JSON
- POST /memory                -> merge JSON payload into memory (shallow merge)
- POST /memory/checkpoint     -> create a timestamped checkpoint of memory
- GET  /memory/export         -> download memory JSON

Storage: .qmoi/memory.json (created if missing)

This is intentionally minimal and dependency-free so it can run inside Codespaces without extra bundles.
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
import json
import os
import threading
from urllib.parse import urlparse
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent
QM_DIR = ROOT / '.qmoi'
QM_DIR.mkdir(exist_ok=True)
MEMORY_FILE = QM_DIR / 'memory.json'
LOCK = threading.Lock()

def read_memory():
    if not MEMORY_FILE.exists():
        return {}
    try:
        return json.loads(MEMORY_FILE.read_text(encoding='utf-8'))
    except Exception:
        return {}

def write_memory(data: dict):
    with LOCK:
        MEMORY_FILE.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')

class Handler(BaseHTTPRequestHandler):
    def _send_json(self, obj, code=200):
        data = json.dumps(obj).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        p = urlparse(self.path)
        if p.path == '/health':
            self._send_json({'status': 'ok'})
            return
        if p.path == '/memory':
            mem = read_memory()
            self._send_json({'memory': mem})
            return
        if p.path == '/memory/export':
            mem = read_memory()
            self._send_json(mem)
            return
        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        p = urlparse(self.path)
        length = int(self.headers.get('Content-Length', '0'))
        body = self.rfile.read(length) if length else b''
        try:
            payload = json.loads(body.decode('utf-8')) if body else {}
        except Exception:
            payload = {}

        if p.path == '/memory':
            # merge shallow
            mem = read_memory()
            if not isinstance(mem, dict):
                mem = {}
            if isinstance(payload, dict):
                mem.update(payload)
            write_memory(mem)
            self._send_json({'status': 'ok', 'memory': mem})
            return

        if p.path == '/memory/checkpoint':
            mem = read_memory()
            ts = datetime.utcnow().strftime('%Y%m%d%H%M%S')
            cp = QM_DIR / f'memory.checkpoint.{ts}.json'
            cp.write_text(json.dumps(mem, indent=2, ensure_ascii=False), encoding='utf-8')
            self._send_json({'status': 'ok', 'checkpoint': str(cp.name)})
            return

        self.send_response(404)
        self.end_headers()

def run(port=8766):
    server = HTTPServer(('127.0.0.1', port), Handler)
    print('QMOI memory service listening on http://127.0.0.1:%d' % port)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()

if __name__ == '__main__':
    run()
