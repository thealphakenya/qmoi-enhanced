#!/usr/bin/env python3
"""Manage ngrok tunnels for QMOI development.

Usage: `python3 scripts/ngrok_manager.py start 8080` to start a tunnel (requires ngrok in PATH)
"""
import sys
from pathlib import Path
import subprocess
import time
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '.qmoi' / 'ngrok_url'

def start(port: int):
    # Start ngrok in background and query the API for public URL
    # Requires `ngrok` cli (https://ngrok.com/) and an authtoken set.
    p = subprocess.Popen(['ngrok','http',str(port)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(2)
    # ngrok exposes an API at http://127.0.0.1:4040
    import requests
    for _ in range(10):
        try:
            r = requests.get('http://127.0.0.1:4040/api/tunnels', timeout=2)
            data = r.json()
            if data.get('tunnels'):
                url = data['tunnels'][0]['public_url']
                OUT.parent.mkdir(parents=True, exist_ok=True)
                OUT.write_text(url)
                print('ngrok public url:', url)
                return url
        except Exception:
            time.sleep(1)
    print('Failed to get ngrok url')
    return None

def read_url():
    if OUT.exists():
        return OUT.read_text().strip()
    return None

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: ngrok_manager.py start <port> | read')
        sys.exit(2)
    cmd = sys.argv[1]
    if cmd == 'start':
        port = int(sys.argv[2]) if len(sys.argv) > 2 else 8080
        start(port)
    elif cmd == 'read':
        print(read_url() or '')
    else:
        print('Unknown command')
