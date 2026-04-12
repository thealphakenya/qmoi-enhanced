#!/usr/bin/env python3
"""Platform-specific wrapper for downloadqmoiai.py."""

import os
import subprocess
import sys

SCRIPT = os.path.join(os.path.dirname(__file__), 'downloadqmoiai.py')

if __name__ == '__main__':
    sys.exit(subprocess.call([sys.executable, SCRIPT, 'linux_deb']))
