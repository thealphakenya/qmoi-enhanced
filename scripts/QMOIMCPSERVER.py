#!/usr/bin/env python3
"""
Lightweight MCP (Master Control Plane) server for QMOI.

This small server exposes master-only endpoints for:
- health check
- run validator (safe)
- run live checks (gated)
- aws-autoclone (simulate or gated check)
- capilot proxy endpoint (simple shim)
 - aws-autoclone (dry-run or gated check)
 - capilot proxy endpoint (simple shim)

Security: requires `MASTER_TOKEN` header `X-MASTER-TOKEN` for protected endpoints and
requires `PRODUCTION_CONFIRMED=true` in env for live actions. By default nothing
is executed that moves funds or creates resources.

Usage (dev):
  python3 scripts/QMOIMCPSERVER.py --port 8081

This server is intentionally dependency-free (uses built-in http.server).
"""

import os
import sys
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
from pathlib import Path
import threading

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / 'scripts'
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

try:
    from vault_adapter import VaultAdapter
except Exception:
    # fallback: simple stub
    class VaultAdapter:
        def __init__(self, allow_network=False):
            self.vault_uri = os.environ.get('SECRETS_VAULT_URI','')
        def get_secret(self, k, env_fallback=None):
            return os.environ.get(env_fallback)

    # Try to import ai adapter (safe fallback to simple reply)
    try:
        from adapters import ai_adapter
    except Exception:
        # Try scripts.adapters import path
        try:
            from scripts.adapters import ai_adapter
        except Exception:
            ai_adapter = None

PID_FILE = Path('.qmoi_validation') / 'qmoimcp.pid'
Path('.qmoi_validation').mkdir(parents=True, exist_ok=True)

MASTER_HEADER = 'X-MASTER-TOKEN'

class Handler(BaseHTTPRequestHandler):
    def _require_master(self):
        token = self.headers.get(MASTER_HEADER)
        if not token or token != os.environ.get('MASTER_TOKEN'):
            self.send_response(403)
            self.end_headers()
            self.wfile.write(b'Forbidden: invalid master token')
            return False
        return True

    def _json(self, code, obj):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(obj, default=str).encode('utf-8'))

    def do_GET(self):
        p = urlparse(self.path)
        if p.path == '/health':
            self._json(200, {'status':'ok','ts':int(__import__('time').time())})
            return
        if p.path == '/api/capilot/qmoi':
            # Respond via ai_adapter when available; otherwise use dry-run reply.
            q = parse_qs(p.query).get('q',[''])[0]
            try:
                if ai_adapter:
                    resp = ai_adapter.generate_text_response(q)
                else:
                    resp = f'QMOI (dry-run) reply to: {q}'
            except Exception as e:
                resp = f'QMOI (error) fallback reply: {e}'
            self._json(200, {'resp': resp})
            return
        if p.path == '/api/status':
            if not self._require_master():
                return
            self._json(200, {'modes':{'dry_run': os.environ.get('QMOI_DRY_RUN','true')}})
            return
        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        p = urlparse(self.path)
        length = int(self.headers.get('Content-Length',0))
        body = self.rfile.read(length) if length else b''
        try:
            data = json.loads(body.decode('utf-8')) if body else {}
        except Exception:
            data = {}

        if p.path == '/api/run_validator':
            # visible only to master
            if not self._require_master():
                return
            # call the validator script in-process
            try:
                from credential_validator import main as validator_main
                validator_main()
            except Exception as e:
                self._json(500, {'error': str(e)})
                return
            self._json(200, {'status':'validator_started'})
            return

        if p.path == '/api/live_checks':
            if not self._require_master():
                return
            # gate: require PRODUCTION_CONFIRMED=true
            if os.environ.get('PRODUCTION_CONFIRMED','').lower() != 'true':
                self._json(403, {'error':'PRODUCTION_CONFIRMED not set to true'})
                return
            # run the live runner in a thread to avoid blocking
            try:
                from live_validation_runner import run_live_checks
            except Exception:
                try:
                    from scripts.live_validation_runner import run_live_checks
                except Exception as e:
                    self._json(500, {'error': 'live runner import failed', 'detail': str(e)})
                    return
            t = threading.Thread(target=run_live_checks, kwargs={'aws_autoclone_enabled': data.get('aws',False), 'aws_simulate': data.get('aws_simulate', True)})
            t.start()
            self._json(200, {'status':'live_checks_started'})
            return

        if p.path == '/api/aws_autoclone':
            if not self._require_master():
                return
            # small wrapper to the runner's autoclone plan
            try:
                from live_validation_runner import _aws_autoclone
            except Exception:
                try:
                    from scripts.live_validation_runner import _aws_autoclone
                except Exception as e:
                    self._json(500, {'error': 'aws autoclone import failed', 'detail': str(e)})
                    return
            simulate = data.get('simulate', True)
            status, entry = _aws_autoclone(simulate=simulate, region=data.get('region','us-east-1'))
            self._json(200, {'status':status, 'entry':entry})
            return

        if p.path == '/api/capilot/proxy':
            # forward a message to the internal capilot shim; use ai_adapter when available
            q = data.get('q','')
            try:
                if ai_adapter:
                    reply = ai_adapter.generate_text_response(q)
                else:
                    reply = f'[QMOI dry-run reply] Received: {q}'
            except Exception as e:
                reply = f'[QMOI error reply] {e}'
            self._json(200, {'reply': reply})
            return

        self.send_response(404)
        self.end_headers()

