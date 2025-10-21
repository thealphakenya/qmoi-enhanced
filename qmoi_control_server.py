#!/usr/bin/env python3
"""Lightweight control server for QMOI to control Q Alpha PWA.

This accepts JSON commands at /control and logs them. In production, QMOI would
authenticate requests and perform actions (navigate, start download, etc.).
"""
from flask import Flask, request, jsonify, redirect
from pathlib import Path
import logging
import os
import json
import jwt
import datetime
from fido2.server import Fido2Server
from fido2.webauthn import PublicKeyCredentialRpEntity
from fido2 import cbor
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from typing import Optional
import uuid

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

# Simple in-memory rate limiter (per-IP, naive)
_RATE_BUCKET = {}
def rate_limit(key_func, limit=10, per_seconds=60):
    def deco(f):
        def wrapped(*args, **kwargs):
            try:
                key = key_func()
                now = int(datetime.datetime.utcnow().timestamp())
                bucket = _RATE_BUCKET.setdefault(key, [])
                # purge old
                while bucket and bucket[0] <= now - per_seconds:
                    bucket.pop(0)
                if len(bucket) >= limit:
                    return jsonify({'status':'error','reason':'rate_limited'}), 429
                bucket.append(now)
            except Exception:
                pass
            return f(*args, **kwargs)
        wrapped.__name__ = f.__name__
        return wrapped
    return deco

# Config / secrets: set these in env for production
CONTROL_TOKEN = os.environ.get('QMOI_CONTROL_TOKEN', 'dev-token')
JWT_SECRET = os.environ.get('QMOI_JWT_SECRET', 'dev-jwt-secret')
# Base raw GitHub URL to serve downloads as fallback; update if repo/branch differ
GITHUB_RAW_BASE = os.environ.get('QMOI_GITHUB_RAW_BASE',
    'https://raw.githubusercontent.com/thealphakenya/qmoi-enhanced/autosync-backup-20250926-232440')

# Storage files (simple file-backed store for demo/dev)
ROOT = Path(__file__).parent
USERS_FILE = ROOT / 'users.json'
MEMORIES_FILE = ROOT / 'memories.json'
DB_FILE = ROOT / 'qmoi.db'


def _load_json(path, default):
    # Deprecated: JSON storage removed for production; raise if used unexpectedly
    app.logger.warning('_load_json called for %s (deprecated)', path)
    return default


def _save_json(path, data):
    # Deprecated: persist to DB instead. Keep no-op to avoid accidental writes.
    app.logger.warning('_save_json called for %s (deprecated)', path)


def load_users():
    # If DB exists, read from DB
    if DB_FILE.exists():
        conn = sqlite3.connect(str(DB_FILE))
        cur = conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, pw TEXT, created TEXT, profiles TEXT)')
        cur.execute('SELECT username, pw, created, profiles FROM users')
        rows = cur.fetchall()
        conn.close()
        res = {}
        for u, pw, created, profiles in rows:
            obj = {'pw': pw, 'created': created}
            if profiles:
                try:
                    obj['profiles'] = json.loads(profiles)
                except Exception:
                    obj['profiles'] = []
            res[u] = obj
        return res
    return _load_json(USERS_FILE, {})


def save_users(u):
    # If DB exists or we can create it, write into DB
    try:
        conn = sqlite3.connect(str(DB_FILE))
        cur = conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, pw TEXT, created TEXT, profiles TEXT)')
        for username, obj in u.items():
            profiles = json.dumps(obj.get('profiles', [])) if obj.get('profiles') is not None else ''
            cur.execute('REPLACE INTO users (username,pw,created,profiles) VALUES (?,?,?,?)', (username, obj.get('pw',''), obj.get('created',''), profiles))
        conn.commit()
        conn.close()
    except Exception:
        _save_json(USERS_FILE, u)


