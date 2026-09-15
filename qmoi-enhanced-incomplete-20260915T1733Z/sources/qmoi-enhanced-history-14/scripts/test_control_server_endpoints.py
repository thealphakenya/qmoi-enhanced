#!/usr/bin/env python3
"""
Lightweight integration test for qmoi_control_server.py using Flask test client.
Runs a sequence of requests to verify endpoints behave as expected in the dev environment.
"""
import json
import sys
sys.path.insert(0, '.')
from qmoi_control_server import app, CONTROL_TOKEN


def pretty(o):
    try:
        return json.dumps(o, indent=2, sort_keys=True)
    except Exception:
        return str(o)


def run_tests():
    results = []
    with app.test_client() as c:
        # Health
        r = c.get('/health')
        results.append(('/health', r.status_code, r.get_json()))

        # Signup
        r = c.post('/signup', json={'username': 'integ_user', 'password': 'pass'})
        try:
            results.append(('/signup', r.status_code, r.get_json()))
        except Exception:
            results.append(('/signup', r.status_code, r.get_data(as_text=True)))

        # Duplicate signup
        r2 = c.post('/signup', json={'username': 'integ_user', 'password': 'pass'})
        try:
            results.append(('/signup duplicate', r2.status_code, r2.get_json()))
        except Exception:
            results.append(('/signup duplicate', r2.status_code, r2.get_data(as_text=True)))

        # Login
        r = c.post('/login', json={'username': 'integ_user', 'password': 'pass'})
        login_json = None
        try:
            login_json = r.get_json()
        except Exception:
            login_json = None
        results.append(('/login', r.status_code, login_json))
        token = None
        if login_json and login_json.get('token'):
            token = login_json.get('token')

        headers = {'Authorization': f'Bearer {token}'} if token else {}

        # AI endpoint
        r = c.post('/ai', json={'prompt': 'hello'}, headers=headers)
        results.append(('/ai', r.status_code, r.get_json()))

        # Sync memory
        r = c.post('/sync-memory', json={'memories': [{'key':'note','value':'x'}]}, headers=headers)
        results.append(('/sync-memory', r.status_code, r.get_json()))

        # Get memories
        r = c.get('/memories', headers=headers)
        results.append(('/memories', r.status_code, r.get_json()))

        # Control endpoint authorized
        r = c.post('/control', json={'command': 'navigate', 'target': '/apps/qmoi'}, headers={'Authorization': CONTROL_TOKEN})
        results.append(('/control auth', r.status_code, r.get_json()))

        # Control endpoint unauthorized
        r = c.post('/control', json={'command': 'navigate'}, headers={'Authorization': 'wrong'})
        results.append(('/control unauth', r.status_code, r.get_json()))

        # Mirror app
        r = c.get('/mirror/app/q-alpha/')
        ct = r.content_type
        size = len(r.get_data()) if r.get_data() else 0
        results.append(('/mirror/app/q-alpha/', r.status_code, {'content_type': ct, 'size': size}))

        # Mirror raw file
        r = c.get('/mirror/raw/live_qmoi_ngrok_url.txt')
        if r.status_code in (301,302,307,308):
            results.append(('/mirror/raw/live_qmoi_ngrok_url.txt (redirect)', r.status_code, r.headers.get('Location')))
        else:
            results.append(('/mirror/raw/live_qmoi_ngrok_url.txt', r.status_code, r.get_data(as_text=True)))

        # Admin backup DB
        r = c.post('/admin/backup-db', headers={'Authorization': CONTROL_TOKEN})
        try:
            results.append(('/admin/backup-db', r.status_code, r.get_json()))
        except Exception:
            results.append(('/admin/backup-db', r.status_code, r.get_data(as_text=True)))

        # Admin update ngrok (dry-run)
        r = c.post('/admin/update-ngrok', headers={'Authorization': CONTROL_TOKEN}, json={})
        try:
            results.append(('/admin/update-ngrok (dry-run)', r.status_code, r.get_json()))
        except Exception:
            results.append(('/admin/update-ngrok (dry-run)', r.status_code, r.get_data(as_text=True)))

        # Logout
        if token:
            r = c.post('/logout', headers={'Authorization': f'Bearer {token}'})
            results.append(('/logout', r.status_code, r.get_json()))

    # Print results
    print('INTEGRATION TEST RESULTS')
    for ep, status, body in results:
        print('---')
        print(ep)
        print('status:', status)
        print('body:', json.dumps(body, indent=2, sort_keys=True) if isinstance(body, (dict, list)) else str(body))


if __name__ == '__main__':
    run_tests()
