#!/usr/bin/env python3
"""
Production-like local helper server used for full verification runs.

Provides minimal, realistic endpoints expected by integration tests:
 - GET /api/qcity/status
 - GET /api/qcity/audit-log
 - POST /api/qcity/remote-command
 - POST /api/financial/verify
 - POST /api/whatsapp/verify
 - GET /api/health

This server is intentionally lightweight but returns realistic payloads
so verification tests run without relying on external services.
"""
from flask import Flask, request, jsonify, make_response
import threading
import time
import os
import json
from werkzeug.serving import make_server
from pathlib import Path

APP = Flask(__name__)
DATA_DIR = Path(os.environ.get("PROD_HELPER_DATA", ".prod_helper"))
DATA_DIR.mkdir(parents=True, exist_ok=True)
AUDIT_LOG = DATA_DIR / "audit_log.json"


def _ok_options():
    resp = make_response("", 204)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization,x-qcity-admin-key"
    return resp


@APP.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response


@APP.route("/api/health", methods=["GET", "OPTIONS"])  # some scripts expect /api/health
@APP.route("/health", methods=["GET", "OPTIONS"])      # others expect /health
def health():
    if request.method == "OPTIONS":
        return _ok_options()
    return jsonify({"status": "ok", "service": "production_helper_server"})


@APP.route("/api/qcity/status", methods=["GET", "OPTIONS"])
def qcity_status():
    if request.method == "OPTIONS":
        return _ok_options()
    # Provide a realistic device/status payload
    payload = {
        "ok": True,
        "timestamp": int(time.time()),
        "devices": [],
        "status": {"uptime": 12345, "load": 0.12}
    }
    return jsonify(payload)


@APP.route("/api/qcity/audit-log", methods=["GET", "OPTIONS"])
def qcity_audit_log():
    if request.method == "OPTIONS":
        return _ok_options()
    # Support optional admin key header for extra entries
    entries = []
    if AUDIT_LOG.exists():
        try:
            entries = json.loads(AUDIT_LOG.read_text(encoding="utf-8"))
        except Exception:
            entries = []
    return jsonify({"ok": True, "entries": entries})


@APP.route("/api/qcity/remote-command", methods=["POST", "OPTIONS"])
def qcity_remote_command():
    if request.method == "OPTIONS":
        return _ok_options()
    payload = request.get_json(silent=True) or {}
    cmd = payload.get("cmd") or payload.get("command")
    # Execute only safe echo for verification; don't run shell commands.
    out = f"executed: {cmd}" if cmd else "no command"
    # record to audit log
    entries = []
    if AUDIT_LOG.exists():
        try:
            entries = json.loads(AUDIT_LOG.read_text(encoding="utf-8"))
        except Exception:
            entries = []
    entries.append({"ts": int(time.time()), "cmd": cmd, "result": out})
    try:
        AUDIT_LOG.write_text(json.dumps(entries, indent=2), encoding="utf-8")
    except Exception:
        pass
    return jsonify({"ok": True, "result": out})


@APP.route("/api/financial/verify", methods=["POST", "OPTIONS"])
def financial_verify():
    if request.method == "OPTIONS":
        return _ok_options()
    payload = request.get_json(silent=True) or {}
    service = payload.get("service")
    account = payload.get("account") or payload.get("phone")
    # For verification purposes assume success for known services
    if service in ("airtel", "mpesa"):
        return jsonify({"ok": True, "service": service, "verified": True, "account": account})
    return jsonify({"ok": False, "service": service, "verified": False}), 400


@APP.route("/api/whatsapp/verify", methods=["POST", "OPTIONS"])
def whatsapp_verify():
    if request.method == "OPTIONS":
        return _ok_options()
    payload = request.get_json(silent=True) or {}
    phone = payload.get("phone")
    # Minimal verification: return success for numeric-looking phones
    verified = isinstance(phone, str) and phone.strip().lstrip('+').isdigit()
    return jsonify({"ok": True, "phone": phone, "verified": bool(verified)})


class _BackgroundServer(threading.Thread):
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


server_thread = None


def start(host: str = "127.0.0.1", port: int = 3000, timeout: float = 2.0):
    global server_thread
    if server_thread and getattr(server_thread, "is_alive", lambda: False)():
        return True
    server_thread = _BackgroundServer(host, port)
    server_thread.start()
    # wait for health
    import requests as _requests
    deadline = time.time() + timeout
    url = f"http://{host}:{port}/api/health"
    while time.time() < deadline:
        try:
            r = _requests.get(url, timeout=0.5)
            if r.status_code == 200:
                return True
        except Exception:
            time.sleep(0.1)
    return False


if __name__ == '__main__':
    start()
