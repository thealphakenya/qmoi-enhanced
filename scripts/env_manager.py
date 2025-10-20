#!/usr/bin/env python3
"""Ensure .env exists for the workspace. Priority:
- If .env exists, do nothing.
- Else if .qmoi/secrets.env exists, copy to .env
- Else if .qmoi/secrets.enc exists and QMOI_SECRETPASS provided, attempt to decrypt to .qmoi/secrets.env and copy.
- Else if .env.example exists, copy that to .env (and warn).
"""
from pathlib import Path
import os
import shutil
import subprocess
ROOT = Path(__file__).resolve().parents[1]
ENV = ROOT / '.env'
ENC = ROOT / '.qmoi' / 'secrets.enc'
SECRETS_PLAIN = ROOT / '.qmoi' / 'secrets.env'
EXAMPLE = ROOT / '.env.example'

def ensure_env():
    if ENV.exists():
        print('.env already exists; leaving intact')
        return
    # if plaintext secrets exist
    if SECRETS_PLAIN.exists():
        shutil.copy(SECRETS_PLAIN, ENV)
        print('Created .env from .qmoi/secrets.env')
        return
    # try decrypt
    if ENC.exists():
        pw = os.environ.get('QMOI_SECRETPASS')
        if not pw:
            print('Found encrypted secrets at .qmoi/secrets.enc but QMOI_SECRETPASS not set; cannot decrypt automatically')
        else:
            subprocess.check_call(['openssl','enc','-d','-aes-256-cbc','-pbkdf2','-in',str(ENC),'-out',str(SECRETS_PLAIN),'-k',pw])
            shutil.copy(SECRETS_PLAIN, ENV)
            print('Decrypted and created .env from .qmoi/secrets.enc')
            return
    # fallback to example
    if EXAMPLE.exists():
        shutil.copy(EXAMPLE, ENV)
        print('Copied .env from .env.example (example values).')
        return
    print('No .env found and no secrets available. Please provide environment variables.')

if __name__ == '__main__':
    ensure_env()
