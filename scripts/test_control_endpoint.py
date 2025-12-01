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
