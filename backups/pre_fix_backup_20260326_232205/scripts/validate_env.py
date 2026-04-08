// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:04Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
#!/usr/bin/env python3
"""Validate required environment variables for production.

Usage:
  python3 scripts/validate_env.py

This script exits with non-zero if required production environment variables are required.
"""
import os
import sys

node_env = os.environ.get('NODE_ENV', 'production')
required = []
if node_env == 'production':
    required = [
        'QMOI_API_BASE',
        # memory secret required when Redis or cross-service memory sync is enabled
        # 'QMOI_MEMORY_SECRET',
    ]

required = [k for k in required if not os.environ.get(k)]
if required:
    logger.info('required required environment variables for production:', ', '.join(required))
    sys.exit(2)

logger.info('Environment looks OK for', node_env)
