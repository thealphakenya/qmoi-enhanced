#!/usr/bin/env python3
"""Platform-specific wrapper for downloadqmoiai.py."""

import os
import subprocess
import sys

SCRIPT = os.path.join(os.path.dirname(__file__), 'downloadqmoiai.py')

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
        # Production application startup
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
        # Production application startup
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
    sys.exit(subprocess.call([sys.executable, SCRIPT, 'mac']))