def load_memories():
    if DB_FILE.exists():
        conn = sqlite3.connect(str(DB_FILE))
        cur = conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS memories (id TEXT PRIMARY KEY, username TEXT, key TEXT, value TEXT, created TEXT, type TEXT)')
        cur.execute('SELECT id, username, key, value, created, type FROM memories')
        rows = cur.fetchall()
        conn.close()
        res = {}
        for mid, username, key, value, created, mtype in rows:
            obj = {'id': mid, 'key': key, 'value': json.loads(value) if value else None, 'created': created, 'type': mtype}
            res.setdefault(username, []).append(obj)
        return res
    return _load_json(MEMORIES_FILE, {})


def save_memories(m):
    try:
        conn = sqlite3.connect(str(DB_FILE))
        cur = conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS memories (id TEXT PRIMARY KEY, username TEXT, key TEXT, value TEXT, created TEXT, type TEXT)')
        # simple replace strategy: clear existing for users present and insert
        for username, mems in m.items():
            # delete existing for user
            cur.execute('DELETE FROM memories WHERE username=?', (username,))
            for mem in mems:
                mid = mem.get('id')
                if not mid:
                    mid = f"gen-{int(datetime.datetime.utcnow().timestamp()*1000)}"
                cur.execute('REPLACE INTO memories (id,username,key,value,created,type) VALUES (?,?,?,?,?,?)', (mid, username, mem.get('key'), json.dumps(mem.get('value')), mem.get('created',''), mem.get('type','')))
        conn.commit()
        conn.close()
    except Exception:
        _save_json(MEMORIES_FILE, m)


def ensure_db_and_migrate():
    # If DB already exists, nothing to do
    if DB_FILE.exists():
        return
    # create DB and migrate existing JSON files into it
    conn = sqlite3.connect(str(DB_FILE))
    cur = conn.cursor()
    cur.execute('CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, pw TEXT, created TEXT, profiles TEXT)')
    cur.execute('CREATE TABLE IF NOT EXISTS memories (id TEXT PRIMARY KEY, username TEXT, key TEXT, value TEXT, created TEXT, type TEXT)')
    cur.execute('CREATE TABLE IF NOT EXISTS revoked_tokens (token TEXT PRIMARY KEY)')
    # Ensure revoked_tokens table has token primary column; we may add jti column later
    cur.execute('CREATE TABLE IF NOT EXISTS revoked_tokens (token TEXT PRIMARY KEY)')
    # ensure jti column exists (for JWT ID checks)
    cur.execute("PRAGMA table_info('revoked_tokens')")
    cols = [r[1] for r in cur.fetchall()]
    if 'jti' not in cols:
        try:
            cur.execute('ALTER TABLE revoked_tokens ADD COLUMN jti TEXT')
        except Exception:
            # ignore if cannot add (older sqlite)
            pass
    cur.execute('CREATE TABLE IF NOT EXISTS webauthn_creds (username TEXT, cred TEXT, fmt TEXT)')
    # migrate users
    users = _load_json(USERS_FILE, {})
    for username, obj in users.items():
        profiles = json.dumps(obj.get('profiles', [])) if obj.get('profiles') is not None else ''
        cur.execute('REPLACE INTO users (username,pw,created,profiles) VALUES (?,?,?,?)', (username, obj.get('pw',''), obj.get('created',''), profiles))
    # migrate memories
    memories = _load_json(MEMORIES_FILE, {})
    for username, mems in memories.items():
        for mem in mems:
            mid = mem.get('id') or f"gen-{int(datetime.datetime.utcnow().timestamp()*1000)}"
            cur.execute('REPLACE INTO memories (id,username,key,value,created,type) VALUES (?,?,?,?,?,?)', (mid, username, mem.get('key'), json.dumps(mem.get('value')), mem.get('created',''), mem.get('type','')))
    # migrate revoked
    revoked = _load_json(ROOT / 'revoked_tokens.json', [])
    for t in revoked:
        cur.execute('REPLACE INTO revoked_tokens (token) VALUES (?)', (t,))
    # migrate webauthn creds
    creds = _load_json(ROOT / 'webauthn_creds.json', {})
    for username, credlist in creds.items():
        for c in credlist:
            cur.execute('REPLACE INTO webauthn_creds (username,cred,fmt) VALUES (?,?,?)', (username, json.dumps(c.get('cred',{}), default=str), c.get('fmt','')))
    conn.commit()
    conn.close()


