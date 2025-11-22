#!/usr/bin/env python3
"""Local Chat Helper

Utilities to help a local chat agent (or developer) work with a repository
that may have uncommitted changes. Features:
- snapshot: create a patch file and a git stash for uncommitted changes
- restore: restore from the patch or stash
- context: produce a concise context bundle (changed files list, short diffs,
  recent commits) suitable to paste to an LLM or to attach to an issue/PR

Usage:
  python scripts/local_chat_helper.py snapshot
  python scripts/local_chat_helper.py restore
  python scripts/local_chat_helper.py context > reports/local_chat_context.txt

This script is conservative and non-destructive: snapshots are stored under
`.qmoi_local_chat/` and do not overwrite existing snapshots.
"""
from __future__ import annotations

import os
import sys
import subprocess
from datetime import datetime
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / '.qmoi_local_chat'
OUT_DIR.mkdir(parents=True, exist_ok=True)


def run(cmd, check=True, capture=False):
    if capture:
        return subprocess.check_output(cmd, shell=True, cwd=ROOT).decode('utf-8', errors='replace')
    else:
        # produce a richer context: changed files, short diffs, recent commits,
        # selected Markdown files (APIs, docs), and QMOI memory snippets.
        out = {}
        try:
            out['branch'] = run('git rev-parse --abbrev-ref HEAD', capture=True).strip()
        except Exception:
            out['branch'] = 'unknown'

        try:
            out['status'] = run('git status --porcelain', capture=True).strip().splitlines()
        except Exception:
            out['status'] = []

        try:
            out['uncommitted_files'] = run('git diff --name-only', capture=True).strip().splitlines()
        except Exception:
            out['uncommitted_files'] = []

        # include tiny diffs (first 400 chars) for up to 20 files
        diffs = {}
        try:
            files = out['uncommitted_files'][:20]
            for f in files:
                d = run(f'git diff -- "{f}" | head -c 400', capture=True)
                diffs[f] = d
        except Exception:
            pass
        out['diff_samples'] = diffs

        try:
            out['recent_commits'] = run('git log -n 20 --pretty=format:"%h %ad %an %s" --date=iso', capture=True).splitlines()
        except Exception:
            out['recent_commits'] = []

        # Gather key Markdown docs (API.md, docs/, README, and other top-level .md files)
        md_summary = {}
        try:
            md_files = []
            # prefer API.md and README.md if present
            candidates = ['API.md', 'API.MD', 'README.md', 'README.MD']
            for c in candidates:
                p = ROOT / c
                if p.exists():
                    md_files.append(p)

            # include docs/ and top-level markdowns up to 40 files
            for p in ROOT.glob('docs/**/*.md'):
                md_files.append(p)
            for p in ROOT.glob('*.md'):
                if p not in md_files:
                    md_files.append(p)

            # dedupe while preserving order
            seen = set(); uniq = []
            for p in md_files:
                if str(p) in seen: continue
                seen.add(str(p)); uniq.append(p)

            for p in uniq[:40]:
                try:
                    size = p.stat().st_size
                    with p.open('r', encoding='utf8', errors='replace') as fh:
                        text = fh.read(2000)
                    # extract headings
                    headings = [l.strip() for l in text.splitlines() if l.strip().startswith('#')][:10]
                    md_summary[str(p.relative_to(ROOT))] = {
                        'size': size,
                        'headings': headings,
                        'sample': text[:1000]
                    }
                except Exception:
                    md_summary[str(p)] = {'error': 'read-failed'}
        except Exception:
            md_summary = {}
        out['markdown_summary'] = md_summary

        # Scan for API-like endpoints inside md files and api/ directory
        endpoints = []
        try:
            import re
            # search in selected md files for HTTP endpoints or common REST verbs
            search_files = list(ROOT.glob('**/*.md'))[:200]
            for p in search_files:
                try:
                    txt = p.read_text(encoding='utf8', errors='replace')
                except Exception:
                    continue
                # URL patterns and simple method+path lines
                for m in re.findall(r'(?m)\b(?:GET|POST|PUT|DELETE|PATCH)\b[^\n]{0,200}', txt):
                    endpoints.append({'file': str(p.relative_to(ROOT)), 'line': m.strip()})
                for u in re.findall(r'https?://[^\s\)\]\"]+', txt):
                    endpoints.append({'file': str(p.relative_to(ROOT)), 'url': u})

            # also scan api/ folder for route patterns (express, flask, fastapi)
            for p in ROOT.glob('api/**/*.js'):
                try:
                    txt = p.read_text(encoding='utf8', errors='replace')
                except Exception:
                    continue
                for m in re.findall(r"(?m)\b(app|router)\.(get|post|put|delete|patch)\(['\"]([^'\"]+)['\"]", txt):
                    endpoints.append({'file': str(p.relative_to(ROOT)), 'framework': m[0], 'method': m[1].upper(), 'path': m[2]})
        except Exception:
            endpoints = []
        out['endpoints_found'] = endpoints[:200]

        # persist endpoints report for human review and for agents
        try:
            reports_dir = ROOT / 'reports'
            reports_dir.mkdir(parents=True, exist_ok=True)
            ep_json = reports_dir / 'api_endpoints.json'
            with ep_json.open('w', encoding='utf8') as ef:
                json.dump(endpoints, ef, indent=2)

            docs_dir = ROOT / 'docs'
            docs_dir.mkdir(parents=True, exist_ok=True)
            md_out = docs_dir / 'API_ENDPOINTS.md'
            with md_out.open('w', encoding='utf8') as mf:
                mf.write('# API Endpoints Discovered\n\n')
                for e in endpoints[:1000]:
                    if 'method' in e and 'path' in e:
                        mf.write(f"- `{e.get('method')}` `{e.get('path')}` — {e.get('file')}\n")
                    elif 'url' in e:
                        mf.write(f"- URL: {e.get('url')} — {e.get('file')}\n")
                    else:
                        mf.write(f"- {e} \n")
        except Exception:
            pass

        # Collect QMOI memory artifacts: known filenames and .qmoi_state
        memory_snippets = {}
        try:
            patterns = ['qmoi_memory.json', 'qmoi_memory*.json', 'qmoi_memory*', '.qmoi_state', 'qmoi_memory.jsonl', 'qmoi_memory']
            found = set()
            for pat in patterns:
                for p in ROOT.glob('**/' + pat):
                    if not p.exists():
                        continue
                    sp = str(p.relative_to(ROOT))
                    if sp in found: continue
                    found.add(sp)
                    try:
                        size = p.stat().st_size
                        if size > 20000:
                            # only include a small prefix
                            sample = p.read_text(encoding='utf8', errors='replace')[:8000]
                        else:
                            sample = p.read_text(encoding='utf8', errors='replace')
                        memory_snippets[sp] = {'size': size, 'sample': sample[:16000]}
                    except Exception:
                        memory_snippets[sp] = {'error': 'read-failed'}
        except Exception:
            memory_snippets = {}
        out['qmoi_memory'] = memory_snippets

        # persist a fuller JSON context to the local agent folder
        try:
            ts = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
            out_path = OUT_DIR / f'context_full_{ts}.json'
            with open(out_path, 'w', encoding='utf8') as of:
                json.dump(out, of, indent=2)
            print('Wrote rich context to', out_path)
        except Exception as e:
            print('Failed to write full context:', e)

        # print compact summary to stdout
        compact = {k: out.get(k) for k in ['branch', 'status', 'uncommitted_files', 'diff_samples', 'recent_commits']}
        print(json.dumps({'summary': compact, 'md_count': len(md_summary), 'endpoints_count': len(endpoints), 'qmoi_memory_count': len(memory_snippets)}, indent=2))
        if pf.exists():
            try:
                run(f'git apply --index "{pf}"')
                print('Applied patch', pf)
                return
            except Exception as e:
                print('git apply failed:', e)

    # fallback: pop the most recent local_chat stash
    try:
        # list stashes and find the latest matching local_chat_snapshot_
        out = run('git stash list', capture=True)
        lines = out.splitlines()
        target = None
        for l in lines:
            if 'local_chat_snapshot_' in l:
                target = l.split(':', 1)[0]
        if target and pop_stash:
            run(f'git stash pop {target}')
            print('Popped stash', target)
            return
        elif target:
            print('Found stash', target, 'but not popping (use --pop to pop)')
        else:
            print('No local_chat snapshot stash found')
    except Exception as e:
        print('Failed to inspect/push stashes:', e)


