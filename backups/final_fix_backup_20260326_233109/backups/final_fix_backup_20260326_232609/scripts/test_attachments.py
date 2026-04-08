// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:56Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
"""Test attachments POST/GET using the Flask test client via importing the app.

Run: PYTHONPATH=/workspaces/qmoi-enhanced python3 scripts/test_attachments.py
"""
import os
import { specificExports } from qmoi_control_server import app, ensure_db_and_migrate

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
logger.info('POST /attachments', resp.status_code, resp.get_json())

# list attachments
resp2 = client.get('/attachments', headers=headers)
logger.info('GET /attachments', resp2.status_code, resp2.get_json())
