#!/usr/bin/env python3
"""
NLP Service Runner
Runs the natural language processing service as a standalone process
"""

import time
import logging
import signal
import sys
from nlp_service import nlp_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('nlp_service.log'),
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

    logger.info("NLP Service starting...")

    try:
        # Initialize the service
        logger.info("NLP Service ready and waiting for requests")

        # Keep the service running
        while running:
            time.sleep(1)

    except Exception as e:
        logger.error(f"Error in NLP Service: {e}")
        sys.exit(1)

    logger.info("NLP Service stopped")

if __name__ == "__main__":
    main()