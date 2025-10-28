"""Clean provider stubs (providers_v2) — safe, simulated clients for staging.

These clients auto-generate placeholder tokens into `.qmoi/env_generated.json`
when env vars are missing. They are idempotent by `idempotency_key`.
Do NOT use generated placeholders to move real money.
"""
import os
import json
import uuid
import time
from typing import Optional, Dict, Any
from pathlib import Path


ENV_STORE = Path('.qmoi') / 'env_generated.json'


def _ensure_env_store():
    if not ENV_STORE.parent.exists():
        ENV_STORE.parent.mkdir(parents=True, exist_ok=True)
    if not ENV_STORE.exists():
        ENV_STORE.write_text(json.dumps({}))


def _load_generated():
    _ensure_env_store()
    try:
        return json.loads(ENV_STORE.read_text())
    except Exception:
        return {}


def _save_generated(data: Dict[str, Any]):
    _ensure_env_store()
    ENV_STORE.write_text(json.dumps(data, indent=2))


def ensure_env_var(name: str, placeholder_prefix: str = 'qmoi_') -> str:
    v = os.environ.get(name)
    if v:
        return v
    gen = _load_generated()
    if name in gen:
        return gen[name]
    token = f"{placeholder_prefix}{uuid.uuid4().hex}"
    gen[name] = token
    _save_generated(gen)
    return token


class ProviderError(Exception):
    pass


class BaseClient:
    name = "base"

    def __init__(self, required_env: Optional[list] = None):
        self.required_env = required_env or []
        # ensure envs (generate placeholders when missing)
        for k in self.required_env:
            ensure_env_var(k, placeholder_prefix=f"{self.name}_")
        # idempotency storage per provider
        self._store = Path('.qmoi') / f'idempotency_{self.name}.json'
        if not self._store.parent.exists():
            self._store.parent.mkdir(parents=True, exist_ok=True)
        if not self._store.exists():
            self._store.write_text(json.dumps({}))

    def _load_ids(self):
        try:
            return json.loads(self._store.read_text())
        except Exception:
            return {}

    def _save_ids(self, d: Dict[str, Any]):
        self._store.write_text(json.dumps(d, indent=2))

    def _detect_real_creds(self) -> bool:
        """Return True if required env vars appear to be real (not generated placeholders)."""
        for k in self.required_env:
            v = os.environ.get(k)
            if not v:
                return False
            # heuristic: generated placeholders from ensure_env_var start with f"{self.name}_" or "qmoi_"
            if v.startswith(f"{self.name}_") or v.startswith("qmoi_"):
                return False
        return True

    def get_balance(self) -> Dict[str, Any]:
        """Return a safe, non-destructive balance estimate for this provider.

        If real credentials are present this may reflect a realistic simulated value.
        If placeholders were generated, this returns a zero-like balance and marks
        the provider as not fully configured.
        """
        has_real = self._detect_real_creds()
        # Simulate different balances by provider name for convenience
        base_map = {
            'cashon': 1000.0,
            'mpesa': 250.0,
            'binance': 5000.0,
        }
        bal = base_map.get(self.name, 0.0) if has_real else 0.0
        return {
            'provider': self.name,
            'balance': float(bal),
            'currency': 'USD',
            'has_real_credentials': bool(has_real),
        }

    def send_payment(self, to_account: str, amount: float, idempotency_key: Optional[str] = None, currency: str = 'USD', metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        ids = self._load_ids()
        if idempotency_key and idempotency_key in ids:
            return ids[idempotency_key]
        time.sleep(0.01)
        tx = {
            'status': 'simulated',
            'provider': self.name,
            'tx_ref': f"{self.name[:6].upper()}_{uuid.uuid4().hex}",
            'to': to_account,
            'amount': amount,
            'currency': currency,
            'metadata': metadata or {}
        }
        if idempotency_key:
            ids[idempotency_key] = tx
            self._save_ids(ids)
        return tx


class CashonClient(BaseClient):
    name = 'cashon'

    def __init__(self):
        super().__init__(required_env=['CASHON_API_KEY', 'CASHON_ACCOUNT'])


class MpesaClient(BaseClient):
    name = 'mpesa'

    def __init__(self):
        super().__init__(required_env=['MPESA_CONSUMER_KEY', 'MPESA_CONSUMER_SECRET'])


class BinanceClient(BaseClient):
    name = 'binance'

    def __init__(self):
        super().__init__(required_env=['BINANCE_API_KEY', 'BINANCE_API_SECRET'])


def get_client(name: str) -> BaseClient:
    n = (name or '').lower()
    if n == 'cashon':
        return CashonClient()
    if n == 'mpesa':
        return MpesaClient()
    if n == 'binance':
        return BinanceClient()
    raise ProviderError(f'Unknown provider: {name}')


if __name__ == '__main__':
    c = get_client('cashon')
    print(c.send_payment('+254700000000', 10.0, idempotency_key='test-1'))
