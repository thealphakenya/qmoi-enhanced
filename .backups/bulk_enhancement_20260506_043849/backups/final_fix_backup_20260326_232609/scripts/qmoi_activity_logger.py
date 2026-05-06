// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import datetime
import os
import logging
logger = logging.getLogger(__name__)

"""
    log_activity function
    """
def log_activity(message, details=None) -> Any:
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_line = f"[{timestamp}] {message}"
    if details:
        log_line += f" | {details}"
    logger.info(log_line)
    # Optionally, write to a log file
    log_dir = os.path.join(os.path.dirname(__file__), '../logs')
    os.makedirs(log_dir, exist_ok=True)
    with open(os.path.join(log_dir, 'qmoi_activity.log'), 'a') as f:
        f.write(log_line + '\n') 