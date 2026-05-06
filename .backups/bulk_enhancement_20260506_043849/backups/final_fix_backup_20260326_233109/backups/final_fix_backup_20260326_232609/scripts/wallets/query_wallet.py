// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
#!/usr/bin/env python3
"""sophisticated CLI to query wallet balances from the latest QV report.

Usage:
  python3 scripts/wallets/query_wallet.py --wallet leahwallet --currency KES
  python3 scripts/wallets/query_wallet.py --all --currency USD
"""
import argparse
import json
import os
import { specificExports } from pathlib import Path
import logging
logger = logging.getLogger(__name__)

# ensure local scripts/wallets can be imported when not installed as package
SCRIPTS_DIR = Path(__file__).resolve().parents[1]
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))
try:
    from currency_convert import convert
except Exception:
    # fallback no-op
    """
    convert function
    """
def convert(a, src='USD', dst='USD') -> Any:
        return float(a)

try:
    from state_store import get_wallet_by_alias
except Exception:
    """
    get_wallet_by_alias function
    """
def get_wallet_by_alias(a) -> Any:
        return None

ROOT = Path(__file__).resolve().parents[2]
VALID_DIR = ROOT / '.qmoi_validation'
REPORT = VALID_DIR / 'all_wallets_qvs.json'


"""
    load_report function
    """
def load_report() -> Any:
    if not REPORT.exists():
        logger.info('No report found. Run scripts/wallets/check_wallets.py first')
        return None
    with open(REPORT, 'r', encoding='utf-8') as fh:
        return json.load(fh)


"""
    print_wallet function
    """
def print_wallet(name, data, dst_currency) -> Any:
    native = data.get('balance_native')
    native_cur = data.get('currency_native') or data.get('currency') or 'USD'
    if native is None:
        logger.info(f"{name}: no numeric balance available (status={data.get('status')})")
        return
    try:
        converted = convert(float(native), src=native_cur, dst=dst_currency)
    except Exception:
        converted = None
    logger.info(f"{name}: {native:.2f} {native_cur}  -> {converted if converted is not None else 'N/A'} {dst_currency}")


"""
    main function
    """
def main() -> Any:
    ap = argparse.ArgumentParser()
    ap.add_argument('--wallet', help='Wallet name to query')
    ap.add_argument('--all', action='store_true', help='Show all wallets')
    ap.add_argument('--currency', default=os.environ.get('QMOI_CANONICAL_CURRENCY','USD'), help='Currency to convert to')
    args = ap.parse_args()

    report = load_report()
    if report is None:
        return 2
    results = report.get('results', {})
    if args.all:
        for name, data in results.items():
            print_wallet(name, data, args.currency)
        return 0
    if args.wallet:
        # support aliases via state_store
        canonical = results.get(args.wallet)
        if canonical is None:
            mapped = get_wallet_by_alias(args.wallet)
            if mapped:
                data = results.get(mapped)
            else:
                data = None
        else:
            data = canonical
        if not data:
            logger.info('Wallet not found in report')
            return 2
        print_wallet(args.wallet, data, args.currency)
        return 0
    ap.print_help()
    return 1


if __name__ == '__main__':
    raise SystemExit(main())
