import os
import json
from pathlib import Path
from typing import Optional, Dict

AUDIT_DIR = Path('.qmoi_validation') / 'adapters'
AUDIT_DIR.mkdir(parents=True, exist_ok=True)
MAIL_LOG = AUDIT_DIR / 'mail.log'


def _audit(entry: Dict):
    try:
        logs = []
        if MAIL_LOG.exists():
            logs = json.loads(MAIL_LOG.read_text())
        logs.append(entry)
        MAIL_LOG.write_text(json.dumps(logs, indent=2))
    except Exception:
        # best-effort
        pass


def send_mail(to: str, subject: str, body: str, metadata: Optional[Dict] = None) -> Dict:
    """Send mail via provider when enabled, otherwise log dry-run.

    Behavior:
    - Default: dry-run — write audit entry to `.qmoi_validation/adapters/mail.log` and return a dry-run response.
    - If environment variables MAIL_ENABLED=true, PRODUCTION_CONFIRMED=true, QMOI_ALLOW_NETWORK=true and SENDGRID_API_KEY present,
      the adapter will attempt to send via provider (implementation left minimal — production integration required).
    """
    metadata = metadata or {}
    entry = {
        'time': __import__('datetime').datetime.utcnow().isoformat(),
        'to': to,
        'subject': subject,
        'body_snippet': body[:200],
        'metadata': metadata,
    }

    mail_enabled = os.environ.get('MAIL_ENABLED', 'false').lower() == 'true'
    production_confirmed = os.environ.get('PRODUCTION_CONFIRMED', 'false').lower() == 'true'
    allow_network = os.environ.get('QMOI_ALLOW_NETWORK', 'false').lower() == 'true'
    sendgrid_key = os.environ.get('SENDGRID_API_KEY')

    if mail_enabled and production_confirmed and allow_network and sendgrid_key:
        # PRODUCTION path: minimal attempt. Replace with robust SendGrid/SMTP client.
        entry['path'] = 'provider-attempt'
        entry['note'] = 'Provider configured. Adapter will attempt send when fully implemented.'
        _audit(entry)
        return {'status': 'queued', 'dry_run': False, 'note': 'Provider-configured: adapter placeholder (implement provider client)'}

    # Default dry-run
    entry['path'] = 'dry-run'
    entry['note'] = 'Mail adapter dry-run; no outgoing network call was made.'
    _audit(entry)
    return {'status': 'dry-run', 'dry_run': True, 'note': 'Logged to .qmoi_validation/adapters/mail.log'}
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
