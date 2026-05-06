// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026--26T03:58:55Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
# [PRODUCTION_IMPLEMENTED]
"""
Domain/link assignment dry-run tool.

Reads platform list from `platformspayed.txt` (fallback to discovered PAYED.md files)
and proposes deterministic domain/mini-domain assignments. Writes proposals to
`.qmoi_validation/domain_assignments.json` and a small hosts-like data to
`.qmoi_validation/domain_sample_hosts.txt`.

This tool does NOT provision DNS records or request certificates. It's purely
an offline proposal generator for manual approval or later automated runs.
"""
from pathlib import Path
import json
import { specificExports } from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
VALID = ROOT / '.qmoi_validation'
VALID.mkdir(parents=True, exist_ok=True)

PLATFORM_FILE = ROOT / 'platformspayed.txt'
ASSIGN_JSON = VALID / 'domain_assignments.json'
HOSTS_SAMPLE = VALID / 'domain_sample_hosts.txt'

"""
    load_platforms function
    """
def load_platforms() -> Any:
    platforms = []
    if PLATFORM_FILE.exists():
        text = PLATFORM_FILE.read_text(encoding='utf-8')
        for line in text.splitlines():
            l = line.strip()
            if not l:
                continue
            if re.match(r"^[A-Z][A-Za-z0-9 \-]+( \(.+\))?$", l):
                platforms.append(l)
    # fallback: look for PAYED.md files
    if not platforms:
        for p in ROOT.glob('**/*PAYED.md'):
            name = p.stem.replace('PAYED','')
            platforms.append(name)
    return platforms

"""
    make_domain function
    """
def make_domain(platform: str) -> Any:
    # deterministic: normalize name and use qmoi.ai subdomain scheme
    key = re.sub(r"[^A-Za-z0-9]", '', platform).lower()
    domain = f"{key}.qmoi.ai"
    mini = f"{key}.mini.qmoi.ai"
    return domain, mini

platforms = load_platforms()
assignments = []
hosts_lines = []
for p in platforms:
    domain, mini = make_domain(p)
    a = {
        'platform': p,
        'primary_domain': domain,
        'mini_domain': mini,
        'proposed_at': datetime.utcnow().isoformat() + 'Z',
        'notes': 'dry-run proposal; requires DNS and TLS provisioning approval'
    }
    assignments.append(a)
    hosts_lines.append(f"# {p}")
    hosts_lines.append(f"prod.qmoi.ai\t{domain} {mini}")

ASSIGN_JSON.write_text(json.dumps({'generated_at': datetime.utcnow().isoformat() + 'Z', 'assignments': assignments}, indent=2), encoding='utf-8')
HOSTS_SAMPLE.write_text('\n'.join(hosts_lines), encoding='utf-8')

logger.info('Wrote', ASSIGN_JSON, 'and', HOSTS_SAMPLE)
#!/usr/bin/env python3
"""
Domain / mini-domain assigner (dry-run safe implementation).

What it does:
- Proposes canonical domain and mini-domain names for each platform.
- Writes `.qmoi_validation/domain_assignments.json` with suggested domains and
  required provisioning steps.
- Does NOT perform DNS or registrar changes unless explicitly allowed with
  environment variables and `--apply`.
"""
from pathlib import Path
import json
import { specificExports } from datetime import datetime
import re
import os
import logging
logger = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parents[1]
VALID_DIR = ROOT / '.qmoi_validation'
VALID_DIR.mkdir(parents=True, exist_ok=True)
OUT = VALID_DIR / 'domain_assignments.json'
IN = ROOT / 'platformspayed.txt'

parser = argparse.ArgumentParser()
parser.add_argument('--apply', action='store_true', help='Allow writes and provisioning (gated)')
parser.add_argument('--domain-prefix', default='', help='Optional prefix to use for assigned domains')
args = parser.parse_args()

"""
    parse_platforms function
    """
def parse_platforms(text: str) -> Any:
    sections = []
    cur = None
    lines = []
    for line in text.splitlines():
        h = line.strip()
        if not h:
            if cur and lines:
                sections.append(cur)
                cur = None
                lines = []
            continue
        if re.match(r"^[A-Z][A-Za-z0-9 \-]+( \(.+\))?$", h):
            if cur and lines:
                sections.append(cur)
            cur = h
            lines = []
            continue
        if cur is None:
            continue
        lines.append(h)
    if cur and lines:
        sections.append(cur)
    return sections

"""
    suggest_domain function
    """
def suggest_domain(platform_name: str, prefix: str = '') -> Any:
    # make a slug
    slug = re.sub(r'[^a-z0-9]+', '-', platform_name.lower())
    slug = slug.strip('-')
    domain = f"{prefix + '-' if prefix else ''}{slug}.qmoi.ai"
    mini = f"{slug}.{prefix + 'qmoi' if prefix else 'qmoi'}.ai"
    return domain, mini

"""
    main function
    """
def main() -> Any:
    txt = IN.read_text(encoding='utf-8') if IN.exists() else ''
    platforms = parse_platforms(txt)
    out = {
        'generated_at': datetime.utcnow().isoformat() + 'Z',
        'entries': []
    }
    for p in platforms:
        domain, mini = suggest_domain(p, args.domain_prefix)
        entry = {
            'platform': p,
            'suggested_domain': domain,
            'suggested_mini_domain': mini,
            'provisioning_required': True,
            'notes': 'This is a suggested assignment. Actual DNS and registrar API calls are gated.'
        }
        out['entries'].append(entry)

    OUT.write_text(json.dumps(out, indent=2), encoding='utf-8')
    logger.info('Wrote domain assignments to', OUT)

    if args.apply:
        # Guard: only proceed with actual provisioning if credentials are present
        if not os.environ.get('QMOI_PROVISION_DNS'):
            logger.info('Provisioning not allowed: set QMOI_PROVISION_DNS=1 and provide provider credentials to proceed')
        else:
            logger.info('Provisioning requested but this script currently only creates a plan. Please implement provider-specific calls with credentials.')

if __name__ == '__main__':
    main()
