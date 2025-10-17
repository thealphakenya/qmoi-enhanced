"""QMOI Secret Manager

Provides simple encryption/decryption helpers for storing secrets encrypted on disk
and retrieving them using a master key stored in the OS keyring or an environment variable.

Backends (in order):
 - OS keyring (service: qmoi_master, username: master-key)
 - Environment variable QMOI_MASTER_KEY (base64 urlsafe)

Note: This helper is intentionally minimal. For production, integrate with a cloud
secret manager (AWS/GCP/Azure) and rotate keys regularly.
"""
import os
import base64
import json
from pathlib import Path
from typing import Optional

try:
    import keyring
except Exception:
    keyring = None

try:
    from cryptography.fernet import Fernet
except Exception:
    Fernet = None


MASTER_KEY_SERVICE = "qmoi_master"
MASTER_KEY_USERNAME = "master-key"


def _get_master_key_from_keyring() -> Optional[bytes]:
    if keyring is None:
        return None
    try:
        val = keyring.get_password(MASTER_KEY_SERVICE, MASTER_KEY_USERNAME)
        if val:
            return base64.urlsafe_b64decode(val.encode())
    except Exception:
        return None
    return None


def _get_master_key_from_env() -> Optional[bytes]:
    v = os.getenv("QMOI_MASTER_KEY")
    if not v:
        return None
    try:
        return base64.urlsafe_b64decode(v.encode())
    except Exception:
        return None


def get_master_key() -> Optional[bytes]:
    # prefer keyring
    m = _get_master_key_from_keyring()
    if m:
        return m
    return _get_master_key_from_env()


def generate_master_key() -> bytes:
    if Fernet is None:
        raise RuntimeError("cryptography.fernet not available")
    return Fernet.generate_key()


def store_master_key_in_keyring(key: bytes) -> bool:
    if keyring is None:
        return False
    try:
        keyring.set_password(MASTER_KEY_SERVICE, MASTER_KEY_USERNAME, key.decode())
        return True
    except Exception:
        return False


def encrypt_secret(secret: str, out_path: str) -> None:
    """Encrypt secret (utf-8) and write to out_path (binary)"""
    key = get_master_key()
    if key is None:
        raise RuntimeError("No master key available. Run bootstrap to generate and store master key.")
    if Fernet is None:
        raise RuntimeError("cryptography package not available")
    f = Fernet(key)
    token = secret.encode("utf-8")
    enc = f.encrypt(token)
    p = Path(out_path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "wb") as fh:
        fh.write(enc)


def decrypt_secret_file(enc_path: str) -> Optional[str]:
    """Decrypt an encrypted file created by encrypt_secret and return the secret string."""
    key = get_master_key()
    if key is None:
        return None
    if Fernet is None:
        return None
    p = Path(enc_path)
    if not p.exists():
        return None
    try:
        with open(p, "rb") as fh:
            data = fh.read()
        f = Fernet(key)
        dec = f.decrypt(data)
        return dec.decode("utf-8")
    except Exception:
        return None


def decrypt_secret_if_present(enc_path: str) -> Optional[str]:
    # convenience wrapper
    return decrypt_secret_file(enc_path)


def encrypt_named_secret(secret: str, name: str, out_dir: str = ".qmoi") -> str:
    """Encrypt a named secret and write it to .qmoi/{name}_token.enc. Returns path."""
    out = Path(out_dir) / f"{name}_token.enc"
    encrypt_secret(secret, str(out))
    return str(out)


def get_named_secret(name: str, out_dir: str = ".qmoi") -> Optional[str]:
    """Retrieve a named secret using the same priority as get_master_key:
    - encrypted file .qmoi/{name}_token.enc (preferred)
    - environment variable QMOI_{NAME}_TOKEN
    Returns the secret string or None.
    """
    enc = Path(out_dir) / f"{name}_token.enc"
    if enc.exists():
        v = decrypt_secret_if_present(str(enc))
        if v:
            return v

    envname = f"QMOI_{name.upper()}_TOKEN"
    v = os.getenv(envname)
    if v:
        return v

    return None
