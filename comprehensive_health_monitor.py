#!/usr/bin/env python3
"""
Comprehensive Health Monitoring System
Monitors all aspects of QMOI health and writes a JSON report.
"""
import json
import logging
import os
import shutil
import socket
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict

try:
    import psutil
    PSUTIL_AVAILABLE = True
except ImportError:
    PSUTIL_AVAILABLE = False

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')


class ComprehensiveHealthMonitor:
    def __init__(self, report_path: Path = Path('health_report.json')):
        self.health_metrics: Dict[str, Any] = {}
        self.report_path = report_path

    def check_system_health(self) -> Dict[str, Any]:
        if PSUTIL_AVAILABLE:
            metrics = {
                'cpu_percent': psutil.cpu_percent(interval=1),
                'memory_percent': psutil.virtual_memory().percent,
                'disk_usage_percent': psutil.disk_usage('/').percent,
                'load_average': os.getloadavg() if hasattr(os, 'getloadavg') else None,
                'timestamp': datetime.now(timezone.utc).isoformat(),
            }
        else:
            total, used, _ = shutil.disk_usage('/')
            metrics = {
                'cpu_percent': None,
                'memory_percent': None,
                'disk_usage_percent': round(used / total * 100, 2) if total else None,
                'load_average': os.getloadavg() if hasattr(os, 'getloadavg') else None,
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'note': 'psutil not available; using safe fallback metrics',
            }
        self.health_metrics['system_health'] = metrics
        return metrics

    def check_application_health(self) -> Dict[str, Any]:
        services = []
        if self._path_exists(Path('config.json')):
            services.append('configuration')
        if self._port_open(8000):
            services.append('api')
        self.health_metrics['application_health'] = {
            'status': 'healthy' if services else 'degraded',
            'services': services,
            'timestamp': datetime.utcnow().isoformat() + 'Z',
        }
        return self.health_metrics['application_health']

    def generate_report(self) -> Dict[str, Any]:
        system_health = self.check_system_health()
        app_health = self.check_application_health()
        overall_status = 'healthy'
        if system_health.get('cpu_percent') is not None and system_health['cpu_percent'] >= 90:
            overall_status = 'warning'
        if app_health['status'] != 'healthy':
            overall_status = 'degraded'
        report = {
            'generated_at': datetime.now(timezone.utc).isoformat(),
            'overall_status': overall_status,
            'system_health': system_health,
            'application_health': app_health,
        }
        self._save_report(report)
        return report

    def _save_report(self, report: Dict[str, Any]) -> None:
        try:
            self.report_path.parent.mkdir(parents=True, exist_ok=True)
            with self.report_path.open('w', encoding='utf-8') as f:
                json.dump(report, f, indent=2)
            logger.info('Health report written to %s', self.report_path)
        except OSError as exc:
            logger.error('Failed to save health report to %s: %s', self.report_path, exc)
            raise

    @staticmethod
    def _path_exists(path: Path) -> bool:
        return path.exists()

    @staticmethod
    def _port_open(port: int) -> bool:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(0.5)
            return sock.connect_ex(('127.0.0.1', port)) == 0


def main() -> int:
    report_path = Path(os.environ.get('QMOI_HEALTH_REPORT', 'health_report.json'))
    monitor = ComprehensiveHealthMonitor(report_path)
    report = monitor.generate_report()
    logger.info('Health report status: %s', report['overall_status'])
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        logger.info('Health monitor interrupted by user.')
        sys.exit(0)
    except Exception as exc:
        logger.exception('Health monitor failed: %s', exc)
        sys.exit(1)
