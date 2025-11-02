#!/usr/bin/env python3
"""
Gated live validation runner (read-only).

This script will perform read-only balance checks for configured wallets. It is
explicitly gated: it will refuse to run unless the environment contains
PRODUCTION_CONFIRMED=true and MASTER_TOKEN is present. It will never place orders
or transfer funds; it only calls `get_account_balances()` or equivalent read-only
methods on per-wallet client modules.

Outputs are written to `.qmoi_validation/balances/<wallet>.json`.

Usage:
  PRODUCTION_CONFIRMED=true MASTER_TOKEN=xxx python3 scripts/live_validation_runner.py

Make sure you understand the security implications before running. The runner
relies on `VaultAdapter` to load secrets; vault accesses are audited to
`.qmoi_validation/audit.log`.
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / 'scripts'
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

try:
    from vault_adapter import VaultAdapter
except Exception:
    print('Could not import VaultAdapter from scripts; aborting')
    raise

BAL_DIR = Path('.qmoi_validation') / 'balances'
BAL_DIR.mkdir(parents=True, exist_ok=True)

WALLETS = [
    'bitget',
    'binance',
    'mpesa',
    'pesapal',
    'megavault',
    'cashon',
    'leah'
]

def _try_client_call(module_name: str, class_name: str = None):
    """Try to import module `scripts.<module_name>` and call a read-only balances method.
    Returns tuple (status, data_or_msg)
    """
    try:
        mod = __import__(module_name)
    except Exception:
        # try relative scripts import
        try:
            mod = __import__('scripts.' + module_name, fromlist=['*'])
        except Exception as e:
            return 'missing_client', str(e)
    # determine client class
    client = None
    if class_name:
        client_cls = getattr(mod, class_name, None)
    else:
        # heuristic: look for BitgetClient, BinanceClient, etc.
        for attr in dir(mod):
            if attr.lower().endswith('client'):
                client_cls = getattr(mod, attr)
                break
        else:
            client_cls = None
    if client_cls is None:
        return 'no_client_class', 'No client class found in module'
    try:
        inst = client_cls(dry_run=False)
    except Exception as e:
        # client construction failed (likely missing creds)
        return 'construction_failed', str(e)
    # attempt to call get_account_balances or balances
    for fn in ('get_account_balances', 'get_balances', 'balances'):
        if hasattr(inst, fn):
            try:
                res = getattr(inst, fn)()
                return 'ok', res
            except Exception as e:
                return 'call_failed', str(e)
    return 'no_balances_method', 'Client has no known balances method'

def run_live_checks():
    if os.environ.get('PRODUCTION_CONFIRMED', '').lower() != 'true':
        print('PRODUCTION_CONFIRMED not set to true; aborting')
        return
    if not os.environ.get('MASTER_TOKEN'):
        print('MASTER_TOKEN not in env; aborting')
        return

    print('Starting gated live validation (read-only) at', datetime.utcnow().isoformat() + 'Z')
    va = VaultAdapter(allow_network=True)

    results = {}
    # Bitget
    # Map wallet name to module/class heuristics
    mapping = {
        'bitget': ('bitget_client', 'BitgetClient'),
        'binance': ('binance_client', 'BinanceClient'),
        'mpesa': ('mpesa_client', None),
        'pesapal': ('pesapal_client', None),
        'megavault': ('megavault_client', None),
        'cashon': ('cashon_client', None),
        'leah': ('leah_client', None)
    }

    for w in WALLETS:
        mod_name, cls_name = mapping.get(w, (f'{w}_client', None))
        print('Checking', w, 'via', mod_name)
        status, payload = _try_client_call(mod_name, cls_name)
        results[w] = {'status': status, 'payload': payload}
        # write snapshot
        out = BAL_DIR / f'{w}.json'
        try:
            out.write_text(json.dumps({'ts': int(datetime.utcnow().timestamp()), 'result': payload if isinstance(payload, (dict, list, str, int, float)) else str(payload), 'status': status}, default=str, indent=2), encoding='utf-8')
        except Exception as e:
            print('Could not write balance snapshot for', w, e)

    # summary
    summary_path = BAL_DIR / 'summary.json'
    summary_path.write_text(json.dumps({'ts': int(datetime.utcnow().timestamp()), 'results': results}, default=str, indent=2), encoding='utf-8')
    print('Wrote live snapshots to', str(BAL_DIR))

def _aws_autoclone(simulate: bool = True, region: str = 'us-east-1'):
    """Attempt to perform a safe (dry-run) autoclone of AWS resources for QMOI.

    Behavior:
    - If simulate=True, only write a plan and do not call AWS.
    - If simulate=False, attempt to use boto3 and the configured AWS credentials to
      create a minimal tagged resource (e.g., an EC2 instance snapshot or a placeholder)
      but only after MASTER_TOKEN and PRODUCTION_CONFIRMED are set. This is gated and
      should be used with extreme caution.
    """
    out_log = Path('.qmoi_validation') / 'aws_autoclone.log'
    out_log.parent.mkdir(parents=True, exist_ok=True)
    entry = {'ts': int(datetime.utcnow().timestamp()), 'simulate': bool(simulate), 'region': region}
    if simulate:
        entry['plan'] = {
            'action': 'simulate_autoclone',
            'description': 'Would clone AMI/EC2/EKS skeletons and produce QCity master entries.'
        }
    out_log.write_text(json.dumps(entry, indent=2), encoding='utf-8')
    # return dry-run marker for clarity
    return 'dry-run', entry

    # real mode: attempt to use boto3 if available and if env gating is present
    if os.environ.get('PRODUCTION_CONFIRMED', '').lower() != 'true' or not os.environ.get('MASTER_TOKEN'):
        entry['error'] = 'gating_missing'
        out_log.write_text(json.dumps(entry, indent=2), encoding='utf-8')
        return 'gating_missing', entry

    try:
        import boto3
        sts = boto3.client('sts')
        who = sts.get_caller_identity()
        entry['who'] = who
        # further safe checks could go here; we will not create resources by default
        entry['note'] = 'boto3 available and credentials valid; autoclone implementation pending explicit action'
        out_log.write_text(json.dumps(entry, indent=2, default=str), encoding='utf-8')
        return 'credentials_ok', entry
    except Exception as e:
        entry['error'] = f'boto3_error:{e}'
        out_log.write_text(json.dumps(entry, indent=2, default=str), encoding='utf-8')
        return 'boto3_error', entry


def run_live_checks(aws_autoclone_enabled: bool = False, aws_simulate: bool = True, parallel: int = 4, run_autotest: bool = False):
    if os.environ.get('PRODUCTION_CONFIRMED', '').lower() != 'true':
        print('PRODUCTION_CONFIRMED not set to true; aborting')
        return
    if not os.environ.get('MASTER_TOKEN'):
        print('MASTER_TOKEN not in env; aborting')
        return

    print('Starting gated live validation (read-only) at', datetime.utcnow().isoformat() + 'Z')
    va = VaultAdapter(allow_network=True)

    # simple thread pool to parallelize wallet checks
    import concurrent.futures

    results = {}
    mapping = {
        'bitget': ('bitget_client', 'BitgetClient'),
        'binance': ('binance_client', 'BinanceClient'),
        'mpesa': ('mpesa_client', None),
        'pesapal': ('pesapal_client', None),
        'megavault': ('megavault_client', None),
        'cashon': ('cashon_client', None),
        'leah': ('leah_client', None)
    }

    def _check_wallet(w):
        mod_name, cls_name = mapping.get(w, (f'{w}_client', None))
        status, payload = _try_client_call(mod_name, cls_name)
        out = {'status': status, 'payload': payload}
        # write snapshot per wallet
        out_path = BAL_DIR / f'{w}.json'
        try:
            out_path.write_text(json.dumps({'ts': int(datetime.utcnow().timestamp()), 'result': payload if isinstance(payload, (dict, list, str, int, float)) else str(payload), 'status': status}, default=str, indent=2), encoding='utf-8')
        except Exception as e:
            out['write_error'] = str(e)
        return w, out

    with concurrent.futures.ThreadPoolExecutor(max_workers=parallel) as ex:
        futures = [ex.submit(_check_wallet, w) for w in WALLETS]
        for fut in concurrent.futures.as_completed(futures):
            try:
                w, out = fut.result()
                results[w] = out
            except Exception as e:
                print('Wallet check failed:', e)

    # summary
    summary_path = BAL_DIR / 'summary.json'
    summary_path.write_text(json.dumps({'ts': int(datetime.utcnow().timestamp()), 'results': results}, default=str, indent=2), encoding='utf-8')
    print('Wrote live snapshots to', str(BAL_DIR))

    if aws_autoclone_enabled:
        print('AWS autoclone requested (simulate=%s)' % aws_simulate)
        aws_status, aws_entry = _aws_autoclone(simulate=aws_simulate)
        print('AWS autoclone status:', aws_status)

    if run_autotest:
        # try to run the AWS paid-features autotest (conservative)
        try:
            import runpy
            tpath = Path('tests') / 'aws_payed_test.py'
            if tpath.exists():
                print('Running AWS paid-features autotest (may be dry-run)')
                runpy.run_path(str(tpath), run_name='__main__')
            else:
                print('Autotest not found:', tpath)
        except Exception as e:
            print('Autotest failed to run:', e)


if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--aws-autoclone', action='store_true', help='Attempt gated AWS autoclone (dry-run by default)')
    p.add_argument('--aws-simulate', action='store_true', help='When used with --aws-autoclone, run in simulate/dry-run mode (default)')
    p.add_argument('--parallel', type=int, default=4, help='Parallel wallet checks')
    p.add_argument('--run-autotest', action='store_true', help='Run the AWS paid-features autotest after checks')
    args = p.parse_args()

    run_live_checks(aws_autoclone_enabled=args.aws_autoclone, aws_simulate=(args.aws_simulate or True), parallel=args.parallel, run_autotest=args.run_autotest)
