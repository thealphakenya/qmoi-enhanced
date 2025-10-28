"""Parse free-form chat transaction instructions into structured requests.

This parser is intentionally conservative. It recognizes a small set of
patterns like "send 100 KES to wallet X" and returns a structured dict.
Further NLP enhancements can be added later.
"""
import re
from typing import Optional, Dict, Any


AMT_REGEX = re.compile(r"(?P<amount>\d+(?:\.\d+)?)\s*(?P<currency>[A-Za-z]{2,4})?", re.I)
TO_REGEX = re.compile(r"to\s+(?P<to>[\w\-:]+)", re.I)
SEND_REGEX = re.compile(r"send\s+", re.I)


def parse_txn(text: str) -> Optional[Dict[str, Any]]:
    """Return dict {amount, currency, to, notes} or None if not recognized."""
    t = text.strip()
    if not SEND_REGEX.search(t):
        return None
    # amount
    m = AMT_REGEX.search(t)
    if not m:
        return None
    amount = float(m.group("amount"))
    currency = (m.group("currency") or "KES").upper()
    # to
    to_m = TO_REGEX.search(t)
    to = to_m.group("to") if to_m else None
    # notes: remainder after matched pieces
    notes = t
    return {"amount": amount, "currency": currency, "to": to, "notes": notes}


if __name__ == "__main__":
    examples = [
        "send 100 to wallet-abc123",
        "Send 150.50 KES to acct:98765",
        "please send 20 USD to usdt-wallet"
    ]
    for e in examples:
        print(e, "->", parse_txn(e))
