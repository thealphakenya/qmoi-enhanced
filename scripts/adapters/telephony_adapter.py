#!/usr/bin/env python3
"""
        Telephony adapter: centralises telephony/call interactions in a safe, gated way.

        Behavior:
        - Logs all call attempts to `.qmoi_validation/calls.log`.
        - Only attempts network/provider calls when TELEPHONY_ENABLED=true and TELEPHONY_TOKEN
            and PRODUCTION_CONFIRMED=true are set. Otherwise acts as dry-run and returns a
            dry-run success object for testing.
"""
import os
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
LOG_DIR = ROOT / '.qmoi_validation'
LOG_DIR.mkdir(parents=True, exist_ok=True)
CALLS_LOG = LOG_DIR / 'calls.log'


def _append_log(obj: dict):
    try:
        with open(CALLS_LOG, 'a', encoding='utf-8') as f:
            f.write(json.dumps(obj, default=str) + "\n")
    except Exception:
        pass


def make_call(number: str, message: str, metadata: dict = None) -> dict:
    ts = datetime.utcnow().isoformat() + 'Z'
    entry = {'ts': ts, 'number': number, 'message': message, 'metadata': metadata or {}}
    enabled = os.environ.get('TELEPHONY_ENABLED', '').lower() == 'true'
    token = os.environ.get('TELEPHONY_TOKEN')
    production = os.environ.get('PRODUCTION_CONFIRMED', '').lower() == 'true'

    # Only attempt provider calls when explicitly enabled and in production mode.
    if enabled and token and production:
        try:
            # Provider-specific implementation goes here (twilio, etc.)
            # For now we log the attempt and return a minimal success object.
            entry.update({'status': 'provider_called', 'note': 'provider integration pending'})
            _append_log(entry)
            return {'ok': True, 'detail': 'provider_called', 'entry': entry}
        except Exception as e:
            entry.update({'status': 'error', 'error': str(e)})
            _append_log(entry)
            return {'ok': False, 'error': str(e), 'entry': entry}

    # Dry-run behaviour: log and return dry-run success
    entry.update({'status': 'dry_run', 'note': 'telephony not enabled or gating not present'})
    _append_log(entry)
    return {'ok': True, 'detail': 'dry_run', 'entry': entry}
