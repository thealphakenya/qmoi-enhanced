"""Test attachments POST/GET using the Flask test client via importing the app.

Run: PYTHONPATH=/workspaces/qmoi-enhanced python3 scripts/test_attachments.py
"""
import os
import json
from qmoi_control_server import app, ensure_db_and_migrate

ensure_db_and_migrate()

client = app.test_client()
# create a user and login
client.post('/signup', json={'username':'attuser','password':'pass'})
res = client.post('/login', json={'username':'attuser','password':'pass'})
tok = res.get_json().get('token')
headers = {'Authorization': f'Bearer {tok}'}

# post attachments
payload = {'attachments':[{'name':'hello.txt','size':12,'mime':'text/plain','dataUrlPreview':'data:text/plain;base64,SGVsbG8='}]}
resp = client.post('/attachments', json=payload, headers=headers)
print('POST /attachments', resp.status_code, resp.get_json())

# list attachments
resp2 = client.get('/attachments', headers=headers)
print('GET /attachments', resp2.status_code, resp2.get_json())