# Ensure DB is present and migrations applied at startup
ensure_db_and_migrate()


# Simple credential store for WebAuthn (store per user: a list of credentials)
RP_NAME = os.environ.get('QMOI_RP_NAME', 'QMOI')


def get_fido2_server():
    """Create a Fido2Server using RP config from env or the incoming request host.
    This allows WebAuthn RP to match the deployment domain.
    """
    rp_id = os.environ.get('QMOI_RP_ID')
    if not rp_id:
        # fall back to request host when available (strip port)
        try:
            host = request.host.split(':')[0]
            rp_id = host
        except Exception:
            rp_id = 'localhost'
    rp = PublicKeyCredentialRpEntity(name=RP_NAME, id=rp_id)
    return Fido2Server(rp)


def _db_get_conn():
    try:
        if DB_FILE.exists():
            return sqlite3.connect(str(DB_FILE))
    except Exception:
        app.logger.exception('Error connecting to DB')
    return None


def load_creds():
    conn = _db_get_conn()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute('CREATE TABLE IF NOT EXISTS webauthn_creds (username TEXT, cred TEXT, fmt TEXT)')
            cur.execute('SELECT username, cred, fmt FROM webauthn_creds')
            rows = cur.fetchall()
            out = {}
            for username, credtext, fmt in rows:
                try:
                    credobj = json.loads(credtext)
                except Exception:
                    credobj = credtext
                out.setdefault(username, []).append({'cred': credobj, 'fmt': fmt})
            return out
        finally:
            conn.close()
    return _load_json(ROOT / 'webauthn_creds.json', {})


def save_creds(c):
    conn = _db_get_conn()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute('CREATE TABLE IF NOT EXISTS webauthn_creds (username TEXT, cred TEXT, fmt TEXT)')
            cur.execute('DELETE FROM webauthn_creds')
            for username, credlist in c.items():
                for cred in credlist:
                    credtext = json.dumps(cred.get('cred', {}), default=str)
                    fmt = cred.get('fmt', '')
                    cur.execute('INSERT INTO webauthn_creds (username,cred,fmt) VALUES (?,?,?)', (username, credtext, fmt))
            conn.commit()
            return
        finally:
            conn.close()
    _save_json(ROOT / 'webauthn_creds.json', c)


def load_revoked_tokens():
    # Legacy function: returns raw-token list if JSON present; new code uses jti in DB
    legacy = _load_json(ROOT / 'revoked_tokens.json', [])
    return legacy


def save_revoked_token(token):
    # legacy storage for raw token strings
    revoked = _load_json(ROOT / 'revoked_tokens.json', [])
    if token not in revoked:
        revoked.append(token)
        _save_json(ROOT / 'revoked_tokens.json', revoked)


def is_token_revoked(token):
    # Check legacy raw-token list first
    legacy = _load_json(ROOT / 'revoked_tokens.json', [])
    if token in legacy:
        return True
    # Try decode and check jti or token in DB
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        jti = payload.get('jti')
    except Exception:
        jti = None
    conn = _db_get_conn()
    if conn:
        try:
            cur = conn.cursor()
            # Safely query for both token and jti if columns exist
            try:
                cur.execute("SELECT token FROM revoked_tokens WHERE token=?", (token,))
                if cur.fetchone():
                    return True
            except Exception:
                # ignore
                pass
            if jti:
                try:
                    cur.execute("SELECT jti FROM revoked_tokens WHERE jti=?", (jti,))
                    if cur.fetchone():
                        return True
                except Exception:
                    pass
        finally:
            conn.close()
    return False


