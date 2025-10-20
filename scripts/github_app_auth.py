#!/usr/bin/env python3
"""Example: generate GitHub App JWT and exchange for installation token.

This script expects the private key PEM in env var QMOI_APP_PRIVATE_KEY or in a file path provided.
It prints the installation token to stdout.
"""
import os
import time
import jwt
import requests

APP_ID = os.environ.get('QMOI_APP_ID')
PRIVATE_KEY = os.environ.get('QMOI_APP_PRIVATE_KEY')
INSTALLATION_ID = os.environ.get('QMOI_INSTALLATION_ID')

if not APP_ID or not PRIVATE_KEY or not INSTALLATION_ID:
    print('Set QMOI_APP_ID, QMOI_APP_PRIVATE_KEY, QMOI_INSTALLATION_ID')
    raise SystemExit(2)

now = int(time.time())
payload = {
    'iat': now - 60,
    'exp': now + (9 * 60),
    'iss': APP_ID
}
encoded = jwt.encode(payload, PRIVATE_KEY, algorithm='RS256')

headers = {'Authorization': f'Bearer {encoded}', 'Accept': 'application/vnd.github+json'}
resp = requests.post(f'https://api.github.com/app/installations/{INSTALLATION_ID}/access_tokens', headers=headers)
resp.raise_for_status()
token = resp.json().get('token')
print(token)
