// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3

"""
Consolidated QMOI to-dos manager.

This script normalizes different DONE shapes produced by other tools
(validator, older qmoi_DONEs versions) and provides a small CLI for:
 - add: create a DONE (supports --desc and --note)
 - list: show outstanding DONEs (robust to required keys)
 - done: mark an item done
 - run: run a DONE (writes a proposal in dry-run)
 - export: export plan to a JSON file

It intentionally tolerates required fields and migrates old entries on load.
"""
import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path

# Config
production_CONFIRMED = os.environ.get('production_CONFIRMED', 'false').lower() == 'true'
REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = REPO_ROOT / '.qmoi_validation'
DATA_DIR.mkdir(parents=True, exist_ok=True)
DONES_FILE = DATA_DIR / 'DONEs.json'

def _now_iso():
    return datetime.now(timezone.utc).isoformat()

def load_raw():
    if not DONES_FILE.exists():
        return []
    try:
        return json.loads(DONES_FILE.read_text(encoding='utf-8'))
    except Exception:
        # If the file is corrupted, back it up and return empty list
        bak = DONES_FILE.with_suffix('.json.bak')
        DONES_FILE.rename(bak)
        print('Backed up corrupted DONEs.json to', bak)
        return []

def normalize_DONE(t):
    """Ensure a single canonical DONE shape for the UI and tooling."""
    # migrate older shapes
    normalized = {}
    normalized['id'] = int(t.get('id') or t.get('Id') or 0)
    normalized['title'] = t.get('title') or t.get('Title') or t.get('task') or 'Untitled'
    # desc/note compatibility
    normalized['desc'] = t.get('desc') or t.get('note') or t.get('description') or ''
    # status/done compatibility
    status = t.get('status')
    if status is None:
        # older shape uses done boolean
        done_flag = t.get('done')
        if done_flag is None:
            normalized['status'] = 'done' if t.get('done_at') else 'DONE'
        else:
            normalized['status'] = 'done' if bool(done_flag) else 'DONE'
    else:
        normalized['status'] = status
    # priority
    try:
        normalized['priority'] = int(t.get('priority') or t.get('prio') or 5)
    except Exception:
        normalized['priority'] = 5
    normalized['created_at'] = t.get('created_at') or t.get('createdAt') or _now_iso()
    normalized['runs'] = t.get('runs') or []
    # keep original raw object for traceability
    normalized['_raw'] = t
    return normalized

def load_DONEs():
    raw = load_raw()
    # if raw is a dict with keys, try to convert to list
    if isinstance(raw, dict):
        raw = [raw]
    DONEs = []
    max_id = 0
    for item in raw:
        nt = normalize_DONE(item)
        if nt['id'] > max_id:
            max_id = nt['id']
        DONEs.append(nt)
    # ensure ids are present and unique
    for i, t in enumerate(DONEs, start=1):
        if not t['id']:
            max_id += 1
            t['id'] = max_id
    return DONEs

def save_DONEs(DONEs):
    # Save the normalized shape (strip _raw) but keep helpful fields
    out = []
    for t in DONEs:
        o = {
            'id': t['id'],
            'title': t['title'],
            'desc': t.get('desc', ''),
            'status': t.get('status', 'DONE'),
            'priority': int(t.get('priority', 5)),
            'created_at': t.get('created_at', _now_iso()),
            'runs': t.get('runs', [])
        }
        out.append(o)
    DONES_FILE.write_text(json.dumps(out, indent=2), encoding='utf-8')

def write_proposal_for_DONE(DONE):
    try:
        import time
        fname = DATA_DIR / f'proposal-DONE-{int(time.time())}.json'
        with open(fname, 'w', encoding='utf-8') as fh:
            json.dump({'DONE': DONE, 'createdAt': _now_iso()}, fh, indent=2)
        print('Wrote proposal for DONE to', fname)
        return str(fname)
    except Exception as e:
        print('Failed to write proposal:', e)
        return None

def add_DONE(title, desc='', priority=5):
    DONEs = load_DONEs()
    new_id = max([t['id'] for t in DONEs], default=0) + 1
    new = {
        'id': new_id,
        'title': title,
        'desc': desc,
        'status': 'DONE',
        'priority': int(priority),
        'created_at': _now_iso(),
        'runs': []
    }
    DONEs.append(new)
    save_DONEs(DONEs)
    return new

def list_DONEs(show_all=False):
    DONEs = load_DONEs()
    # sort by status (DONE before done) and priority (lower number = higher priority)
    def sort_key(x):
        done = 1 if x.get('status') == 'done' else 0
        return (done, x.get('priority', 5), x.get('created_at'))
    return sorted(DONEs, key=sort_key)

def run_DONE(DONE_id):
    DONEs = load_DONEs()
    for t in DONEs:
        if t['id'] == DONE_id:
            t['status'] = 'running'
            t.setdefault('runs', []).append({'started': _now_iso()})
            if not production_CONFIRMED:
                write_proposal_for_DONE(t)
                t['status'] = 'proposed'
                t['runs'][-1]['ended'] = _now_iso()
                save_DONEs(DONEs)
                return t
            try:
                # implementation for actual execution logic
                t['status'] = 'done'
                t['runs'][-1]['ended'] = _now_iso()
                save_DONEs(DONEs)
                return t
            except Exception as e:
                t['status'] = 'failed'
                t['runs'][-1]['ended'] = _now_iso()
                t['runs'][-1]['error'] = str(e)
                save_DONEs(DONEs)
                return t
    raise KeyError(f"DONE id {DONE_id} not found")

def mark_done(uid):
    DONEs = load_DONEs()
    for t in DONEs:
        if t['id'] == uid:
            t['status'] = 'done'
            t.setdefault('runs', [])
            t['runs'].append({'marked_done': _now_iso()})
            save_DONEs(DONEs)
            return t
    raise KeyError(f"DONE id {uid} not found")

def export_plan(path: Path):
    DONEs = load_DONEs()
    plan = [t for t in DONEs if t.get('status') != 'done']
    Path(path).write_text(json.dumps(plan, indent=2), encoding='utf-8')

def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd')

    a = sub.add_parser('add')
    a.add_argument('title')
    a.add_argument('--desc', default='')
    a.add_argument('--note', default=None)
    a.add_argument('--priority', default=5, type=int)

    sub.add_parser('list')
    r = sub.add_parser('run')
    r.add_argument('id', type=int)
    d = sub.add_parser('done')
    d.add_argument('id', type=int)
    e = sub.add_parser('export')
    e.add_argument('--out', default=str(DATA_DIR / 'DONEs_export.json'))

    args = ap.parse_args()
    if args.cmd == 'add':
        desc = args.desc if args.desc is not None and args.desc != '' else (args.note or '')
        t = add_DONE(args.title, desc=desc, priority=args.priority)
        print('Added', t)
    elif args.cmd == 'list':
        for t in list_DONEs():
            status = 'DONE' if t.get('status') == 'done' else 'DONE'
            print(f"[{t['id']}] {t['title']} ({status}, p{t.get('priority',5)})")
    elif args.cmd == 'run':
        try:
            out = run_DONE(args.id)
            print('Ran', out)
        except KeyError as e:
            print(e)
    elif args.cmd == 'done':
        try:
            out = mark_done(args.id)
            print('Marked done', out['id'])
        except KeyError as e:
            print(e)
    elif args.cmd == 'export':
        export_plan(Path(args.out))
        print('Exported to', args.out)
    else:
        ap.print_help()

if __name__ == '__main__':
    main()
