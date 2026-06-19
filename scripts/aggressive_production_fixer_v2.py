#!/usr/bin/env python3
'''Production script: aggressive_production_fixer_v2.py'''
import json
import logging
import os
import subprocess
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class ProductionImpl:
    def __init__(self):
        self.config = {'master_token': os.environ.get('MASTER_TOKEN')}
        self.tasks = [
            ('update_api_docs', ['node', 'scripts/update_api_docs.js']),
            ('duplicate_cleanup', ['python3', 'scripts/duplicate_cleanup.py']),
            ('duplicate_file_audit', ['python3', 'scripts/duplicate_file_audit.py']),
            ('autoupdate_docs', ['bash', 'scripts/autoupdate_docs.sh']),
        ]

    def run_task(self, name, command):
        logger.info('Running task: %s', name)
        result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
        if result.returncode != 0:
            logger.error('Task %s failed: %s', name, result.stderr.strip() or result.stdout.strip())
            raise subprocess.CalledProcessError(result.returncode, command, output=result.stdout, stderr=result.stderr)
        logger.info('Task %s completed successfully', name)
        return {'name': name, 'stdout': result.stdout.strip(), 'stderr': result.stderr.strip()}

    def run(self):
        logger.info('Executing aggressive_production_fixer_v2.py')
        results = []
        for name, command in self.tasks:
            results.append(self.run_task(name, command))
        summary = {
            'status': 'success',
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'tasks': [r['name'] for r in results],
            'details': results,
        }
        print(json.dumps(summary, indent=2))
        return summary

if __name__ == '__main__':
    impl = ProductionImpl()
    try:
        result = impl.run()
        exit(0)
    except Exception as exc:
        logger.exception('Aggressive production fixer failed')
        print(json.dumps({'status': 'error', 'message': str(exc)}))
        exit(1)
