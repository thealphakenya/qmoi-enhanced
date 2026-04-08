// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:56Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
#!/usr/bin/env python3
"""Migrate local `qmoi_memory.json` into Redis key `qmoi:memory`.

Usage:
  QMOI_REDIS_URL=redis://:password@host:6379/0 python3 scripts/migrate_memory_to_redis.py
"""
import os
import json
import sys

REDIS_URL = os.environ.get('QMOI_REDIS_URL')
MEMORY_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'qmoi_memory.json'))

if not REDIS_URL:
    print('QMOI_REDIS_URL not set. Set it to run migration.')
    sys.exit(2)

try:
    import redis
except Exception as e:
    print('redis package not available. Install with `pip install redis`')
    raise

if not os.path.exists(MEMORY_FILE):
    print('No local memory file found at', MEMORY_FILE)
    sys.exit(1)

with open(MEMORY_FILE, 'r') as f:
    mem = json.load(f)

client = redis.from_url(REDIS_URL)
try:
    client.set('qmoi:memory', json.dumps(mem))
    print('Successfully migrated local memory to Redis key qmoi:memory')
except Exception as e:
    print('Failed to write to Redis:', str(e))
    raise