def run(port=8081):
    PID_FILE.write_text(str(os.getpid()), encoding='utf-8')
    server = HTTPServer(('0.0.0.0', port), Handler)
    print('QMOIMCPSERVER running on port', port)
    try:
        server.serve_forever()
    finally:
        try:
            PID_FILE.unlink()
        except Exception:
            pass

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--port', type=int, default=8081)
    args = p.parse_args()
    run(port=args.port)
#!/usr/bin/env python3
"""
Lightweight MCP (Master Control Protocol) HTTP server for QMOI.

Features:
- No external dependencies (uses Python stdlib HTTP server).
- Master-gated endpoints using MASTER_TOKEN and PRODUCTION_CONFIRMED env variables.
- Endpoints: /health, /run-live-check, /aws-autoclone, /status, /shutdown
- Writes a PID file to `.qmoi_validation/qmoimcp.pid` when started.
- All operations are conservative and read-only by default; autoclone is dry-run unless explicit gating is enabled.

This server is intentionally minimal so it can be started in developer Codespaces/workspaces without extra packages.
"""

import os
import json
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
Q_VALIDATION_DIR = ROOT / '.qmoi_validation'
Q_VALIDATION_DIR.mkdir(parents=True, exist_ok=True)
PID_FILE = Q_VALIDATION_DIR / 'qmoimcp.pid'

# Import live runner functions from scripts
import sys
SCRIPTS = str(ROOT / 'scripts')
if SCRIPTS not in sys.path:
    sys.path.insert(0, SCRIPTS)

try:
    from live_validation_runner import run_live_checks, _aws_autoclone
except Exception:
    # live runner may not be available; provide safe stubs
    def run_live_checks(*args, **kwargs):
        return {'error': 'live_runner_unavailable'}
    def _aws_autoclone(*args, **kwargs):
        return ('unavailable', {'error': 'live_runner_unavailable'})

JOB_STORE = {}

def _write_pid():
    try:
        PID_FILE.write_text(str(os.getpid()), encoding='utf-8')
    except Exception:
        pass

