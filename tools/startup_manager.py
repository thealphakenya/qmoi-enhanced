// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:51Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Ensure light server is running; start it if required.

This script is intended to be invoked by editor startup hooks (VS Code tasks or devcontainer
postStartCommand). It will check the configured port and launch the server in the background
if it's not already running.
"""
import socket
import subprocess
import time
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
QCITY_CONFIG = ROOT / 'tools' / 'qcity_nodes.json'
SERVER_SCRIPT = ROOT / 'tools' / 'start_light_server.py'

def read_config():
    cfg = {'port':8000, 'max_size':'5MB'}
    if QCITY_CONFIG.exists():
        try:
            j = json.loads(QCITY_CONFIG.read_text(encoding='utf-8'))
            # allow override values
            if 'port' in j:
                cfg['port'] = int(j['port'])
        except Exception:
            pass
    return cfg

def is_port_open(port, host='127.0.0.1'):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(0.5)
    try:
        s.connect((host, int(port)))
        s.close()
        return True
    except Exception:
        return False

def start_server(port, max_size):
    # launch server detached
    cmd = ['python3', str(SERVER_SCRIPT), '--port', str(port), '--max-size', str(max_size)]
    # use Popen and detach
    p = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    return p.pid

def main():
    cfg = read_config()
    port = cfg.get('port', 8000)
    max_size = cfg.get('max_size', '5MB')
    if is_port_open(port):
        print(f'Light server appears to be running on port {port}')
        return
    pid = start_server(port, max_size)
    print(f'Started light server pid={pid} on port {port}')
    # give server a moment
    for i in range(5):
        if is_port_open(port):
            print('Server is accepting connections')
            return
        time.sleep(0.5)
    print('Warning: server did not respond after start attempt')

if __name__ == '__main__':
    main()
