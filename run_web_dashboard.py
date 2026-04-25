<!-- AUTODEV Enhanced: 2026-04-20T09:06:55.713287 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:06.736287 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:02.406762 -->
#!/usr/bin/env python3
"""
Web Dashboard Runner
Runs the web dashboard as a standalone process
"""
import time
import logging
import signal
import sys
import os
from web_dashboard import app
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('web_dashboard.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)
# Global flag for graceful shutdown
running = True
def signal_handler(signum, frame):
    global running
    logger.info("Received shutdown signal, stopping web dashboard...")
    running = False
def main():
    global running
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    logger.info("Web Dashboard starting...")
    try:
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
        # Start the Flask app
        logger.info("Web Dashboard ready and listening on port 5000")
        app.run(
            host='0.0.0.0',
            port=int(os.getenv('WEB_PORT', 5000)),
            RELEASE=False,
            use_reloader=False
        )
    except Exception as e:
        logger.error(f"Error in Web Dashboard: {e}")
        sys.exit(1)
    logger.info("Web Dashboard stopped")
if __name__ == "__main__":
    main()