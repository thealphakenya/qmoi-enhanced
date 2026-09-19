"""Integration tests for qmoi_control_server

This script provides pytest-compatible tests that exercise the main
authentication and memory-sync flows using the Flask test_client so they
can be run in CI or locally with `pytest`.

Tests included:
- signup -> login -> sync-memory -> get memories -> logout -> verify revoked
- control endpoint check using CONTROL_TOKEN

The tests use the repository-local SQLite database (qmoi.db). For a clean
run the database file is removed at test startup.
"""
import os
import json
import sqlite3
import time

import pytest
import sys
from pathlib import Path

# Ensure repository root is on sys.path so qmoi_control_server can be imported
repo_root = Path(__file__).resolve().parents[1]
if str(repo_root) not in sys.path:
	sys.path.insert(0, str(repo_root))

import qmoi_control_server as server


DB_FILE = server.DB_FILE
CONTROL_TOKEN = os.environ.get('QMOI_CONTROL_TOKEN', 'dev-token')


def remove_db_if_exists():
	try:
		if DB_FILE.exists():
			DB_FILE.unlink()
	except Exception:
		pass


@pytest.fixture(scope='module')
def client():
	# ensure a clean DB for integration test
	remove_db_if_exists()
	# create DB and run migrations
	server.ensure_db_and_migrate()
	app = server.app
	app.config['TESTING'] = True
	with app.test_client() as c:
		yield c


def _decode_token(resp_json):
	tok = resp_json.get('token')
	if isinstance(tok, bytes):
		try:
			tok = tok.decode('utf-8')
		except Exception:
			tok = tok
	return tok


def test_signup_login_and_memory_flow(client):
	username = f'test_user_{int(time.time())}'
	password = 'test-pass-123'

	# Signup
	r = client.post('/signup', json={'username': username, 'password': password})
	assert r.status_code == 200
	j = r.get_json()
	assert j.get('status') == 'ok'

	# Login
	r = client.post('/login', json={'username': username, 'password': password})
	assert r.status_code == 200
	j = r.get_json()
	assert j.get('status') == 'ok'
	token = _decode_token(j)
	assert token

	auth_header = {'Authorization': f'Bearer {token}'}

	# Sync memory with a q.ki entry and another custom memory
	memories = [
		{'key': 'q.ki', 'value': {'node': 'alpha', 'sync': True}, 'type': 'pref'},
		{'key': 'note', 'value': {'text': 'hello world'}, 'type': 'text'}
	]
	r = client.post('/sync-memory', json={'memories': memories}, headers=auth_header)
	assert r.status_code == 200
	j = r.get_json()
	assert j.get('status') == 'ok'

	# Get memories
	r = client.get('/memories', headers=auth_header)
	assert r.status_code == 200
	j = r.get_json()
	assert j.get('status') == 'ok'
	mems = j.get('memories', [])
	# q.ki preference must be preserved; other memories may be merged depending on merge logic
	keys = {m.get('key') for m in mems}
	assert 'q.ki' in keys

	# Use AI endpoint (authorized)
	r = client.post('/ai', json={'prompt': 'Say hi'}, headers=auth_header)
	assert r.status_code == 200
	j = r.get_json()
	assert j.get('status') == 'ok'

	# Logout -> token should be revoked
	r = client.post('/logout', headers=auth_header)
	assert r.status_code == 200
	j = r.get_json()
	assert j.get('status') == 'ok'

	# After logout, token must be rejected
	r = client.get('/memories', headers=auth_header)
	assert r.status_code == 401 or (r.get_json() and r.get_json().get('reason') == 'unauthorized')


def test_control_endpoint_with_control_token(client):
	# control endpoint requires CONTROL_TOKEN in Authorization or X-API-KEY
	headers = {'Authorization': f'Bearer {CONTROL_TOKEN}'}
	r = client.post('/control', json={'command': 'navigate', 'target': '/test'}, headers=headers)
	assert r.status_code == 200
	j = r.get_json()
	assert j.get('status') == 'ok'
	assert j.get('action') == 'navigate'

