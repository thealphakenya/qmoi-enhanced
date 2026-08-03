#!/usr/bin/env python3
"""Lightweight backend API to simulate QMOI AI chat responses for local testing.
Run: python3 scripts/qmoi_ai_api.py
Listens on port 8000
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    message = data.get('message', '')
    model = data.get('model', 'Auto')
    # Simulate processing
    time.sleep(0.6)
    reply = f"QMOI AI ({model}): Received: '{message}'. This is a simulated response from the local API."
    return jsonify({
        'ok': True,
        'reply': reply,
    })

if __name__ == '__main__':
    import logging
    logging.basicConfig(level=logging.INFO)
    print('Starting QMOI AI local API on http://0.0.0.0:8000')
    app.run(host='0.0.0.0', port=8000)
#!/usr/bin/env python3
"""Lightweight backend API to simulate QMOI AI chat responses for local testing.
Run: python3 scripts/qmoi_ai_api.py
Listens on port 8000
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    message = data.get('message', '')
    model = data.get('model', 'Auto')
    # Simulate processing
    time.sleep(0.6)
    reply = f"QMOI AI ({model}): Received: '{message}'. This is a simulated response from the local API."
    return jsonify({
        'ok': True,
        'reply': reply,
    })

if __name__ == '__main__':
    import logging
    logging.basicConfig(level=logging.INFO)
    print('Starting QMOI AI local API on http://0.0.0.0:8000')
    app.run(host='0.0.0.0', port=8000)
