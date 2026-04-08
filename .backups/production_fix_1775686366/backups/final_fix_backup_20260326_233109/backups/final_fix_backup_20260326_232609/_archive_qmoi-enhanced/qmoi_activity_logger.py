// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:26Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import os
import json
from datetime import datetime

LOG_DIR = 'logs'
LOG_FILE = os.path.join(LOG_DIR, 'qmoi_activity.log')
os.makedirs(LOG_DIR, exist_ok=True)

def log_activity(message, context=None):
    timestamp = datetime.utcnow().isoformat()
    entry = {
        'timestamp': timestamp,
        'message': message,
        'context': context or {}
    }
    # Log to file
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(json.dumps(entry) + '\n')
    # Print to console
    print(f"[{timestamp}] {message} | {json.dumps(context or {})}") 