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
from payments import stripe_adapter
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from typing import Optional
import uuid
import subprocess

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
# Runtime-only in-memory storage for transient WebAuthn state (was stored in webauthn_state.json)
WEBAUTHN_STATE = {}


def _load_json(path, default):
    # JSON storage is deprecated. Return default to avoid accidental reads.
    app.logger.warning('Attempted to load JSON file %s but JSON persistence is deprecated; returning default', path)
    return default


def _save_json(path, data):
    # JSON persistence is deprecated. No-op (we keep backups of legacy JSON files).
    app.logger.warning('Attempted to save JSON file %s but JSON persistence is deprecated; no-op', path)


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
    cur.execute('CREATE TABLE IF NOT EXISTS attachments (id TEXT PRIMARY KEY, username TEXT, name TEXT, size INTEGER, mime TEXT, data TEXT, created TEXT)')
    cur.execute('CREATE TABLE IF NOT EXISTS sponsored (username TEXT PRIMARY KEY, added_by TEXT, added_at TEXT)')
    cur.execute('CREATE TABLE IF NOT EXISTS user_pricing (username TEXT PRIMARY KEY, price_cents INTEGER, tier TEXT, expires_at TEXT, auto_generated INTEGER)')
    cur.execute('CREATE TABLE IF NOT EXISTS deals (id TEXT PRIMARY KEY, title TEXT, description TEXT, price_cents INTEGER, active INTEGER, created TEXT, metadata TEXT)')
    cur.execute('CREATE TABLE IF NOT EXISTS wallets (username TEXT PRIMARY KEY, balance_cents INTEGER)')
    cur.execute('CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, username TEXT, deal_id TEXT, amount_cents INTEGER, status TEXT, provider TEXT, provider_ref TEXT, created TEXT, settled_at TEXT)')
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
    # If DB not available, return empty dict (no credentials)
    app.logger.warning('Database unavailable when loading webauthn creds; returning empty credential set')
    return {}


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
    # If DB not available, log and drop (we do not persist to JSON)
    app.logger.warning('Database unavailable when saving webauthn creds; change not persisted')


def load_revoked_tokens():
    conn = _db_get_conn()
    tokens = []
    if conn:
        try:
            cur = conn.cursor()
            cur.execute('CREATE TABLE IF NOT EXISTS revoked_tokens (token TEXT PRIMARY KEY, jti TEXT)')
            cur.execute('SELECT token, jti FROM revoked_tokens')
            rows = cur.fetchall()
            for token, jti in rows:
                tokens.append({'token': token, 'jti': jti})
            return tokens
        finally:
            conn.close()
    app.logger.warning('Database unavailable when loading revoked tokens; returning empty list')
    return []


def save_revoked_token(token):
    conn = _db_get_conn()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute('CREATE TABLE IF NOT EXISTS revoked_tokens (token TEXT PRIMARY KEY, jti TEXT)')
            # attempt to decode jti
            try:
                payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
                jti = payload.get('jti')
            except Exception:
                jti = None
            cur.execute('REPLACE INTO revoked_tokens (token, jti) VALUES (?,?)', (token, jti))
            conn.commit()
            return
        finally:
            conn.close()
    app.logger.warning('Database unavailable when saving revoked token; token not persisted')


def is_token_revoked(token):
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
            # Query for token
            try:
                cur.execute("SELECT token FROM revoked_tokens WHERE token=?", (token,))
                if cur.fetchone():
                    return True
            except Exception:
                pass
            # Query for jti
            if jti:
                try:
                    cur.execute("SELECT jti FROM revoked_tokens WHERE jti=?", (jti,))
                    if cur.fetchone():
                        return True
                except Exception:
                    pass
        finally:
            conn.close()
    # If DB not available or no match, treat as not revoked
    return False


def is_sponsored(username):
    conn = _db_get_conn()
    if not conn:
        return False
    try:
        cur = conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS sponsored (username TEXT PRIMARY KEY, added_by TEXT, added_at TEXT)')
        cur.execute('SELECT username FROM sponsored WHERE username=?', (username,))
        return cur.fetchone() is not None
    finally:
        try:
            conn.close()
        except Exception:
            pass


def _ensure_wallet(username):
    conn = _db_get_conn()
    if not conn:
        return False
    try:
        cur = conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS wallets (username TEXT PRIMARY KEY, balance_cents INTEGER)')
        cur.execute('SELECT balance_cents FROM wallets WHERE username=?', (username,))
        if not cur.fetchone():
            cur.execute('INSERT OR REPLACE INTO wallets (username,balance_cents) VALUES (?,?)', (username, 0))
            conn.commit()
        return True
    finally:
        try:
            conn.close()
        except Exception:
            pass


