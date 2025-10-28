#!/usr/bin/env python3
"""Lightweight progress tracker for QMOI tasks.

Endpoints:
- GET  /progress           -> list progress entries
- POST /progress          -> add/update progress entry {id, status, percent, meta}
- GET  /progress/{id}     -> get progress for id

Storage: .qmoi/progress.json
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
import json
import threading
from urllib.parse import urlparse
import re

ROOT = Path(__file__).resolve().parent.parent
QM_DIR = ROOT / '.qmoi'
QM_DIR.mkdir(exist_ok=True)
PROGRESS_FILE = QM_DIR / 'progress.json'
LOCK = threading.Lock()

def read_progress():
    if not PROGRESS_FILE.exists():
        return {}
    try:
        return json.loads(PROGRESS_FILE.read_text(encoding='utf-8'))
    except Exception:
        return {}

def write_progress(data: dict):
    with LOCK:
        PROGRESS_FILE.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')

class Handler(BaseHTTPRequestHandler):
    id_re = re.compile(r'^/progress/([^/]+)$')

    def _send(self, obj, code=200):
        b = json.dumps(obj).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        p = urlparse(self.path)
        if p.path == '/progress':
            self._send(read_progress())
            return
        m = self.id_re.match(p.path)
        if m:
            pid = m.group(1)
            prog = read_progress()
            self._send(prog.get(pid, {}))
            return
        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        length = int(self.headers.get('Content-Length', '0'))
        body = self.rfile.read(length) if length else b''
        try:
            payload = json.loads(body.decode('utf-8')) if body else {}
        except Exception:
            payload = {}

        if not isinstance(payload, dict):
            self._send({'error': 'invalid payload'}, code=400)
            return

        prog = read_progress()
        pid = payload.get('id')
        if not pid:
            self._send({'error': 'missing id'}, code=400)
            return
        prog[pid] = payload
        write_progress(prog)
        self._send({'status': 'ok', 'id': pid})

def run(port=8767):
    server = HTTPServer(('127.0.0.1', port), Handler)
    print('QMOI progress tracker listening on http://127.0.0.1:%d' % port)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()

if __name__ == '__main__':
    run()
