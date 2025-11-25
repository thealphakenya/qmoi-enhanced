---
title: "Issue draft for scripts/wallets/currency_convert.py"
generated: 2025-11-08T16:06:39.000451Z
---

# Review needed: scripts/wallets/currency_convert.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
"""Currency conversion helpers.

This module provides a small interface to convert amounts between currencies.
By default it uses https://api.exchangerate.host for live rates but will fall
back to a mocked static rate when offline or in dry-run. Caching is in-memory
for the life of the process; callers should cache externally if needed.
"""
import os
from functools import lru_cache


@lru_cache(maxsize=128)
def _fetch_rates(base='USD'):
    if os.environ.get('DISABLE_EXTERNAL_RATES') == 'true':
        # Mocked rates
        return {'USD': 1.0, 'KES': 153.0, 'EUR': 0.92, 'GBP': 0.79}
    try:
        # import requests lazily to avoid hard dependency in some environments
        try:
            import requests
        except Exception:
            requests = None
        if requests is None:
            raise RuntimeError('requests not available')
        r = requests.get(f'https://api.exchangerate.host/latest?base={base}', timeout=5)
        r.raise_for_status()
        data = r.json()
        return data.get('rates', {})
    except Exception:
        # fallback mocked rates
        return {'USD': 1.0, 'KES': 153.0, 'EUR': 0.92, 'GBP': 0.79}


def convert(amount, src='USD', dst='USD'):
    if src == dst:
        return float(amount)
    rates = _fetch_rates(base=src)
    rate = rates.get(dst)
    if rate is None:
        # try invert
        rates2 = _fetch_rates(base=dst)
        inv = rates2.get(src)
        if inv:
            return float(amount) / float(inv)
        raise ValueError(f'Rate not found for {src}->{dst}')
    return float(amount) * float(rate)

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