def _adjust_balance(username, delta_cents):
    conn = _db_get_conn()
    if not conn:
        return False
    try:
        cur = conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS wallets (username TEXT PRIMARY KEY, balance_cents INTEGER)')
        cur.execute('SELECT balance_cents FROM wallets WHERE username=?', (username,))
        row = cur.fetchone()
        if not row:
            cur.execute('INSERT INTO wallets (username,balance_cents) VALUES (?,?)', (username, delta_cents if delta_cents>0 else 0))
            conn.commit()
            return True
        new = row[0] + int(delta_cents)
        cur.execute('UPDATE wallets SET balance_cents=? WHERE username=?', (new, username))
        conn.commit()
        return True
    finally:
        try:
            conn.close()
        except Exception:
            pass


def _get_balance(username):
    conn = _db_get_conn()
    if not conn:
        return None
    try:
        cur = conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS wallets (username TEXT PRIMARY KEY, balance_cents INTEGER)')
        cur.execute('SELECT balance_cents FROM wallets WHERE username=?', (username,))
        row = cur.fetchone()
        return row[0] if row else 0
    finally:
        try:
            conn.close()
        except Exception:
            pass


@app.route('/sponsored/add', methods=['POST'])
def sponsored_add():
    # Add a username to the sponsored table. Requires CONTROL_TOKEN or master JWT.
    auth = request.headers.get('Authorization') or request.headers.get('X-API-KEY')
    token = None
    if auth:
        if auth.startswith('Bearer '):
            token = auth.split(' ', 1)[1].strip()
        else:
            token = auth.strip()
    # If CONTROL_TOKEN provided, allow
    if token == CONTROL_TOKEN:
        payload = request.get_json(force=True) or {}
        uname = payload.get('username')
        added_by = 'control-token'
    else:
        # Otherwise require master JWT
        user = _verify_jwt(request)
        master = os.environ.get('QMOI_MASTER_USER', 'master')
        if user != master:
            return jsonify({'status': 'error', 'reason': 'forbidden'}), 403
        payload = request.get_json(force=True) or {}
        uname = payload.get('username')
        added_by = user
    if not uname:
        return jsonify({'status': 'error', 'reason': 'missing_username'}), 400
    conn = _db_get_conn()
    if not conn:
        return jsonify({'status': 'error', 'reason': 'db_unavailable'}), 500
    try:
        cur = conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS sponsored (username TEXT PRIMARY KEY, added_by TEXT, added_at TEXT)')
        cur.execute('REPLACE INTO sponsored (username, added_by, added_at) VALUES (?,?,?)', (uname, added_by, datetime.datetime.utcnow().isoformat()))
        conn.commit()
        return jsonify({'status': 'ok', 'sponsored': uname})
    finally:
        try:
            conn.close()
        except Exception:
            pass
def sponsored_list():
    # Anyone authenticated can view the sponsored list
    user = _verify_jwt(request)
    if not user:
        return jsonify({'status': 'error', 'reason': 'unauthorized'}), 401
    conn = _db_get_conn()
    if not conn:
        return jsonify({'status': 'error', 'reason': 'db_unavailable'}), 500
    try:
        cur = conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS sponsored (username TEXT PRIMARY KEY, added_by TEXT, added_at TEXT)')
        cur.execute('SELECT username, added_by, added_at FROM sponsored')
        rows = cur.fetchall()
        out = [{'username': r[0], 'added_by': r[1], 'added_at': r[2]} for r in rows]
        return jsonify({'status': 'ok', 'sponsored': out})
    finally:
        try:
            conn.close()
        except Exception:
            pass


def _is_master_request(req):
    # Accept CONTROL_TOKEN or a JWT where subject equals MASTER_USERNAME
    auth = req.headers.get('Authorization') or req.headers.get('X-API-KEY')
    if auth:
        token = auth.split(' ',1)[1].strip() if auth.startswith('Bearer ') else auth.strip()
        if token == CONTROL_TOKEN:
            return True
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            master = os.environ.get('QMOI_MASTER_USER', 'master')
            if payload.get('sub') == master:
                return True
        except Exception:
            pass
    return False


@app.route('/admin/users', methods=['GET'])
def admin_users_list():
    # Master-only endpoint to list all registered users and pricing
    if not _is_master_request(request):
        return jsonify({'status': 'error', 'reason': 'forbidden'}), 403
    users = load_users()
    conn = _db_get_conn()
    pricing = {}
    if conn:
        try:
            cur = conn.cursor()
            cur.execute('CREATE TABLE IF NOT EXISTS user_pricing (username TEXT PRIMARY KEY, price_cents INTEGER, tier TEXT, expires_at TEXT, auto_generated INTEGER)')
            cur.execute('SELECT username, price_cents, tier, expires_at, auto_generated FROM user_pricing')
            for r in cur.fetchall():
                pricing[r[0]] = {'price_cents': r[1], 'tier': r[2], 'expires_at': r[3], 'auto_generated': bool(r[4])}
        finally:
            conn.close()
    out = []
    for uname, obj in users.items():
        out.append({'username': uname, 'created': obj.get('created'), 'pricing': pricing.get(uname)})
    return jsonify({'status': 'ok', 'users': out})


