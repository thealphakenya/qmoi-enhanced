#!/usr/bin/env python3
"""Windows-focused QMOI executable wrapper, launches the download tool."""

import os
import platform
import subprocess
import sys

SCRIPT = os.path.join(os.path.dirname(__file__), 'downloadqmoiai.py')


def main() -> int:
    target = 'windows'
    if platform.system().lower() != 'windows':
        print('qmoiexe.py is a Windows download wrapper. Using the Windows download target.')
    return subprocess.call([sys.executable, SCRIPT, target])


if __name__ == '__main__':
    raise SystemExit(main())
