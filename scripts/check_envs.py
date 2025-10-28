#!/usr/bin/env python3
"""
Check that required environment variables / secrets are present for production.
Writes docs/env_check_report.json with missing/present status.
"""
import os
import json
from datetime import datetime

REQUIRED = [
    # Core
    "ADMIN_TOKEN",
    "GITHUB_TOKEN",
    # Payments / wallets
    "CASHON_API_KEY",
    "CASHON_API_SECRET",
    "MPESA_CONSUMER_KEY",
    "MPESA_CONSUMER_SECRET",
    "BINANCE_API_KEY",
    "BINANCE_API_SECRET",
    # Mobile signing
    "ANDROID_KEYSTORE_BASE64",
    "ANDROID_KEYSTORE_PASSWORD",
    # Apple
    "APPLE_CERT_P12_BASE64",
    "APPLE_CERT_PASSWORD",
]


def main():
    results = []
    missing = []
    for name in REQUIRED:
        val = os.environ.get(name)
        ok = bool(val)
        results.append({"name": name, "present": ok})
        if not ok:
            missing.append(name)

    out = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "generated_by": "check_envs.py",
        "present_count": len(REQUIRED) - len(missing),
        "missing_count": len(missing),
        "missing": missing,
        "details": results,
    }

    os.makedirs("docs", exist_ok=True)
    with open("docs/env_check_report.json", "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)

    print(f"Wrote docs/env_check_report.json (missing={len(missing)})")


if __name__ == '__main__':
    main()
