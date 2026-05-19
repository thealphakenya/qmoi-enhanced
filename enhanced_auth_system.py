#!/usr/bin/env python3
"""Enhanced authentication system for QMOI."""
import hashlib
import hmac
import json
import logging
import os
import secrets
import sys
import time
from pathlib import Path
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

AUTH_SECRET = os.environ.get('QMOI_AUTH_SECRET', secrets.token_hex(32))


class EnhancedAuthSystem:
    def __init__(self, user_store: Path):
        self.user_store = user_store
        self.user_store.parent.mkdir(parents=True, exist_ok=True)
        if not self.user_store.exists():
            self.user_store.write_text('{}', encoding='utf-8')

    def _load_store(self) -> Dict[str, Dict[str, str]]:
        try:
            return json.loads(self.user_store.read_text(encoding='utf-8'))
        except json.JSONDecodeError:
            logger.warning('User store is invalid JSON, initializing empty store.')
            return {}

    def _save_store(self, data: Dict[str, Any]) -> None:
        self.user_store.write_text(json.dumps(data, indent=2), encoding='utf-8')

    def hash_password(self, password: str, salt: Optional[str] = None) -> str:
        salt = salt or secrets.token_hex(16)
        hashed = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 120000)
        return f'{salt}${hashed.hex()}'

    def verify_password(self, password: str, stored_password: str) -> bool:
        if '$' not in stored_password:
            return False
        salt, expected_hash = stored_password.split('$', 1)
        hashed = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 120000)
        return hmac.compare_digest(hashed.hex(), expected_hash)

    def register_user(self, username: str, password: str) -> None:
        data = self._load_store()
        if username in data:
            raise ValueError('User already exists')
        data[username] = {'password': self.hash_password(password)}
        self._save_store(data)
        logger.info('Registered user: %s', username)

    def authenticate(self, username: str, password: str) -> bool:
        data = self._load_store()
        user = data.get(username)
        if not user:
            return False
        return self.verify_password(password, user['password'])

    def generate_token(self, username: str, ttl_seconds: int = 3600) -> str:
        payload = f'{username}:{int(time.time()) + ttl_seconds}'
        secret = AUTH_SECRET
        signature = hmac.new(secret.encode('utf-8'), payload.encode('utf-8'), hashlib.sha256).hexdigest()
        return f'{payload}:{signature}'

    def verify_token(self, token: str) -> bool:
        try:
            username, expires, signature = token.split(':', 2)
            secret = AUTH_SECRET
            expected = hmac.new(secret.encode('utf-8'), f'{username}:{expires}'.encode('utf-8'), hashlib.sha256).hexdigest()
            if not hmac.compare_digest(expected, signature):
                return False
            return int(expires) >= int(time.time())
        except Exception:
            return False


def main() -> int:
    logger.info('Enhanced auth system loaded. Use register_user and authenticate for password management.')
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except Exception as exc:
        logger.exception('Enhanced auth system failed: %s', exc)
        sys.exit(1)
