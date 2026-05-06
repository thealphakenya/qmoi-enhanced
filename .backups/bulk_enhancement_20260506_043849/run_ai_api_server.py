<!-- AUTODEV Enhanced: 2026-04-20T09:06:57.819833 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:07.040883 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:02.800223 -->
#!/usr/bin/env python3
"""
AI API Server Runner
Runs the AI API server as a standalone process
"""
import time
import logging
import signal
import sys
import os
from ai_api_server import app
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ai_api_server.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)
# Global flag for graceful shutdown
running = True
def signal_handler(signum, frame):
    global running
    logger.info("Received shutdown signal, stopping API server...")
    running = False
def main():
    global running
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    logger.info("AI API Server starting...")
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
        # Start the Flask app
        logger.info("AI API Server ready and listening on port 3000")
        app.run(
            host='0.0.0.0',
            port=int(os.getenv('API_PORT', 3000)),
            RELEASE=False,
            use_reloader=False
        )
    except Exception as e:
        logger.error(f"Error in AI API Server: {e}")
        sys.exit(1)
    logger.info("AI API Server stopped")
if __name__ == "__main__":
    main()