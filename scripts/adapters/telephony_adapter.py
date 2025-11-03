"""scripts/adapters/telephony_adapter.py

Gated telephony adapter (safe-by-default).

Behavior:
- All attempts are logged to .qmoi_validation/adapters/telephony.log as JSON-lines.
- By default the adapter runs in dry-run mode and records the proposed action.
- To enable provider calls set these environment variables:
  - TELEPHONY_ENABLED=true
  - PRODUCTION_CONFIRMED=true
  - QMOI_ALLOW_NETWORK=true
  - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM

If Twilio's Python SDK is not installed, the adapter will return an error advising how to install it.
"""

from __future__ import annotations

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional

ROOT = Path(__file__).resolve().parents[1]
AUDIT_DIR = ROOT / '.qmoi_validation' / 'adapters'
AUDIT_DIR.mkdir(parents=True, exist_ok=True)
CALL_LOG = AUDIT_DIR / 'telephony.log'


def _write_audit(entry: Dict) -> None:
    try:
        # append JSON-line for auditability
        with open(CALL_LOG, 'a', encoding='utf-8') as f:
            f.write(json.dumps(entry, default=str) + "\n")
    except Exception:
        # keep adapter safe: don't crash callers if audit write fails
        pass


def _redact_env(key: str) -> str:
    v = os.environ.get(key)
    if not v:
        return ''
    if len(v) <= 8:
        return 'REDACTED'
    return v[:4] + '...' + v[-4:]


def place_call(number: str, message: str, metadata: Optional[Dict] = None) -> Dict:
    """Place a call or send SMS via configured provider.

    Returns a dict with keys: ok(bool), dry_run(bool), detail/message, and audit entry.
    """
    metadata = metadata or {}
    ts = datetime.utcnow().isoformat() + 'Z'
    entry = {
        'ts': ts,
        'number': number,
        'message_snippet': (message or '')[:1024],
        'metadata': metadata,
    }

    enabled = os.environ.get('TELEPHONY_ENABLED', '').lower() == 'true'
    production = os.environ.get('PRODUCTION_CONFIRMED', '').lower() == 'true'
    allow_network = os.environ.get('QMOI_ALLOW_NETWORK', '').lower() == 'true'

    sid = os.environ.get('TWILIO_ACCOUNT_SID')
    token = os.environ.get('TWILIO_AUTH_TOKEN')
    twilio_from = os.environ.get('TWILIO_FROM')
    call_type = os.environ.get('TELEPHONY_CALL_TYPE', 'sms').lower()  # sms or voice

    production_ready = enabled and production and allow_network and sid and token and twilio_from

    if production_ready:
        # attempt provider call using Twilio if available
        try:
            try:
                from twilio.rest import Client  # type: ignore
            except Exception as e:  # pragma: no cover - runtime environment may not have twilio
                entry.update({'status': 'error', 'error': 'twilio-sdk-missing', 'note': 'pip install twilio'})
                _write_audit(entry)
                return {'ok': False, 'dry_run': False, 'error': 'twilio-sdk-missing', 'hint': 'pip install twilio', 'entry': entry}

            client = Client(sid, token)
            if call_type == 'voice':
                # Twilio voice call requires a TwiML URL or TwiML body; we use Messages as fallback
                # For full voice support, set TELEPHONY_VOICE_URL to a publicly reachable TwiML URL.
                voice_url = os.environ.get('TELEPHONY_VOICE_URL')
                if not voice_url:
                    # fallback to SMS if no voice URL
                    resp = client.messages.create(body=message, from_=twilio_from, to=number)
                    entry.update({'status': 'provider_sms_fallback', 'provider_sid': getattr(resp, 'sid', None)})
                else:
                    resp = client.calls.create(url=voice_url, to=number, from_=twilio_from)
                    entry.update({'status': 'provider_voice', 'provider_sid': getattr(resp, 'sid', None)})
            else:
                resp = client.messages.create(body=message, from_=twilio_from, to=number)
                entry.update({'status': 'provider_sms', 'provider_sid': getattr(resp, 'sid', None)})

            # redact sensitive envs in the audit entry
            entry['env_snapshot'] = {
                'TWILIO_ACCOUNT_SID': _redact_env('TWILIO_ACCOUNT_SID'),
                'TWILIO_FROM': _redact_env('TWILIO_FROM'),
            }
            _write_audit(entry)
            return {'ok': True, 'dry_run': False, 'detail': 'provider_called', 'entry': entry}
        except Exception as e:  # capture provider errors
            entry.update({'status': 'error', 'error': str(e)})
            _write_audit(entry)
            return {'ok': False, 'dry_run': False, 'error': str(e), 'entry': entry}

    # Default dry-run behaviour
    entry.update({'status': 'dry_run', 'note': 'Telephony dry-run: gating or credentials missing'})
    # include reasons (redacted)
    entry['gating'] = {
        'TELEPHONY_ENABLED': os.environ.get('TELEPHONY_ENABLED', ''),
        'PRODUCTION_CONFIRMED': os.environ.get('PRODUCTION_CONFIRMED', ''),
        'QMOI_ALLOW_NETWORK': os.environ.get('QMOI_ALLOW_NETWORK', ''),
        'TWILIO_ACCOUNT_SID': _redact_env('TWILIO_ACCOUNT_SID'),
    }
    _write_audit(entry)
    return {'ok': True, 'dry_run': True, 'detail': 'logged', 'entry': entry}
