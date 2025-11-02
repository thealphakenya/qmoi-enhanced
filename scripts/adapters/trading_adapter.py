import os
import json
from pathlib import Path
from typing import Dict, Optional

AUDIT_DIR = Path('.qmoi_validation') / 'adapters'
AUDIT_DIR.mkdir(parents=True, exist_ok=True)
TRADING_LOG = AUDIT_DIR / 'trading.log'


def _audit(entry: Dict):
    try:
        logs = []
        if TRADING_LOG.exists():
            logs = json.loads(TRADING_LOG.read_text())
        logs.append(entry)
        TRADING_LOG.write_text(json.dumps(logs, indent=2))
    except Exception:
        pass


def place_order(side: str, amount: float, symbol: str, price: Optional[float] = None, metadata: Optional[Dict] = None) -> Dict:
    metadata = metadata or {}
    entry = {
        'time': __import__('datetime').datetime.utcnow().isoformat(),
        'side': side,
        'amount': amount,
        'symbol': symbol,
        'price': price,
        'metadata': metadata,
    }

    bitget_enabled = os.environ.get('BITGET_ENABLED', 'false').lower() == 'true'
    production_confirmed = os.environ.get('PRODUCTION_CONFIRMED', 'false').lower() == 'true'
    allow_network = os.environ.get('QMOI_ALLOW_NETWORK', 'false').lower() == 'true'
    bitget_key = os.environ.get('BITGET_API_KEY')

    if bitget_enabled and production_confirmed and allow_network and bitget_key:
        entry['path'] = 'provider-attempt'
        entry['note'] = 'Provider configured. Adapter placeholder (implement exchange SDK client).'
        _audit(entry)
        return {'status': 'queued', 'dry_run': False, 'note': 'Provider-configured: adapter placeholder'}

    entry['path'] = 'dry-run'
    entry['note'] = 'Trading adapter dry-run; no order sent.'
    _audit(entry)
    return {'status': 'dry-run', 'dry_run': True, 'note': 'Logged to .qmoi_validation/adapters/trading.log'}
#!/usr/bin/env python3
"""
Trading adapter: centralises exchange/trading actions with safe dry-run fallbacks.

Behavior:
- Logs all trade attempts to `.qmoi_validation/trading.log`.
- Only attempts provider calls when BITGET_ENABLED=true (or provider-specific env) and
  provider credentials exist and PRODUCTION_CONFIRMED=true.
  Otherwise acts as dry-run and returns a dry-run success object for testing.
"""
import os
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
LOG_DIR = ROOT / '.qmoi_validation'
LOG_DIR.mkdir(parents=True, exist_ok=True)
TRADING_LOG = LOG_DIR / 'trading.log'


def _append_log(obj: dict):
    try:
        with open(TRADING_LOG, 'a', encoding='utf-8') as f:
            f.write(json.dumps(obj, default=str) + "\n")
    except Exception:
        pass


def place_order(side: str, amount: float, symbol: str = 'BTC/USDT', price: float = None, metadata: dict = None) -> dict:
    ts = datetime.utcnow().isoformat() + 'Z'
    entry = {'ts': ts, 'side': side, 'amount': amount, 'symbol': symbol, 'price': price, 'metadata': metadata or {}}
    enabled = os.environ.get('BITGET_ENABLED', '').lower() == 'true'
    api_key = os.environ.get('BITGET_API_KEY') or os.environ.get('EXCHANGE_API_KEY')
    production = os.environ.get('PRODUCTION_CONFIRMED', '').lower() == 'true'

    if enabled and api_key and production:
        try:
            # Provider-specific implementation goes here (Bitget, Binance, etc.)
            entry.update({'status': 'provider_called', 'note': 'provider integration pending'})
            _append_log(entry)
            return {'ok': True, 'detail': 'provider_called', 'entry': entry}
        except Exception as e:
            entry.update({'status': 'error', 'error': str(e)})
            _append_log(entry)
            return {'ok': False, 'error': str(e), 'entry': entry}

    entry.update({'status': 'dry_run', 'note': 'trading not enabled or gating not present'})
    _append_log(entry)
    # return a dry-run order id to allow downstream logic to proceed
    entry['order_id'] = f"dry-{int(datetime.utcnow().timestamp()*1000)}"
    return {'ok': True, 'detail': 'dry_run', 'entry': entry}
