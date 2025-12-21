#!/usr/bin/env python3
"""
Lightweight local QM OI chat endpoint (no external deps).

Endpoint: POST /v1/chat/completions
Accepts payload similar to OpenAI Chat API: {"model":"qmoi","messages":[{...}]}

Behavior:
- Uses persistent memory file `qmoi_memory.json` to store conversation history (appends every user message).
- Responds with a persona adapted to the final user role: master, sister, or user (falls back to 'user').
- Saves memory after each request to ensure permanence across restarts.

This is a local helper for development and testing only.
"""

from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os
from urllib.parse import urlparse
from datetime import datetime, timezone
import threading
import time
import sqlite3

# Optional HTTP client for remote sync backends
try:
    import requests
except Exception:
    requests = None

BASE = os.environ.get('QMOI_BASE', '/workspaces/qmoi-enhanced')
DEFAULT_MEMORY_FILE = os.path.join(BASE, 'qmoi_memory.json')
MEMORY_FILE = os.environ.get('QMOI_MEMORY_FILE', DEFAULT_MEMORY_FILE)
DB_FILE = os.environ.get('QMOI_DB_FILE', os.path.join(BASE, 'qmoi_memory.db'))
USE_SQLITE = os.environ.get('QMOI_USE_SQLITE', '') == '1'
# The canonical model name used by the server. For safety we ALWAYS use 'qmoi'.
MODEL_NAME = 'qmoi'

# Optional API key protecting /sync/* endpoints. If not set, sync endpoints are open
# on the local network (still not recommended for production). When set, requests
# must include header: Authorization: Bearer <QMOI_SYNC_API_KEY>
SYNC_API_KEY = os.environ.get('QMOI_SYNC_API_KEY')


def load_memory():
    if USE_SQLITE:
        # Ensure DB exists and table is initialized
        conn = sqlite3.connect(DB_FILE)
        try:
            cur = conn.cursor()
            cur.execute('''CREATE TABLE IF NOT EXISTS conversations (
                timestamp TEXT PRIMARY KEY,
                persona TEXT,
                message TEXT
            )''')
            conn.commit()
            cur.execute('SELECT timestamp, persona, message FROM conversations ORDER BY timestamp')
            rows = cur.fetchall()
            conversations = []
            for ts, persona, message in rows:
                conversations.append({'timestamp': ts, 'persona': persona, 'message': message})
            return {'conversations': conversations}
        finally:
            conn.close()
    else:
        if os.path.exists(MEMORY_FILE):
            try:
                with open(MEMORY_FILE, 'r') as f:
                    return json.load(f)
            except Exception:
                return {'conversations': []}
        return {'conversations': []}


def save_memory(mem):
    if USE_SQLITE:
        conn = sqlite3.connect(DB_FILE)
        try:
            cur = conn.cursor()
            cur.execute('''CREATE TABLE IF NOT EXISTS conversations (
                timestamp TEXT PRIMARY KEY,
                persona TEXT,
                message TEXT
            )''')
            # Upsert rows from mem into DB
            for c in mem.get('conversations', []):
                try:
                    ts = c.get('timestamp')
                    persona = c.get('persona')
                    message = c.get('message')
                    if not ts:
                        continue
                    cur.execute(
                        'INSERT OR REPLACE INTO conversations (timestamp, persona, message) VALUES (?, ?, ?)', (ts, persona, message))
                except Exception:
                    continue
            conn.commit()
        finally:
            conn.close()
    else:
        # Atomic write: write to temp file then rename to avoid partial writes
        try:
            dirn = os.path.dirname(MEMORY_FILE)
            tmp = MEMORY_FILE + '.tmp'
            with open(tmp, 'w') as f:
                json.dump(mem, f, indent=2)
            os.replace(tmp, MEMORY_FILE)
            # Also write a timestamped backup for additional local sync resilience
            try:
                backup_path = os.path.join(dirn, 'qmoi_memory_backup.json')
                with open(backup_path + '.tmp', 'w') as bf:
                    json.dump(mem, bf, indent=2)
                os.replace(backup_path + '.tmp', backup_path)
            except Exception:
                pass
        except Exception:
            # Fallback non-atomic write
            with open(MEMORY_FILE, 'w') as f:
                json.dump(mem, f, indent=2)


