#!/usr/bin/env python3
"""
Minimal, robust helper server used by tests and local development.

Endpoints:
 - GET  /            -> health
 - POST /v1/chat/completions -> returns a minimal chat-completion (echo)
 - POST /sync/push  -> save JSON memory (protected by QMOI_SYNC_API_KEY if set)
 - GET  /sync/pull  -> return saved memory

This implementation uses Flask and performs atomic writes for the memory file.
"""

from pathlib import Path
import os
import json
import tempfile
from flask import Flask, request, jsonify, make_response
import threading
import time
from datetime import datetime
from werkzeug.serving import make_server

APP = Flask(__name__)
BASE_DIR = Path(__file__).resolve().parent
MEMORY_FILE = Path(os.environ.get("QMOI_MEMORY_FILE", str(BASE_DIR / "qmoi_memory.json")))
QMOI_SYNC_API_KEY = os.environ.get("QMOI_SYNC_API_KEY")


def atomic_write_json(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(mode="w", delete=False, dir=str(path.parent), encoding="utf-8") as tf:
        tf.write(json.dumps(data, ensure_ascii=False, indent=2))
        tmp = tf.name
    os.replace(tmp, str(path))


@APP.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    return response


@APP.route("/", methods=["GET"])
def index():
    return jsonify({"ok": True, "msg": "qmoi_local_server running"})


@APP.route("/v1/chat/completions", methods=["POST", "OPTIONS"])
def chat_completions():
    if request.method == "OPTIONS":
        return _ok_options()
    payload = request.get_json(silent=True) or {}
    messages = payload.get("messages") or []
    last_user = ""
    for m in reversed(messages):
        if m.get("role") == "user":
            last_user = m.get("content", "")
            break
    # Simple memory write: append last user message to conversations
    try:
        mem = {}
        if MEMORY_FILE.exists():
            with open(MEMORY_FILE, 'r', encoding='utf-8') as f:
                mem = json.load(f) or {}
        convs = mem.get('conversations', [])
        if last_user:
            convs.append({'role': 'user', 'content': last_user, 'ts': datetime.utcnow().isoformat()})
            mem['conversations'] = convs
            atomic_write_json(MEMORY_FILE, mem)
    except Exception:
        pass

    # Provide a simple assistant reply, supporting recall
    if last_user and 'what did i tell' in last_user.lower():
        # recall last N messages
        msgs = []
        try:
            with open(MEMORY_FILE, 'r', encoding='utf-8') as f:
                mm = json.load(f) or {}
                msgs = [c['content'] for c in mm.get('conversations', []) if c.get('role') == 'user']
        except Exception:
            msgs = []
        recall = ' '.join(msgs[-5:]) if msgs else 'I do not recall.'
        reply_text = f"[User Mode] I recall: {recall}"
    else:
        reply_text = f"[User Mode] Echo: {last_user}" if last_user else "[User Mode] Hello from qmoi_local_server"
    response = {
        "id": "local-1",
        "object": "chat.completion",
        "choices": [
            {"index": 0, "message": {"role": "assistant", "content": reply_text}}
        ],
        "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
    }
    return jsonify(response)


@APP.route("/sync/push", methods=["POST", "OPTIONS"])
def sync_push():
    if request.method == "OPTIONS":
        return _ok_options()
    if QMOI_SYNC_API_KEY:
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer ") or auth.split(" ", 1)[1] != QMOI_SYNC_API_KEY:
            return make_response(jsonify({"error": "unauthorized"}), 401)
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return make_response(jsonify({"error": "invalid payload"}), 400)
    try:
        atomic_write_json(MEMORY_FILE, data)
    except Exception as e:
        return make_response(jsonify({"error": "failed to save", "details": str(e)}), 500)
    return jsonify({"ok": True})


@APP.route("/sync/pull", methods=["GET", "OPTIONS"])
def sync_pull():
    if request.method == "OPTIONS":
        return _ok_options()
    if QMOI_SYNC_API_KEY:
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer ") or auth.split(" ", 1)[1] != QMOI_SYNC_API_KEY:
            return make_response(jsonify({"error": "unauthorized"}), 401)
    if not MEMORY_FILE.exists():
        return jsonify({})
    try:
        with open(MEMORY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        data = {}
    return jsonify(data)


@APP.route('/health', methods=['GET', 'OPTIONS'])
def health():
    if request.method == 'OPTIONS':
        return _ok_options()
    return jsonify({'status': 'ok', 'model': 'qmoi'})


@APP.route('/memory', methods=['GET'])
def memory():
    if not MEMORY_FILE.exists():
        return jsonify({'conversations': []})
    try:
        with open(MEMORY_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception:
        data = {'conversations': []}
    return jsonify(data)


def _ok_options():
    resp = make_response("", 204)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    return resp


def run(port: int = 8081, host: str | None = None):
    """Run the Flask helper app; provided for test runners that call `run()`.

    Args:
        port: TCP port to bind (default 8081)
        host: Optional host to bind; if None, uses `QMOI_HELPER_HOST` or 127.0.0.1
    """
    bind_host = host or os.environ.get("QMOI_HELPER_HOST", "127.0.0.1")
    APP.run(host=bind_host, port=port)


class _BackgroundFlaskServer(threading.Thread):
    def __init__(self, host: str, port: int):
        super().__init__(daemon=True)
        self.host = host
        self.port = port
        self._srv = None

    def run(self):
        try:
            self._srv = make_server(self.host, self.port, APP)
            self._srv.serve_forever()
        except Exception:
            return


# Auto-start a local helper server on import for test environments unless turned off
if os.environ.get('QMOI_HELPER_AUTOSTART', '1') == '1':
    DEFAULT_PORT = int(os.environ.get('QMOI_LOCAL_PORT', '8080'))
    DEFAULT_HOST = os.environ.get('QMOI_HELPER_HOST', '127.0.0.1')

    def _start_and_wait(host=DEFAULT_HOST, port=DEFAULT_PORT, timeout=2.0):
        """Start the background server and wait until /health responds or timeout."""
        global server_thread
        server_thread = _BackgroundFlaskServer(host, port)
        server_thread.start()
        # Poll for health
        import time as _time
        import requests as _requests
        deadline = _time.time() + timeout
        url = f"http://{host}:{port}/health"
        while _time.time() < deadline:
            try:
                r = _requests.get(url, timeout=0.5)
                if r.status_code == 200:
                    return True
            except Exception:
                _time.sleep(0.1)
        return False

    try:
        _start_and_wait()
    except Exception:
        # Best effort: do not raise on import
        pass


if __name__ == '__main__':
    os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
    if not os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, 'w', encoding='utf-8') as f:
            json.dump({'conversations': []}, f)
    # Allow test runners to override port via QMOI_LOCAL_PORT env
    port = int(os.environ.get('QMOI_LOCAL_PORT', '8081'))
    run(port=port)
