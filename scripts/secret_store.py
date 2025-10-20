#!/usr/bin/env python3
"""Local secret storage helper.

This is intentionally small: it demonstrates encrypt/decrypt of a JSON blob using a key stored in OS keyring (if available).
If keyring is not available, it warns and falls back to plaintext file (not recommended).
"""
import json
from pathlib import Path
import os
try:
    import keyring
except Exception:
    keyring = None
from base64 import b64encode, b64decode
try:
    from Crypto.Cipher import AES
    from Crypto.Random import get_random_bytes
except Exception:
    AES = None
    get_random_bytes = None

STORAGE = Path('.qmoi_secrets')


def _derive_key(secret: str) -> bytes:
    # simple KDF for demo only
    import hashlib
    h = hashlib.sha256(secret.encode('utf-8')).digest()
    return h


def save(obj: dict):
    key = None
    if not AES or not get_random_bytes:
        print('PyCrypto not available; writing plaintext to .qmoi_secrets (insecure)')
        STORAGE.write_text(json.dumps(obj, indent=2))
        return
    if keyring:
        key = keyring.get_password('qmoi', 'master')
    else:
        key = None
    if not key:
        print('No keyring master key found; writing plaintext to .qmoi_secrets (not secure)')
        STORAGE.write_text(json.dumps(obj, indent=2))
        return
    keyb = _derive_key(key)
    iv = get_random_bytes(12)
    cipher = AES.new(keyb, AES.MODE_GCM, nonce=iv)
    data = json.dumps(obj).encode('utf-8')
    ct, tag = cipher.encrypt_and_digest(data)
    STORAGE.write_bytes(iv + tag + ct)
    print('Wrote encrypted secrets to .qmoi_secrets')


def load():
    if not STORAGE.exists():
        return None
    if not AES or not get_random_bytes:
        try:
            return json.loads(STORAGE.read_text())
        except Exception:
            return None
    key = None
    if keyring:
        key = keyring.get_password('qmoi', 'master')
    if not key:
        try:
            return json.loads(STORAGE.read_text())
        except Exception:
            return None
    keyb = _derive_key(key)
    data = STORAGE.read_bytes()
    iv = data[:12]
    tag = data[12:28]
    ct = data[28:]
    cipher = AES.new(keyb, AES.MODE_GCM, nonce=iv)
    pt = cipher.decrypt_and_verify(ct, tag)
    return json.loads(pt.decode('utf-8'))


if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('op', choices=['save','load'])
    p.add_argument('--data', help='JSON string for save')
    args = p.parse_args()
    if args.op == 'save':
        if not args.data:
            print('Provide --data')
        else:
            save(json.loads(args.data))
    else:
        print(load())
#!/usr/bin/env python3
"""Simple local secret store using Fernet symmetric encryption.

This is intentionally minimal and intended to be a helper until you adopt a proper KMS.
It stores an encryption key at ~/.qmoi_key (file permissions 600) and encrypted blobs under .qmoi_secrets/.
"""
import os
from pathlib import Path
try:
    from cryptography.fernet import Fernet
except Exception:
    Fernet = None

HOME = Path.home()
KEYFILE = HOME / '.qmoi_key'
SECRETDIR = Path.cwd() / '.qmoi_secrets'

def ensure_key():
    if Fernet is None:
        raise RuntimeError('cryptography not installed')
    if not KEYFILE.exists():
        key = Fernet.generate_key()
        KEYFILE.write_bytes(key)
        os.chmod(KEYFILE, 0o600)
        return key
    return KEYFILE.read_bytes()

def encrypt(name: str, plaintext: str) -> None:
    key = ensure_key()
    f = Fernet(key)
    ct = f.encrypt(plaintext.encode('utf-8'))
    SECRETDIR.mkdir(exist_ok=True)
    (SECRETDIR / name).write_bytes(ct)

def decrypt(name: str) -> str:
    if Fernet is None:
        raise RuntimeError('cryptography not installed')
    key = ensure_key()
    f = Fernet(key)
    ct = (SECRETDIR / name).read_bytes()
    return f.decrypt(ct).decode('utf-8')

if __name__ == '__main__':
    print('secret_store available; cryptography installed' if Fernet else 'cryptography not available; install cryptography to enable secret store')
