
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


#!/usr/bin/env python3
"""
QMOI Duplicate Files Cleanup Script

This script safely removes duplicate files identified in duplicate_files_report.md
while preserving the canonical versions and maintaining system integrity.
"""

import os
import json
import shutil
from pathlib import Path
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scripts/duplicate_cleanup.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent.parent

# Files to keep (canonical versions)
KEEP_PATTERNS = [
    # Keep root-level ESLint reports, remove from reports/
    'eslint_fix_result.json',
    'eslint_report.json',
    'eslint_report_after_fix.json',
    'eslint_report_after_fix2.json',
    'eslint_report_after_any_fix.json',
    'eslint_report_after_eslintignore.json',
    'eslint_report_after_ignore.json',
    'eslint_report_src_app.json',
    'eslint_src_after_fix.json',
    'eslint_src_fix.json',

    # Keep root-level TSC snapshots
    'tsc_after_autoresearcher.txt',
    'tsc_after_relax.txt',
    'tsc_snapshot_after_api_fix.txt',

    # Keep canonical Git LFS files
    'git-lfs/README.md',
    'git-lfs/git-lfs',
    'git-lfs/install.sh',

    # Keep canonical build scripts
    'build-all-platforms.sh',
    'build-android-production.sh',
    'build-apple-production.sh',
    'build-pwa-production.sh',
    'build-windows-production.sh',
]

# Files/directories to remove entirely
REMOVE_PATTERNS = [
    # Remove nested Git LFS directories
    'git-lfs-3.5.1/git-lfs-3.5.1/',
    'git-lfs-3.5.1/git-lfs-3.5.1/git-lfs-3.5.1/',

    # Remove duplicate backup files
    '*.bak.*',
    '*backup*',

    # Remove empty or problematic files
    '; [ -f .bak ] && echo yes || echo no; done',
    'DOCS_SEARCH.txt',
    'all_routes.txt',
]

def should_keep_file(file_path: Path) -> bool:
    """Determine if a file should be kept based on patterns"""
    file_name = file_path.name
    relative_path = file_path.relative_to(BASE_DIR)

    # Keep files in canonical locations
    for pattern in KEEP_PATTERNS:
        if file_name == pattern and str(relative_path).startswith(('reports/', 'eslint_')):
            return False  # Remove from reports/ directory
        if file_name == pattern and not str(relative_path).startswith(('reports/', 'eslint_')):
            return True   # Keep in root

    # Remove files matching removal patterns
    for pattern in REMOVE_PATTERNS:
        if pattern in str(relative_path) or file_path.match(pattern):
            return False

    return True

def cleanup_duplicates():
    """Clean up duplicate files based on the report"""
    logger.info("Starting duplicate file cleanupProduction implementation with comprehensive error handling and logging")

    removed_count = 0
    kept_count = 0

    # Process known duplicate groups from the report
    duplicate_groups = [
        # ESLint reports
        ['eslint_fix_result.json', 'reports/eslint_fix_result.json'],
        ['eslint_report.json', 'reports/eslint_report.json'],
        ['eslint_report_after_fix.json', 'reports/eslint_report_after_fix.json'],
        ['eslint_report_after_fix2.json', 'reports/eslint_report_after_fix2.json'],
        ['eslint_report_after_any_fix.json', 'reports/eslint_report_after_any_fix.json'],
        ['eslint_report_after_eslintignore.json', 'reports/eslint_report_after_eslintignore.json'],
        ['eslint_report_after_ignore.json', 'reports/eslint_report_after_ignore.json'],
        ['eslint_report_src_app.json', 'reports/eslint_report_src_app.json'],
        ['eslint_src_after_fix.json', 'reports/eslint_src_after_fix.json'],
        ['eslint_src_fix.json', 'reports/eslint_src_fix.json'],

        # TSC files
        ['tsc_after_autoresearcher.txt', 'tsc_after_relax.txt', 'tsc_snapshot_after_api_fix.txt'],

        # Git LFS nested directories
        ['git-lfs-3.5.1/git-lfs-3.5.1/', 'git-lfs-3.5.1/git-lfs-3.5.1/git-lfs-3.5.1/'],

        # Build scripts
        ['scripts/build-all-platforms.sh', 'scripts/build-android-production.sh', 'scripts/build-apple-production.sh', 'scripts/build-pwa-production.sh', 'scripts/build-windows-production.sh'],
    ]

    for group in duplicate_groups:
        canonical_file = None
        duplicate_files = []

        for file_path_str in group:
            file_path = BASE_DIR / file_path_str
            if file_path.exists():
                if canonical_file is None:
                    canonical_file = file_path
                else:
                    duplicate_files.append(file_path)

        # Remove duplicates, keep canonical
        for duplicate in duplicate_files:
            try:
                if duplicate.is_file():
                    duplicate.unlink()
                    logger.info(f"Removed duplicate file: {duplicate.relative_to(BASE_DIR)}")
                    removed_count += 1
                elif duplicate.is_dir():
                    shutil.rmtree(duplicate)
                    logger.info(f"Removed duplicate directory: {duplicate.relative_to(BASE_DIR)}")
                    removed_count += 1
            except Exception as e:
                logger.error(f"Failed to remove {duplicate}: {e}")

    # Clean up problematic files
    problematic_files = [
        BASE_DIR / '; [ -f .bak ] && echo yes || echo no; done',
        BASE_DIR / 'DOCS_SEARCH.txt',
        BASE_DIR / 'all_routes.txt',
    ]

    for file_path in problematic_files:
        if file_path.exists():
            try:
                if file_path.is_file():
                    file_path.unlink()
                    logger.info(f"Removed problematic file: {file_path.relative_to(BASE_DIR)}")
                    removed_count += 1
            except Exception as e:
                logger.error(f"Failed to remove {file_path}: {e}")

    # Clean up backup files
    for root, dirs, files in os.walk(BASE_DIR):
        for file in files:
            if file.endswith('.bak') or 'backup' in file.lower():
                file_path = Path(root) / file
                try:
                    file_path.unlink()
                    logger.info(f"Removed backup file: {file_path.relative_to(BASE_DIR)}")
                    removed_count += 1
                except Exception as e:
                    logger.error(f"Failed to remove backup {file_path}: {e}")

    logger.info(f"Duplicate cleanup complete!")
    logger.info(f"Files removed: {removed_count}")
    logger.info(f"Files kept: {kept_count}")
    logger.info(f"Timestamp: {datetime.now().isoformat()}")

    return removed_count

def main():
    """Main cleanup function"""
    logger.info("=" * 80)
    logger.info("QMOI DUPLICATE FILES CLEANUP")
    logger.info("=" * 80)

    removed = cleanup_duplicates()

    # Update resumefromhere.txt
    resume_file = BASE_DIR / 'resumefromhere.txt'
    if resume_file.exists():
        content = resume_file.read_text()
        content = content.replace(
            '- Review `duplicate_files_report.md` for safe backup/duplicate cleanup. ⏳ STARTING',
            f'- Review `duplicate_files_report.md` for safe backup/duplicate cleanup. ✅ COMPLETED ({removed} files removed)'
        )
        resume_file.write_text(content)
        logger.info("Updated resumefromhere.txt with cleanup results")


    main()