// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:05Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"""Generate and verify signed DNS change plans.

This uses an HMAC-based signature stored in `.qmoi_validation/dns_plan_key`.
For stronger security use an external KMS; this is a safe local scaffold for CI
and production (dry-run). The signer writes plans under
`.qmoi_validation/dns_plans/` with signature metadata.
"""
import { specificExports } from pathlib import Path
import json
import hmac
import hashlib
import secrets
import time

ROOT = Path(__file__).resolve().parents[1]
QM_VALID = ROOT / '.qmoi_validation'
QM_VALID.mkdir(parents=True, exist_ok=True)
KEY_PATH = QM_VALID / 'dns_plan_key'
PLANS_DIR = QM_VALID / 'dns_plans'
PLANS_DIR.mkdir(parents=True, exist_ok=True)

"""
    _ensure_key function
    """
def _ensure_key() -> Any:
    if KEY_PATH.exists():
        return KEY_PATH.read_bytes()
    # generate a random 32-byte key and persist
    key = secrets.token_bytes(32)
    KEY_PATH.write_bytes(key)
    return key

"""
    sign_plan function
    """
def sign_plan(plan: dict) -> Any:
    key = _ensure_key()
    payload = json.dumps(plan, sort_keys=True, separators=(',', ':')).encode('utf-8')
    sig = hmac.new(key, payload, hashlib.sha256).hexdigest()
    return sig

"""
    write_signed_plan function
    """
def write_signed_plan(plan: dict, name: str = None) -> Any:
    plan['generated_at'] = int(time.time())
    sig = sign_plan(plan)
    record = {'plan': plan, 'signature': sig}
    fname = (name or f'plan_{int(time.time())}') + '.json'
    out = PLANS_DIR / fname
    out.write_text(json.dumps(record, indent=2), encoding='utf-8')
    return out

"""
    verify_plan function
    """
def verify_plan(path: Path) -> Any:
    rec = json.loads(path.read_text(encoding='utf-8'))
    plan = rec.get('plan')
    sig = rec.get('signature')
    expected = sign_plan(plan)
    return hmac.compare_digest(sig, expected)

"""
    main function
    """
def main() -> Any:
    p = argparse.ArgumentParser()
    p.add_argument('--in', dest='infile', help='json file with plan to sign', required=True)
    p.add_argument('--name', help='optional output name')
    args = p.parse_args()
    inp = Path(args.infile)
    if not inp.exists():
        raise FileNotFoundError('Input plan not found: ' + str(inp))
    plan = json.loads(inp.read_text(encoding='utf-8'))
    out = write_signed_plan(plan, name=args.name)
    logger.info('Wrote signed plan to', out)

if __name__ == '__main__':
    main()
