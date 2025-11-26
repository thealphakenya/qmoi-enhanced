---
title: "Issue draft for scripts/generate_revenue_spec.py"
generated: 2025-11-08T16:06:38.968063Z
---

# Review needed: scripts/generate_revenue_spec.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
#!/usr/bin/env python3
"""Enhanced revenue specification generator for QMOI.

This script scans repository Markdown files for revenue-related information and generates
a structured revenue specification document. Features:

- Identifies monetary amounts, revenue mentions, and payment systems
- Conservative by default (generates .generated.md in dry-run mode)
- Provides both human-readable Markdown and machine-readable JSON output
- Supports environment-based configuration via tools/lion.env

Usage:
  python3 scripts/generate_revenue_spec.py --out docs/REVENUE_SPEC.md --root .
  LION_APPLY=1 python3 scripts/generate_revenue_spec.py  # applies changes
"""
import argparse
import json
import os
import re
from pathlib import Path
from typing import Dict, List, Optional

# Comprehensive revenue-related keywords
KEYWORDS = {
    'revenue_terms': [
        'revenue', 'profit', 'income', 'earnings', 'monetization',
        'daily target', 'daily profit', 'projection', 'forecast'
    ],
    'payment_systems': [
        'wallet', 'cashon', 'mpesa', 'pesapal', 'payment', 'transfer',
        'trading', 'payout', 'subscription', 'sale'
    ],
    'currencies': [
        'KSH', 'KES', 'USD', 'EUR', '$', 'master'
    ]
}

# Regex for monetary amounts with currency
AMOUNT_RE = re.compile(
    r'((?:KSH|KES|USD|EUR|\$)\s*\d[\d,]*|\d[\d,]*\s*(?:KSH|KES|USD|EUR))',
    re.IGNORECASE
)
def load_dotenv(root: Path) -> Dict[str, str]:
    """Load environment variables from tools/lion.env or .env files.
    
    Environment variables in the OS take precedence over file-based configuration.
    Returns a merged dictionary of environment variables.
    """
    candidates = [root / 'tools' / 'lion.env', root / '.env']
    env = {}
    
    # Load from first existing env file
    for p in candidates:
        if p.exists():
            for line in p.read_text(encoding='utf8').splitlines():
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
     
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
