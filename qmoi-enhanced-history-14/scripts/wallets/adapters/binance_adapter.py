"""Binance testnet adapter scaffold (mock-first).

This file provides a scaffold for interacting with Binance testnet. It is
mock-first and will not perform real API calls unless explicitly allowed
with `--real` and `PRODUCTION_CONFIRMED=true`.
"""
from .adapter_base import TestnetAdapter
import os


class BinanceTestnetAdapter(TestnetAdapter):
    def __init__(self):
        super().__init__('binance_testnet', base_amount=10.0, currency='USDT')

    def check_balance(self, config=None, real=False):
        cfg = config or {}
        if real:
            if os.environ.get('PRODUCTION_CONFIRMED', 'false').lower() != 'true':
                return {'status': 'blocked_no_production_confirm', 'last_checked': self.now_iso(), 'meta': {'adapter': self.name}}
            # Placeholder for real SDK call (binance.client or ccxt)
            return {'status': 'not_implemented', 'last_checked': self.now_iso(), 'meta': {'adapter': self.name}}
        return super().check_balance(config=cfg, real=False)


# Register in adapter registry if available
try:
    from .adapter_base import REGISTRY
    REGISTRY.setdefault('binance_testnet', BinanceTestnetAdapter())
except Exception:
    pass
