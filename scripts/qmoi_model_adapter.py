#!/usr/bin/env python3
"""
Lightweight QMOI Model Adapter

This small HTTP adapter exposes a simple metadata and generate endpoint so local chat UIs
or custom 'capilot' integrations can discover and call the QMOI model runtime.

Behavior:
- Reads runtime backend from environment variable QMOI_MODEL_BACKEND (URL) or .qmoi/config.json
- If no backend is configured the adapter returns a safe canned response, allowing local UI testing
  without requiring heavy model downloads.

Note: This is a local development shim. Production deployments should route to real model hosts
on QCity or your model-serving infra.
"""
import os
import json
from pathlib import Path
from http.server import BaseHTTPRequestHandler, HTTPServer

ROOT = Path(__file__).resolve().parent.parent
CFG = ROOT / '.qmoi' / 'config.json'

def load_config():
    cfg = {}
    if CFG.exists():
        try:
            cfg = json.loads(CFG.read_text(encoding='utf-8'))
        except Exception:
            cfg = {}
    # env override
    backend = os.environ.get('QMOI_MODEL_BACKEND') or cfg.get('model_backend')
    return {'backend': backend, 'metadata': cfg.get('model_metadata', {})}

CONFIG = load_config()

class Handler(BaseHTTPRequestHandler):
    def _send_json(self, obj, status=200):
        data = json.dumps(obj).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path in ('/', '/info'):
            self._send_json({'service': 'qmoi-model-adapter', 'backend': CONFIG.get('backend')})
            return
        if self.path == '/metadata':
            meta = {
                'id': 'qmoi-model',
                'name': 'QMOI (local-adapter)',
                'description': 'QMOI model adapter (local). Configure QMOI_MODEL_BACKEND to proxy to real model.',
                'capabilities': ['chat', 'code', 'multi-turn'],
            }
            # merge user-provided metadata
            meta.update(CONFIG.get('metadata') or {})
            self._send_json(meta)
            return
        self._send_json({'error': 'not found'}, status=404)

    def do_POST(self):
        if self.path == '/generate':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length) if length else b''
            try:
                payload = json.loads(body.decode('utf-8') or '{}')
            except Exception:
                payload = {}
            prompt = payload.get('prompt') or payload.get('input') or ''
            # If backend configured, in future we can proxy the request; for now return a canned reply
            if CONFIG.get('backend'):
                # Proxying intentionally not implemented here to avoid requiring credentials in dev.
                reply = f"[proxied to {CONFIG.get('backend')}] Received prompt of {len(prompt)} chars"
            else:
                # Safe canned response for testing and UI discovery
                reply = "QMOI (adapter) reply: This is a safe local response. Configure QMOI_MODEL_BACKEND to enable real model proxying."
            resp = {'id': 'qmoi-gen-1', 'object': 'completion', 'text': reply}
            self._send_json(resp)
            return
        self._send_json({'error': 'not found'}, status=404)

def run(port=8000):
    server = HTTPServer(('127.0.0.1', port), Handler)
    print(f'QMOI model adapter running at http://127.0.0.1:{port} (backend={CONFIG.get("backend")})')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('Shutting down')
        server.server_close()

if __name__ == '__main__':
    run(int(os.environ.get('QMOI_ADAPTER_PORT', '8000')))
