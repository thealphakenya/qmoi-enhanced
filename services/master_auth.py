"""Simple master-auth scaffold for QMOI chat-driven approvals.

This module intentionally uses a conservative, auditable approach:
- Requires `QMOI_ADMIN_TOKEN` env var for master identification.
- Records master actions to `.qmoi/master_actions.log` with timestamps.
- Provides a `confirm_master_action` hook that should be wired to human review
  or cryptographic verification in production.
"""
import os
import time
import json
from typing import Dict, Any


ADMIN_TOKEN = os.environ.get("QMOI_ADMIN_TOKEN")


def is_master_token(token: str) -> bool:
    if not ADMIN_TOKEN:
        return False
    return token == ADMIN_TOKEN


def record_action(action: Dict[str, Any], source: str = "chat") -> None:
    os.makedirs(".qmoi", exist_ok=True)
    path = ".qmoi/master_actions.log"
    entry = {"ts": int(time.time()), "source": source, "action": action}
    with open(path, "a+") as f:
        f.write(json.dumps(entry) + "\n")


def confirm_master_action(action: Dict[str, Any], token: str) -> bool:
    """Confirm and record a master action. Returns True when accepted.

    NOTE: This is a convenience scaffold. Replace with cryptographic signature
    verification or external IAM in production.
    """
    if not is_master_token(token):
        return False
    # record and accept
    record_action(action)
    return True


if __name__ == "__main__":
    print("QMOI master auth scaffold. ADMIN_TOKEN present:" , bool(ADMIN_TOKEN))
"""Master authentication helpers for QMOI chat-driven actions.

This module provides a small helper to determine whether a given chat instruction
is authorized by the 'master'. It uses environment-based ADMIN_TOKEN and
optionally signed commands. For a production setup, integrate with proper
signatures, HSM keys, or an IAM service.
"""
import os
import json
from pathlib import Path
from typing import Tuple

ADMIN_TOKEN_ENV = 'QMOI_ADMIN_TOKEN'
MASTER_LOG = Path('.qmoi') / 'master_actions.log'

def _ensure_master_log():
    if not MASTER_LOG.parent.exists():
        MASTER_LOG.parent.mkdir(parents=True, exist_ok=True)
    if not MASTER_LOG.exists():
        MASTER_LOG.write_text('[]')

def is_master_authorized(message: str, provided_token: str = None) -> Tuple[bool, str]:
    """Return (authorized, reason).

    Strategy (scaffold):
    - If message contains the admin token (dangerous but explicit) accept.
    - If provided_token matches ADMIN_TOKEN_ENV accept.
    - If message starts with 'MASTER:' accept if env token present in system (convenience for operators).
    - Otherwise deny.
    """
    env_token = os.environ.get(ADMIN_TOKEN_ENV)
    if provided_token and env_token and provided_token == env_token:
        return True, 'provided_token_match'
    if env_token and env_token in message:
        return True, 'token_in_message'
    if message.strip().upper().startswith('MASTER:') and env_token:
        return True, 'master_prefix_and_env'
    return False, 'not_authorized'

def record_master_action(message: str, actor: str = 'chat') -> None:
    _ensure_master_log()
    try:
        data = json.loads(MASTER_LOG.read_text())
    except Exception:
        data = []
    entry = {
        'ts': __import__('datetime').datetime.utcnow().isoformat() + 'Z',
        'actor': actor,
        'message': message
    }
    data.append(entry)
    MASTER_LOG.write_text(json.dumps(data, indent=2))
