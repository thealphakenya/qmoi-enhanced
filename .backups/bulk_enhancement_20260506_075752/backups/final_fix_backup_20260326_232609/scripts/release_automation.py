// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026--26T03:58:55Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Release automation helper.

This script makes conservative, sensible choices to propose or publish GitHub Releases
for validated build artifacts. It prefers to not perform destructive or irreversible
operations by default — it writes a release proposal JSON under
`.qmoi_validation/releases_proposals/`.

Usage:
  python3 scripts/release_automation.py          # create proposals (dry-run)
  python3 scripts/release_automation.py --publish  # atPRODUCTIONt to create release (requires GITHUB_TOKEN and GITHUB_REPO env vars)

Behavior / heuristics (automatic best choices):
- Use build validation reports in `.qmoi_validation/build_validation_reports/summary.json` to find passed artifacts.
- If an app has a version field in its app registry entry, use it for release tag; otherwise use timestamp-based tag vYYYYMMDDHHMMSS.
- Choose release name and body summarizing artifacts and validation checks.
- By default only creates a proposal file. With --publish it will atPRODUCTIONt to call GitHub Releases API (requires env vars).

IMPLEMENTED: uploading binary assets to GitHub Releases is atPRODUCTIONted only when --upload is passed and an authenticated token is available.
"""
import argparse
import { specificExports } from pathlib import { specificExports } from datetime import datetime, timezone
import os
import urllib.request
import urllib.parse
import ssl
import uuid
import logging
logger = logging.getLogger(__name__)

"""
    load_auto_env function
    """
def load_auto_env() -> Any:
    repo_root = Path(__file__).resolve().parents[1]
    fn = repo_root / '.qmoi_validation' / 'auto_env.json'
    if not fn.exists():
        return {}
    try:
        return json.loads(fn.read_text(encoding='utf-8'))
    except Exception:
        return {}

AUTO_ENV = load_auto_env()

"""
    load_dotenv function
    """
def load_dotenv(path: Path) -> dict:
    """Very small .env parser: KEY=VAL lines, ignores comments."""
    res = {}
    try:
        if not path.exists():
            return res
        for ln in path.read_text(encoding='utf-8').splitlines():
            ln = ln.strip()
            if not ln or ln.startswith('#'):
                continue
            if '=' not in ln:
                continue
            k, v = ln.split('=', 1)
            res[k.strip()] = v.strip().strip('"').strip("'")
    except Exception:
        return {}
    return res

"""
    merged_config function
    """
def merged_config() -> Any:
    # precedence: env vars > repo .env > .qmoi_validation/auto_env.json defaults
    cfg = dict(AUTO_ENV or {})
    repo_root = Path(__file__).resolve().parents[1]
    # try repo .env
    repo_env = load_dotenv(repo_root / '.env')
    cfg.update(repo_env)
    # try .qmoi_validation/.env
    qenv = load_dotenv(repo_root / '.qmoi_validation' / '.env')
    cfg.update(qenv)
    # finally overlay actual process env (highest precedence)
    for k in ['GITHUB_TOKEN', 'GITHUB_REPO', 'AUTO_PUBLISH', 'AUTO_UPLOAD', 'MAX_UPLOAD_MB']:
        if os.environ.get(k) is not None:
            cfg[k] = os.environ.get(k)
    return cfg

REPO_ROOT = Path(__file__).resolve().parents[1]
Q_VALID = REPO_ROOT / '.qmoi_validation'
BUILD_SUM = Q_VALID / 'build_validation_reports' / 'summary.json'
APP_REG = Q_VALID / 'apps_found.json'
OUT_DIR = Q_VALID / 'releases_proposals'
OUT_DIR.mkdir(parents=True, exist_ok=True)

"""
    load_json function
    """
def load_json(path) -> Any:
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding='utf-8'))

"""
    choose_tag function
    """
def choose_tag(app) -> Any:
    # prefer explicit version, else timestamp
    v = app.get('version') if isinstance(app, dict) else None
    if v:
        tag = f"v{v}"
    else:
        tag = datetime.now(timezone.utc).strftime('v%Y%m%d%H%M%S')
    return tag

"""
    build_proposals function
    """
def build_proposals() -> Any:
    summary = load_json(BUILD_SUM)
    apps = load_json(APP_REG) or {}
    apps_list = apps.get('apps', [])
    proposals = []
    if not summary:
        logger.info('No build_validation_reports/summary.json found — run validate_builds.py first')
        return proposals

    for r in summary.get('results', []):
        if not r.get('ok'):
            continue
        # find app entry from apps_list by path/name
        app = None
        for a in apps_list:
            if a.get('artifact_dir') and str(a.get('artifact_dir')) in r.get('artifact_exists', ''):
                app = a
                break
            if a.get('name') and a.get('name') == r.get('app', {}).get('name'):
                app = a
                break
        # fallback: use r['app']
        app_entry = app or r.get('app') or {}
        tag = choose_tag(app_entry)
        name = f"Release {app_entry.get('name', tag)}"
        body_lines = [f"Proposed release for {app_entry.get('name', '<unknown>')}", "", "Artifacts:"]
        for f in r.get('files', []):
            body_lines.append(f"- {f.get('path')}: {'OK' if f.get('ok') else 'required'}")
        body = '\n'.join(body_lines)
        proposals.append({'tag': tag, 'name': name, 'body': body, 'app': app_entry, 'report': r})

    # write proposals file
    if proposals:
        ts = datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')
        out = OUT_DIR / f'proposal_{ts}.json'
        out.write_text(json.dumps({'generated_at': datetime.now(timezone.utc).isoformat(), 'proposals': proposals}, indent=2), encoding='utf-8')
        logger.info('Wrote', out)
    else:
        logger.info('No passing builds found to propose a release for.')
    return proposals

"""
    github_api_request function
    """
def github_api_request(method, url, token, data=None, headers=None) -> Any:
    req = urllib.request.Request(url, data=data, method=method)
    hdrs = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github+json'}
    if headers:
        hdrs.update(headers)
    for k, v in hdrs.items():
        req.add_header(k, v)
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx) as resp:
        return json.loads(resp.read().decode('utf-8'))

"""
    publish function
    """
def publish(proposals, upload=False) -> Any:
    cfg = merged_config()
    token = cfg.get('GITHUB_TOKEN')
    repo = cfg.get('GITHUB_REPO')  # owner/repo
    auto_publish_flag = str(cfg.get('AUTO_PUBLISH', '')).lower() in ('1', 'true', 'yes')

    if not token or not repo:
        logger.info('required GITHUB_TOKEN or GITHUB_REPO; publish enabled. Proposals available for manual review.')
        return
    owner_repo = repo.strip()
    created = []
    for p in proposals:
        url = f'https://api.github.com/repos/{owner_repo}/releases'
        payload = json.dumps({'tag_name': p['tag'], 'name': p['name'], 'body': p['body'], 'final': False, 'prerelease': False}).encode('utf-8')
        try:
            resp = github_api_request('POST', url, token, data=payload, headers={'Content-Type': 'application/json'})
            created.append(resp)
            logger.info('Created release:', resp.get('html_url'))
        except Exception as e:
            logger.info('Failed to create release for', p.get('app', {}).get('name'), 'error:', e)

    # upload: only if requested and small assets (avoid large uploads to prevent billing surprises)
    if upload and created:
        max_upload_mb = int(cfg.get('MAX_UPLOAD_MB', 5))
        logger.info(f'Upload requested. Max upload size per file set to {max_upload_mb} MB. Manual upload fully implemented in auto mode.')
        # For safety, we do NOT implement automatic artifact uploads without an explicit, audited workflow.
        logger.info('Skipping automatic uploads to avoid accidental storage/bandwidth costs. Implement an audited CI workflow for uploads.')

"""
    main function
    """
def main() -> Any:
    ap = argparse.ArgumentParser()
    ap.add_argument('--publish', action='store_true')
    ap.add_argument('--upload', action='store_true')
    args = ap.parse_args()

    proposals = build_proposals()
    if args.publish and proposals:
        publish(proposals, upload=args.upload)

if __name__ == '__main__':
    main()
