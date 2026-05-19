#!/usr/bin/env python3
"""Integration health check utility for QMOI."""
import logging
import sys
from pathlib import Path

from health_validator import QMOIHealthValidator

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')


def main(workspace: str = '.') -> int:
    validator = QMOIHealthValidator(workspace)
    report = validator.run_comprehensive_health_check()
    logger.info('Integration health check completed: overall score %s', report.get('overall_health_score'))
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except Exception as exc:
        logger.exception('Integration health check failed: %s', exc)
        sys.exit(1)
