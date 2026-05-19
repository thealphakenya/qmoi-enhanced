#!/usr/bin/env python3
"""Health optimization utility for QMOI."""
import logging
import sys
from pathlib import Path
from typing import Any, Dict, List

from comprehensive_health_monitor import ComprehensiveHealthMonitor

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')


class HealthOptimizer:
    def __init__(self, report_path: Path = Path('health_report.json')):
        self.monitor = ComprehensiveHealthMonitor(report_path)

    def optimize(self) -> Dict[str, Any]:
        report = self.monitor.generate_report()
        recommendations: List[str] = []
        system = report.get('system_health', {})
        if system.get('cpu_percent') is not None and system['cpu_percent'] >= 85:
            recommendations.append('CPU usage is high. Consider scaling or reducing load.')
        if system.get('disk_usage_percent') is not None and system['disk_usage_percent'] >= 90:
            recommendations.append('Disk usage is critical. Free space or add storage.')
        app_health = report.get('application_health', {})
        if app_health.get('status') != 'healthy':
            recommendations.append('Application health degraded. Check configured services.')
        return {'report': report, 'recommendations': recommendations}


def main() -> int:
    optimizer = HealthOptimizer()
    result = optimizer.optimize()
    logger.info('Health optimization completed with %d recommendations.', len(result['recommendations']))
    for recommendation in result['recommendations']:
        logger.info('Recommendation: %s', recommendation)
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except Exception as exc:
        logger.exception('Health optimizer failed: %s', exc)
        sys.exit(1)