@app.route('/webauthn/register/options', methods=['POST'])
def webauthn_register_options():
    payload = request.get_json(force=True)
    username = payload.get('username')
    if not username:
        return jsonify({'status':'error','reason':'missing_username'}), 400
    users = load_users()
    user = users.get(username)
    user_id = username.encode('utf-8')
    f2 = get_fido2_server()
    registration_data, state = f2.register_begin({'id': user_id, 'name': username, 'displayName': username}, user_verification='discouraged')
    # store state in memory (simple): in a temp file keyed by username
    tmp = _load_json(ROOT / 'webauthn_state.json', {})
    tmp[username] = state
    _save_json(ROOT / 'webauthn_state.json', tmp)
    return cbor.encode(registration_data)


@app.route('/webauthn/register/complete', methods=['POST'])
def webauthn_register_complete():
    # expects CBOR body
    raw = request.get_data()
    data = cbor.decode(raw)
    username = data.get('username')
    client_data = data.get('clientData')
    att_obj = data.get('attestationObject')
    tmp = _load_json(ROOT / 'webauthn_state.json', {})
    state = tmp.get(username)
    f2 = get_fido2_server()
    auth_data = f2.register_complete(state, client_data, att_obj)
    # save credential
    creds = load_creds()
    creds.setdefault(username, []).append({'cred': auth_data.credential_data, 'fmt': auth_data.fmt})
    save_creds(creds)
    return jsonify({'status':'ok'})


@app.route('/webauthn/authenticate/options', methods=['POST'])
def webauthn_auth_options():
    payload = request.get_json(force=True)
    username = payload.get('username')
    creds = load_creds().get(username, [])
    if not creds:
        return jsonify({'status':'error','reason':'no_creds'}), 404
    allow_list = []
    for c in creds:
        allow_list.append({'type':'public-key','id': c['cred'].credential_id})
    f2 = get_fido2_server()
    auth_data, state = f2.authenticate_begin(allow_list)
    tmp = _load_json(ROOT / 'webauthn_state.json', {})
    tmp[username] = state
    _save_json(ROOT / 'webauthn_state.json', tmp)
    return cbor.encode(auth_data)


@app.route('/webauthn/authenticate/complete', methods=['POST'])
def webauthn_auth_complete():
    raw = request.get_data()
    data = cbor.decode(raw)
    username = data.get('username')
    resp = data.get('authenticatorData')
    sig = data.get('signature')
    client_data = data.get('clientData')
    tmp = _load_json(ROOT / 'webauthn_state.json', {})
    state = tmp.get(username)
    creds = load_creds().get(username, [])
    # match credential by id
    cred = None
    for c in creds:
        if c['cred'].credential_id == data.get('id'):
            cred = c
            break
    if not cred:
        return jsonify({'status':'error','reason':'unknown_credential'}), 404
    f2 = get_fido2_server()
    f2.authenticate_complete(state, cred['cred'], client_data, resp, sig)
    # on success create JWT
    now = datetime.datetime.utcnow()
    jti = str(uuid.uuid4())
    token = jwt.encode({'sub': username, 'iat': now.timestamp(), 'exp': (now + datetime.timedelta(days=7)).timestamp(), 'jti': jti}, JWT_SECRET, algorithm='HS256')
    return jsonify({'status':'ok','token': token})

