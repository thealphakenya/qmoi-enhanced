#!/usr/bin/env python3
"""
Lightweight QMOI to-dos manager with simple persistence and LION-tag hooks.

Usage:
  python3 scripts/qmoi_todos.py add "title" --desc "..."
  python3 scripts/qmoi_todos.py list
  python3 scripts/qmoi_todos.py run <id>
  python3 scripts/qmoi_todos.py export
"""
import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path

# Respect dry-run by default
PRODUCTION_CONFIRMED = os.environ.get('PRODUCTION_CONFIRMED', 'false').lower() == 'true'
VALIDATION_DIR = Path(__file__).resolve().parents[1] / '.qmoi_validation'
VALIDATION_DIR.mkdir(parents=True, exist_ok=True)

def write_proposal_for_todo(todo):
    try:
        import time
        fname = VALIDATION_DIR / f'proposal-todo-{int(time.time())}.json'
        with open(fname, 'w', encoding='utf-8') as fh:
            json.dump({'todo': todo, 'createdAt': datetime.now(timezone.utc).isoformat()}, fh, indent=2)
        print('Wrote proposal for todo to', fname)
        return str(fname)
    except Exception as e:
        print('Failed to write proposal:', e)
        return None

REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = REPO_ROOT / ".qmoi_validation"
DATA_DIR.mkdir(exist_ok=True)
TODOS_FILE = DATA_DIR / "todos.json"


def load_todos():
    if not TODOS_FILE.exists():
        return []
    return json.loads(TODOS_FILE.read_text(encoding='utf-8'))


def save_todos(todos):
    TODOS_FILE.write_text(json.dumps(todos, indent=2), encoding='utf-8')


def add_todo(title, desc):
    todos = load_todos()
    new = {
        'id': (max([t['id'] for t in todos]) + 1) if todos else 1,
        'title': title,
        'desc': desc,
        'created_at': datetime.now(timezone.utc).isoformat(),
        'status': 'todo'
    }
    todos.append(new)
    save_todos(todos)
    return new


def list_todos():
    return load_todos()


def run_todo(todo_id):
    todos = load_todos()
    for t in todos:
        if t['id'] == todo_id:
            t['status'] = 'running'
            t.setdefault('runs', []).append({'started': datetime.now(timezone.utc).isoformat()})
            # Safe behavior: write a proposal describing the run instead of executing
            if not PRODUCTION_CONFIRMED:
                write_proposal_for_todo(t)
                t['status'] = 'proposed'
                t['runs'][-1]['ended'] = datetime.now(timezone.utc).isoformat()
                save_todos(todos)
                return t

            # If production confirmed, execute actual hooks (placeholder for integration)
            try:
                # Here you would call the actual orchestration code or shells
                # For now we mark the todo done to avoid silent destructive actions
                t['status'] = 'done'
                t['runs'][-1]['ended'] = datetime.now(timezone.utc).isoformat()
                save_todos(todos)
                return t
            except Exception as e:
                t['status'] = 'failed'
                t['runs'][-1]['ended'] = datetime.now(timezone.utc).isoformat()
                t['runs'][-1]['error'] = str(e)
                save_todos(todos)
                return t
    raise KeyError(f"Todo id {todo_id} not found")


def export_plan(path: Path):
    todos = load_todos()
    path.write_text(json.dumps(todos, indent=2), encoding='utf-8')


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd')

    a = sub.add_parser('add')
    a.add_argument('title')
    a.add_argument('--desc', default='')

    sub.add_parser('list')

    r = sub.add_parser('run')
    r.add_argument('id', type=int)

    e = sub.add_parser('export')
    e.add_argument('--out', default=str(REPO_ROOT / '.qmoi_validation' / 'todos_export.json'))

    args = ap.parse_args()
    if args.cmd == 'add':
        t = add_todo(args.title, args.desc)
        print('Added', t)
    elif args.cmd == 'list':
        for t in list_todos():
            print(f"[{t['id']}] {t['title']} ({t['status']})")
    elif args.cmd == 'run':
        try:
            out = run_todo(args.id)
            print('Ran', out)
        except KeyError as e:
            print(e)
    elif args.cmd == 'export':
        export_plan(Path(args.out))
        print('Exported to', args.out)
    else:
        ap.print_help()


if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""
Lightweight QMOI to-dos manager.

Features:
- JSON-backed persistent to-do list at .qmoi_validation/todos.json
- Create tasks, list, mark done, add notes, set priority
- Export a plan summary for the validator to use

Usage: python scripts/qmoi_todos.py add "Title" --note "..." --priority 3
       python scripts/qmoi_todos.py list
       python scripts/qmoi_todos.py done 3
"""
import os
import json
import argparse
from datetime import datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, '.qmoi_validation')
os.makedirs(OUT, exist_ok=True)
TODO_FILE = os.path.join(OUT, 'todos.json')

def load():
    if os.path.exists(TODO_FILE):
        return json.load(open(TODO_FILE, 'r', encoding='utf-8'))
    return []

def save(data):
    json.dump(data, open(TODO_FILE, 'w', encoding='utf-8'), indent=2)

def add(title, note=None, priority=5):
    data = load()
    item = {
        'id': (max([i['id'] for i in data]) + 1) if data else 1,
        'title': title,
        'note': note or '',
        'priority': int(priority),
        'created_at': datetime.utcnow().isoformat() + 'Z',
        'done': False,
        'done_at': None
    }
    data.append(item)
    save(data)
    print('Added', item['id'])

def list_items(show_all=False):
    data = load()
    for i in sorted(data, key=lambda x: (x['done'], x['priority'])):
        if not show_all and i['done']:
            continue
        status = 'DONE' if i['done'] else 'TODO'
        print(f"{i['id']:3d} [{status}] (p{i['priority']}) {i['title']}")

def mark_done(uid):
    data = load()
    for i in data:
        if i['id'] == uid:
            i['done'] = True
            i['done_at'] = datetime.utcnow().isoformat() + 'Z'
            save(data)
            print('Marked done', uid)
            return
    print('Not found', uid)

def export_plan(path=None):
    data = load()
    plan = [i for i in data if not i['done']]
    out = path or os.path.join(OUT, 'plan_export.json')
    with open(out, 'w', encoding='utf-8') as fh:
        json.dump(plan, fh, indent=2)
    print('Exported plan to', out)

def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest='cmd')
    pa = sub.add_parser('add')
    pa.add_argument('title')
    pa.add_argument('--note')
    pa.add_argument('--priority', default=5)
    pb = sub.add_parser('list')
    pb.add_argument('--all', action='store_true')
    pc = sub.add_parser('done')
    pc.add_argument('id', type=int)
    pe = sub.add_parser('export')
    pe.add_argument('--path')
    args = p.parse_args()
    if args.cmd == 'add':
        add(args.title, note=args.note, priority=args.priority)
    elif args.cmd == 'list':
        list_items(show_all=args.all)
    elif args.cmd == 'done':
        mark_done(args.id)
    elif args.cmd == 'export':
        export_plan(path=args.path)
    else:
        p.print_help()

if __name__ == '__main__':
    main()