def context():
    # produce a short context: changed files, short diffs, recent commits
    out = {}
    try:
        out['branch'] = run('git rev-parse --abbrev-ref HEAD', capture=True).strip()
    except Exception:
        out['branch'] = 'unknown'

    try:
        out['status'] = run('git status --porcelain', capture=True).strip().splitlines()
    except Exception:
        out['status'] = []

    try:
        out['uncommitted_files'] = run('git diff --name-only', capture=True).strip().splitlines()
    except Exception:
        out['uncommitted_files'] = []

    # include tiny diffs (first 500 chars) for up to 20 files
    diffs = {}
    try:
        files = out['uncommitted_files'][:20]
        for f in files:
            d = run(f'git diff -- "{f}" | head -c 500', capture=True)
            diffs[f] = d
    except Exception:
        pass
    out['diff_samples'] = diffs

    try:
        out['recent_commits'] = run('git log -n 20 --pretty=format:"%h %ad %an %s" --date=iso', capture=True).splitlines()
    except Exception:
        out['recent_commits'] = []

    # Gather key docs and API/endpoints content (small excerpts)
    docs = {}
    try:
        # candidate files: API.md, ENDPOINTS.md, files under docs/, and top-level *.md
        candidates = []
        for p in (ROOT, ROOT / 'docs'):
            try:
                for f in p.rglob('*.md'):
                    candidates.append(f)
            except Exception:
                pass

        # also include common API docs by name
        for name in ('API.md', 'API.MD', 'ENDPOINTS.md', 'endpoints.md', 'ENDPOINTS.MD'):
            fp = ROOT / name
            if fp.exists():
                candidates.append(fp)

        # unique and limit to 50 files
        seen = set(); uniq = []
        for f in candidates:
            s = str(f.resolve())
            if s not in seen:
                seen.add(s); uniq.append(f)
        uniq = uniq[:50]
        for f in uniq:
            try:
                txt = f.read_text(encoding='utf8', errors='replace')
                docs[str(f.relative_to(ROOT))] = txt[:2000]
            except Exception:
                docs[str(f.relative_to(ROOT))] = '<read-failed>'
    except Exception:
        pass
    out['docs_snippets'] = docs

    # Include QMOI memory/state files (truncated)
    memory = {}
    try:
        mem_files = []
        # common memory locations
        for m in (ROOT / 'qmoi_memory.json', ROOT / 'qmoi-release-status.json'):
            if m.exists():
                mem_files.append(m)
        # .qmoi_state directory
        st = ROOT / '.qmoi_state'
        if st.exists() and st.is_dir():
            for f in st.rglob('*.json'):
                mem_files.append(f)

        # also include top-level qmoi files
        topnames = ['qmoi_memory.json', 'qmoi_memory.json.backup', 'qmoi_release_memory.json', 'qmoi_memory']
        for tn in topnames:
            fp = ROOT / tn
            if fp.exists():
                mem_files.append(fp)

        # unique and limit
        mf_seen = set(); mf = []
        for f in mem_files:
            p = str(f.resolve())
            if p not in mf_seen:
                mf_seen.add(p); mf.append(f)
        for f in mf[:20]:
            try:
                txt = f.read_text(encoding='utf8', errors='replace')
                memory[str(f.relative_to(ROOT))] = txt[:10000]
            except Exception:
                memory[str(f.relative_to(ROOT))] = '<read-failed>'
    except Exception:
        pass
    out['qmoi_memory'] = memory

    # write a bundle file under OUT_DIR for tools to use
    try:
        ts = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
        bundle = OUT_DIR / f'context_bundle_{ts}.json'
        with open(bundle, 'w', encoding='utf8') as bf:
            json.dump(out, bf, indent=2)
        print(str(bundle))
    except Exception:
        # fallback to printing
        print(json.dumps(out, indent=2))


