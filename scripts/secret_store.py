#!/usr/bin/env python3
"""Secret store for QMOI.

This module prefers cryptography.Fernet for symmetric encryption.
It stores encrypted blobs under a repository-local `.qmoi/` directory and
stores a per-user key under `~/.qmoi_key` with permissions 600.

If neither Fernet nor pycryptodome are available the module will fall back
to writing a plaintext snapshot under `.qmoi/` but will print a clear warning.
"""
import json
import os
from pathlib import Path
from typing import Optional

try:
    from cryptography.fernet import Fernet
except Exception:
    Fernet = None

try:
    # pycryptodome
    from Crypto.Cipher import AES
    from Crypto.Random import get_random_bytes
except Exception:
    AES = None
    get_random_bytes = None

try:
    import keyring
except Exception:
    keyring = None

ROOT = Path.cwd()
QM_DIR = ROOT / '.qmoi'
QM_DIR.mkdir(exist_ok=True)
KEYFILE = Path.home() / '.qmoi_key'
SNAP_FILE = QM_DIR / 'env_snapshot.bin'
PLAINTEXT_FALLBACK = QM_DIR / 'env_snapshot.json'


def _ensure_keyfile() -> bytes:
    """Return a bytes key. Create one if it does not exist.

    Prefer using an existing keyfile at ~/.qmoi_key. If keyring is available
    a persistent secret can be stored there instead (not implemented here by
    default).
    """
    if KEYFILE.exists():
        return KEYFILE.read_bytes()
    # create a new Fernet-compatible key
    if Fernet is not None:
        key = Fernet.generate_key()
        KEYFILE.write_bytes(key)
        os.chmod(KEYFILE, 0o600)
        return key
    # fallback: make a 32-byte random key
    k = os.urandom(32)
    KEYFILE.write_bytes(k)
    os.chmod(KEYFILE, 0o600)
    return k


def save(mapping: dict) -> None:
    """Save mapping securely to disk under .qmoi/. Uses Fernet if available.

    This overwrites the existing snapshot.
    """
    QM_DIR.mkdir(exist_ok=True)
    if Fernet is not None:
        key = _ensure_keyfile()
        f = Fernet(key)
        ct = f.encrypt(json.dumps(mapping).encode('utf-8'))
        SNAP_FILE.write_bytes(ct)
        # ensure no plaintext fallback remains
        try:
            PLAINTEXT_FALLBACK.unlink()
        except Exception:
            pass
        print(f'Wrote encrypted snapshot to {SNAP_FILE}')
        return

    # Try AES GCM via pycryptodome
    if AES is not None and get_random_bytes is not None:
        key = _ensure_keyfile()
        # ensure key is 32 bytes
        if len(key) < 32:
            key = key.ljust(32, b"0")[:32]
        iv = get_random_bytes(12)
        cipher = AES.new(key, AES.MODE_GCM, nonce=iv)
        data = json.dumps(mapping).encode('utf-8')
        ct, tag = cipher.encrypt_and_digest(data)
        SNAP_FILE.write_bytes(iv + tag + ct)
        try:
            PLAINTEXT_FALLBACK.unlink()
        except Exception:
            pass
        print(f'Wrote AES-GCM encrypted snapshot to {SNAP_FILE}')
        return

    # Last resort: plaintext under .qmoi (still better than repo root)
    QM_DIR.mkdir(exist_ok=True)
    PLAINTEXT_FALLBACK.write_text(json.dumps(mapping, indent=2), encoding='utf-8')
    print(f'cryptography not available; wrote plaintext snapshot to {PLAINTEXT_FALLBACK} (insecure)')


def load() -> Optional[dict]:
    """Load and return the saved mapping, or None if not present/failed."""
    if SNAP_FILE.exists():
        if Fernet is not None:
            try:
                key = _ensure_keyfile()
                f = Fernet(key)
                pt = f.decrypt(SNAP_FILE.read_bytes())
                return json.loads(pt.decode('utf-8'))
            except Exception:
                return None
        if AES is not None and get_random_bytes is not None:
            try:
                key = _ensure_keyfile()
                data = SNAP_FILE.read_bytes()
                iv = data[:12]
                tag = data[12:28]
                ct = data[28:]
                cipher = AES.new(key[:32], AES.MODE_GCM, nonce=iv)
                pt = cipher.decrypt_and_verify(ct, tag)
                return json.loads(pt.decode('utf-8'))
            except Exception:
                return None
    if PLAINTEXT_FALLBACK.exists():
        try:
            return json.loads(PLAINTEXT_FALLBACK.read_text(encoding='utf-8'))
        except Exception:
            return None
    return None


if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('op', choices=['save', 'load'])
    p.add_argument('--data', help='JSON string for save')
    args = p.parse_args()
    if args.op == 'save':
        if not args.data:
            print('Provide --data')
        else:
            save(json.loads(args.data))
    else:
        print(load())
