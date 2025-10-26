"""Payments adapters package.
Adapters implement a simple interface:
  - initialize(config)
  - charge(customer_id, amount_cents, currency, metadata)
  - refund(transaction_id, amount_cents)

Start here with sandbox/testnet drivers. Do NOT store real keys in repo.
"""

__all__ = ["sandbox_adapter", "stripe_adapter"]