def help_msg():
    print(__doc__)


def main(argv):
    if len(argv) < 2:
        help_msg(); sys.exit(1)
    cmd = argv[1]
    if cmd == 'snapshot':
        snapshot()
    elif cmd == 'restore':
        pop = '--pop' in argv
        patch = None
        for a in argv[2:]:
            if a.startswith('--patch='):
                patch = a.split('=',1)[1]
        restore(patch=patch, pop_stash=pop)
    elif cmd == 'context':
        context()
    else:
        help_msg()


if __name__ == '__main__':
    main(sys.argv)
#!/usr/bin/env python3
"""Local Chat Agent Helper

Small CLI to help a local chat agent work with repositories that have
uncommitted changes. Provides safe snapshot/restore and patch export/import
so an assistant process can operate on a clean tree while preserving
developer work-in-progress.

Usage:
  python scripts/local_chat_helper.py snapshot <name>    # create a temp branch with current index+work
  python scripts/local_chat_helper.py restore <name>     # restore snapshot branch into working tree (no checkout)
  python scripts/local_chat_helper.py stash               # run 'git stash push -u'
  python scripts/local_chat_helper.py pop                 # git stash pop
  python scripts/local_chat_helper.py create-patch <out>  # create patch of uncommitted changes
  python scripts/local_chat_helper.py apply-patch <file> # apply patch file

This tool avoids destructive actions and writes outputs to stdout for
automation. It's intentionally small and uses git commands.
"""
import argparse
import subprocess
import sys
from pathlib import Path


