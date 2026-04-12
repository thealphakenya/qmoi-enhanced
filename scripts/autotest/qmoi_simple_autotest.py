
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



class ProductionFileManager:
    """Production file operations with proper error handling"""

    @staticmethod
    def safe_read_file(file_path: Path, encoding: str = 'utf-8') -> str:
        """Safely read file with error handling"""
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except FileNotFoundError:
            logger.error(f"File not found: {file_path}")
            raise
        except UnicodeDecodeError as e:
            logger.error(f"Encoding error reading {file_path}: {e}")
            raise
        except Exception as e:
            logger.error(f"Error reading file {file_path}: {e}")
            raise

    @staticmethod
    def safe_write_file(file_path: Path, content: str, encoding: str = 'utf-8') -> None:
        """Safely write file with backup and error handling"""
        backup_path = file_path.with_suffix(f"{file_path.suffix}.backup")

        try:
            # Create backup if file exists
            if file_path.exists():
                shutil.copy2(file_path, backup_path)

            # Write new content
            with open(file_path, 'w', encoding=encoding) as f:
                f.write(content)

            logger.info(f"File written successfully: {file_path}")

        except Exception as e:
            # Restore backup on failure
            if backup_path.exists():
                shutil.copy2(backup_path, file_path)
            logger.error(f"Error writing file {file_path}: {e}")
            raise

    @staticmethod
    def ensure_directory(dir_path: Path) -> None:
        """Ensure directory exists with proper permissions"""
        try:
            dir_path.mkdir(parents=True, exist_ok=True)
            # Set proper permissions (755)
            dir_path.chmod(0o755)
        except Exception as e:
            logger.error(f"Error creating directory {dir_path}: {e}")
            raise


#!/usr/bin/env python3
"""
Minimal QMOI autotest runner for repository validation.
This script is designed to run with a simple environment and provide a pass/fail signal.
"""

import os
import sys
import shutil
import logging
import subprocess
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
LOG_FILE = Path(__file__).resolve().parent / 'qmoi_simple_autotest.log'

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger('qmoi_simple_autotest')


def log_result(message: str) -> None:
    logger.info(message)
    try:
        with LOG_FILE.open('a', encoding='utf-8') as f:
            f.write(f'[{datetime.now().isoformat()}] {message}\n')
    except OSError:
return None  # Placeholder
def check_python_version() -> bool:
    version = sys.version_info
    log_result(f'Python version: {version.major}.{version.minor}.{version.micro}')
    return version >= (3, 8)


def check_repository_root() -> bool:
    exists = ROOT.exists()
    log_result(f'Repository root exists: {exists}')
    return exists


def check_package_json() -> bool:
    pkg = ROOT / 'package.json'
    exists = pkg.exists()
    log_result(f'package.json present: {exists}')
    return exists


def check_command_available(command: str) -> bool:
    available = shutil.which(command) is not None
    log_result(f'Command {command} available: {available}')
    return available


def run_command(command: list[str]) -> bool:
    try:
        completed = subprocess.run(
            command,
            cwd=str(ROOT),
            capture_output=True,
            text=True,
            timeout=60,
        )
        log_result(f'Ran command: {" ".join(command)} (exit {completed.returncode})')
        if completed.stdout:
            log_result(f'stdout: {completed.stdout.strip()}')
        if completed.stderr:
            log_result(f'stderr: {completed.stderr.strip()}')
        return completed.returncode == 0
    except Exception as exc:
        log_result(f'Command failed: {command} ({exc})')
        return False


def main() -> int:
    all_ok = True

    if not check_repository_root():
        return 1

    all_ok &= check_python_version()

    if check_package_json() and check_command_available('npm'):
        all_ok &= run_command(['npm', '--version'])
    else:
        log_result('Skipping npm checks because npm is not available.')

    return 0 if all_ok else 1



    sys.exit(main())