def migrate_json_to_sqlite():
    # If sqlite is enabled and DB is empty but JSON exists, migrate
    if not USE_SQLITE:
        return
    if not os.path.exists(MEMORY_FILE):
        return
    conn = sqlite3.connect(DB_FILE)
    try:
        cur = conn.cursor()
        cur.execute('''CREATE TABLE IF NOT EXISTS conversations (
            timestamp TEXT PRIMARY KEY,
            persona TEXT,
            message TEXT
        )''')
        cur.execute('SELECT COUNT(1) FROM conversations')
        count = cur.fetchone()[0]
        if count == 0:
            try:
                with open(MEMORY_FILE, 'r') as f:
                    j = json.load(f)
                for c in j.get('conversations', []):
                    ts = c.get('timestamp')
                    persona = c.get('persona')
                    message = c.get('message')
                    if ts:
                        cur.execute(
                            'INSERT OR REPLACE INTO conversations (timestamp, persona, message) VALUES (?, ?, ?)', (ts, persona, message))
                conn.commit()
            except Exception:
                pass
    finally:
        conn.close()


def detect_persona(messages):
    # Heuristic: examine last user/system messages for keywords
    persona = 'user'
    for m in reversed(messages[-6:]):
        role = m.get('role', '')
        content = (m.get('content') or '').lower()
        if role == 'system' and 'master' in content:
            return 'master'
        if 'sister' in content or (role == 'system' and 'sister' in content):
            return 'sister'
        if 'master:' in content:
            return 'master'
    # If any message labeled assistant with prefix 'Master' assume master
    for m in messages:
        if m.get('role') == 'assistant' and isinstance(m.get('content'), str):
            c = m['content'].lower()
            if c.strip().startswith('master'):
                return 'master'
    return persona


def persona_response(persona, user_msg, memory):
    """Generate a short, natural assistant reply based on a lightweight heuristic.

    This keeps the local helper useful for UI/E2E testing while we replace it with
    a real model later. Replies include a persona tag and a friendly, actionable
    message (and keep a compact memory entry as before).
    """
    user_msg = (user_msg or '').strip()

    # Build persona prefix
    if persona == 'master':
        prefix = '[Master Mode] '
    elif persona == 'sister':
        prefix = '[Sister Mode] '
    else:
        prefix = '[User Mode] '

    # Simple heuristics for conversational replies
    lm = user_msg.lower()
    if not user_msg:
        body = "Hello — I'm here and ready to help. What would you like to do?"
    elif 'how are you' in lm or 'how are you doing' in lm:
        body = "I'm doing well, thanks! How can I help you today?"
    elif lm.startswith(('hi', 'hello', 'hey')) or lm in ('hi', 'hello', 'hey'):
        body = "Hello! How can I assist you today?"
    elif 'create' in lm and 'file' in lm:
        body = "I can create that file for you — tell me the filename and content, or say 'create it' to confirm."
    elif '?' in user_msg:
        body = "That's a great question — could you give me a bit more detail so I can provide a helpful answer?"
    else:
        # Default concise follow-up
        body = "Got it — tell me more or describe what you want me to do and I'll assist."

    # Compose reply: include a brief acknowledgement and the helpful sentence
    if persona == 'master':
        reply = f"{prefix}{body}"
    elif persona == 'sister':
        reply = f"{prefix}{body}"
    else:
        # For user persona keep a short acknowledgement of what we heard + the reply
        heard = f"I heard: {user_msg}" if user_msg else ''
        reply = f"{prefix}{heard}" + ("\n" + body if heard else body)

    # Persist a compact memory entry
    note = {
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'persona': persona,
        'message': user_msg
    }
    memory.setdefault('conversations', []).append(note)
    return reply


