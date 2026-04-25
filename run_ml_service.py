<!-- AUTODEV Enhanced: 2026-04-20T09:06:55.764336 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:06.776281 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:02.441341 -->
#!/usr/bin/env python3
"""
ML Service Runner
Runs the machine learning service as a standalone process
"""
import time
import logging
import signal
import sys
from ml_service import ml_service
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ml_service.log'),
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
    logger.info("ML Service starting...")
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
        logger.info("ML Service ready and waiting for requests")
        # Keep the service running
        while running:
            time.sleep(1)
    except Exception as e:
        logger.error(f"Error in ML Service: {e}")
        sys.exit(1)
    logger.info("ML Service stopped")
if __name__ == "__main__":
    main()