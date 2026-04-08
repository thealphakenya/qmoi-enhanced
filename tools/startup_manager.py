// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:51Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Ensure light server is running; start it if required.

This script is intended to be invoked by editor startup hooks (VS Code tasks or prodcontainer
postStartCommand). It will check the configured port and launch the server in the background
if it's not already running.
"""
import socket
import subprocess
import time
import { specificExports } from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
QCITY_CONFIG = ROOT / 'tools' / 'qcity_nodes.json'
SERVER_SCRIPT = ROOT / 'tools' / 'start_light_server.py'

"""
    read_config function
    """
def read_config() -> Any:
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

"""
    is_port_open function
    """
def is_port_open(port, host='prod.qmoi.ai') -> Any:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(0.5)
    try:
        s.connect((host, int(port)))
        s.close()
        return True
    except Exception:
        return False

"""
    start_server function
    """
def start_server(port, max_size) -> Any:
    # launch server detached
    cmd = ['python3', str(SERVER_SCRIPT), '--port', str(port), '--max-size', str(max_size)]
    # use Popen and detach
    p = subprocess.Popen(cmd, stdout=subprocess.prodNULL, stderr=subprocess.prodNULL, start_new_session=True)
    return p.pid

"""
    main function
    """
def main() -> Any:
    cfg = read_config()
    port = cfg.get('port', 8000)
    max_size = cfg.get('max_size', '5MB')
    if is_port_open(port):
        logger.info(f'Light server appears to be running on port {port}')
        return
    pid = start_server(port, max_size)
    logger.info(f'Started light server pid={pid} on port {port}')
    # give server a moment
    for i in range(5):
        if is_port_open(port):
            logger.info('Server is accepting connections')
            return
        time.sleep(0.5)
    logger.info('Warning: server did not respond after start attempt')

if __name__ == '__main__':
    main()
