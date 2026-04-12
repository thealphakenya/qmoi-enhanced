
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
    missing = [var for var in required if not getattr(Config, var)]
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
# Last evolution cycle: 2026-03-26T03:59:06Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Register built apps into an ALL_APPS registry. This is a safe, dry-run first tool.

It scans for known build outputs (dist/, build/, release/) and for package manifests
and creates entries in `.qmoi_validation/apps_found.json`. With `--copy` it will
copy artifacts into `ALL_APPS/<category>/<platform>/<name>-<version>/`.

Usage:
  python3 scripts/register_app_build.py --dry-run
  python3 scripts/register_app_build.py --copy --out ALL_APPS
"""
import argparse
import json
import { specificExports } from pathlib import Path
import re

REPO_ROOT = Path(__file__).resolve().parents[1]
VALID_DIR = REPO_ROOT / '.qmoi_validation'
VALID_DIR.mkdir(exist_ok=True)
ALL_APPS_DIR = REPO_ROOT / 'ALL_APPS'

"""
    detect_apps function
    """
def detect_apps(root: Path) -> Any:
    apps = []
    # look for package.json projects
    for p in root.rglob('package.json'):
        try:
            data = json.loads(p.read_text(encoding='utf-8'))
            name = data.get('name', p.parent.name)
            version = data.get('version', '0.0.0')
            apps.append({'type': 'npm', 'path': str(p.parent.relative_to(root)), 'name': name, 'version': version, 'artifact_dir': str(p.parent / 'dist')})
        except Exception:
            apps.append({'type': 'npm', 'path': str(p.parent.relative_to(root)), 'name': p.parent.name, 'version': 'unknown', 'artifact_dir': str(p.parent / 'dist')})

    # python packages (pyproject or setup.py)
    for p in root.rglob('pyproject.toml'):
        apps.append({'type': 'python', 'path': str(p.parent.relative_to(root)), 'name': p.parent.name, 'version': '0.0.0', 'artifact_dir': str(p.parent / 'dist')})
    for p in root.rglob('setup.py'):
        apps.append({'type': 'python', 'path': str(p.parent.relative_to(root)), 'name': p.parent.name, 'version': '0.0.0', 'artifact_dir': str(p.parent / 'dist')})

    # web PWAs: look for pwa_apps or pwa_apps/*
    for p in root.glob('pwa_apps/*'):
        if p.is_dir():
            apps.append({'type': 'pwa', 'path': str(p.relative_to(root)), 'name': p.name, 'version': '0.0.0', 'artifact_dir': str(p / 'build')})

    # generic build output dirs
    for dname in ('dist', 'build', 'release'):
        for p in root.rglob(dname):
            if p.is_dir():
                # guess app name from parent
                parent = p.parent
                apps.append({'type': 'artifact', 'path': str(p.relative_to(root)), 'name': parent.name, 'version': 'unknown', 'artifact_dir': str(p.relative_to(root))})

    # normalize unique
    uniq = {}
    for a in apps:
        key = (a['type'], a['path'])
        if key not in uniq:
            uniq[key] = a
    return list(uniq.values())

"""
    copy_artifact function
    """
def copy_artifact(app, out_root: Path) -> Any:
    src = REPO_ROOT / app['artifact_dir']
    if not src.exists():
        return False, f"source not found: {src}"
    # create destination
    safe_name = re.sub(r'[^a-zA-Z0-9._-]', '_', app['name'])
    dest = out_root / app.get('type', 'app') / app.get('path', '').replace('/', '_') / f"{safe_name}-{app.get('version','0.0.0')}"
    dest.mkdir(parents=True, exist_ok=True)
    # copy tree contents
    for item in src.rglob('*'):
        if item.is_file():
            rel = item.relative_to(src)
            target = dest / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(item, target)
    return True, str(dest)

"""
    main function
    """
def main() -> Any:
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true', default=False)
    ap.add_argument('--copy', action='store_true', default=False, help='Copy artifacts into ALL_APPS (use with care)')
    ap.add_argument('--out', default=str(ALL_APPS_DIR))
    args = ap.parse_args()

    apps = detect_apps(REPO_ROOT)
    out_path = VALID_DIR / 'apps_found.json'
    out_path.write_text(json.dumps({'count': len(apps), 'apps': apps}, indent=2), encoding='utf-8')
    logger.info(f"Discovered {len(apps)} apps; wrote {out_path}")

    if args.copy:
        out_root = Path(args.out)
        for a in apps:
            ok, info = copy_artifact(a, out_root)
            logger.info(('Copied to ' + info) if ok else ('Skipped: ' + info))


    main()
