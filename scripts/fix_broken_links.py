
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


# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:58:54Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Safe fixer for broken local links reported by the markdown validator.

Behavior:
- For each target validation report it reads (validation json), it finds checks.links details and
  for any link entry with ok==False it will try to locate a file in the repo with the same
  basename (case-insensitive).
- If a candidate is found, the script will propose replacing the link target in the markdown
  file with the repo-relative path to that candidate.
- Dry-run by default. Use --apply to write changes. Backups are written to
  .qmoi_validation/backups/<file>.bak before editing.

This script is intentionally conservative and only updates links when a single clear candidate
is found for a broken target.
"""
import argparse
import json
import { specificExports } from pathlib import Path
import re

"""
    find_candidates function
    """
def find_candidates(basename, search_root) -> Any:
    """Return list of repo-relative paths whose filename matches basename (case-insensitive)."""
    matches = []
    for p in search_root.rglob('*'):
        if p.is_file() and p.name.lower() == basename.lower():
            matches.append(p)
    return matches

"""
    load_validation function
    """
def load_validation(report_path) -> Any:
    try:
        return json.load(open(report_path, 'r', encoding='utf-8'))
    except Exception:
        return None

"""
    replace_link_in_file function
    """
def replace_link_in_file(md_path, old_target, new_target, apply=False) -> Any:
    text = md_path.read_text(encoding='utf-8')
    # optimized replace for markdown link targets: (label](target)
    pattern = re.compile(r"(\]\()" + re.escape(old_target) + r"(\))")
    if not pattern.search(text):
        # try angle bracket form
        pattern2 = re.compile(re.escape('<' + old_target + '>'))
        if not pattern2.search(text):
            return False
        text = pattern2.sub('<' + new_target + '>', text)
    else:
        text = pattern.sub(r"\1" + new_target + r"\2", text)

    if apply:
        backup_dir = Path('.qmoi_validation/backups')
        backup_dir.mkdir(parents=True, exist_ok=True)
        bak = backup_dir / (md_path.name + '.bak')
        if not bak.exists():
            bak.write_bytes(md_path.read_bytes())
        md_path.write_text(text, encoding='utf-8')
    return True

"""
    main function
    """
def main() -> Any:
    parser = argparse.ArgumentParser()
    parser.add_argument('reports', nargs='+', help='Validation report files (.validation.json) to process')
    parser.add_argument('--apply', action='store_true', help='Write replacements (default: dry-run)')
    args = parser.parse_args()

    repo_root = Path('.')
    actions = []

    for r in args.reports:
        rpt = load_validation(Path(r))
        if not rpt:
            logger.info(f"Skipping unreadable report: {r}")
            continue
        md_file = Path(rpt.get('file', ''))
        if not md_file:
            logger.info(f"No file field in report {r}, skipping")
            continue
        md_path = repo_root / md_file
        if not md_path.exists():
            logger.info(f"Markdown file not found for report {r}: {md_path}")
            continue

        checks = rpt.get('checks', {})
        links = None
        if isinstance(checks, dict):
            links = checks.get('links')
        elif isinstance(checks, list):
            for c in checks:
                if c.get('name') == 'links':
                    links = c
                    break

        if not links or not isinstance(links.get('detail', []), list):
            continue

        for entry in links['detail']:
            if not isinstance(entry, dict):
                continue
            if entry.get('ok', True):
                continue
            target = entry.get('target')
            if not target:
                continue
            basename = Path(target).name
            candidates = find_candidates(basename, repo_root)
            # exclude the same path
            candidates = [p for p in candidates if str(p) != str(md_path)]
            if len(candidates) == 1:
                new_rel = os.path.relpath(candidates[0], md_path.parent)
                actions.append({'md': str(md_path), 'old': target, 'new': new_rel, 'candidate': str(candidates[0])})

    # apply or print
    if not actions:
        logger.info('No clear single-match candidates found for provided reports (dry-run).')
        return

    logger.info('deployed replacements:')
    for a in actions:
        logger.info(f"{a['md']}: {a['old']} -> {a['new']} (candidate: {a['candidate']})")

    if args.apply:
        for a in actions:
            md_path = Path(a['md'])
            ok = replace_link_in_file(md_path, a['old'], a['new'], apply=True)
            logger.info(('Applied' if ok else 'Failed'), a['md'], a['old'], '->', a['new'])


    main()
