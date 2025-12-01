#!/usr/bin/env python3
"""Simple script to test /control endpoint on `qmoi_control_server.py`.
Usage: python3 scripts/test_control_endpoint.py
"""
import os
import sys
import requests
import json

CONTROL_URL = os.environ.get('QMOI_CONTROL_URL', 'http://127.0.0.1:8100/control')
TOKEN = os.environ.get('QMOI_CONTROL_TOKEN', 'dev-token')

def main():
    payload = {'command': 'navigate', 'target': '/apps/qmoi'}
    headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'}
    try:
        r = requests.post(CONTROL_URL, headers=headers, json=payload, timeout=10)
        print('Status:', r.status_code)
        try:
            print('Response:', json.dumps(r.json(), indent=2))
        except Exception:
            print('Raw response:', r.text)
        if r.status_code == 200:
            print('✅ Control endpoint accepted the request')
            sys.exit(0)
        else:
            print('❌ Control endpoint rejected the request')
            sys.exit(2)
    except Exception as e:
        print('Error contacting control endpoint:', e)
        sys.exit(3)

if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""Simple test to call the /control endpoint on the control server using the dev token."""
import os
import sys
import json
import requests

url = os.environ.get('QMOI_CONTROL_URL', 'http://localhost:8100/control')
token = os.environ.get('QMOI_CONTROL_TOKEN', 'dev-token')

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json',
}

payload = {
    'command': 'navigate',
    'target': '/apps/qmoi'
}

def main():
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=10)
        print('Status:', resp.status_code)
        try:
            print(json.dumps(resp.json(), indent=2))
        except Exception:
            print(resp.text)
    except Exception as e:
        print('Request failed:', e)
        sys.exit(1)

if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""
Quick test script to call the control endpoint with the default dev token.
"""
import os
import requests

def test_control(host='http://localhost', port=8100):
    url = f"{host}:{port}/control"
    token = os.environ.get('QMOI_CONTROL_TOKEN', 'dev-token')
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    payload = {'command': 'navigate', 'target': '/apps/qmoi'}
    try:
        r = requests.post(url, json=payload, headers=headers, timeout=5)
        print('Status:', r.status_code)
        print('Response:', r.text)
    except Exception as e:
        print('Failed to contact control endpoint:', e)

if __name__ == '__main__':
    test_control()