def push_memory_to_backends(memory):
    """Push memory to configured backends. Returns (ok:bool, details:list)."""
    details = []
    backends = os.environ.get('QMOI_SYNC_BACKENDS', '').split(',')
    if not backends or backends == ['']:
        return True, ['no_backends_configured']

    ok_all = True
    for b in backends:
        b = b.strip()
        if not b:
            continue
        try:
            if b == 'gist':
                gist_id = os.environ.get('QMOI_GIST_ID')
                gh_token = os.environ.get('QMOI_GH_TOKEN')
                if not (requests and gist_id and gh_token):
                    details.append('gist:skipped:missing_config_or_requests')
                    ok_all = False
                    continue
                url = f'https://api.github.com/gists/{gist_id}'
                payload = {'files': {'qmoi_memory.json': {'content': json.dumps(memory, indent=2)}}}
                r = requests.patch(url, headers={'Authorization': f'token {gh_token}'}, json=payload, timeout=15)
                if r.status_code in (200, 201):
                    details.append('gist:ok')
                else:
                    details.append(f'gist:error:{r.status_code}')
                    ok_all = False
            elif b == 'hf':
                # Push to a Hugging Face repo by creating/updating a file via the repo API (requires token)
                hf_token = os.environ.get('QMOI_HF_TOKEN')
                hf_repo = os.environ.get('QMOI_HF_REPO')
                if not (requests and hf_token and hf_repo):
                    details.append('hf:skipped:missing_config_or_requests')
                    ok_all = False
                    continue
                # Use HF API to upload a file to the repo (simple approach: create commit via api)
                api_url = f'https://huggingface.co/api/repos/{hf_repo}/commit'
                payload = {
                    'files': [
                        {'path': 'qmoi_memory.json', 'content': json.dumps(memory, indent=2)}
                    ],
                    'commit_message': 'sync qmoi_memory.json from local server'
                }
                r = requests.post(api_url, headers={'Authorization': f'Bearer {hf_token}'}, json=payload, timeout=20)
                if r.status_code in (200, 201):
                    details.append('hf:ok')
                else:
                    details.append(f'hf:error:{r.status_code}')
                    ok_all = False
            elif b.startswith('scp:'):
                # Format scp:user@host:/path
                scp_target = b[len('scp:'):]
                try:
                    import subprocess
                    import tempfile
                    with tempfile.NamedTemporaryFile('w', delete=False) as t:
                        t.write(json.dumps(memory, indent=2))
                        tmpname = t.name
                    subprocess.check_call(['scp', tmpname, scp_target])
                    details.append(f'scp:{scp_target}:ok')
                except Exception as e:
                    details.append(f'scp:{scp_target}:error:{e}')
                    ok_all = False
            else:
                details.append(f'unknown_backend:{b}')
                ok_all = False
        except Exception as e:
            details.append(f'backend_exception:{b}:{e}')
            ok_all = False
    return ok_all, details


def pull_memory_from_backends():
    """Attempt to pull memory from configured backends. Returns memory dict or None."""
    backends = os.environ.get('QMOI_SYNC_BACKENDS', '').split(',')
    for b in backends:
        b = b.strip()
        if not b:
            continue
        try:
            if b == 'gist':
                gist_id = os.environ.get('QMOI_GIST_ID')
                gh_token = os.environ.get('QMOI_GH_TOKEN')
                if not (requests and gist_id and gh_token):
                    continue
                url = f'https://api.github.com/gists/{gist_id}'
                r = requests.get(url, headers={'Authorization': f'token {gh_token}'}, timeout=15)
                if r.status_code == 200:
                    g = r.json()
                    files = g.get('files', {})
                    fm = files.get('qmoi_memory.json')
                    if fm and 'content' in fm:
                        try:
                            return json.loads(fm['content'])
                        except Exception:
                            continue
            elif b == 'hf':
                hf_token = os.environ.get('QMOI_HF_TOKEN')
                hf_repo = os.environ.get('QMOI_HF_REPO')
                if not (requests and hf_token and hf_repo):
                    continue
                # Try to fetch raw file from huggingface repo raw path
                raw_url = f'https://huggingface.co/{hf_repo}/raw/main/qmoi_memory.json'
                r = requests.get(raw_url, timeout=15)
                if r.status_code == 200:
                    try:
                        return r.json()
                    except Exception:
                        try:
                            return json.loads(r.text)
                        except Exception:
                            continue
            elif b.startswith('scp:'):
                # Not implemented pull for scp
                continue
        except Exception:
            continue
    return None