@app.route('/admin/set-pricing', methods=['POST'])
def admin_set_pricing():
    if not _is_master_request(request):
        return jsonify({'status': 'error', 'reason': 'forbidden'}), 403
    payload = request.get_json(force=True) or {}
    username = payload.get('username')
    price_cents = int(payload.get('price_cents') or 0)
    tier = payload.get('tier') or 'custom'
    expires_at = payload.get('expires_at')
    conn = _db_get_conn()
    if not conn:
        return jsonify({'status': 'error', 'reason': 'db_unavailable'}), 500
    try:
        cur = conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS user_pricing (username TEXT PRIMARY KEY, price_cents INTEGER, tier TEXT, expires_at TEXT, auto_generated INTEGER)')
        cur.execute('REPLACE INTO user_pricing (username, price_cents, tier, expires_at, auto_generated) VALUES (?,?,?,?,?)', (username, price_cents, tier, expires_at, 0))
        conn.commit()
        return jsonify({'status': 'ok', 'username': username, 'price_cents': price_cents, 'tier': tier, 'expires_at': expires_at})
    finally:
        try:
            conn.close()
        except Exception:
            pass


@app.route('/admin/check-access/<username>/<feature>', methods=['GET'])
def admin_check_access(username, feature):
    # Master-only: determine if a user has access to a paid feature
    if not _is_master_request(request):
        return jsonify({'status': 'error', 'reason': 'forbidden'}), 403
    # Sponsored users get full access
    if is_sponsored(username):
        return jsonify({'status': 'ok', 'access': True, 'reason': 'sponsored'})
    # Check pricing: if price 0 or expires_at in future -> access
    conn = _db_get_conn()
    if conn:
        try:
            cur = conn.cursor()
            cur.execute('SELECT price_cents, expires_at FROM user_pricing WHERE username=?', (username,))
            row = cur.fetchone()
            if not row:
                # no pricing info: auto-generate a suggestion (e.g., free trial)
                suggested_cents = 0
                return jsonify({'status': 'ok', 'access': False, 'suggested_price_cents': suggested_cents, 'note': 'no_pricing'})
            price_cents, expires_at = row
            if price_cents == 0:
                return jsonify({'status': 'ok', 'access': True, 'reason': 'free'})
            if expires_at:
                try:
                    exp_dt = datetime.datetime.fromisoformat(expires_at)
                    if exp_dt > datetime.datetime.utcnow():
                        return jsonify({'status': 'ok', 'access': True, 'reason': 'subscription_active', 'expires_at': expires_at})
                except Exception:
                    pass
            return jsonify({'status': 'ok', 'access': False, 'price_cents': price_cents})
        finally:
            conn.close()
    return jsonify({'status': 'ok', 'access': False, 'reason': 'no_db'})


@app.route('/deals/create', methods=['POST'])
def deals_create():
    # Admin-only endpoint to create deals
    if not _is_master_request(request):
        return jsonify({'status': 'error', 'reason': 'forbidden'}), 403
    payload = request.get_json(force=True) or {}
    did = payload.get('id') or f"deal-{int(datetime.datetime.utcnow().timestamp())}"
    title = payload.get('title')
    desc = payload.get('description','')
    price = int(payload.get('price_cents') or 0)
    meta = json.dumps(payload.get('metadata',{}))
    conn = _db_get_conn()
    if not conn:
        return jsonify({'status':'error','reason':'db_unavailable'}),500
    try:
        cur = conn.cursor()
        cur.execute('REPLACE INTO deals (id,title,description,price_cents,active,created,metadata) VALUES (?,?,?,?,?,?,?)', (did, title, desc, price, 1, datetime.datetime.utcnow().isoformat(), meta))
        conn.commit()
        return jsonify({'status':'ok','id':did})
    finally:
        conn.close()


@app.route('/deals', methods=['GET'])
def deals_list():
    conn = _db_get_conn()
    if not conn:
        return jsonify({'status':'error','reason':'db_unavailable'}),500
    try:
        cur = conn.cursor()
        cur.execute('SELECT id,title,description,price_cents,active,created,metadata FROM deals')
        rows = cur.fetchall()
        out = []
        for r in rows:
            out.append({'id':r[0],'title':r[1],'description':r[2],'price_cents':r[3],'active':bool(r[4]),'created':r[5],'metadata': json.loads(r[6] or '{}')})
        return jsonify({'status':'ok','deals':out})
    finally:
        conn.close()


@app.route('/deals/<deal_id>', methods=['GET'])
def deals_get(deal_id):
    conn = _db_get_conn()
    if not conn:
        return jsonify({'status':'error','reason':'db_unavailable'}),500
    try:
        cur = conn.cursor()
        cur.execute('SELECT id,title,description,price_cents,active,created,metadata FROM deals WHERE id=?', (deal_id,))
        r = cur.fetchone()
        if not r:
            return jsonify({'status':'error','reason':'not_found'}),404
        return jsonify({'status':'ok','deal':{'id':r[0],'title':r[1],'description':r[2],'price_cents':r[3],'active':bool(r[4]),'created':r[5],'metadata': json.loads(r[6] or '{}')}})
    finally:
        conn.close()


