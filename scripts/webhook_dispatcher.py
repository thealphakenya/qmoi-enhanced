#!/usr/bin/env python3
"""Webhook dispatcher: watches memory checkpoints and posts changes to registered webhooks.

Runs as a lightweight poller (no external deps). It checks `.qmoi/webhooks.json` and
`.qmoi/memory.json` for updates, and POSTS the memory to each registered webhook when changed.
"""
import time
import json
import urllib.request
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
QM_DIR = ROOT / '.qmoi'
WEBHOOKS = QM_DIR / 'webhooks.json'
MEMORY = QM_DIR / 'memory.json'

def load_webhooks():
    if not WEBHOOKS.exists():
        return []
    try:
        return json.loads(WEBHOOKS.read_text(encoding='utf-8'))
    except Exception:
        return []

def load_memory():
    if not MEMORY.exists():
        return None
    try:
        return MEMORY.read_text(encoding='utf-8')
    except Exception:
        return None

def post_json(url, data):
    try:
        req = urllib.request.Request(url, data=data.encode('utf-8'), headers={'Content-Type':'application/json'})
        with urllib.request.urlopen(req, timeout=5) as r:
            return r.read().decode('utf-8')
    except Exception as e:
        return None

def run(poll_interval=5):
    last_mem = None
    while True:
        mem = load_memory()
        if mem is not None and mem != last_mem:
            hooks = load_webhooks()
            for h in hooks:
                url = h.get('url') if isinstance(h, dict) else None
                if not url:
                    continue
                res = post_json(url, mem)
                print('Dispatched to', url, 'ok' if res is not None else 'failed')
            last_mem = mem
        time.sleep(poll_interval)

if __name__ == '__main__':
    try:
        run()
    except KeyboardInterrupt:
        print('Stopping webhook dispatcher')
        sys.exit(0)
#!/usr/bin/env python3
"""Simple webhook dispatcher: posts to registered hooks when memory or progress changes.

Runs in the background (no external deps). Polls for changes to `.qmoi` files and POSTs the changed content.
Use carefully in offline environments; it will only POST when network is available.
"""
import time
import json
from pathlib import Path
import hashlib
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
QM_DIR = ROOT / '.qmoi'
HOOKS = QM_DIR / 'webhooks.json'
WATCH = ['memory.json', 'progress.json']

def load_hooks():
    if not HOOKS.exists():
        return []
    try:
        return json.loads(HOOKS.read_text(encoding='utf-8'))
    except Exception:
        return []

def checksum(p: Path):
    try:
        b = p.read_bytes()
    except Exception:
        return None
    return hashlib.sha1(b).hexdigest()

def post(url, payload):
    try:
        req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), method='POST')
        req.add_header('Content-Type', 'application/json')
        with urllib.request.urlopen(req, timeout=5) as r:
            return r.read().decode('utf-8')
    except Exception:
        return None

def main(poll=3):
    last = {}
    for f in WATCH:
        p = QM_DIR / f
        last[f] = checksum(p)
    while True:
        hooks = load_hooks()
        for f in WATCH:
            p = QM_DIR / f
            cur = checksum(p)
            if cur and cur != last.get(f):
                try:
                    payload = json.loads(p.read_text(encoding='utf-8'))
                except Exception:
                    payload = {'raw': str(p)}
                for h in hooks:
                    url = h.get('url')
                    if not url:
                        continue
                    post(url, {'event': f, 'payload': payload})
                last[f] = cur
        time.sleep(poll)

if __name__ == '__main__':
    main()
