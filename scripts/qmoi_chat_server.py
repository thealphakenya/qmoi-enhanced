#!/usr/bin/env python3
"""
Simple local QMOI-compatible chat server for testing personas and persistent memory.
- POST /v1/chat/completions
  JSON fields accepted: model, role, messages
- Persists memory to `qmoi_memory.json` in repo root.

This is a lightweight test server (not production). It simulates role-based replies.
"""

import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse
from datetime import datetime

PORT = int(os.environ.get('QMOI_CHAT_PORT', 8080))
MEMORY_FILE = os.path.join(os.path.dirname(__file__), '..', 'qmoi_memory.json')
MEMORY_FILE = os.path.abspath(MEMORY_FILE)

PERSONAS = {
    'master': {
        'tone': 'formal, concise, action-oriented',
        'prefix': 'Master, acknowledging: '
    },
    'sister': {
        'tone': 'friendly, warm, conversational',
        'prefix': 'Hey there — '
    },
    'user': {
        'tone': 'helpful, clear',
        'prefix': ''
    }
}


def load_memory():
    if not os.path.exists(MEMORY_FILE):
        return {'conversations': []}
    try:
        with open(MEMORY_FILE, 'r') as f:
            return json.load(f)
    except Exception:
        return {'conversations': []}


def save_memory(mem):
    os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
    with open(MEMORY_FILE, 'w') as f:
        json.dump(mem, f, indent=2)


class Handler(BaseHTTPRequestHandler):
    def _set_json(self, code=200):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != '/v1/chat/completions':
            self._set_json(404)
            self.wfile.write(json.dumps({'error': 'Not Found'}).encode())
            return

        length = int(self.headers.get('Content-Length', 0))
        raw = self.rfile.read(length).decode('utf-8')
        try:
            payload = json.loads(raw)
        except Exception as e:
            self._set_json(400)
            self.wfile.write(json.dumps({'error': 'Invalid JSON', 'detail': str(e)}).encode())
            return

        role_header = self.headers.get('X-QMOI-ROLE')
        role = payload.get('role') or role_header or 'user'
        role = role.lower()
        model = payload.get('model', 'qmoi')
        messages = payload.get('messages', [])

        # Load memory, append conversation
        memory = load_memory()
        timestamp = datetime.utcnow().isoformat() + 'Z'

        # Build a short simulated reply based on persona and last user message
        last_user = None
        if messages:
            for m in reversed(messages):
                if m.get('role') == 'user':
                    last_user = m.get('content')
                    break
            if not last_user:
                last_user = messages[-1].get('content')

        persona = PERSONAS.get(role, PERSONAS['user'])
        prefix = persona.get('prefix', '')
        tone = persona.get('tone', '')

        reply_text = prefix + (f"I received your message: '{last_user}'. " if last_user else "Hello.")
        reply_text += f"(tone: {tone}; model: {model})"

        # Append to memory with role tag
        conv_entry = {
            'timestamp': timestamp,
            'role': role,
            'model': model,
            'messages': messages,
            'reply': reply_text
        }
        memory.setdefault('conversations', []).append(conv_entry)
        save_memory(memory)

        response = {
            'id': f'local-{int(datetime.utcnow().timestamp())}',
            'object': 'chat.completion',
            'created': int(datetime.utcnow().timestamp()),
            'model': model,
            'choices': [
                {
                    'index': 0,
                    'message': {
                        'role': 'assistant',
                        'content': reply_text
                    },
                    'finish_reason': 'stop'
                }
            ],
            'usage': {
                'prompt_tokens': 0,
                'completion_tokens': 0,
                'total_tokens': 0
            }
        }

        self._set_json(200)
        self.wfile.write(json.dumps(response).encode())

    def log_message(self, format, *args):
        # keep logs minimal
        return


def run(server_class=HTTPServer, handler_class=Handler):
    server_address = ('', PORT)
    httpd = server_class(server_address, handler_class)
    print(f"QMOI test chat server running on http://localhost:{PORT}/v1/chat/completions")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('Stopping server')


if __name__ == '__main__':
    run()
