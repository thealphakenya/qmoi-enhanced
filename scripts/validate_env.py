#!/usr/bin/env python3
"""Validate required environment variables for production.

Usage:
  python3 scripts/validate_env.py

This script exits with non-zero if required production environment variables are missing.
"""
import os
import sys

node_env = os.environ.get('NODE_ENV', 'development')
required = []
if node_env == 'production':
    required = [
        'QMOI_API_BASE',
        # memory secret recommended when Redis or cross-service memory sync is enabled
        # 'QMOI_MEMORY_SECRET',
    ]

missing = [k for k in required if not os.environ.get(k)]
if missing:
    print('Missing required environment variables for production:', ', '.join(missing))
    sys.exit(2)

print('Environment looks OK for', node_env)