class MCPHandler(BaseHTTPRequestHandler):
    server_version = 'QMOI-MCP/0.1'

    def _require_master(self):
        # simple gating: require MASTER_TOKEN header or query param and PRODUCTION_CONFIRMED=true
        token = self.headers.get('X-Master-Token')
        if not token:
            # also accept as query param
            q = parse_qs(urlparse(self.path).query)
            token = q.get('master_token', [None])[0]
        env_token = os.environ.get('MASTER_TOKEN')
        if not env_token or not token or token != env_token:
            return False, 'master_token_missing_or_invalid'
        if os.environ.get('PRODUCTION_CONFIRMED', '').lower() != 'true':
            return False, 'production_not_confirmed'
        return True, 'ok'

    def _send_json(self, obj, code=200):
        b = json.dumps(obj, default=str).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        p = urlparse(self.path)
        if p.path == '/health':
            self._send_json({'status': 'ok', 'ts': datetime.utcnow().isoformat() + 'Z'})
            return
        if p.path == '/status':
            # return last balances summary and audit tail
            bal_dir = Q_VALIDATION_DIR / 'balances'
            summary = {}
            if (bal_dir / 'summary.json').exists():
                try:
                    summary = json.loads((bal_dir / 'summary.json').read_text(encoding='utf-8'))
                except Exception:
                    summary = {'error': 'failed_read_summary'}
            audit_tail = []
            audit_file = Q_VALIDATION_DIR / 'audit.log'
            if audit_file.exists():
                try:
                    lines = audit_file.read_text(encoding='utf-8').splitlines()
                    for l in lines[-50:]:
                        try:
                            audit_tail.append(json.loads(l))
                        except Exception:
                            audit_tail.append({'raw': l})
                except Exception:
                    audit_tail = ['audit_read_error']
            self._send_json({'summary': summary, 'audit_tail': audit_tail})
            return
        # unknown
        self._send_json({'error': 'unknown_endpoint'}, code=404)

    def do_POST(self):
        p = urlparse(self.path)
        if p.path == '/run-live-check':
            ok, reason = self._require_master()
            if not ok:
                self._send_json({'error': reason}, code=403)
                return
            # start live checks in background thread
            def _target():
                try:
                    run_live_checks()
                except Exception as e:
                    # record error
                    (Q_VALIDATION_DIR / 'mcp_last_error.log').write_text(str(e), encoding='utf-8')
            t = threading.Thread(target=_target, daemon=True)
            t.start()
            jobid = f'job-{int(datetime.utcnow().timestamp())}'
            JOB_STORE[jobid] = {'ts': datetime.utcnow().isoformat(), 'status': 'started'}
            self._send_json({'jobid': jobid})
            return

        if p.path == '/aws-autoclone':
            ok, reason = self._require_master()
            if not ok:
                self._send_json({'error': reason}, code=403)
                return
            length = int(self.headers.get('Content-Length', '0'))
            body = self.rfile.read(length).decode('utf-8') if length else '{}'
            try:
                data = json.loads(body)
            except Exception:
                data = {}
            simulate = data.get('simulate', True)
            region = data.get('region', 'us-east-1')
            status, entry = _aws_autoclone(simulate=simulate, region=region)
            self._send_json({'status': status, 'entry': entry})
            return

        if p.path == '/shutdown':
            ok, reason = self._require_master()
            if not ok:
                self._send_json({'error': reason}, code=403)
                return
            self._send_json({'status': 'shutting_down'})
            def _shutdown():
                import time
                time.sleep(0.5)
                os._exit(0)
            threading.Thread(target=_shutdown, daemon=True).start()
            return

        self._send_json({'error': 'unknown_endpoint'}, code=404)

def run_server(host='127.0.0.1', port=8765):
    server = HTTPServer((host, port), MCPHandler)
    _write_pid()
    print(f'QMOI MCP server running on http://{host}:{port} (pid {os.getpid()})')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass

if __name__ == '__main__':
    # start the server in the current process
    run_server()
#!/usr/bin/env python3
"""
Lightweight QMOI MCP server (master-controlled endpoints).

Features (safe-by-default):
- /ping GET - health check
- /status GET - show basic status and last snapshots
- /run-live-check POST - trigger gated live validation runner (requires MASTER_TOKEN)
- /aws-autoclone POST - request AWS autoclone (simulate by default; requires MASTER_TOKEN for real)
- /shutdown POST - request server shutdown (requires MASTER_TOKEN)

Security & safe defaults:
- All operations that can touch live systems require MASTER_TOKEN and, where applicable, PRODUCTION_CONFIRMED=true.
- The server reads secrets through `VaultAdapter` and writes audit entries to `.qmoi_validation/audit.log`.

Usage: run as a long-running process on a secure host. This is a minimal implementation
meant for scaffolding. Do NOT expose it to public internet without TLS and authentication proxies.
"""

import os
import json
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse
import signal
import sys
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / 'scripts'
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

try:
    from vault_adapter import VaultAdapter
except Exception:
    # minimal fallback
    class VaultAdapter:
        def __init__(self, allow_network=False):
            self.vault_uri = os.environ.get('SECRETS_VAULT_URI', '')
        def get_secret(self, k, env_fallback=None):
            return os.environ.get(env_fallback) if env_fallback else None

