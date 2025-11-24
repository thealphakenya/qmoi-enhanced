"""M-Pesa sandbox adapter scaffold (mock-first).

This adapter is a placeholder for M-Pesa sandbox interactions. It returns
test values by default and requires human approval and proper credentials
for live operations.
"""
from .adapter_base import TestnetAdapter
import os


class MpesaSandboxAdapter(TestnetAdapter):
    def __init__(self):
        super().__init__('mpesa_sandbox', base_amount=2000.0, currency='KES')

    def check_balance(self, config=None, real=False):
        cfg = config or {}
        if real:
            if os.environ.get('PRODUCTION_CONFIRMED', 'false').lower() != 'true':
                return {'status': 'blocked_no_production_confirm', 'last_checked': self.now_iso(), 'meta': {'adapter': self.name}}
            # Placeholder for real sandbox call
            return {'status': 'not_implemented', 'last_checked': self.now_iso(), 'meta': {'adapter': self.name}}
        return super().check_balance(config=cfg, real=False)


try:
    from .adapter_base import REGISTRY
    REGISTRY.setdefault('mpesa_sandbox', MpesaSandboxAdapter())
except Exception:
    pass
