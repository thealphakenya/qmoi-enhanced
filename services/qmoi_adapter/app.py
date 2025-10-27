#!/usr/bin/env python3
"""Lightweight QMOI local adapter for Capilot discovery.

Dependency-free HTTP adapter (uses Python stdlib). Exposes:
- GET /health
- GET /manifest
- POST /v1/chat    -> simple echo / placeholder response
- GET/POST/PUT/DELETE /v1/todos -> manage local todo list stored under qmoi-data/

Config:
- Reads .qmoi/config.json for settings if present.

This adapter is intentionally small to avoid heavy bundles in Codespaces.
"""
import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
QM_DIR = ROOT / 'qmoi-data'
QM_DIR.mkdir(exist_ok=True)
TODOS_FILE = QM_DIR / 'todos.json'
MANIFEST_FILE = ROOT / 'qmoi-model-manifest.json'
CONFIG_FILE = ROOT / '.qmoi' / 'config.json'

DEFAULT_MANIFEST = {
    "id": "qmoi-local",
    "name": "QMOI Local (light)",
    "description": "Lightweight local QMOI adapter for Capilot/Dev UIs. Offline-first, low-bandwidth.",
    "endpoint": "http://localhost:8765",
    "capabilities": ["chat", "todos", "file-write-limited"],
    "recommended_settings": {
        "max_bandwidth_kbps": 200,
        "max_parallel_jobs": 2
    }
}

def load_manifest():
    if MANIFEST_FILE.exists():
        try:
            return json.loads(MANIFEST_FILE.read_text(encoding='utf-8'))
        except Exception:
            pass
    return DEFAULT_MANIFEST

def load_todos():
    if TODOS_FILE.exists():
        try:
            return json.loads(TODOS_FILE.read_text(encoding='utf-8'))
        except Exception:
            return []
    return []

def save_todos(todos):
    TODOS_FILE.write_text(json.dumps(todos, indent=2), encoding='utf-8')

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
            self._send_json({'status': 'ok', 'pid': os.getpid()})
            return
        if p.path == '/manifest':
            self._send_json(load_manifest())
            return
        if p.path == '/v1/todos':
            todos = load_todos()
            self._send_json({'todos': todos})
            return
        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        p = urlparse(self.path)
        length = int(self.headers.get('content-length', 0))
        body = self.rfile.read(length).decode('utf-8') if length else ''
        try:
            payload = json.loads(body) if body else {}
        except Exception:
            payload = {}

        if p.path == '/v1/chat':
            inp = payload.get('input', '')
            # Very small, deterministic response to avoid heavy models
            resp = {
                'model': 'qmoi-local',
                'response': f"QMOI (local) echo: {inp}",
                'note': 'This is the lightweight local adapter. For full model, enable remote QMOI in server config.'
            }
            self._send_json(resp)
            return

        if p.path == '/v1/todos':
            todos = load_todos()
            item = payload.get('item')
            if not item:
                self._send_json({'error': 'missing item'}, code=400)
                return
            # simple id assignment
            nid = max([t.get('id', 0) for t in todos] + [0]) + 1
            item_obj = {'id': nid, 'text': item, 'done': False}
            todos.append(item_obj)
            save_todos(todos)
            self._send_json(item_obj, code=201)
            return

        self.send_response(404)
        self.end_headers()

    def do_PUT(self):
        p = urlparse(self.path)
        length = int(self.headers.get('content-length', 0))
        body = self.rfile.read(length).decode('utf-8') if length else ''
        try:
            payload = json.loads(body) if body else {}
        except Exception:
            payload = {}

        # support /v1/todos/{id}
        if p.path.startswith('/v1/todos/'):
            try:
                tid = int(p.path.split('/')[-1])
            except Exception:
                self._send_json({'error': 'invalid id'}, code=400)
                return
            todos = load_todos()
            for t in todos:
                if t.get('id') == tid:
                    t.update(payload)
                    save_todos(todos)
                    self._send_json(t)
                    return
            self._send_json({'error': 'not found'}, code=404)
            return

        self.send_response(404)
        self.end_headers()

    def do_DELETE(self):
        p = urlparse(self.path)
        if p.path.startswith('/v1/todos/'):
            try:
                tid = int(p.path.split('/')[-1])
            except Exception:
                self._send_json({'error': 'invalid id'}, code=400)
                return
            todos = load_todos()
            new = [t for t in todos if t.get('id') != tid]
            if len(new) == len(todos):
                self._send_json({'error': 'not found'}, code=404)
                return
            save_todos(new)
            self._send_json({'ok': True})
            return

        self.send_response(404)
        self.end_headers()

def run(addr='127.0.0.1', port=8765):
    server = HTTPServer((addr, port), Handler)
    print('QMOI adapter running at http://%s:%d' % (addr, port))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('Stopping QMOI adapter')
        server.server_close()

if __name__ == '__main__':
    run()
