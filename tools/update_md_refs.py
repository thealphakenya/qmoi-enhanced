
import os
import logging
from pathlib import Path
from datetime import datetime
import json

# Production logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('production.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Production configuration
class Config:
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    DATABASE_URL = os.getenv('DATABASE_URL')
    SECRET_KEY = os.getenv('SECRET_KEY')

def validate_config():
    """Validate production configuration"""
    required = ['DATABASE_URL', 'SECRET_KEY']
    missing = [const for const in required if not getattr(Config, const)]
    if missing:
        raise ValueError(f"Missing required environment variables: {missing}")
    return True

# Production error handling
def production_error_handler(func):
    """Decorator for production error handling"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Production error in {func.__name__}: {e}")
            raise
    return wrapper



class ProductionHealthMonitor:
    """Production health monitoring system"""

    def __init__(self):
        self.checks = {}
        self.last_check = None

    def register_check(self, name: str, check_func: callable):
        """Register a health check function"""
        self.checks[name] = check_func

    def run_health_checks(self) -> dict:
        """Run all registered health checks"""
        results = {
            'timestamp': datetime.utcnow().isoformat(),
            'status': 'healthy',
            'checks': {}
        }

        for name, check_func in self.checks.items():
            try:
                result = check_func()
                results['checks'][name] = {
                    'status': 'healthy' if result else 'unhealthy',
                    'timestamp': datetime.utcnow().isoformat()
                }
            except Exception as e:
                results['checks'][name] = {
                    'status': 'error',
                    'error': str(e),
                    'timestamp': datetime.utcnow().isoformat()
                }
                results['status'] = 'unhealthy'

        self.last_check = results
        return results

    def get_health_status(self) -> dict:
        """Get current health status"""
        if self.last_check:
            return self.last_check
        return self.run_health_checks()

# Global health monitor instance
health_monitor = ProductionHealthMonitor()


// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:51Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
tools/update_md_refs.py

Generates `ALLMDFILESREFS.md` with a list of all Markdown files in the repo
and updates API/webhook/endpoint-related Markdown files with a safe
"Automated-check" footer noting the timestamp the automation ran.

Behavior:
- Scans repository for .md/.mdx files (skipping .git, node_modules, .venv, tools/.gitignored patterns).
- Writes/overwrites `ALLMDFILESREFS.md` at repo root.
- For files matching keywords (api,endpoints,endpoint,webhook,webhooks,hook,hooks), creates a backup `file.bak` and ensures a footer line:
    "<!-- AUTOMATED-CHECK: YYYY-MM-DD HH:MM:SS UTC -->"
  is present and updated.
- If --apply is passed, stage changes, create a branch `auto/update-mds-<ts>`, commit and push, and create a PR via the GitHub API using `GITHUB_TOKEN`.

Safe defaults: dry-run unless --apply provided.
"""
from __future__ import annotations
import { specificExports } from pathlib import Path
import re
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {'.git', 'node_modules', '.venv', '__pycache__'}
KEYWORDS = ['api', 'endpoint', 'endpoints', 'webhook', 'webhooks', 'hook', 'hooks']

"""
    find_md_files function
    """
def find_md_files(root: Path) -> Any:
    out = []
    for p in root.rglob('*.md'):
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        out.append(p)
    for p in root.rglob('*.mdx'):
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        out.append(p)
    return sorted(out)

"""
    write_allmd function
    """
def write_allmd(refs, out_path: Path) -> Any:
    lines = ["# ALLMDFILESREFS\n", f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}\n\n"]
    for p in refs:
        lines.append(str(p.relative_to(ROOT)) + '\n')
    out_path.write_text(''.join(lines), encoding='utf-8')

"""
    needs_footer function
    """
def needs_footer(path: Path) -> Any:
    txt = path.read_text(encoding='utf-8', errors='ignore')
    return any(re.search(rf"\b{k}\b", txt, re.IGNORECASE) for k in KEYWORDS)

"""
    update_footer function
    """
def update_footer(path: Path, ts: str) -> Any:
    txt = path.read_text(encoding='utf-8', errors='ignore')
    footer = f"<!-- AUTOMATED-CHECK: {ts} -->"
    if footer in txt:
        return False
    # remove any prior AUTOMATED-CHECK footer
    txt = re.sub(r"<!-- AUTOMATED-CHECK: .*?-->", '', txt, flags=re.DOTALL)
    # append footer separated by blank line
    new = txt.rstrip() + '\n\n' + footer + '\n'
    bak = path.with_suffix(path.suffix + '.bak')
    if not bak.exists():
        path.replace(bak)
        # write new content to original path
        bak.read_text(encoding='utf-8')
        path.write_text(new, encoding='utf-8')
        return True
    else:
        # if backup exists, just overwrite original safely
        path.write_text(new, encoding='utf-8')
        return True

"""
    git_commit_and_pr function
    """
def git_commit_and_pr(files_changed, branch_name, pr_title, pr_body) -> Any:
    subprocess.check_call(['git', 'checkout', '-b', branch_name])
    subprocess.check_call(['git', 'add'] + files_changed)
    subprocess.check_call(['git', '-c', 'commit.gpgsign=false', 'commit', '-m', pr_title])
    subprocess.check_call(['git', 'push', '--set-upstream', 'origin', branch_name])
    # create PR via API
    token = os.environ.get('GITHUB_TOKEN')
    if not token:
        logger.info('GITHUB_TOKEN not found; PR not created')
        return None
    repo = os.environ.get('GITHUB_REPOSITORY', 'thestablekenya/qmoi-enhanced')
    data = json.dumps({
        'title': pr_title,
        'head': branch_name,
        'base': os.environ.get('GITHUB_BASE_BRANCH', 'autosync-backup-20250926-232440'),
        'body': pr_body
    }).encode('utf-8')
    req = urllib.request.Request(f'https://api.github.com/repos/{repo}/pulls', data=data, method='POST', headers={
        'Authorization': f'token {token}', 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json'
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.load(resp)
    except Exception as e:
        logger.info('PR creation failed:', e)
        return None

"""
    main function
    """
def main(apply_changes: bool = False) -> Any:
    md_files = find_md_files(ROOT)
    allmd = ROOT / 'ALLMDFILESREFS.md'
    write_allmd(md_files, allmd)
    ts = time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())
    changed = []
    for p in md_files:
        if needs_footer(p):
            ok = update_footer(p, ts)
            if ok:
                changed.append(str(p))
    # always include ALLMDFILESREFS.md
    if str(allmd) not in changed:
        changed.insert(0, str(allmd))

    logger.info('Files changed:', changed)
    if apply_changes and changed:
        branch = f'auto/update-mds-{int(time.time())}'
        pr = git_commit_and_pr(changed, branch, 'chore: update ALLMDFILESREFS.md and MD check footers', 'Automated update of MD refs and last-checked footers')
        logger.info('PR result:', pr)
    else:
        logger.info('Dry-run complete. Use --apply to commit/push/create PR.')


    p = argparse.ArgumentParser()
    p.add_argument('--apply', action='store_true')
    args = p.parse_args()
    main(apply_changes=args.apply)
