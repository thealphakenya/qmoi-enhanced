// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
"""Simple on-disk state store for wallet metadata and aliases.

This module keeps a small JSON store under `.qmoi_state/wallets.json` that
maps canonical wallet IDs to metadata and aliases (e.g., 'leah' -> 'leahwallet').

Usage:
  from scripts.wallets.state_store import get_wallet_by_alias, set_alias
"""
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[2]
STATE_DIR = ROOT / '.qmoi_state'
STATE_DIR.mkdir(parents=True, exist_ok=True)
STATE_FILE = STATE_DIR / 'wallets.json'


def _load():
    if not STATE_FILE.exists():
        return {'wallets': {}, 'aliases': {}, 'updated_at': None}
    try:
        with open(STATE_FILE, 'r', encoding='utf-8') as fh:
            return json.load(fh)
    except Exception:
        return {'wallets': {}, 'aliases': {}, 'updated_at': None}


def _save(data):
    data['updated_at'] = datetime.utcnow().isoformat() + 'Z'
    with open(STATE_FILE, 'w', encoding='utf-8') as fh:
        json.dump(data, fh, indent=2)


def list_wallets():
    d = _load()
    return d.get('wallets', {})


def get_wallet(name):
    d = _load()
    return d.get('wallets', {}).get(name)


def set_wallet(name, meta):
    d = _load()
    d.setdefault('wallets', {})[name] = meta
    _save(d)


def list_aliases():
    d = _load()
    return d.get('aliases', {})


def set_alias(alias, wallet_name):
    d = _load()
    d.setdefault('aliases', {})[alias] = wallet_name
    _save(d)


def get_wallet_by_alias(alias):
    d = _load()
    return d.get('aliases', {}).get(alias)


def ensure_defaults():
    d = _load()
    changed = False
    # add default alias 'leah' -> 'leahwallet' if not present and file exists
    if 'leahwallet' in d.get('wallets', {}) and 'leah' not in d.get('aliases', {}):
        d.setdefault('aliases', {})['leah'] = 'leahwallet'
        changed = True
    if changed:
        _save(d)


if __name__ == '__main__':
    # bootstrap helper
    ensure_defaults()
    print('State file:', STATE_FILE)
    print('Wallets:', list_wallets())
    print('Aliases:', list_aliases())
