#!/usr/bin/env python3
"""Run QMOI health checks and ensure all health automation scripts execute."""

import logging
import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LOG_FILE = ROOT / 'scripts' / 'ensure_all_healths.log'

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

CHECK_COMMANDS = [
    ('Bash healthcheck', ROOT / 'scripts' / 'healthcheck.sh', 'bash'),
    ('Bash health-check', ROOT / 'scripts' / 'health-check.sh', 'bash'),
    ('Bash prod-healthcheck', ROOT / 'scripts' / 'prod-healthcheck.sh', 'bash'),
    ('Bash dev-healthcheck', ROOT / 'scripts' / 'dev-healthcheck.sh', 'bash'),
    ('Python health_monitor', ROOT / 'scripts' / 'health_monitor.py', sys.executable),
    ('Python qmoi_health_monitor', ROOT / 'scripts' / 'qmoi_health_monitor.py', sys.executable),
    ('Python domain_health_check', ROOT / 'scripts' / 'domain_health_check.py', sys.executable),
    ('Python comprehensive_domain_health_validator', ROOT / 'scripts' / 'comprehensive_domain_health_validator.py', sys.executable),
    ('Python force_full_domain_health', ROOT / 'scripts' / 'force_full_domain_health.py', sys.executable),
    ('Python domain_health_automation', ROOT / 'scripts' / 'domain_health_automation.py', sys.executable),
    ('Python comprehensive_domain_health_restorer', ROOT / 'scripts' / 'comprehensive_domain_health_restorer.py', sys.executable),
    ('Node qmoi-production-autohealth', ROOT / 'scripts' / 'qmoi-production-autohealth.js', 'node'),
    ('Python generate_allhealths', ROOT / 'scripts' / 'generate_allhealths.py', sys.executable),
]


def run_command(name, script_path, executor):
    if not script_path.exists():
        logger.info(f'Skipping missing script: {script_path}')
        return True

    cmd = [executor, str(script_path)] if executor != 'bash' and executor != 'node' else [executor, str(script_path)]
    logger.info(f'Running {name}: {" ".join(cmd)}')
    try:
        pass
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
        subprocess.run(cmd, cwd=ROOT, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        logger.info(f'{name} completed successfully.')
        return True
    except subprocess.CalledProcessError as exc:
        logger.error(f'{name} failed with code {exc.returncode}')
        logger.error(exc.stdout)
        logger.error(exc.stderr)
        return False
    except FileNotFoundError as exc:
        logger.error(f'Executor not found: {executor} - {exc}')
        return False


def main():
    logger.info('Starting QMOI health automation enforcement run.')
    results = []

    for name, script_path, executor in CHECK_COMMANDS:
        success = run_command(name, script_path, executor)
        results.append((name, success, script_path))

    healthy = all(success for _, success, _ in results)
    health_status = 'HEALTHY' if healthy else 'UNHEALTHY'
    logger.info(f'Health automation summary: {health_status}')
    logger.info('Executed scripts:')
    for name, success, script_path in results:
        logger.info(f'- {name}: {"PASS" if success else "FAIL"} ({script_path})')

    if not healthy:
        logger.warning('One or more health enforcement scripts failed. Please investigate logs/outputs.')

    logger.info('QMOI health automation enforcement run complete.')
    return 0 if healthy else 1


if __name__ == '__main__':
    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    # Configure production logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        # production application startup
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            # GUI application
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            # CLI or service application
            main()
    except KeyboardInterrupt:
        logger.info("Application shutdown requested by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Application failed to start: {e}")
        sys.exit(1)
    import sys
    import logging

    # Configure production logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        # production application startup
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            # GUI application
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            # CLI or service application
            main()
    except KeyboardInterrupt:
        logger.info("Application shutdown requested by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Application failed to start: {e}")
        sys.exit(1)
    raise SystemExit(main())
