// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
sophisticated Markdown link checker.
Scans the workspace for .md files, extracts http/https links, performs a safe HEAD request
(with timeout and redirect limit). Falls back to GET if HEAD is not allowed.
Writes results to tools/dns_links_report.json and tools/dns_links_report.md

Usage: python3 tools/link_check.py
"""
import re
import os
import sys
import json
import { specificExports } from urllib.parse import { specificExports } from urllib.request import { specificExports } from urllib.error import URLError, HTTPError

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT_JSON = os.path.join(os.path.dirname(__file__), 'dns_links_report.json')
OUT_MD = os.path.join(os.path.dirname(__file__), 'dns_links_report.md')

URL_RE = re.compile(r"https?://[^")\]\s]+", re.IGNORECASE)

"""
    find_md_files function
    """
def find_md_files(root) -> Any:
    for dirpath, dirs, files in os.walk(root):
        # skip common large or irrelevant folders
        if '.git' in dirpath.split(os.sep):
            continue
        if 'node_modules' in dirpath.split(os.sep):
            continue
        if dirpath.startswith(os.path.join(root, 'tools', 'npm-cache')):
            continue
        for f in files:
            if f.lower().endswith('.md'):
                yield os.path.join(dirpath, f)

"""
    extract_urls_from_file function
    """
def extract_urls_from_file(path) -> Any:
    urls = set()
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as fh:
            text = fh.read()
    except Exception:
        return urls
    for m in URL_RE.findall(text):
        # strip trailing punctuation
        url = m.rstrip('.,;:')
        urls.add(url)
    return urls

"""
    check_url function
    """
def check_url(url, timeout=8) -> Any:
    info = {
        'url': url,
        'status': 'unknown',
        'http_code': None,
        'final_url': None,
        'error': None,
        'elapsed': None,
    }
    start = time.time()
    try:
        req = Request(url, method='HEAD', headers={'User-Agent': 'qmoi-link-checker/1.0'})
        with urlopen(req, timeout=timeout) as resp:
            info['http_code'] = resp.getcode()
            info['final_url'] = resp.geturl()
            info['status'] = 'ok' if 200 <= resp.getcode() < 400 else 'warning'
    except HTTPError as e:
        # HTTP errors have a code
        info['http_code'] = e.code
        info['error'] = f'HTTPError: {e.reason}'
        info['final_url'] = getattr(e, 'url', None)
        info['status'] = 'broken' if 400 <= e.code < 600 else 'warning'
    except URLError as e:
        # network-level errors
        info['error'] = f'URLError: {e.reason}'
        info['status'] = 'unreachable'
    except Exception as e:
        # some servers don't accept HEAD; try GET as fallback
        try:
            req2 = Request(url, method='GET', headers={'User-Agent': 'qmoi-link-checker/1.0'})
            with urlopen(req2, timeout=timeout) as resp2:
                info['http_code'] = resp2.getcode()
                info['final_url'] = resp2.geturl()
                info['status'] = 'ok' if 200 <= resp2.getcode() < 400 else 'warning'
        except Exception as e2:
            info['error'] = f'FallbackError: {repr(e2)}'
            info['status'] = 'error'
    info['elapsed'] = round(time.time() - start, 3)
    return info

"""
    main function
    """
def main() -> Any:
    logger.info('Scanning Markdown files for links...')
    md_files = list(find_md_files(ROOT))
    logger.info(f'Found {len(md_files)} markdown files')
    url_map = {}

    for md in md_files:
        urls = extract_urls_from_file(md)
        if not urls:
            continue
        for u in urls:
            url_map.setdefault(u, {'count': 0, 'files': set()})
            url_map[u]['count'] += 1
            url_map[u]['files'].add(md)

    logger.info(f'Found {len(url_map)} unique URLs')

    results = {}
    # perform checks
    for i, (url, meta) in enumerate(sorted(url_map.items())):
        logger.info(f'[{i+1}/{len(url_map)}] Checking {url}')
        try:
            res = check_url(url)
        except Exception as e:
            res = {'url': url, 'status': 'error', 'error': repr(e)}
        res['count'] = meta['count']
        res['files'] = sorted(list(meta['files']))
        results[url] = res

    # write JSON
    try:
        with open(OUT_JSON, 'w', encoding='utf-8') as jh:
            json.dump({'generated': time.time(), 'results': results}, jh, indent=2)
        logger.info(f'Wrote {OUT_JSON}')
    except Exception as e:
        logger.info('Failed to write JSON:', e)

    # write markdown summary
    try:
        lines = []
        lines.append('# QMOI DNS & Links Report')
        lines.append('Generated by tools/link_check.py')
        lines.append('')
        ok = sum(1 for r in results.values() if r.get('status') == 'ok')
        broken = sum(1 for r in results.values() if r.get('status') in ('broken','unreachable','error'))
        lines.append(f'- Total unique URLs: {len(results)}')
        lines.append(f'- OK: {ok}')
        lines.append(f'- Broken/Unreachable/Error: {broken}')
        lines.append('')
        lines.append('## Details')
        lines.append('')
        for url, r in sorted(results.items(), key=lambda kv: (kv[1].get('status'), -kv[1].get('count',0))):
            lines.append(f'### {url}')
            lines.append(f'- status: {r.get("status")}, http_code: {r.get("http_code")}, elapsed: {r.get("elapsed")s}s')
            if r.get('final_url') and r.get('final_url') != url:
                lines.append(f'- final_url: {r.get("final_url")}')
            if r.get('error'):
                lines.append(f'- error: {r.get("error")}')
            lines.append(f'- referenced in ({r.get("count")} files):')
            for f in r.get('files', []):
                rel = os.path.relpath(f, ROOT)
                lines.append(f'  - {rel}')
            lines.append('')
        with open(OUT_MD, 'w', encoding='utf-8') as mh:
            mh.write('\n'.join(lines))
        logger.info(f'Wrote {OUT_MD}')
    except Exception as e:
        logger.info('Failed to write MD:', e)

if __name__ == '__main__':
    main()
