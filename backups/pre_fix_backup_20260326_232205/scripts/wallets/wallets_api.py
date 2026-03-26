// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
#!/usr/bin/env python3
"""Small Flask API to expose wallet reports and history for local dashboards.

Security: if `QMOI_API_TOKEN` is set in env, clients must send header `X-QMOI-API-TOKEN`.
This is intentionally simple and for local/dev use only. Do NOT expose to public internet
without proper auth.
"""
import os
import json
from pathlib import Path
from flask import Flask, jsonify, request, abort, send_file
try:
    from flask_cors import CORS
except Exception:
    CORS = None

ROOT = Path(__file__).resolve().parents[2]
VALID_DIR = ROOT / '.qmoi_validation'
REPORT = VALID_DIR / 'all_wallets_qvs.json'
HISTORY = VALID_DIR / 'wallet_balance_history.json'

app = Flask(__name__)
API_TOKEN = os.environ.get('QMOI_API_TOKEN')

def _check_auth():
    if not API_TOKEN:
        return True
    token = request.headers.get('X-QMOI-API-TOKEN')
    return token == API_TOKEN

@app.route('/api/wallets')
def wallets():
    if not _check_auth():
        abort(401)
    if not REPORT.exists():
        return jsonify({'error': 'no report found'}), 404
    with open(REPORT, 'r', encoding='utf-8') as fh:
        data = json.load(fh)
    return jsonify(data)

@app.route('/')
def serve_ui():
    """Serve the data dashboard UI if present under ui_samples/wallet_dashboard."""
    ui_path = ROOT / 'ui_samples' / 'wallet_dashboard' / 'index.html'
    if ui_path.exists():
        return send_file(str(ui_path))
    return '<h1>QMOI Wallets API</h1><p>No UI installed. Place dashboard in ui_samples/wallet_dashboard/</p>'

@app.route('/api/history')
def history():
    if not _check_auth():
        abort(401)
    if not HISTORY.exists():
        return jsonify({'history': []})
    with open(HISTORY, 'r', encoding='utf-8') as fh:
        data = json.load(fh)
    return jsonify(data)

@app.route('/api/wallets/<name>')
def wallet_detail(name):
    if not _check_auth():
        abort(401)
    if not REPORT.exists():
        return jsonify({'error': 'no report found'}), 404
    with open(REPORT, 'r', encoding='utf-8') as fh:
        data = json.load(fh)
    w = data.get('results', {}).get(name)
    if not w:
        return jsonify({'error': 'not found'}), 404
    return jsonify(w)

def run(port=8765):
    print('Starting wallets API on http://127.0.0.1:%d (token=%s)' % (port, 'SET' if API_TOKEN else 'UNSET'))
    app.run(host='127.0.0.1', port=port)

if __name__ == '__main__':
    run()