@app.route('/deals/<deal_id>/activate', methods=['POST'])
def deals_activate(deal_id):
    if not _is_master_request(request):
        return jsonify({'status':'error','reason':'forbidden'}),403
    conn = _db_get_conn()
    if not conn:
        return jsonify({'status':'error','reason':'db_unavailable'}),500
    try:
        cur = conn.cursor()
        cur.execute('UPDATE deals SET active=1 WHERE id=?', (deal_id,))
        conn.commit()
        return jsonify({'status':'ok','id':deal_id})
    finally:
        conn.close()


@app.route('/deals/<deal_id>/deactivate', methods=['POST'])
def deals_deactivate(deal_id):
    if not _is_master_request(request):
        return jsonify({'status':'error','reason':'forbidden'}),403
    conn = _db_get_conn()
    if not conn:
        return jsonify({'status':'error','reason':'db_unavailable'}),500
    try:
        cur = conn.cursor()
        cur.execute('UPDATE deals SET active=0 WHERE id=?', (deal_id,))
        conn.commit()
        return jsonify({'status':'ok','id':deal_id})
    finally:
        conn.close()


@app.route('/deals/<deal_id>/purchase', methods=['POST'])
def deals_purchase(deal_id):
    # Purchase a deal for the authenticated user. Sponsored users get it free.
    user = _verify_jwt(request)
    if not user:
        return jsonify({'status':'error','reason':'unauthorized'}),401
    # Use an explicit DB transaction to make pricing + wallet + transaction inserts atomic
    try:
        conn = sqlite3.connect(str(DB_FILE))
    except Exception:
        return jsonify({'status':'error','reason':'db_unavailable'}),500
    try:
        cur = conn.cursor()
        cur.execute('BEGIN')
        cur.execute('SELECT id,price_cents,active FROM deals WHERE id=?', (deal_id,))
        r = cur.fetchone()
        if not r:
            conn.rollback()
            return jsonify({'status':'error','reason':'not_found'}),404
        price = r[1]
        active = bool(r[2])
        if not active:
            conn.rollback()
            return jsonify({'status':'error','reason':'inactive'}),400
        # If sponsored, allow purchase for free
        if is_sponsored(user):
            cur.execute('REPLACE INTO user_pricing (username, price_cents, tier, expires_at, auto_generated) VALUES (?,?,?,?,?)', (user, 0, 'sponsored', None, 0))
            conn.commit()
            return jsonify({'status':'ok','paid':0,'note':'sponsored'})

        # Otherwise, attempt to create a provider charge (Stripe if configured)
        adapter_result = None
        try:
            adapter_result = stripe_adapter.create_charge(user, price, 'usd')
        except Exception:
            app.logger.exception('Payment adapter create_charge failed; falling back to local settlement')

        # If adapter returned an error or is not configured, fallback to local settlement
        if not adapter_result or adapter_result.get('error'):
            # fallback: perform local wallet movements and mark settled
            cur.execute('REPLACE INTO user_pricing (username, price_cents, tier, expires_at, auto_generated) VALUES (?,?,?,?,?)', (user, price, 'deal', None, 1))
            cur.execute('CREATE TABLE IF NOT EXISTS wallets (username TEXT PRIMARY KEY, balance_cents INTEGER)')
            cur.execute('SELECT balance_cents FROM wallets WHERE username=?', (user,))
            if not cur.fetchone():
                cur.execute('INSERT OR REPLACE INTO wallets (username,balance_cents) VALUES (?,?)', (user, 0))
            cur.execute('SELECT balance_cents FROM wallets WHERE username=?', ('cashon',))
            if not cur.fetchone():
                cur.execute('INSERT OR REPLACE INTO wallets (username,balance_cents) VALUES (?,?)', ('cashon', 0))
            cur.execute('UPDATE wallets SET balance_cents = balance_cents - ? WHERE username = ?', (price, user))
            cur.execute('UPDATE wallets SET balance_cents = balance_cents + ? WHERE username = ?', (price, 'cashon'))
            txid = f"tx-{int(datetime.datetime.utcnow().timestamp()*1000)}"
            cur.execute('CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, username TEXT, deal_id TEXT, amount_cents INTEGER, status TEXT, provider TEXT, provider_ref TEXT, created TEXT, settled_at TEXT)')
            cur.execute('INSERT OR REPLACE INTO transactions (id,username,deal_id,amount_cents,status,provider,provider_ref,created,settled_at) VALUES (?,?,?,?,?,?,?,?,?)', (txid, user, deal_id, price, 'settled', None, None, datetime.datetime.utcnow().isoformat(), datetime.datetime.utcnow().isoformat()))
            conn.commit()
            return jsonify({'status':'ok','paid_cents':price,'transaction_id': txid})

        # Adapter returned a result object — inspect status
        provider_status = adapter_result.get('status')
        provider_ref = adapter_result.get('provider_ref')
        client_secret = adapter_result.get('client_secret')
        txid = f"tx-{int(datetime.datetime.utcnow().timestamp()*1000)}"
        cur.execute('CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, username TEXT, deal_id TEXT, amount_cents INTEGER, status TEXT, provider TEXT, provider_ref TEXT, created TEXT, settled_at TEXT)')
        if provider_status in (None, 'settled', 'succeeded'):
            # mark settled and perform local wallet updates
            cur.execute('REPLACE INTO user_pricing (username, price_cents, tier, expires_at, auto_generated) VALUES (?,?,?,?,?)', (user, price, 'deal', None, 1))
            cur.execute('INSERT OR REPLACE INTO wallets (username,balance_cents) VALUES (?,COALESCE((SELECT balance_cents FROM wallets WHERE username=?),0))', (user, user))
            cur.execute('INSERT OR REPLACE INTO wallets (username,balance_cents) VALUES (?,COALESCE((SELECT balance_cents FROM wallets WHERE username=?),0))', ('cashon', 'cashon'))
            cur.execute('UPDATE wallets SET balance_cents = balance_cents - ? WHERE username = ?', (price, user))
            cur.execute('UPDATE wallets SET balance_cents = balance_cents + ? WHERE username = ?', (price, 'cashon'))
            cur.execute('INSERT OR REPLACE INTO transactions (id,username,deal_id,amount_cents,status,provider,provider_ref,created,settled_at) VALUES (?,?,?,?,?,?,?,?,?)', (txid, user, deal_id, price, 'settled', 'stripe', provider_ref, datetime.datetime.utcnow().isoformat(), datetime.datetime.utcnow().isoformat()))
            conn.commit()
            return jsonify({'status':'ok','paid_cents':price,'transaction_id': txid})
        else:
            # pending or requires client action — create pending txn and return client_hint
            cur.execute('INSERT OR REPLACE INTO transactions (id,username,deal_id,amount_cents,status,provider,provider_ref,created,settled_at) VALUES (?,?,?,?,?,?,?,?,?)', (txid, user, deal_id, price, 'pending', 'stripe', provider_ref, datetime.datetime.utcnow().isoformat(), None))
            conn.commit()
            resp = {'status':'pending','transaction_id': txid}
            if client_secret:
                resp['client_secret'] = client_secret
            return jsonify(resp)
    except Exception:
        try:
            conn.rollback()
        except Exception:
            pass
        app.logger.exception('Purchase transaction failed')
        return jsonify({'status':'error','reason':'purchase_failed'}),500
    finally:
        try:
            conn.close()
        except Exception:
            pass