def _check_sync_auth(headers):
    """Return (allowed:bool, reason:str). If SYNC_API_KEY is not configured,
    allow by default."""
    if not SYNC_API_KEY:
        return True, 'no_key_configured'
    auth = headers.get('Authorization') or headers.get('authorization')
    if not auth:
        return False, 'missing_authorization_header'
    parts = auth.split()
    if len(parts) == 2 and parts[0].lower() == 'bearer' and parts[1] == SYNC_API_KEY:
        return True, 'ok'
    return False, 'invalid_token'


class Handler(BaseHTTPRequestHandler):
    def _set_headers(self, code=200, ct='application/json'):
        self.send_response(code)
        self.send_header('Content-type', ct)
        # Allow local test clients to call without CORS failures in test env
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        # Allow requested headers to be reflected for preflight (helps msw interceptors and custom x-* headers)
        req_headers = self.headers.get('Access-Control-Request-Headers')
        if req_headers:
            self.send_header('Access-Control-Allow-Headers', req_headers)
        else:
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_POST(self):
        parsed = urlparse(self.path)
        # Chat endpoint
        if parsed.path == '/v1/chat/completions':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length) if length else b''
            try:
                data = json.loads(body.decode()) if body else {}
            except Exception:
                self._set_headers(400)
                self.wfile.write(json.dumps({'error': 'invalid_json'}).encode())
                return

            messages = data.get('messages') or []
            # fallback: single input
            if not messages and 'input' in data:
                messages = [{'role': 'user', 'content': data['input']}]

            memory = load_memory()
            persona = detect_persona(messages)

            # get last user content
            user_msg = ''
            for m in reversed(messages):
                if m.get('role') == 'user':
                    user_msg = m.get('content', '')
                    break
            if not user_msg and messages:
                user_msg = messages[-1].get('content', '')

            # Detect simple agent actions in the user message (e.g., create file)
            action_result = None
            try:
                um = (user_msg or '')
                low = um.lower()
                if 'create' in low and 'file' in low:
                    import re
                    # More robust filename matcher (look for a token with a typical extension)
                    m = re.search(r"([A-Za-z0-9_.\-]+\.(txt|md|json|py|sh|exe|cfg|conf))", um)
                    if not m:
                        # fallback to earlier patterns on the lowercased text
                        m = re.search(r"create (?:a )?file (?:named )?['\"]?([^'\"\s,]+)['\"]?", low)
                        if not m:
                            m = re.search(r"create (?:a )?file (?:named )?([^\s,]+)", low)
                    if m:
                        fname = m.group(1)
                        # attempt to extract content after 'with' or after ':'
                        content = None
                        m2 = re.search(r"with (?:the )?content[:]?\s*['\"]([^'\"]+)['\"]", um, re.IGNORECASE)
                        if not m2:
                            m2 = re.search(r"with (.+)$", um, re.IGNORECASE)
                        if m2:
                            content = m2.group(1).strip().strip('"')
                        if not content:
                            # default content
                            content = f"Created by qmoi agent at {datetime.now(timezone.utc).isoformat()}"
                        # safety: prevent directory traversal and absolute paths
                        if '..' in fname or fname.startswith('/') or '\\' in fname:
                            action_result = 'error: invalid filename'
                        else:
                            target = os.path.join(BASE, fname)
                            try:
                                os.makedirs(os.path.dirname(target), exist_ok=True)
                                with open(target, 'w') as f:
                                    f.write(content + '\n')
                                action_result = f'created:{target}'
                            except Exception as e:
                                action_result = f'error: {e}'
            except Exception:
                action_result = None

            # Build persona reply and include any action result
            reply_text = persona_response(persona, user_msg, memory)
            if action_result:
                reply_text = reply_text + "\n\n[Action] " + str(action_result)
            save_memory(memory)

            # Build response similar to OpenAI Chat Completions
            resp = {
                'id': 'qmoi-local-'+datetime.utcnow().strftime('%Y%m%d%H%M%S'),
                'object': 'chat.completion',
                'created': int(datetime.utcnow().timestamp()),
                'model': MODEL_NAME,
                'choices': [
                    {
                        'index': 0,
                        'message': {'role': 'assistant', 'content': reply_text},
                        'finish_reason': 'stop'
                    }
                ]
            }

            self._set_headers(200)
            self.wfile.write(json.dumps(resp).encode())
            return

        # Sync push endpoint: trigger push to configured backends
        if parsed.path == '/sync/push':
            # auth check
            allowed, reason = _check_sync_auth(self.headers)
            if not allowed:
                self._set_headers(401)
                self.wfile.write(json.dumps({'ok': False, 'reason': reason}).encode())
                return
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length) if length else b''
            # optional: accept {'force': true}
            try:
                _ = json.loads(body.decode()) if body else {}
            except Exception:
                _ = {}
            mem = load_memory()
            ok, details = push_memory_to_backends(mem)
            status = 200 if ok else 500
            self._set_headers(status)
            self.wfile.write(json.dumps({'ok': ok, 'details': details}).encode())
            return

        # Sync pull endpoint: fetch remote memory and merge
        if parsed.path == '/sync/pull':
            # auth check
            allowed, reason = _check_sync_auth(self.headers)
            if not allowed:
                self._set_headers(401)
                self.wfile.write(json.dumps({'ok': False, 'reason': reason}).encode())
                return
            try:
                remote_mem = pull_memory_from_backends()
                if remote_mem:
                    local = load_memory()
                    # naive merge: extend local conversations with remote that are new
                    existing = {c.get('timestamp'): True for c in local.get('conversations', []) if isinstance(c, dict)}
                    added = 0
                    for c in remote_mem.get('conversations', []):
                        if not isinstance(c, dict):
                            continue
                        if c.get('timestamp') not in existing:
                            local.setdefault('conversations', []).append(c)
                            added += 1
                    save_memory(local)
                    self._set_headers(200)
                    self.wfile.write(json.dumps({'ok': True, 'added': added}).encode())
                    return
                else:
                    self._set_headers(204)
                    self.wfile.write(json.dumps({'ok': False, 'reason': 'no_remote'}).encode())
                    return
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({'ok': False, 'error': str(e)}).encode())
                return
        # Unknown POST route
        self._set_headers(404)
        self.wfile.write(json.dumps({'error': 'not_found'}).encode())

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/health':
            self._set_headers(200)
            # Report canonical model name
            self.wfile.write(json.dumps({'status': 'ok', 'model': 'qmoi'}).encode())
            return
        if parsed.path == '/memory':
            mem = load_memory()
            self._set_headers(200)
            self.wfile.write(json.dumps(mem).encode())
            return
        # Simple endpoint to list configured sync backends
        if parsed.path == '/sync/config':
            cfg = {
                'backends': os.environ.get('QMOI_SYNC_BACKENDS', '').split(','),
                'hf_repo': os.environ.get('QMOI_HF_REPO'),
                'gist_id': os.environ.get('QMOI_GIST_ID')
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(cfg).encode())
            return
        self._set_headers(404)
        self.wfile.write(json.dumps({'error': 'not_found'}).encode())


def run(server_class=HTTPServer, handler_class=Handler, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"QM OI local server listening on http://0.0.0.0:{port}")
    # Optionally start background sync thread if configured
    sync_interval = int(os.environ.get('QMOI_SYNC_INTERVAL_SECONDS', '0') or 0)
    if sync_interval > 0:
        def bg_sync():
            while True:
                try:
                    # import here to avoid circulars
                    from functools import partial
                    mem = load_memory()
                    # Always persist local memory and backup
                    save_memory(mem)
                    # Attempt to push to configured remote backends (if any)
                    push_memory_to_backends(mem)
                except Exception as e:
                    print('Background sync error:', e)
                time.sleep(sync_interval)

        t = threading.Thread(target=bg_sync, daemon=True)
        t.start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down')
        httpd.server_close()


if __name__ == '__main__':
    os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
    if not os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, 'w') as f:
            json.dump({'conversations': []}, f)
    # Allow test runners to override port via QMOI_LOCAL_PORT env
    port = int(os.environ.get('QMOI_LOCAL_PORT', '8080'))
    run(port=port)
