#!/usr/bin/env python3
"""Security monitoring utilities for QMOI."""
import logging
import os
import stat
import sys
from pathlib import Path
from typing import Any, Dict, List

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')


class SecurityMonitor:
    def __init__(self, paths: List[Path] = None):
        self.paths = paths or [Path('config.json'), Path('secrets.json')]

    def scan(self) -> Dict[str, Any]:
        findings = {
            'environment': self._check_sensitive_env(),
            'file_permissions': self._check_permissions(self.paths),
            'runtime': self._check_runtime(),
        }
        findings['status'] = 'secure' if all(not item['issue'] for item in findings.values()) else 'warning'
        return findings

    def _check_sensitive_env(self) -> Dict[str, Any]:
        sensitive_keys = [key for key in os.environ if 'SECRET' in key or 'KEY' in key or 'TOKEN' in key]
        return {
            'issue': bool(sensitive_keys),
            'details': sensitive_keys[:10],
            'message': 'Sensitive environment variable names detected; verify secrets management.' if sensitive_keys else 'No sensitive environment variables discovered.'
        }

    def _check_permissions(self, paths: List[Path]) -> Dict[str, Any]:
        issues = []
        for path in paths:
            if path.exists():
                mode = path.stat().st_mode
                if mode & stat.S_IWOTH:
                    issues.append(f'World-writable file: {path}')
        return {
            'issue': bool(issues),
            'details': issues,
            'message': 'Fix file permissions for production security.' if issues else 'File permissions are appropriate.'
        }

    def _check_runtime(self) -> Dict[str, Any]:
        issues = []
        if os.geteuid() == 0:
            issues.append('Running as root user; avoid root in production.')
        return {
            'issue': bool(issues),
            'details': issues,
            'message': 'Runtime environment must not run as root.' if issues else 'Runtime environment looks acceptable.'
        }


def main() -> int:
    monitor = SecurityMonitor()
    findings = monitor.scan()
    logger.info('Security status: %s', findings['status'])
    for key, value in findings.items():
        if key == 'status':
            continue
        logger.info('%s: %s', key, value['message'])
        if value['details']:
            logger.debug('%s details: %s', key, value['details'])
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except Exception as exc:
        logger.exception('Security monitor failed: %s', exc)
        sys.exit(1)