@app.route('/wallet', methods=['GET'])
def wallet_get():
    user = _verify_jwt(request)
    if not user:
        return jsonify({'status':'error','reason':'unauthorized'}),401
    bal = _get_balance(user)
    return jsonify({'status':'ok','balance_cents': bal})


@app.route('/wallet/credit', methods=['POST'])
def wallet_credit():
    # master or control token may credit any wallet
    if not _is_master_request(request):
        return jsonify({'status':'error','reason':'forbidden'}),403
    payload = request.get_json(force=True) or {}
    username = payload.get('username')
    amount = int(payload.get('amount_cents') or 0)
    if not username:
        return jsonify({'status':'error','reason':'missing_username'}),400
    _ensure_wallet(username)
    _adjust_balance(username, amount)
    return jsonify({'status':'ok','username':username,'credit':amount})


@app.route('/wallet/debit', methods=['POST'])
def wallet_debit():
    if not _is_master_request(request):
        return jsonify({'status':'error','reason':'forbidden'}),403
    payload = request.get_json(force=True) or {}
    username = payload.get('username')
    amount = int(payload.get('amount_cents') or 0)
    if not username:
        return jsonify({'status':'error','reason':'missing_username'}),400
    _ensure_wallet(username)
    _adjust_balance(username, -amount)
    return jsonify({'status':'ok','username':username,'debit':amount})


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
    # store state in memory keyed by username
    WEBAUTHN_STATE[username] = state
    return cbor.encode(registration_data)


@app.route('/webauthn/register/complete', methods=['POST'])
def webauthn_register_complete():
    # expects CBOR body
    raw = request.get_data()
    data = cbor.decode(raw)
    username = data.get('username')
    client_data = data.get('clientData')
    att_obj = data.get('attestationObject')
    state = WEBAUTHN_STATE.get(username)
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
    WEBAUTHN_STATE[username] = state
    return cbor.encode(auth_data)


@app.route('/webauthn/authenticate/complete', methods=['POST'])
def webauthn_auth_complete():
    raw = request.get_data()
    data = cbor.decode(raw)
    username = data.get('username')
    resp = data.get('authenticatorData')
    sig = data.get('signature')
    client_data = data.get('clientData')
    state = WEBAUTHN_STATE.get(username)
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