@app.route('/control', methods=['POST'])
def control():
    data = request.get_json(force=True)
    cmd = data.get('command')
    target = data.get('target')
    # Here you'd implement real action handlers; for now we log and acknowledge
    # Authenticate
    auth = request.headers.get('Authorization') or request.headers.get('X-API-KEY')
    token = None
    if auth:
        if auth.startswith('Bearer '):
            token = auth.split(' ', 1)[1].strip()
        else:
            token = auth.strip()
    if token != CONTROL_TOKEN:
        app.logger.warning('Unauthorized control attempt')
        return jsonify({'status': 'error', 'reason': 'unauthorized'}), 401

    app.logger.info('Received control command: %s target=%s', cmd, target)

    # Implement a few concrete commands
    if cmd == 'navigate':
        # target can be a route like '/apps/qmoi'
        route = target or '/'
        return jsonify({'status': 'ok', 'action': 'navigate', 'route': route})

    if cmd == 'download':
        # target should be filename present in ./downloads/
        filename = target
        downloads_dir = Path(__file__).parent / 'downloads'
        candidate = downloads_dir / filename if filename else None
        if candidate and candidate.exists():
            # Return raw GitHub URL as a fallback download link
            raw_url = f"{GITHUB_RAW_BASE}/downloads/{filename}"
            return jsonify({'status': 'ok', 'action': 'download', 'url': raw_url})
        else:
            return jsonify({'status': 'error', 'reason': 'file_not_found'}), 404

    if cmd == 'voice' or cmd == 'speak':
        text = data.get('text', '')
        # For now we just log voice commands; a real system would route to TTS or dialog manager
        app.logger.info('Voice command text: %s', text)
        return jsonify({'status': 'ok', 'action': 'voice', 'text': text})

    # Fallback acknowledgement
    return jsonify({'status': 'ok', 'command': cmd, 'target': target})


@app.route('/ai', methods=['POST'])
def ai_endpoint():
    """User-facing AI endpoint. Accepts JSON {prompt: string} and requires user JWT.
    Returns a simulated response for now. In production this would proxy to an AI service.
    """
    user = _verify_jwt(request)
    if not user:
        return jsonify({'status': 'error', 'reason': 'unauthorized'}), 401
    payload = request.get_json(force=True)
    prompt = payload.get('prompt', '')
    # Here a real system would call an LLM/service; we simulate a response
    resp = {'reply': f"(simulated) Received prompt from {user}: {prompt[:200]}"}
    app.logger.info('AI request by %s: %s', user, prompt)
    return jsonify({'status': 'ok', 'response': resp})


@app.route('/signup', methods=['POST'])
@rate_limit(lambda: request.remote_addr or 'anon', limit=5, per_seconds=60)
def signup():
    payload = request.get_json(force=True)
    username = payload.get('username')
    password = payload.get('password')
    if not username or not password:
        return jsonify({'status': 'error', 'reason': 'missing_fields'}), 400
    users = load_users()
    if username in users:
        return jsonify({'status': 'error', 'reason': 'user_exists'}), 409
    users[username] = {'pw': generate_password_hash(password), 'created': datetime.datetime.utcnow().isoformat()}
    save_users(users)
    return jsonify({'status': 'ok', 'user': username})


@app.route('/login', methods=['POST'])
@rate_limit(lambda: request.remote_addr or 'anon', limit=10, per_seconds=60)
def login():
    payload = request.get_json(force=True)
    username = payload.get('username')
    password = payload.get('password')
    users = load_users()
    user = users.get(username)
    if not user or not check_password_hash(user.get('pw', ''), password):
        return jsonify({'status': 'error', 'reason': 'invalid_credentials'}), 401
    # Create JWT
    now = datetime.datetime.utcnow()
    jti = str(uuid.uuid4())
    token = jwt.encode({'sub': username, 'iat': now.timestamp(), 'exp': (now + datetime.timedelta(days=7)).timestamp(), 'jti': jti}, JWT_SECRET, algorithm='HS256')
    return jsonify({'status': 'ok', 'token': token})


def _get_jwt_from_request():
    auth = request.headers.get('Authorization') or request.headers.get('X-API-KEY')
    if not auth:
        return None
    if auth.startswith('Bearer '):
        return auth.split(' ', 1)[1].strip()
    return auth.strip()


