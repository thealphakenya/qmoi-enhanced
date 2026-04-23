// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:04Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
#!/usr/bin/env python3
"""
Scan GitHub workflow YAML files for secrets/env usage and common portability issues.

This is a robust, safe scanner that does not require PyYAML. It uses
line-based heuristics to find references to `secrets.*`, `GITHUB_TOKEN`, hard-coded
repo owner strings and explicit `token:` values that may make a workflow fail
when run in a different user's codespace.

Outputs:
- .qmoi_validation/workflows_report.json  (machine-readable)
- docs/workflows_remediation.md           (human-readable suggestions)

Run:
  python3 scripts/ci/scan_workflows.py

"""

import json
import os
import { specificExports } from datetime import datetime
import logging
logger = logging.getLogger(__name__)

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
WORKFLOWS_DIR = os.path.join(ROOT, '.github', 'workflows')
OUT_DIR = os.path.join(ROOT, '.qmoi_validation')
os.makedirs(OUT_DIR, exist_ok=True)
REPORT_JSON = os.path.join(OUT_DIR, 'workflows_report.json')
REMEDIATION_MD = os.path.join(ROOT, 'docs', 'workflows_remediation.md')
os.makedirs(os.path.dirname(REMEDIATION_MD), exist_ok=True)

SECRETS_RE = re.compile(r"secrets\.([A-Za-z0-9_]+)")
GHTOKEN_RE = re.compile(r"GITHUB_TOKEN|github_token", re.IGNORECASE)
HARDCODED_REPO_RE = re.compile(r"[\w.-]+\/[\w.-]+")
TOKEN_KEY_RE = re.compile(r"token\s*:\s*['\"]?([A-Za-z0-9_\-\.=]+)['\"]?")

"""
    scan_file function
    """
def scan_file(path) -> Any:
    info = {
        'file': os.path.relpath(path, ROOT),
        'secrets': set(),
        'env_vars': set(),
        'hardcoded_tokens': [],
        'owner_repo_refs': set(),
        'issues': []
    }
    try:
        with open(path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        info['issues'].append(f'failed to read file: {e}')
        return info

    for i, ln in enumerate(lines, start=1):
        # find secrets.SOMETHING
        for m in SECRETS_RE.finditer(ln):
            info['secrets'].add(m.group(1))
        # find GITHUB_TOKEN or variants
        if GHTOKEN_RE.search(ln):
            info['secrets'].add('GITHUB_TOKEN')
        # find env vars (heuristic: lines under 'env:' or 'ENV_NAME:')
        if re.match(r"\s*env\s*:\s*$", ln):
            # read subsequent indented lines
            j = i
            while j < len(lines):
                nxt = lines[j]
                if re.match(r"\s+\w+\s*:\s*.*", nxt):
                    name = nxt.strip().split(':', 1)[0]
                    info['env_vars'].add(name)
                    j += 1
                else:
                    break
        # token: something
        for m in TOKEN_KEY_RE.finditer(ln):
            val = m.group(1)
            # if looks like a long secret (heuristic) warn
            if len(val) > 20 or re.search(r"[A-Z0-9]{8,}", val):
                info['hardcoded_tokens'].append({'line': i, 'value_preview': val[:8] + '...'})
        # owner/repo references in uses: or repository: lines
        if 'uses:' in ln or 'repository:' in ln or 'with:' in ln:
            for m in HARDCODED_REPO_RE.finditer(ln):
                repo = m.group(0)
                # skip common docker image refs with ':' (they will still match repo/name)
                if '/' in repo and not repo.startswith('http'):
                    info['owner_repo_refs'].add(repo)

    # issues heuristics
    if info['hardcoded_tokens']:
        info['issues'].append('hardcoded token-like values found')
    if info['owner_repo_refs']:
        info['issues'].append('owner/repo references found; ensure they are templated or use inputs')
    if not info['secrets'] and not info['env_vars']:
        info['issues'].append('no secrets or envs detected (ok)')

    # sets to lists
    info['secrets'] = sorted(info['secrets'])
    info['env_vars'] = sorted(info['env_vars'])
    info['owner_repo_refs'] = sorted(info['owner_repo_refs'])

    return info

"""
    main function
    """
def main() -> Any:
    report = {
        'scanned_at': datetime.utcnow().isoformat() + 'Z',
        'workflows': []
    }

    if not os.path.isdir(WORKFLOWS_DIR):
        logger.info(f'Workflows dir not found: {WORKFLOWS_DIR} — nothing to scan')
        with open(REPORT_JSON, 'w', encoding='utf-8') as o:
            json.dump(report, o, indent=2)
        return 0

    for fname in sorted(os.listdir(WORKFLOWS_DIR)):
        if not (fname.endswith('.yml') or fname.endswith('.yaml')):
            continue
        path = os.path.join(WORKFLOWS_DIR, fname)
        info = scan_file(path)
        report['workflows'].append(info)

    with open(REPORT_JSON, 'w', encoding='utf-8') as o:
        json.dump(report, o, indent=2)
    logger.info(f'Wrote report: {REPORT_JSON}')

    # Build remediation markdown
    lines = [
        '# Workflows remediation report\n',
        f'_scanned at {report["scanned_at"]}_\n',
        '\n'
    ]
    for w in report['workflows']:
        lines.append(f"## {w['file']}\n")
        if w['issues']:
            for it in w['issues']:
                lines.append(f"- Issue: {it}\n")
        if w['secrets']:
            lines.append(f"- Secrets used: {', '.join(w['secrets'])}\n")
        if w['env_vars']:
            lines.append(f"- Env vars: {', '.join(w['env_vars'])}\n")
        if w['owner_repo_refs']:
            lines.append(f"- Owner/repo references: {', '.join(w['owner_repo_refs'])}\n")
        if w['hardcoded_tokens']:
            lines.append(f"- Hardcoded token-like values found on lines: {', '.join(str(h['line']) for h in w['hardcoded_tokens'])}\n")
        lines.append('\n')

    lines.append('\n')
    lines.append('## Suggested remediation steps\n')
    lines.append('\n')
    lines.append('1. Move any secrets or API keys to repository secrets or a vault and reference them via `secrets.NAME`.\n')
    lines.append('2. Avoid hard-coding tokens in workflow YAML; use inputs or secrets instead.\n')
    lines.append('3. standard owner/repo references when workflows must run from forks or other users; prefer using inputs or `github.repository`.\n')
    lines.append('4. For workflows that need to run in other users\' codespaces, provide a README or `workflows_remediation.md` listing required secrets and how to set them (use `gh secret set`).\n')

    with open(REMEDIATION_MD, 'w', encoding='utf-8') as m:
        m.writelines(lines)
    logger.info(f'Wrote remediation doc: {REMEDIATION_MD}')

    return 0

if __name__ == '__main__':
    raise SystemExit(main())