@app.route('/attachments', methods=['POST'])
@rate_limit(lambda: request.remote_addr or 'anon', limit=30, per_seconds=60)
def attachments():
    """Accept lightweight attachment metadata and persist to DB.
    Expected JSON: { "attachments": [ { name, size, mime, dataUrlPreview } ] }
    """
    user = _verify_jwt(request)
    if not user:
        return jsonify({'status': 'error', 'reason': 'unauthorized'}), 401
    data = request.get_json(force=True)
    arr = data.get('attachments', [])
    if not arr:
        return jsonify({'status': 'error', 'reason': 'missing_attachments'}), 400
    conn = _db_get_conn()
    if not conn:
        return jsonify({'status': 'error', 'reason': 'db_unavailable'}), 500
    try:
        cur = conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS attachments (id TEXT PRIMARY KEY, username TEXT, name TEXT, size INTEGER, mime TEXT, data TEXT, created TEXT)')
        inserted = 0
        for a in arr:
            aid = a.get('id') or f"att-{int(datetime.datetime.utcnow().timestamp()*1000)}"
            name = a.get('name')
            size = int(a.get('size') or 0)
            mime = a.get('mime') or ''
            data_preview = a.get('dataUrlPreview') or ''
            created = datetime.datetime.utcnow().isoformat()
            cur.execute('REPLACE INTO attachments (id,username,name,size,mime,data,created) VALUES (?,?,?,?,?,?,?)', (aid, user, name, size, mime, data_preview, created))
            inserted += 1
        conn.commit()
        return jsonify({'status': 'ok', 'inserted': inserted})
    except Exception:
        app.logger.exception('Failed to save attachments')
        return jsonify({'status': 'error', 'reason': 'save_failed'}), 500
    finally:
        try:
            conn.close()
        except Exception:
            pass


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
import html
import base64

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


@app.route('/admin/update-ngrok', methods=['POST'])
def admin_update_ngrok():
    """Trigger the repo ngrok URL update script. Requires CONTROL_TOKEN header.

    This endpoint runs the local script in a subprocess. It's intentionally conservative:
    - Only accepts requests authenticated with CONTROL_TOKEN
    - Runs the script without network calls; the update script reads `live_qmoi_ngrok_url.txt`.
    - Returns the script output. Do NOT enable unauthenticated access in production.
    """
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

    # run the update script in dry-run or apply based on JSON body flag
    payload = request.get_json(silent=True) or {}
    apply_changes = bool(payload.get('apply', False))

    script = Path(__file__).parent / 'scripts' / 'update_ngrok_links.py'
    if not script.exists():
        return jsonify({'status':'error','reason':'script_missing'}), 500

    cmd = ['python3', str(script)]
    if apply_changes:
        cmd.append('--apply')
    else:
        cmd.append('--dry-run')

    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        out = proc.stdout
        err = proc.stderr
        status = 'ok' if proc.returncode == 0 else 'error'
        return jsonify({'status': status, 'returncode': proc.returncode, 'stdout': out, 'stderr': err})
    except subprocess.TimeoutExpired:
        return jsonify({'status':'error','reason':'timeout'}), 504
    except Exception:
        app.logger.exception('Failed to run update script')
        return jsonify({'status':'error','reason':'failed'}), 500


@app.route('/attachments', methods=['GET'])
def list_attachments():
    """Return attachments metadata for the authenticated user."""
    user = _verify_jwt(request)
    if not user:
        return jsonify({'status': 'error', 'reason': 'unauthorized'}), 401
    conn = _db_get_conn()
    if not conn:
        return jsonify({'status': 'error', 'reason': 'db_unavailable'}), 500
    try:
        cur = conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS attachments (id TEXT PRIMARY KEY, username TEXT, name TEXT, size INTEGER, mime TEXT, data TEXT, created TEXT)')
        cur.execute('SELECT id, name, size, mime, created FROM attachments WHERE username=? ORDER BY created DESC', (user,))
        rows = cur.fetchall()
        out = [{'id': r[0], 'name': r[1], 'size': r[2], 'mime': r[3], 'created': r[4]} for r in rows]
        return jsonify({'status': 'ok', 'attachments': out})
    except Exception:
        app.logger.exception('Failed to list attachments')
        return jsonify({'status': 'error', 'reason': 'failed'}), 500
    finally:
        try:
            conn.close()
        except Exception:
            pass


@app.route('/ready', methods=['GET'])
def ready():
    """Readiness probe: confirms DB is accessible and basic tables exist."""
    conn = _db_get_conn()
    if not conn:
        return jsonify({'status': 'error', 'reason': 'db_unavailable'}), 500
    try:
        cur = conn.cursor()
        # simple checks: users and memories tables present
        cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('users','memories')")
        rows = cur.fetchall()
        ok = len(rows) >= 1
        return jsonify({'status': 'ok' if ok else 'degraded', 'tables_found': [r[0] for r in rows]})
    except Exception:
        app.logger.exception('Readiness check failed')
        return jsonify({'status': 'error'}), 500
    finally:
        try:
            conn.close()
        except Exception:
            pass