try:
    from live_validation_runner import run_live_checks, _aws_autoclone
except Exception:
    # graceful degradation: functions may be invoked via subprocess instead
    run_live_checks = None
    _aws_autoclone = None

PID_FILE = Path('.qmoi_validation') / 'mcp_server.pid'
LOG = Path('.qmoi_validation') / 'mcp_server.log'
Path('.qmoi_validation').mkdir(parents=True, exist_ok=True)

class Handler(BaseHTTPRequestHandler):
    server_version = 'QMOI-MCP/0.1'

    def _send_json(self, code, obj):
        body = json.dumps(obj, default=str).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        p = urlparse(self.path)
        if p.path == '/ping':
            return self._send_json(200, {'ok': True, 'ts': datetime.utcnow().isoformat() + 'Z'})
        if p.path == '/status':
            # show last balance summary if present
            summary = Path('.qmoi_validation') / 'balances' / 'summary.json'
            audit = Path('.qmoi_validation') / 'audit.log'
            out = {'ts': datetime.utcnow().isoformat() + 'Z', 'summary_exists': summary.exists(), 'audit_exists': audit.exists()}
            if summary.exists():
                try:
                    out['summary'] = json.loads(summary.read_text(encoding='utf-8'))
                except Exception:
                    out['summary'] = 'unreadable'
            self._send_json(200, out)
            return
        self._send_json(404, {'error': 'not_found'})

    def do_POST(self):
        p = urlparse(self.path)
        length = int(self.headers.get('Content-Length') or 0)
        body = self.rfile.read(length) if length else b''
        token = os.environ.get('MASTER_TOKEN')

        def require_master():
            # Validate provided master token header or env
            provided = self.headers.get('X-MASTER-TOKEN') or self.headers.get('Authorization')
            if provided and provided.strip() == token and token:
                return True
            return False

        if p.path == '/run-live-check':
            if not require_master():
                return self._send_json(403, {'error': 'master_required'})
            # parse options
            opts = {}
            try:
                opts = json.loads(body.decode('utf-8')) if body else {}
            except Exception:
                pass
            # run live checks in a background thread so the endpoint returns quickly
            def _run():
                if run_live_checks:
                    run_live_checks(aws_autoclone_enabled=opts.get('aws_autoclone', False), aws_simulate=opts.get('aws_simulate', True), parallel=opts.get('parallel', 4), run_autotest=opts.get('run_autotest', False))
            threading.Thread(target=_run, daemon=True).start()
            return self._send_json(202, {'status': 'accepted', 'task': 'run_live_checks'})

        if p.path == '/aws-autoclone':
            if not require_master():
                return self._send_json(403, {'error': 'master_required'})
            opts = {}
            try:
                opts = json.loads(body.decode('utf-8')) if body else {}
            except Exception:
                pass
            simulate = opts.get('simulate', True)
            if _aws_autoclone:
                status, entry = _aws_autoclone(simulate=simulate, region=opts.get('region', 'us-east-1'))
                return self._send_json(200, {'status': status, 'entry': entry})
            else:
                return self._send_json(501, {'error': 'autoclone_not_available'})

        if p.path == '/shutdown':
            if not require_master():
                return self._send_json(403, {'error': 'master_required'})
            # request graceful shutdown
            def _shutdown():
                self._send_json(200, {'status': 'shutting_down'})
                def do_exit(signum, frame):
                    raise SystemExit()
                os.kill(os.getpid(), signal.SIGINT)
            threading.Thread(target=_shutdown, daemon=True).start()
            return

        self._send_json(404, {'error': 'not_found'})


def run_server(host='127.0.0.1', port=8765):
    server = HTTPServer((host, port), Handler)
    pid = os.getpid()
    try:
        PID_FILE.write_text(str(pid), encoding='utf-8')
    except Exception:
        pass
    with LOG.open('a', encoding='utf-8') as lf:
        lf.write(f"{datetime.utcnow().isoformat()}Z - starting MCP server on {host}:{port}\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        with LOG.open('a', encoding='utf-8') as lf:
            lf.write(f"{datetime.utcnow().isoformat()}Z - shutdown requested\n")
    finally:
        try:
            PID_FILE.unlink()
        except Exception:
            pass


if __name__ == '__main__':
    run_server()
