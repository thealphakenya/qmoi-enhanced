#!/usr/bin/env python3
"""Conservative Markdown link auditor/fixer.

Fast default: scans .md files and performs conservative, non-network edits (replace download-like targets
with a safe placeholder). Optional --deep will do bounded HTTP checks. Always writes backups before edits.

Produces:
 - .qmoi_validation/link_validation_report.txt
 - .qmoi_validation/link_validation_report.json
 - .qmoi_validation/link_validation_deep_report.json (if --deep)
"""
from __future__ import annotations
import argparse
import json
import os
import re
import socket
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from time import time
from urllib.request import Request, urlopen
from urllib.error import URLError


ROOT = Path(__file__).resolve().parents[1]
REPORT_DIR = ROOT / ".qmoi_validation"
REPORT_DIR.mkdir(exist_ok=True)
TXT_REPORT = REPORT_DIR / "link_validation_report.txt"
JSON_REPORT = REPORT_DIR / "link_validation_report.json"
DEEP_JSON = REPORT_DIR / "link_validation_deep_report.json"

MD_EXTENSIONS = {".md", ".markdown"}
MD_LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")


def find_md_files() -> list[Path]:
    files: list[Path] = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        # skip large/irrelevant dirs
        if any(p in dirpath for p in ("/.git/", "/node_modules/", str(REPORT_DIR), "/.venv/")):
            continue
        for fn in filenames:
            p = Path(dirpath) / fn
            if p.suffix.lower() in MD_EXTENSIONS or (fn.lower().startswith("readme") and p.suffix):
                files.append(p)
    return files


def is_download_like(target: str) -> bool:
    t = target.strip()
    return bool(re.match(r'^(?:downloads?|download[:/\\])', t, re.I)) or t.lower().startswith('download')


def http_check(url: str, timeout: float = 6.0) -> dict:
    try:
        req = Request(url, method='HEAD')
        with urlopen(req, timeout=timeout) as resp:
            code = getattr(resp, 'getcode', lambda: None)()
            return {'ok': 200 <= (code or 0) < 400, 'status': code}
    except Exception:
        try:
            req = Request(url, method='GET')
            with urlopen(req, timeout=timeout) as resp:
                code = getattr(resp, 'getcode', lambda: None)()
                return {'ok': 200 <= (code or 0) < 400, 'status': code}
        except URLError as e:
            try:
                host = url.split('://', 1)[-1].split('/')[0].split(':')[0]
                socket.gethostbyname(host)
            except Exception:
                return {'ok': False, 'error': 'dns_error', 'detail': str(e)}
            return {'ok': False, 'error': 'url_error', 'detail': str(e)}
        except Exception as e:
            return {'ok': False, 'error': 'unknown', 'detail': str(e)}


def process_file(path: Path, deep: bool, url_tasks: list) -> dict:
    text = path.read_text(encoding='utf-8', errors='replace')
    modified = False
    file_report = {'file': str(path.relative_to(ROOT)), 'links': [], 'replacements': []}

    def repl(m):
        nonlocal modified
        label = m.group(1)
        target = m.group(2).strip()
        info = {'label': label, 'target': target}
        if target.lower().startswith(('http://', 'https://')):
            if deep:
                url_tasks.append((str(path.relative_to(ROOT)), target))
            info['ok'] = None  # Will be updated by deep checks if enabled
        else:
            if is_download_like(target):
                modified = True
                info['action'] = 'replaced_download_placeholder'
                file_report['replacements'].append({'label': label, 'old': target, 'new': 'TODO_REPLACE_DOWNLOAD_LINK'})
                file_report['links'].append(info)  # Add to links before replacement
                return f'[{label}](TODO_REPLACE_DOWNLOAD_LINK)'
            else:
                try:
                    tpath = (path.parent / target).resolve()
                    tpath.relative_to(ROOT)
                    info['exists'] = tpath.exists()
                except Exception:
                    info['exists'] = False

        file_report['links'].append(info)
        return m.group(0)

    new_text = MD_LINK_RE.sub(repl, text)
    if modified:
        bak = path.with_suffix(path.suffix + '.linkfix.bak')
        bak.write_text(text, encoding='utf-8')
        path.write_text(new_text, encoding='utf-8')

    return file_report


def run_deep_checks(urls: list[tuple], max_workers: int = 8) -> dict:
    deduped = {}
    for src, u in urls:
        deduped.setdefault(u, []).append(src)

    res = {}
    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        futures = {ex.submit(http_check, u): u for u in deduped}
        for fut in as_completed(futures):
            u = futures[fut]
            try:
                r = fut.result()
            except Exception as e:
                r = {'ok': False, 'error': 'exception', 'detail': str(e)}
            res[u] = {'result': r, 'seen_in': deduped.get(u, [])}
    return res


def main(argv=None):
    ap = argparse.ArgumentParser(description='Conservative Markdown link auditor/fixer')
    ap.add_argument('--deep', action='store_true', help='Perform HTTP checks (slower)')
    ap.add_argument('--workers', type=int, default=8, help='Max workers for deep checks')
    ap.add_argument('--max-files', type=int, default=0, help='Limit number of markdown files to scan (0=all)')
    args = ap.parse_args(argv)

    start = time()
    md_files = find_md_files()
    if args.max_files and args.max_files > 0:
        md_files = md_files[:args.max_files]

    report = {'run': start, 'files_scanned': len(md_files), 'modified_files': [], 'files': []}
    url_tasks: list[tuple] = []

    for p in md_files:
        try:
            fr = process_file(p, args.deep, url_tasks)
            report['files'].append(fr)
            if fr.get('replacements'):
                report['modified_files'].append(fr['file'])
        except Exception as e:
            report['files'].append({'file': str(p.relative_to(ROOT)), 'error': str(e)})

    TXT = [f"link audit run: {start}", f"files_scanned: {len(md_files)}", f"modified_files_count: {len(report['modified_files'])}", '']
    for mf in report['modified_files']:
        TXT.append(f"MODIFIED: {mf}")
    TXT.append('\nDetailed per-file JSON report at link_validation_report.json')
    TXT_REPORT.write_text('\n'.join(TXT), encoding='utf-8')
    JSON_REPORT.write_text(json.dumps(report, indent=2), encoding='utf-8')

    print(f"Fast link audit complete. scanned={len(md_files)} modified={len(report['modified_files'])}")

    if args.deep and url_tasks:
        print(f"Starting deep checks for {len(url_tasks)} url tasks (deduped)...")
        deep_res = run_deep_checks(url_tasks, max_workers=args.workers)
        DEEP_JSON.write_text(json.dumps({'run': time(), 'results': deep_res}, indent=2), encoding='utf-8')
        print(f"Deep checks complete. results={len(deep_res)}")


if __name__ == '__main__':
    main()
