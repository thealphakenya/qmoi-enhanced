#!/usr/bin/env python3
"""Fallback type-check stub for environments without npm or Node.js."""

import shutil
import subprocess
import sys
from pathlib import Path

if __name__ == '__main__':
    npm_path = shutil.which('npm')
    if npm_path is None:
        print('⚠️  npm is not available in this environment. Skipping TypeScript verification.')
        print('If you need actual TypeScript verification, run `npm run type-check` in a Node-capable environment.')
        sys.exit(0)

    print('✅ npm found at', npm_path)
    print('Running `npm run type-check`...')
    result = subprocess.run([npm_path, 'run', 'type-check'])
    sys.exit(result.returncode)