@app.route('/metrics', methods=['GET'])
def metrics():
    """Lightweight metrics for orchestration and supervisor scripts."""
    conn = _db_get_conn()
    if not conn:
        return jsonify({'status': 'error', 'reason': 'db_unavailable'}), 500
    try:
        cur = conn.cursor()
        cur.execute('SELECT COUNT(*) FROM users')
        users_count = cur.fetchone()[0]
        cur.execute('SELECT COUNT(*) FROM memories')
        memories_count = cur.fetchone()[0]
        cur.execute('SELECT COUNT(*) FROM attachments')
        attachments_count = cur.fetchone()[0]
        return jsonify({'status': 'ok', 'users': users_count, 'memories': memories_count, 'attachments': attachments_count})
    except Exception:
        app.logger.exception('Metrics failed')
        return jsonify({'status': 'error'}), 500
    finally:
        try:
            conn.close()
        except Exception:
            pass


@app.route('/attachments/<att_id>/download', methods=['GET'])
def attachment_download(att_id):
    """Return attachment data or a data URL for the authenticated user.

    This is intentionally lightweight: attachments currently store a small
    preview in the `data` column (dataUrlPreview). If a full binary is stored
    as a data URL, we return it. For production, this should return a signed
    S3/MinIO URL or stream with proper caching and access controls.
    """
    user = _verify_jwt(request)
    if not user:
        return jsonify({'status': 'error', 'reason': 'unauthorized'}), 401
    conn = _db_get_conn()
    if not conn:
        return jsonify({'status': 'error', 'reason': 'db_unavailable'}), 500
    try:
        cur = conn.cursor()
        cur.execute('SELECT id, name, size, mime, data FROM attachments WHERE id=? AND username=?', (att_id, user))
        row = cur.fetchone()
        if not row:
            return jsonify({'status': 'error', 'reason': 'not_found'}), 404
        aid, name, size, mime, data_field = row
        # If data_field looks like a data URL, return it as JSON so clients can render it
        if isinstance(data_field, str) and data_field.startswith('data:'):
            return jsonify({'status': 'ok', 'id': aid, 'name': name, 'size': size, 'mime': mime, 'dataUrl': data_field})
        # If data_field looks like base64 without prefix, return it with mime
        if isinstance(data_field, str) and data_field:
            try:
                # attempt base64 decode to validate
                _ = base64.b64decode(data_field.split(',')[-1])
                return jsonify({'status': 'ok', 'id': aid, 'name': name, 'size': size, 'mime': mime, 'dataBase64': data_field})
            except Exception:
                pass
        # Fallback: no binary available; return metadata and a guidance URL
        return jsonify({'status': 'ok', 'id': aid, 'name': name, 'size': size, 'mime': mime, 'note': 'preview-only or full data not stored; upgrade to S3 for downloads'})
    except Exception:
        app.logger.exception('Failed to fetch attachment')
        return jsonify({'status': 'error', 'reason': 'failed'}), 500
    finally:
        try:
            conn.close()
        except Exception:
            pass


@app.route('/ai/tts', methods=['POST'])
def ai_tts():
    """Return a simple SSML wrapper for the AI prompt. Requires user JWT.

    Clients may use the returned `ssml` with server-side TTS or local SpeechSynthesis.
    This is a prototype endpoint; production should return audio streams or signed URLs.
    """
    user = _verify_jwt(request)
    if not user:
        return jsonify({'status': 'error', 'reason': 'unauthorized'}), 401
    payload = request.get_json(force=True) or {}
    prompt = payload.get('prompt', '') or payload.get('text', '')
    # Keep the SSML safe by escaping
    safe_text = html.escape(prompt)
    voice = payload.get('voice', 'default')
    ssml = f"<speak><voice name=\"{html.escape(voice)}\">{safe_text}</voice></speak>"
    return jsonify({'status': 'ok', 'ssml': ssml})


from payments.webhook_processor import WebhookProcessor

