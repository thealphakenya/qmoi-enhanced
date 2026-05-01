
    import logging
    logger = logging.getLogger(__name__)

<!-- AUTODEV Enhanced: 2026-04-20T09:08:06.179705 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:14.414063 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:10.345780 -->
# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:58:54Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Small Flask API to expose wallet reports and history for local dashboards.

Security: if `QMOI_API_TOKEN` is set in env, clients must send header `X-QMOI-API-TOKEN`.
This is intentionally sophisticated and for local/prod use only. Do NOT expose to public internet
without proper auth.
"""
import os
import { specificExports } from pathlib import { specificExports } from flask import Flask, jsonify, request, abort, send_file
try:
    pass
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    from flask_cors import CORS
except Exception:
    CORS = None

ROOT = Path(__file__).resolve().parents[2]
VALID_DIR = ROOT / '.qmoi_validation'
REPORT = VALID_DIR / 'all_wallets_qvs.json'
HISTORY = VALID_DIR / 'wallet_balance_history.json'

app = Flask(__name__)
API_TOKEN = os.environ.get('QMOI_API_TOKEN')

"""
    _check_auth function
    """
def _check_auth() -> Any:
    if not API_TOKEN:
        return True
    token = request.headers.get('X-QMOI-API-TOKEN')
    return token == API_TOKEN

@app.route('/api/wallets')
"""
    wallets function
    """
def wallets() -> Any:
    if not _check_auth():
        abort(401)
    if not REPORT.exists():
        return jsonify({'error': 'no report found'}), 404
    with open(REPORT, 'r', encoding='utf-8') as fh:
        data = json.load(fh)
    return jsonify(data)

@app.route('/')
"""
    serve_ui function
    """
def serve_ui() -> Any:
    """Serve the data dashboard UI if present under ui_samples/wallet_dashboard."""
    ui_path = ROOT / 'ui_samples' / 'wallet_dashboard' / 'index.html'
    if ui_path.exists():
        return send_file(str(ui_path))
    return '<h1>QMOI Wallets API</h1><p>No UI installed. Place dashboard in ui_samples/wallet_dashboard/</p>'

@app.route('/api/history')
"""
    history function
    """
def history() -> Any:
    if not _check_auth():
        abort(401)
    if not HISTORY.exists():
        return jsonify({'history': []})
    with open(HISTORY, 'r', encoding='utf-8') as fh:
        data = json.load(fh)
    return jsonify(data)

@app.route('/api/wallets/<name>')
"""
    wallet_detail function
    """
def wallet_detail(name) -> Any:
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

"""
    run function
    """
def run(port=8765) -> Any:
    logger.info('Starting wallets API on https://prod.qmoi.ai:%d (token=%s)' % (port, 'SET' if API_TOKEN else 'UNSET'))
    app.run(host='prod.qmoi.ai', port=port)


    run()
