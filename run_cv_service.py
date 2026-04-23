<!-- AUTODEV Enhanced: 2026-04-20T09:07:01.121324 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:07.268844 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:03.103894 -->
#!/usr/bin/env python3
"""
CV Service Runner
Runs the computer vision service as a standalone process
"""

import time
import logging
import signal
import sys
from cv_service import cv_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('cv_service.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Global flag for graceful shutdown
running = True

def signal_handler(signum, frame):
    global running
    logger.info("Received shutdown signal, stopping service...")
    running = False

def main():
    global running

    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    logger.info("CV Service starting...")

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
        # Initialize the service
        logger.info("CV Service ready and waiting for requests")

        # Keep the service running
        while running:
            time.sleep(1)

    except Exception as e:
        logger.error(f"Error in CV Service: {e}")
        sys.exit(1)

    logger.info("CV Service stopped")

if __name__ == "__main__":
    main()