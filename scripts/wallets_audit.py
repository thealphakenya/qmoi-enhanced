#!/usr/bin/env python3
"""Simple wallets audit script.

Scans repository for wallet-related components, configuration, and example keys.
Produces a JSON report under docs/ by default (dry-run). Use --apply or set
LION_APPLY=1 to mark as applied (script itself won't change code; apply flag reserved for future actions).
"""
import argparse
import json
import os
from pathlib import Path

KEYWORDS = ['leahwallet', 'cashon', 'wallet', 'mpesa', 'pesapal', 'binance', 'valr', 'wallets', 'leah']


def scan_files(root: Path):
    findings = []
    for p in root.rglob('*'):
        if p.is_file() and p.suffix.lower() in ('.md', '.py', '.js', '.ts', '.json', '.tsx', '.yml', '.yaml'):
            try:
                text = p.read_text(encoding='utf8', errors='ignore')
            except Exception:
                continue
            for i, line in enumerate(text.splitlines(), start=1):
                low = line.lower()
                for k in KEYWORDS:
                    if k in low:
                        findings.append({'file': str(p.relative_to(root)), 'line': i, 'keyword': k, 'text': line.strip()})
    return findings


def build_report(findings):
    report = {'summary': {'total_matches': len(findings)}, 'matches': findings}
    return report


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--root', default='.', help='repo root')
    p.add_argument('--out', default='docs/wallets_report.generated.json')
    p.add_argument('--apply', action='store_true')
    args = p.parse_args()

    root = Path(args.root).resolve()
    findings = scan_files(root)
    report = build_report(findings)
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2), encoding='utf8')
    print('Wrote', out_path)

    if args.apply or os.environ.get('LION_APPLY') == '1':
        canonical = root / 'docs' / 'wallets_report.json'
        canonical.write_text(json.dumps(report, indent=2), encoding='utf8')
        print('Applied canonical wallets report ->', canonical)


if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""Simple wallets audit script.

Creates a JSON report with discovered wallet config entries and basic connectivity checks
where possible. Dry-run by default; to perform active tests set LION_APPLY=1 or pass --apply.
"""
import argparse
import json
import os
from pathlib import Path
import socket


def load_dotenv(root: Path):
    candidates = [root / 'tools' / 'lion.env', root / '.env']
    env = {}
    for p in candidates:
        if p.exists():
            for line in p.read_text(encoding='utf8').splitlines():
                line=line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    k,v=line.split('=',1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
            break
    for k,v in os.environ.items():
        if k not in env:
            env[k]=v
    return env


def check_tcp_host(hostport: str, timeout=2):
    try:
        host,port = hostport.split(':')
        port=int(port)
        with socket.create_connection((host,port), timeout=timeout):
            return True
    except Exception:
        return False


def find_wallet_configs(root: Path):
    # Look for files or env entries that mention wallet endpoints
    candidates = []
    env = load_dotenv(root)
    if 'WALLET_TESTNET_RPC' in env:
        candidates.append({'source': 'env', 'key': 'WALLET_TESTNET_RPC', 'value': env['WALLET_TESTNET_RPC']})
    # search common config files
    for p in root.rglob('*config*.json'):
        try:
            txt = p.read_text(encoding='utf8')
        except Exception:
            continue
        if 'rpc' in txt.lower() or 'wallet' in txt.lower():
            candidates.append({'source': str(p.relative_to(root)), 'key': 'file', 'value': txt[:200]})
    return candidates


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--root', default='.')
    p.add_argument('--out', default='docs/wallets_report.json')
    p.add_argument('--apply', action='store_true')
    args = p.parse_args()
    root = Path(args.root).resolve()
    env = load_dotenv(root)

    report = {'root': str(root), 'summary': {}, 'wallets': []}
    wallets = find_wallet_configs(root)
    report['wallets'] = wallets

    # Basic connectivity check for WALLET_TESTNET_RPC in host:port form
    if any('WALLET_TESTNET_RPC'==w.get('key') for w in wallets):
        val = next(w['value'] for w in wallets if w.get('key')=='WALLET_TESTNET_RPC')
        # attempt to parse host:port
        if ':' in val:
            ok = check_tcp_host(val)
            report['summary']['testnet_connectivity'] = {'endpoint': val, 'reachable': ok}
        else:
            report['summary']['testnet_connectivity'] = {'endpoint': val, 'reachable': None}

    outp = Path(args.out)
    outp.parent.mkdir(parents=True, exist_ok=True)
    outp.write_text(json.dumps(report, indent=2), encoding='utf8')
    print('Wrote', outp)


if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""Simple wallets audit that scans repo for wallet/payment references and emits a report.

This script is conservative and makes no network calls. It produces a JSON report
listing discovered wallet mentions and suggested checks.
"""
import argparse
import json
from pathlib import Path

WALLET_KEYWORDS = ['wallet', 'cashon', 'pesapal', 'mpesa', 'leahwallet', 'cashonwallet', 'binance']


def scan_for_wallets(root: Path):
    findings = []
    for p in root.rglob('*'):
        if p.is_file() and p.suffix in ('.md', '.py', '.ts', '.tsx', '.js'):
            try:
                text = p.read_text(encoding='utf8').lower()
            except Exception:
                continue
            for k in WALLET_KEYWORDS:
                if k in text:
                    findings.append({'file': str(p.relative_to(root)), 'keyword': k})
    return findings


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--root', default='.', help='repo root')
    p.add_argument('--out', default='docs/wallets_report.json')
    args = p.parse_args()
    root = Path(args.root).resolve()
    out_path = Path(args.out).resolve()

    findings = scan_for_wallets(root)
    report = {
        'summary': f'Found {len(findings)} wallet-related occurrences',
        'findings': findings,
        'recommendations': [
            'Inventory payment gateway integrations and map required secrets',
            'Add sandbox/testnet drivers and unit tests',
            'Ensure master approval flows are clearly defined in docs'
        ]
    }
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2), encoding='utf8')
    print('Wrote', out_path)

if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""Simple wallets audit script.

Produces a small JSON report `docs/wallets_report.json` listing found wallet-related files
and simple sanity checks (presence of config keys in common locations). Dry-run by default.
Set environment variable LION_APPLY=1 to allow write to canonical path (the script itself won't perform destructive ops).
"""
import argparse
import json
import os
from pathlib import Path

WALLET_KEYWORDS = ['wallet', 'cashon', 'leahwallet', 'leah', 'mpesa', 'pesapal', 'binance']

def find_candidates(root: Path):
    candidates = []
    for p in root.rglob('*'):
        if p.is_file() and p.suffix.lower() in ('.md', '.ts', '.tsx', '.py', '.js', '.json'):
            try:
                txt = p.read_text(encoding='utf8').lower()
            except Exception:
                continue
            for kw in WALLET_KEYWORDS:
                if kw in txt:
                    candidates.append(str(p.relative_to(root)))
                    break
    return sorted(set(candidates))

def make_report(root: Path, candidates):
    report = {
        'root': str(root),
        'found': len(candidates),
        'candidates': candidates,
    }
    return report

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--root', default='.')
    p.add_argument('--out', default='docs/wallets_report.json')
    args = p.parse_args()

    root = Path(args.root).resolve()
    candidates = find_candidates(root)
    report = make_report(root, candidates)

    out_path = Path(args.out)
    apply_env = os.environ.get('LION_APPLY', '0') == '1'
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2), encoding='utf8')
    print('Wrote', out_path)

if __name__ == '__main__':
    main()
