#!/usr/bin/env python3
"""
Wallet checker.

This script:
 - Scans the repo for wallet/provider related files (reuse same search patterns as wallet_audit).
 - For each known provider (cashon, mpesa, binance) it instantiates the provider client from services.providers_v2
   and calls get_balance() to collect a safe balance report.
 - Ensures generated placeholder envs are recorded in .qmoi/env_generated.json by the provider stubs.
 - Ensures idempotency stores exist (providers create them on init).
 - Writes docs/wallet_balance_report.json and logs to .qmoi/wallet_checks.log.

This is conservative and will NOT move any real money. If providers are only using generated placeholder credentials
the report will mark them as needing manual secret provisioning.
"""
import os
import json
from datetime import datetime
from pathlib import Path

SEARCH_PATTERNS = [
    "cashon",
    "wallet",
    "keystore",
    "mpesa",
    "binance",
    "apple_cert",
]


def scan_files(root="."):
    matches = []
    for dirpath, dirs, files in os.walk(root):
        if "node_modules" in dirpath.split(os.sep) or ".git" in dirpath.split(os.sep):
            continue
        for fn in files:
            lname = fn.lower()
            for pat in SEARCH_PATTERNS:
                if pat in lname:
                    matches.append(os.path.join(dirpath, fn))
                    break
    return matches


def infer_providers_from_matches(matches):
    providers = set()
    for p in matches:
        lp = p.lower()
        if 'cashon' in lp:
            providers.add('cashon')
        if 'mpesa' in lp:
            providers.add('mpesa')
        if 'binance' in lp:
            providers.add('binance')
    # Always check the common ones even if not found explicitly
    providers.update(['cashon', 'mpesa', 'binance'])
    return sorted(providers)


def write_report(report: dict, path: str = 'docs/wallet_balance_report.json'):
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)


def append_log(line: str):
    p = Path('.qmoi')
    p.mkdir(parents=True, exist_ok=True)
    with open(p / 'wallet_checks.log', 'a', encoding='utf-8') as f:
        f.write(line + '\n')


def main():
    # scan
    matches = scan_files()
    providers = infer_providers_from_matches(matches)

    # dynamic import of the provider stubs
    try:
        from services.providers_v2 import get_client, _load_generated
    except Exception as e:
        print('Failed to import providers_v2:', e)
        return

    results = []
    # we'll fetch a preview of generated envs after provider initialization
    generated_envs = {}
    timestamp = datetime.utcnow().isoformat() + 'Z'

    for prov in providers:
        try:
            client = get_client(prov)
        except Exception as e:
            results.append({'provider': prov, 'error': str(e)})
            continue

        bal = None
        try:
            bal = client.get_balance()
        except Exception as e:
            results.append({'provider': prov, 'error': f'get_balance failed: {e}'})
            continue

        # conservative auto-fix checks: ensure idempotency store exists (provider init created it)
        # and record in report whether credentials look real
        needs_secrets = not bool(bal.get('has_real_credentials'))

        results.append({
            'provider': prov,
            'balance': bal.get('balance'),
            'currency': bal.get('currency'),
            'has_real_credentials': bal.get('has_real_credentials'),
            'needs_manual_setup': bool(needs_secrets),
            'idempotency_store': str(Path('.qmoi') / f'idempotency_{prov}.json'),
        })

        append_log(f"{timestamp} - checked {prov} - balance={bal.get('balance')} has_real={bal.get('has_real_credentials')}")

    # refresh generated envs to include any placeholders created during client init
    try:
        generated_envs = _load_generated()
    except Exception:
        generated_envs = {}

    report = {
        'generated_at': timestamp,
        'generated_by': 'wallet_checker.py',
        'found_files_count': len(matches),
        'providers_checked': len(results),
        'items': results,
        'env_generated_preview': dict(list(generated_envs.items())[:20]),
    }

    write_report(report)
    print(f"Wrote docs/wallet_balance_report.json (providers={len(results)})")


if __name__ == '__main__':
    main()