@app.route('/payments/webhook', methods=['POST'])
def payments_webhook():
    """Handle Stripe webhook events with idempotency and comprehensive error handling.
    
    This endpoint:
    1. Verifies webhook signatures in production
    2. Processes events idempotently using event IDs
    3. Updates transaction states and user balances
    4. Handles all relevant Stripe event types
    """
    payload = request.get_data()
    sig = request.headers.get('Stripe-Signature')
    
    # Verify webhook signature
    res = stripe_adapter.verify_webhook_signature(payload, sig)
    if not res.get('ok'):
        app.logger.error(f"Webhook signature verification failed: {res.get('error')}")
        return jsonify({
            'status': 'error',
            'reason': 'invalid_signature',
            'detail': res.get('error')
        }), 400
        
    evt = res.get('event')
    
    # Get event details
    try:
        # Handle both dict and Stripe Event object formats
        etype = evt.get('type') if isinstance(evt, dict) else getattr(evt, 'type', None)
        event_id = evt.get('id') if isinstance(evt, dict) else getattr(evt, 'id', None)
        data = evt.get('data', {}).get('object') if isinstance(evt, dict) else getattr(evt, 'data', {}).get('object')
        
        app.logger.info(f"Processing Stripe webhook event: {etype} ({event_id})")
        
        # Get DB connection and initialize processor
        conn = _db_get_conn()
        if not conn:
            return jsonify({'status': 'error', 'reason': 'database_error'}), 500
            
        processor = WebhookProcessor(conn)
        
        try:
            # Check for duplicate event
            if processor.is_duplicate_event(event_id):
                return jsonify({
                    'status': 'ok',
                    'reason': 'event_already_processed'
                }), 200
                
            # Process event based on type
            if etype in ('payment_intent.succeeded', 'charge.succeeded'):
                provider_ref = data.get('id') or data.get('payment_intent')
                amount = int(data.get('amount') or 0)
                metadata = data.get('metadata', {})
                username = metadata.get('username')
                deal_id = metadata.get('deal_id')
                
                if provider_ref and username:
                    processor.handle_payment_success(
                        provider_ref=provider_ref,
                        username=username,
                        amount=amount,
                        deal_id=deal_id
                    )
                    
            elif etype == 'payment_intent.payment_failed':
                provider_ref = data.get('id') or data.get('payment_intent')
                error = data.get('last_payment_error', {}).get('message', 'Payment failed')
                
                if provider_ref:
                    processor.handle_payment_failure(
                        provider_ref=provider_ref,
                        error=error
                    )
                    
            elif etype == 'charge.refunded':
                provider_ref = data.get('payment_intent')
                if provider_ref:
                    processor.handle_refund(provider_ref)
                    
            # Record webhook as processed
            processor.record_event(event_id, etype)
            conn.commit()
            
            return jsonify({
                'status': 'ok',
                'event_type': etype,
                'provider_ref': provider_ref
            }), 200
                
        except Exception as e:
            conn.rollback()
            app.logger.error(f"Error processing webhook: {e}")
            return jsonify({
                'status': 'error',
                'reason': 'processing_error',
                'detail': str(e)
            }), 500
            
        finally:
            conn.close()
            
    except Exception as e:
        app.logger.error(f"Failed to parse webhook event: {e}")
        return jsonify({
            'status': 'error',
            'reason': 'invalid_event',
            'detail': str(e)
        }), 400

    # Handle charge/payment_intent succeeded/settled events
    # Check for duplicate event
    conn = _db_get_conn()
    if not conn:
        app.logger.error("Failed to connect to database")
        return jsonify({'status': 'error', 'reason': 'database_error'}), 500
        
    try:
        cur = conn.cursor()
        
        # Store webhook event for idempotency
        cur.execute('''CREATE TABLE IF NOT EXISTS webhook_events 
            (id TEXT PRIMARY KEY, type TEXT, processed_at TEXT)''')
            
        # Check if we've seen this event before
        cur.execute('SELECT id FROM webhook_events WHERE id = ?', (event_id,))
        if cur.fetchone():
            app.logger.info(f"Skipping duplicate event: {event_id}")
            return jsonify({'status': 'ok', 'reason': 'event_already_processed'}), 200
            
        # Ensure transactions table exists
        cur.execute('''CREATE TABLE IF NOT EXISTS transactions 
            (id TEXT PRIMARY KEY, username TEXT, deal_id TEXT, amount_cents INTEGER, 
             status TEXT, provider TEXT, provider_ref TEXT, created TEXT, settled_at TEXT,
             error TEXT)''')
             
        # Process event based on type
        if etype in ('payment_intent.succeeded', 'charge.succeeded'):
            # Payment successful
            provider_ref = data.get('id') or data.get('payment_intent')
            amount = int(data.get('amount') or 0)
            metadata = data.get('metadata', {})
            username = metadata.get('username')
            deal_id = metadata.get('deal_id')
                # idempotent update: find a transaction by provider_ref and mark settled
                if provider_ref:
                    cur.execute('SELECT id, status FROM transactions WHERE provider_ref=?', (provider_ref,))
                    row = cur.fetchone()
                    if row:
                        if row[1] != 'settled' and etype in ('payment_intent.succeeded', 'charge.succeeded', 'charge.settled'):
                            cur.execute('UPDATE transactions SET status=?, settled_at=? WHERE id=?', ('settled', datetime.datetime.utcnow().isoformat(), row[0]))
                            conn.commit()
                            handled = True
                    else:
                        # create transaction if not exists
                        txid = f"tx-{int(datetime.datetime.utcnow().timestamp()*1000)}"
                        cur.execute('INSERT OR REPLACE INTO transactions (id,username,deal_id,amount_cents,status,provider,provider_ref,created,settled_at) VALUES (?,?,?,?,?,?,?,?,?)', (txid, username or '', None, amount or 0, 'settled' if etype!='payment_intent.payment_failed' else 'failed', 'stripe', provider_ref, datetime.datetime.utcnow().isoformat(), datetime.datetime.utcnow().isoformat() if etype!='payment_intent.payment_failed' else None))
                        conn.commit()
                        handled = True
        finally:
            try:
                conn.close()
            except Exception:
                pass

    return jsonify({'status': 'ok' if handled else 'ignored'})


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

    # Start the Flask dev server (use a WSGI server in production)
    app.run(host='0.0.0.0', port=8000)
