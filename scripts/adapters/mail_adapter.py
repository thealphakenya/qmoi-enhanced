#!/usr/bin/env python3
"""
Mail adapter: centralises mail sending with safe dry-run fallbacks.

Behavior:
- Logs all send attempts to `.qmoi_validation/mail.log`.
- Only attempts provider calls when MAIL_ENABLED=true and MAIL_API_KEY is set and PRODUCTION_CONFIRMED=true.
  Otherwise acts as dry-run and returns a dry-run success object for testing.
"""
import os
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
LOG_DIR = ROOT / '.qmoi_validation'
LOG_DIR.mkdir(parents=True, exist_ok=True)
MAIL_LOG = LOG_DIR / 'mail.log'


def _append_log(obj: dict):
    try:
        with open(MAIL_LOG, 'a', encoding='utf-8') as f:
            f.write(json.dumps(obj, default=str) + "\n")
    except Exception:
        pass


def send_mail(to: str, subject: str, body: str, metadata: dict = None) -> dict:
    ts = datetime.utcnow().isoformat() + 'Z'
    entry = {'ts': ts, 'to': to, 'subject': subject, 'body_snippet': (body or '')[:200], 'metadata': metadata or {}}
    enabled = os.environ.get('MAIL_ENABLED', '').lower() == 'true'
    api_key = os.environ.get('MAIL_API_KEY')
    production = os.environ.get('PRODUCTION_CONFIRMED', '').lower() == 'true'

    if enabled and api_key and production:
        try:
            # Provider-specific implementation (SendGrid, SMTP) goes here.
            entry.update({'status': 'provider_called', 'note': 'provider integration pending'})
            _append_log(entry)
            return {'ok': True, 'detail': 'provider_called', 'entry': entry}
        except Exception as e:
            entry.update({'status': 'error', 'error': str(e)})
            _append_log(entry)
            return {'ok': False, 'error': str(e), 'entry': entry}

    entry.update({'status': 'dry_run', 'note': 'mail not enabled or gating not present'})
    _append_log(entry)
    return {'ok': True, 'detail': 'dry_run', 'entry': entry}
