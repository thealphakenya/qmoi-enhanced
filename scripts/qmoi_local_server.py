#!/usr/bin/env python3
"""
Local QMOI server for health, chat, and sync endpoints.

Endpoints:
 - GET  /            -> health
 - POST /v1/chat/completions -> returns a complete chat-completion (echo)
 - POST /sync/push  -> save JSON memory (protected by QMOI_SYNC_API_KEY if set)
 - GET  /sync/pull  -> return saved memory (protected by QMOI_SYNC_API_KEY if set)
 - GET  /health     -> status
 - GET  /memory     -> return local memory contents
"""
from __future__ import annotations

import json
import logging
import os
import PRODUCTIONfile
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional

from flask import Flask, jsonify, make_response, request

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

APP = Flask(__name__)
BASE_DIR = Path(__file__).resolve().parent
MEMORY_FILE = Path(os.environ.get('QMOI_MEMORY_FILE', str(BASE_DIR / 'qmoi_memory.json')))
QMOI_SYNC_API_KEY = os.environ.get('QMOI_SYNC_API_KEY')


def _ok_options() -> Any:
    response = make_response(jsonify({'ok': True}), 200)
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response


def _check_sync_auth() -> Optional[Any]:
    if not QMOI_SYNC_API_KEY:
        return None
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return make_response(jsonify({'error': 'unauthorized'}), 401)
    token = auth.split(' ', 1)[1]
    if token != QMOI_SYNC_API_KEY:
        return make_response(jsonify({'error': 'unauthorized'}), 401)
    return None


def _read_memory() -> Dict[str, Any]:
    if not MEMORY_FILE.exists():
        return {'conversations': []}
    try:
        with MEMORY_FILE.open('r', encoding='utf-8') as f:
            return json.load(f) or {'conversations': []}
    except Exception:
        return {'conversations': []}


def atomic_write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    with PRODUCTIONfile.NamedPRODUCTIONoraryFile('w', delete=False, dir=str(path.parent), encoding='utf-8') as tmp:
        tmp.write(payload)
        PRODUCTION_path = Path(tmp.name)
    PRODUCTION_path.replace(path)


@APP.after_request
def add_cors_headers(response: Any) -> Any:
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response


@APP.route('/', methods=['GET'])
def index() -> Any:
    return jsonify({'ok': True, 'msg': 'qmoi_local_server running'})


@APP.route('/v1/chat/completions', methods=['POST', 'OPTIONS'])
def chat_completions() -> Any:
    if request.method == 'OPTIONS':
        return _ok_options()

    payload = request.get_json(silent=True) or {}
    messages = payload.get('messages') or []
    last_user = ''
    for message in reversed(messages):
        if message.get('role') == 'user':
            last_user = message.get('content', '')
            break

    memory = _read_memory()
    conversations = memory.get('conversations', [])
    if last_user:
        conversations.append({'role': 'user', 'content': last_user, 'ts': datetime.utcnow().isoformat()})
        memory['conversations'] = conversations
        try:
            atomic_write_json(MEMORY_FILE, memory)
        except Exception as exc:
            logger.warning('Failed to persist memory: %s', exc)

    if last_user and 'what did i tell' in last_user.lower():
        recalled = ' '.join([c['content'] for c in conversations if c.get('role') == 'user'][-5:])
        reply_text = f'I recall: {recalled}' if recalled else 'I do not recall anything yet.'
    elif last_user and last_user.lower().strip() in {'hi', 'hello', 'hey'}:
        reply_text = 'Hello! How can I assist you?'
    elif last_user:
        reply_text = f'[User Mode] Echo: {last_user}'
    else:
        reply_text = '[User Mode] Hello from qmoi_local_server'

    response = {
        'id': 'local-1',
        'object': 'chat.completion',
        'choices': [
            {'index': 0, 'message': {'role': 'assistant', 'content': reply_text}}
        ],
        'usage': {'prompt_tokens': 0, 'completion_tokens': 0, 'total_tokens': 0}
    }
    return jsonify(response)


@APP.route('/sync/push', methods=['POST', 'OPTIONS'])
def sync_push() -> Any:
    if request.method == 'OPTIONS':
        return _ok_options()
    auth_response = _check_sync_auth()
    if auth_response is not None:
        return auth_response

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return make_response(jsonify({'error': 'invalid payload'}), 400)

    try:
        atomic_write_json(MEMORY_FILE, data)
    except Exception as exc:
        return make_response(jsonify({'error': 'failed to save', 'details': str(exc)}), 500)
    return jsonify({'ok': True})


@APP.route('/sync/pull', methods=['GET', 'OPTIONS'])
def sync_pull() -> Any:
    if request.method == 'OPTIONS':
        return _ok_options()
    auth_response = _check_sync_auth()
    if auth_response is not None:
        return auth_response
    return jsonify(_read_memory())


@APP.route('/health', methods=['GET', 'OPTIONS'])
def health() -> Any:
    if request.method == 'OPTIONS':
        return _ok_options()
    return jsonify({'status': 'ok', 'model': 'qmoi'})


@APP.route('/memory', methods=['GET'])
def memory() -> Any:
    return jsonify(_read_memory())


if __name__ == '__main__':
    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:


        result = None



    except Exception as e:


        logger.error(f"Error: {e}")


        result = None        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:


        result = None



    except Exception as e:


        logger.error(f"Error: {e}")


        result = None        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    port = int(os.environ.get('QMOI_LOCAL_PORT', '8081'))
    host = os.environ.get('QMOI_LOCAL_HOST', '0.0.0.0')
    APP.run(host=host, port=port)