def _verify_jwt(req):
    token = _get_jwt_from_request()
    if not token:
        return None
    if is_token_revoked(token):
        return None
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload.get('sub')
    except Exception:
        return None


@app.route('/logout', methods=['POST'])
def logout():
    token = _get_jwt_from_request()
    if not token:
        return jsonify({'status':'ok'})
    # Persist revoked token by jti when possible
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        jti = payload.get('jti')
    except Exception:
        jti = None
    if jti:
        conn = _db_get_conn()
        if conn:
            try:
                cur = conn.cursor()
                # Try to insert into jti column, fallback to token column or legacy JSON
                try:
                    cur.execute('REPLACE INTO revoked_tokens (jti) VALUES (?)', (jti,))
                except sqlite3.OperationalError:
                    try:
                        cur.execute('REPLACE INTO revoked_tokens (token) VALUES (?)', (token,))
                    except Exception:
                        # Last resort: store in legacy JSON
                        save_revoked_token(token)
                conn.commit()
            finally:
                conn.close()
    else:
        # Fallback: store raw token string
        save_revoked_token(token)
    return jsonify({'status':'ok'})


@app.route('/sync-memory', methods=['POST'])
@rate_limit(lambda: request.remote_addr or 'anon', limit=30, per_seconds=60)
def sync_memory():
    user = _verify_jwt(request)
    if not user:
        return jsonify({'status': 'error', 'reason': 'unauthorized'}), 401
    data = request.get_json(force=True)
    memories = load_memories()
    user_mem = memories.get(user, [])
    incoming = data.get('memories', [])
    # Merge by id when possible
    existing_by_id = {m.get('id'): m for m in user_mem if m.get('id')}
    for m in incoming:
        mid = m.get('id')
        if mid:
            existing_by_id[mid] = m
        else:
            # assign an id for local-only items
            m['id'] = f"gen-{int(datetime.datetime.utcnow().timestamp()*1000)}"
            existing_by_id[m['id']] = m
    # Always ensure q.ki preference exists if present in incoming
    for m in incoming:
        if m.get('key') == 'q.ki':
            existing_by_id[m['id']] = m

    merged = list(existing_by_id.values())
    memories[user] = merged
    save_memories(memories)
    return jsonify({'status': 'ok', 'merged_count': len(merged)})


@app.route('/memories', methods=['GET'])
def get_memories():
    user = _verify_jwt(request)
    if not user:
        return jsonify({'status': 'error', 'reason': 'unauthorized'}), 401
    memories = load_memories()
    return jsonify({'status': 'ok', 'memories': memories.get(user, [])})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


import mimetypes

# Discover apps under pwa_apps/ dynamically
APPS_DIR = ROOT / 'pwa_apps'


def discover_apps():
    apps = {}
    if APPS_DIR.exists() and APPS_DIR.is_dir():
        for child in APPS_DIR.iterdir():
            if child.is_dir():
                idx = child / 'index.html'
                if idx.exists():
                    apps[child.name] = child
    # also include explicit q-alpha mapping if missing
    if 'q-alpha' not in apps and (ROOT / 'pwa_apps' / 'q-alpha').exists():
        apps['q-alpha'] = ROOT / 'pwa_apps' / 'q-alpha'
    return apps


