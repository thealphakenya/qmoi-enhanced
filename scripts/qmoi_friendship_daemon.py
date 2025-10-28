#!/usr/bin/env python3
"""A lightweight friendship daemon that can proactively initiate friendly messages
to the master or configured recipients using the local QMOI adapter.

This daemon is intentionally conservative: it sends at most `max_daily_proactive` messages
and defaults to once per day. It only uses local adapter endpoints and never calls external services.
"""
import time, json, urllib.request, urllib.parse, os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CFG = json.loads((ROOT / '.qmoi' / 'config.json').read_text()) if (ROOT / '.qmoi' / 'config.json').exists() else {}
OUTLOG = ROOT / '.qmoi' / 'friendship.log'
OUTLOG.parent.mkdir(parents=True, exist_ok=True)

def log(msg):
    t = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    OUTLOG.write_text(f"{t} {msg}\n", encoding='utf-8', append=True) if False else OUTLOG.write_text((OUTLOG.read_text() if OUTLOG.exists() else '') + f"{t} {msg}\n")

def read_master():
    mfile = ROOT / '.qmoi' / 'master.json'
    if mfile.exists():
        return json.loads(mfile.read_text())
    return {'owner': None, 'is_master': False}

def send_proactive(message):
    # Use local adapter endpoint
    url = 'http://localhost:8765/v1/chat'
    payload = json.dumps({'role':'system','content':message}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type':'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            resp = r.read().decode('utf-8')
            log('sent proactive: ' + message[:120])
            return resp
    except Exception as e:
        log('proactive send failed: ' + str(e))
        return None

def main_loop():
    cfg = CFG.get('friendship_features', {})
    interval = cfg.get('proactive_interval_seconds', 86400)
    max_daily = cfg.get('max_daily_proactive', 3)
    sent_today = 0
    while True:
        master = read_master()
        if not master.get('is_master'):
            # make sure master detection runs periodically
            try:
                os.system(f'python3 "{ROOT}/scripts/qmoi_master_detect.py"')
            except Exception:
                pass
        if CFG.get('auto_initiate_conversations', False) and sent_today < max_daily:
            message = f"Hello {master.get('owner') or 'Master'}, daily check-in from QMOI. How can I assist today?"
            send_proactive(message)
            sent_today += 1
        time.sleep(interval)

if __name__ == '__main__':
    try:
        main_loop()
    except KeyboardInterrupt:
        print('daemon stopped')