def run(cmd, check=True, capture=False):
    if capture:
        return subprocess.run(cmd, shell=True, check=check, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return subprocess.run(cmd, shell=True, check=check)


def git_root():
    p = run("git rev-parse --show-toplevel", capture=True)
    if p.returncode != 0:
        print("Not a git repository", file=sys.stderr)
        sys.exit(2)
    return Path(p.stdout.strip())


def snapshot(name: str):
    root = git_root()
    branch = f"wip/snapshot/{name}"
    # ensure index committed on temp branch: create orphan branch then commit tree
    print(f"Creating snapshot branch: {branch}")
    # create a commit from current index and working tree using temporary commit
    run(f"git add -A")
    # create branch from HEAD then commit
    run(f"git branch -f {branch} HEAD")
    # checkout branch temporarily to commit working tree
    run(f"git checkout {branch}")
    try:
        run("git commit -m 'wip: snapshot of working tree' --no-verify || true")
    except Exception:
        # commit may fail if no changes
        pass
    # return to previous branch (HEAD@{1})
    run("git checkout -")
    print(branch)


def restore(name: str):
    root = git_root()
    branch = f"wip/snapshot/{name}"
    # merge the snapshot into working tree without commit
    print(f"Restoring snapshot {branch} into working tree (no commit)")
    run(f"git fetch . {branch}:{branch} || true")
    # checkout files from snapshot into working tree
    run(f"git checkout {branch} -- .")
    print("Restored files from snapshot to working tree")


def do_stash():
    print("Stashing uncommitted changes (including untracked files)")
    run("git stash push -u -m 'local_chat_helper stash' || true")


def do_pop():
    print("Popping stash")
    run("git stash pop || true")


def create_patch(out: str):
    p = Path(out)
    p.parent.mkdir(parents=True, exist_ok=True)
    print(f"Creating patch to {out}")
    run(f"git add -A")
    # create patch of working tree vs HEAD
    run(f"git diff --staged > {out} || true")
    print(out)


def apply_patch(file: str):
    f = Path(file)
    if not f.exists():
        print(f"Patch file not found: {file}", file=sys.stderr)
        sys.exit(1)
    print(f"Applying patch {file}")
    run(f"git apply --index {file} || (git apply {file} && echo 'applied without index')")


def main():
    parser = argparse.ArgumentParser(description='Local chat agent helper for git WIP')
    sub = parser.add_subparsers(dest='cmd')
    sp = sub.add_parser('snapshot')
    sp.add_argument('name')
    sp2 = sub.add_parser('restore')
    sp2.add_argument('name')
    sub.add_parser('stash')
    sub.add_parser('pop')
    sp3 = sub.add_parser('create-patch')
    sp3.add_argument('out')
    sp4 = sub.add_parser('apply-patch')
    sp4.add_argument('file')
    sub.add_parser('context')

    args = parser.parse_args()
    if args.cmd == 'snapshot':
        snapshot(args.name)
    elif args.cmd == 'restore':
        restore(args.name)
    elif args.cmd == 'stash':
        do_stash()
    elif args.cmd == 'pop':
        do_pop()
    elif args.cmd == 'create-patch':
        create_patch(args.out)
    elif args.cmd == 'apply-patch':
        apply_patch(args.file)
    elif args.cmd == 'context':
        # produce a compact context bundle for local chat
        context()
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