@app.route('/mirror/app/<appname>/', defaults={'rest': ''})
@app.route('/mirror/app/<appname>/<path:rest>')
def mirror_app(appname, rest):
    apps = discover_apps()
    appdir = apps.get(appname)
    # if local file exists, serve it
    if appdir:
        # default to index.html
        if rest == '' or rest is None:
            target = appdir / 'index.html'
        else:
            target = appdir / rest
        if target.exists() and target.is_file():
            # If we're serving HTML, rewrite root-relative asset URLs to use /mirror/raw/
            mime, _ = mimetypes.guess_type(str(target))
            if mime == 'text/html':
                txt = target.read_text()
                # rewrite src/href attributes that start with "/" to route via /mirror/raw/
                import re
                def repl_root(match):
                    prefix = match.group(1)
                    path = match.group(2)
                    # avoid rewriting protocol-relative or external URLs
                    if path.startswith('//') or path.startswith('http'):
                        return match.group(0)
                    new = f'{prefix}/mirror/raw/{path.lstrip("/")}'
                    return new

                txt = re.sub(r'(?i)(src|href)=(\")(/[^\"]+)(\")', lambda m: f"{m.group(1)}=\"/mirror/raw/{m.group(3).lstrip('/')}\"", txt)
                txt = re.sub(r"(?i)(src|href)=(')(/[^']+)(')", lambda m: f"{m.group(1)}='{ '/mirror/raw/' + m.group(3).lstrip('/') }'", txt)
                headers = {'Content-Type': 'text/html'}
                return txt.encode('utf-8'), 200, headers
            else:
                headers = {}
                if mime:
                    headers['Content-Type'] = mime
                else:
                    headers['Content-Type'] = 'application/octet-stream'
                return target.read_bytes(), 200, headers
    # Fallback: redirect to GitHub raw (assumes files are under pwa_apps/<appname>/...)
    path = rest if rest else 'index.html'
    raw_url = f"{GITHUB_RAW_BASE}/pwa_apps/{appname}/{path}"
    return redirect(raw_url)


@app.route('/mirror/raw/<path:rest>', methods=['GET'])
def mirror_raw(rest):
    # Serve local file if present under the repository root; otherwise redirect to GitHub raw
    local = ROOT / rest
    if local.exists() and local.is_file():
        mime, _ = mimetypes.guess_type(str(local))
        headers = {}
        if mime:
            headers['Content-Type'] = mime
        else:
            headers['Content-Type'] = 'application/octet-stream'
        return local.read_bytes(), 200, headers
    raw = f"{GITHUB_RAW_BASE}/{rest}"
    return redirect(raw)

if __name__ == '__main__':
    # Ensure DB and migrate any JSON-backed stores into SQLite before serving
    try:
        ensure_db_and_migrate()
    except Exception:
        app.logger.exception('DB migration failed')

    # In production, require secrets to be set and not default
    if os.environ.get('QMOI_ENV') == 'production':
        missing = []
        if JWT_SECRET in (None, '', 'dev-jwt-secret'):
            missing.append('QMOI_JWT_SECRET')
        if CONTROL_TOKEN in (None, '', 'dev-token'):
            missing.append('QMOI_CONTROL_TOKEN')
        if missing:
            app.logger.error('Missing required secrets for production: %s', missing)
            raise SystemExit(1)

    @app.route('/admin/backup-db', methods=['POST'])
    def admin_backup_db():
        # Auth with control token header
        auth = request.headers.get('Authorization') or request.headers.get('X-API-KEY')
        token = None
        if auth:
            if auth.startswith('Bearer '):
                token = auth.split(' ', 1)[1].strip()
            else:
                token = auth.strip()
        if token != CONTROL_TOKEN:
            return jsonify({'status':'error','reason':'unauthorized'}), 401
        if not DB_FILE.exists():
            return jsonify({'status':'error','reason':'db_missing'}), 404
        downloads = ROOT / 'downloads'
        downloads.mkdir(parents=True, exist_ok=True)
        out = downloads / f'qmoi.db.backup.{int(datetime.datetime.utcnow().timestamp())}.sqlite'
        try:
            import shutil
            shutil.copy2(str(DB_FILE), str(out))
            return jsonify({'status':'ok','path': str(out.relative_to(ROOT))})
        except Exception:
            app.logger.exception('Backup failed')
            return jsonify({'status':'error','reason':'backup_failed'}), 500

    app.run(host='0.0.0.0', port=8000)
