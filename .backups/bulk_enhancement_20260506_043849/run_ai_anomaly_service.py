<!-- AUTOPRODUCTION Enhanced: 2026-04-20T09:07:05.583211 -->
<!-- AUTOPRODUCTION Enhanced: 2026-04-20T09:01:07.483942 -->
<!-- AUTOPRODUCTION Enhanced: 2026-04-20T08:55:03.389748 -->
#!/usr/bin/env python3
"""
AI Anomaly Service Runner
Runs the anomaly detection service as a standalone process
"""
import time
import logging
import signal
import sys
from ai_anomaly_service import anomaly_service
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ai_anomaly_service.log'),
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
    logger.info("AI Anomaly Service starting...")
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
        # Pre-train the model
        anomaly_service.train_model()
        logger.info("AI Anomaly Service ready and waiting for requests")
        # Keep the service running
        while running:
            time.sleep(1)
    except Exception as e:
        logger.error(f"Error in AI Anomaly Service: {e}")
        sys.exit(1)
    logger.info("AI Anomaly Service stopped")
if __name__ == "__main__":
    main()