"""Placeholder provider clients for Cashon, Mpesa, Binance.

These clients validate presence of required env vars and provide a simulated
send_payment method. They will auto-generate placeholder credentials to
`.qmoi/env_generated.json` when real env vars are missing to allow staging
and CI flows. DO NOT use generated placeholders to move real funds.
"""
import os
import json
import time
from typing import Optional

GEN_PATH = ".qmoi/env_generated.json"


def _save_generated(d: dict):
    os.makedirs(".qmoi", exist_ok=True)
    with open(GEN_PATH, "w") as f:
        json.dump(d, f)


class BaseProvider:
    def __init__(self, name: str, required_env: list):
        self.name = name
        self.required_env = required_env
        self.cfg = {k: os.environ.get(k) for k in required_env}
        self._ensure()

    def _ensure(self):
        missing = [k for k, v in self.cfg.items() if not v]
        if missing:
            # generate placeholders for missing entries
            generated = {k: f"{self.name}_PLACEHOLDER_{int(time.time())}" for k in missing}
            existing = {}
            if os.path.exists(GEN_PATH):
                try:
                    existing = json.load(open(GEN_PATH))
                except Exception:
                    existing = {}
            existing.setdefault(self.name, {}).update(generated)
            _save_generated(existing)
            # merge into cfg (but do not set real env)
            self.cfg.update(generated)

    def send_payment(self, to: str, amount: float, currency: str = "KES", idempotency_key: Optional[str] = None) -> dict:
        """Simulate a payment. Replace with real provider SDK logic."""
        # simulated response
        return {
            "provider": self.name,
            "to": to,
            "amount": amount,
            "currency": currency,
            "idempotency_key": idempotency_key,
            "status": "simulated",
            "tx_ref": f"{self.name}-sim-{int(time.time()*1000)}"
        }


class CashonClient(BaseProvider):
    def __init__(self):
        super().__init__("cashon", ["CASHON_API_KEY", "CASHON_ACCOUNT"])


class MpesaClient(BaseProvider):
    def __init__(self):
        super().__init__("mpesa", ["MPESA_CONSUMER_KEY", "MPESA_CONSUMER_SECRET"])


class BinanceClient(BaseProvider):
    def __init__(self):
        super().__init__("binance", ["BINANCE_API_KEY", "BINANCE_API_SECRET"])


def get_provider(name: str):
    if name.lower() == "cashon":
        return CashonClient()
    if name.lower() == "mpesa":
        return MpesaClient()
    if name.lower() == "binance":
        return BinanceClient()
    raise ValueError("unknown provider")


if __name__ == "__main__":
    # quick demo
    p = get_provider("cashon")
    print(p.send_payment("wallet-123", 100.0))
"""Provider client templates for Cashon, Mpesa, Binance.

These are placeholder/simulated clients. They will:
- Read required env vars; if missing, auto-generate placeholder values and persist them to `.qmoi/.env_generated.json`.
- Provide a `send_payment` method that is idempotent by `idempotency_key` (simulated).

DO NOT store real production secrets in the repository. Auto-generated placeholders are convenient for local dev and CI.
"""
import os
import json
import uuid
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
    # create a placeholder token and persist it
    token = f"{placeholder_prefix}{uuid.uuid4().hex}"
    gen[name] = token
    _save_generated(gen)
    return token

class BaseProvider:
    def __init__(self, name: str, key_env: Optional[str] = None):
        self.name = name
        self.key_env = key_env
        if key_env:
            self.api_key = ensure_env_var(key_env, placeholder_prefix=f'{name.lower()}_')
        else:
            self.api_key = None
        # simple idempotency store
        self._idempotency = Path('.qmoi') / f'idempotency_{name}.json'
        if not self._idempotency.parent.exists():
            self._idempotency.parent.mkdir(parents=True, exist_ok=True)
        if not self._idempotency.exists():
            self._idempotency.write_text(json.dumps({}))

    def _load_ids(self):
        try:
            return json.loads(self._idempotency.read_text())
        except Exception:
            return {}

    def _save_ids(self, d: Dict[str, Any]):
        self._idempotency.write_text(json.dumps(d, indent=2))

    def send_payment(self, idempotency_key: str, to_account: str, amount: float, currency: str = 'USD', meta: Optional[Dict[str,Any]] = None) -> Dict[str,Any]:
        """Simulate sending a payment. Returns a dict with status and provider_tx_id.

        This method is idempotent: the same idempotency_key returns the original result.
        """
        ids = self._load_ids()
        if idempotency_key in ids:
            return ids[idempotency_key]
        # simulated provider tx id
        provider_tx_id = f"{self.name[:6].upper()}_{uuid.uuid4().hex}"
        res = {
            'status': 'ok',
            'provider_tx_id': provider_tx_id,
            'to': to_account,
            'amount': amount,
            'currency': currency,
            'meta': meta or {}
        }
        ids[idempotency_key] = res
        self._save_ids(ids)
        return res


class CashonClient(BaseProvider):
    def __init__(self):
        super().__init__('cashon', key_env='CASHON_API_KEY')


class MpesaClient(BaseProvider):
    def __init__(self):
        super().__init__('mpesa', key_env='MPESA_CONSUMER_KEY')


class BinanceClient(BaseProvider):
    def __init__(self):
        super().__init__('binance', key_env='BINANCE_API_KEY')
"""Provider client templates (simulated) for Cashon, Mpesa, Binance.

These are lightweight placeholders that validate required environment variables
and provide a simulated `send_payment` method. Replace with real HTTP SDK
clients when credentials and endpoints are available.
"""
from __future__ import annotations

import os
import uuid
import time
from typing import Optional, Dict, Any


class ProviderError(Exception):
    pass


class BaseClient:
    name = "base"

    def __init__(self, required_env: Optional[list] = None):
        self.required_env = required_env or []
        missing = [k for k in self.required_env if not os.getenv(k)]
        if missing:
            raise ProviderError(f"Missing required env vars for {self.__class__.__name__}: {missing}")

    def send_payment(self, to_account: str, amount: float, idempotency_key: Optional[str] = None, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Simulate sending a payment. Returns provider response dict."""
        # Simulate network/processing latency
        time.sleep(0.05)
        return {
            "status": "ok",
            "provider": self.name,
            "tx_ref": str(uuid.uuid4()),
            "idempotency_key": idempotency_key,
            "amount": amount,
            "to": to_account,
        }


class CashonClient(BaseClient):
    name = "cashon"

    def __init__(self):
        super().__init__(required_env=["CASHON_API_KEY", "CASHON_ACCOUNT"])


class MpesaClient(BaseClient):
    name = "mpesa"

    def __init__(self):
        super().__init__(required_env=["MPESA_CONSUMER_KEY", "MPESA_CONSUMER_SECRET"])


class BinanceClient(BaseClient):
    name = "binance"

    def __init__(self):
        super().__init__(required_env=["BINANCE_API_KEY", "BINANCE_API_SECRET"])


def get_client(name: str) -> BaseClient:
    name = (name or "").lower()
    if name == "cashon":
        return CashonClient()
    if name == "mpesa":
        return MpesaClient()
    if name == "binance":
        return BinanceClient()
    raise ProviderError(f"Unknown provider: {name}")


if __name__ == "__main__":
    # basic smoke test (will raise if env vars missing)
    try:
        c = get_client("cashon")
        print(c.send_payment("+254700000000", 10.0, idempotency_key=str(uuid.uuid4())))
    except ProviderError as e:
        print("ProviderError:", e)
