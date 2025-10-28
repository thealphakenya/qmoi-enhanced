#!/usr/bin/env python3
"""QMOI gateway: aggregates adapter, memory, progress and workspace services.

Runs on 127.0.0.1:8770 and exposes Capilot-friendly endpoints that proxy or compose data
from the local services (ports 8765, 8766, 8767).

Dependency-free: uses urllib from stdlib to make local HTTP requests.
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
import urllib.request
import json
from pathlib import Path
import os
import subprocess

ROOT = Path(__file__).resolve().parents[2]
QM_DIR = ROOT / '.qmoi'
MANIFEST = ROOT / 'qmoi-model-manifest.json'
CONFIG = ROOT / '.qmoi' / 'config.json'

def _fetch(path, method='GET', data=None, headers=None, timeout=2):
    url = path
    req = urllib.request.Request(url, data=(json.dumps(data).encode('utf-8') if data else None), method=method)
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read().decode('utf-8')
    except Exception as e:
        return None

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
            # check underlying services
            a = _fetch('http://127.0.0.1:8765/health')
            m = _fetch('http://127.0.0.1:8766/health')
            pr = _fetch('http://127.0.0.1:8767/progress')
            self._send_json({'adapter': bool(a), 'memory': bool(m), 'progress': bool(pr)})
            return

        if p.path == '/v1/models':
            # combine manifest and config
            manifest = {}
            try:
                manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
            except Exception:
                manifest = {}
            cfg = {}
            try:
                cfg = json.loads(CONFIG.read_text(encoding='utf-8'))
            except Exception:
                cfg = {}
            models = []
            # prefer manifest local id
            if manifest.get('id'):
                models.append(manifest.get('id'))
            # respect allow_remote_models / local_only flags in config
            allow_remote = cfg.get('allow_remote_models', True)
            local_only = cfg.get('local_only', False)
            if allow_remote and not local_only:
                if cfg.get('gpt_versions', {}).get('default'):
                    models.append(cfg['gpt_versions']['default'])
            # fallback to qmoi-local if nothing present
            if not models:
                models = ['qmoi-local']
            # dedupe while preserving order
            seen = set()
            dedup = []
            for m in models:
                if m not in seen:
                    dedup.append(m)
                    seen.add(m)
            models = dedup
            self._send_json({'models': models, 'manifest': manifest, 'config': cfg})
            return

        if p.path == '/v1/memory':
            res = _fetch('http://127.0.0.1:8766/memory')
            if res is None:
                self._send_json({'error': 'memory service unreachable'}, code=503)
                return
            try:
                self._send_json(json.loads(res))
            except Exception:
                self._send_json({'error': 'invalid memory response', 'raw': res})
            return

        if p.path == '/v1/progress':
            res = _fetch('http://127.0.0.1:8767/progress')
            if res is None:
                self._send_json({'error': 'progress service unreachable'}, code=503)
                return
            try:
                self._send_json(json.loads(res))
            except Exception:
                self._send_json({'error': 'invalid progress response', 'raw': res})
            return

        if p.path == '/v1/snapshot':
            snap = QM_DIR / 'workspace_snapshot.json'
            if not snap.exists():
                # run snapshot script
                sc = ROOT / 'scripts' / 'qmoi_workspace_snapshot.py'
                try:
                    subprocess.run(["python3", str(sc)], check=True, cwd=str(ROOT))
                except Exception:
                    pass
            if snap.exists():
                try:
                    self._send_json(json.loads(snap.read_text(encoding='utf-8')))
                except Exception:
                    self._send_json({'error': 'invalid snapshot'})
                return
            self._send_json({'error': 'snapshot unavailable'}, code=404)
            return

        if p.path == '/v1/settings':
            if CONFIG.exists():
                try:
                    self._send_json(json.loads(CONFIG.read_text(encoding='utf-8')))
                    return
                except Exception:
                    pass
            self._send_json({'error': 'settings missing'}, code=404)
            return

        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        p = urlparse(self.path)
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8') if length else ''
        data = None
        try:
            data = json.loads(body) if body else None
        except Exception:
            data = None

        if p.path == '/v1/sync':
            # trigger memory checkpoint
            res = _fetch('http://127.0.0.1:8766/memory/checkpoint', method='POST', data={})
            if res is None:
                self._send_json({'error': 'memory service unreachable'}, code=503)
                return
            self._send_json({'ok': True, 'checkpoint': res})
            return

        if p.path == '/v1/webhook/register':
            if not data or 'url' not in data:
                self._send_json({'error': 'missing url'}, code=400)
                return
            hooks = QM_DIR / 'webhooks.json'
            try:
                existing = json.loads(hooks.read_text(encoding='utf-8')) if hooks.exists() else []
            except Exception:
                existing = []
            existing.append({'url': data['url']})
            hooks.write_text(json.dumps(existing, indent=2), encoding='utf-8')
            self._send_json({'status': 'ok'})
            return

        if p.path == '/v1/chat':
            # forward to local adapter
            res = _fetch('http://127.0.0.1:8765/v1/chat', method='POST', data=data)
            if res is None:
                self._send_json({'error': 'adapter unreachable'}, code=503)
                return
            try:
                self._send_json(json.loads(res))
            except Exception:
                self._send_json({'raw': res})
            return

        self.send_response(404)
        self.end_headers()

def run(port=8770):
    server = HTTPServer(('127.0.0.1', port), Handler)
    print('QMOI gateway listening on http://127.0.0.1:%d' % port)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()

if __name__ == '__main__':
    run()
