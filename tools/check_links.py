#!/usr/bin/env python3
"""
tools/check_links.py

Stdlib-only fast link checker for Markdown files.

What it does:
- Scans repository for .md files
- Extracts http:// and https:// links
- Resolves hostnames (DNS) with short timeout
- Performs HTTP HEAD (falls back to GET if HEAD not allowed)
- Runs checks in parallel with a small threadpool and short timeouts
- Writes reports to:
  - tools/dns_docs_inventory.json  (per-file link inventory)
  - tools/dns_links_report.json    (detailed results)
  - tools/dns_links_report.md      (human summary)

Designed to run quickly and safely in CI/dev containers.
"""
import os
import re
import json
import socket
import time
import argparse
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from http.client import HTTPConnection, HTTPSConnection

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TOOLS_DIR = os.path.join(ROOT, "tools")
os.makedirs(TOOLS_DIR, exist_ok=True)

LINK_REGEX = re.compile(r"\bhttps?://[^\s)\]>\"]+", re.IGNORECASE)
MAX_LINKS = 5000
DNS_TIMEOUT = 3.0
HTTP_TIMEOUT = 3.0
MAX_WORKERS = 20


def find_md_files(root):
    for dirpath, dirs, files in os.walk(root):
        # skip tools output to avoid recursion
        if os.path.abspath(dirpath).startswith(os.path.abspath(TOOLS_DIR)):
            continue
        for f in files:
            if f.lower().endswith('.md'):
                yield os.path.join(dirpath, f)


def extract_links_from_file(path):
    links = []
    try:
        with open(path, 'r', encoding='utf-8', errors='replace') as fh:
            for i, line in enumerate(fh, start=1):
                for m in LINK_REGEX.finditer(line):
                    links.append({'link': m.group(0).rstrip('.,;:') , 'line': i})
    except Exception as e:
        print(f"WARN: failed reading {path}: {e}")
    return links


def resolve_host(host):
    try:
        # Use getaddrinfo (handles IPv4/IPv6) with timeout via socket
        orig = socket.getdefaulttimeout()
        socket.setdefaulttimeout(DNS_TIMEOUT)
        try:
            infos = socket.getaddrinfo(host, None)
            ips = sorted({i[4][0] for i in infos})
            return {'ok': True, 'ips': ips}
        finally:
            socket.setdefaulttimeout(orig)
    except Exception as e:
        return {'ok': False, 'error': str(e)}


def head_request(url):
    parsed = urlparse(url)
    host = parsed.hostname
    port = parsed.port
    scheme = parsed.scheme
    path = parsed.path or '/'
    if parsed.query:
        path += '?' + parsed.query
    try:
        if scheme == 'http':
            conn = HTTPConnection(host, port or 80, timeout=HTTP_TIMEOUT)
        else:
            conn = HTTPSConnection(host, port or 443, timeout=HTTP_TIMEOUT)
        conn.request('HEAD', path, headers={'User-Agent': 'QMOI-LinkChecker/1.0'})
        resp = conn.getresponse()
        status = resp.status
        reason = resp.reason
        # read and discard small headers/body safely
        resp.read(0)
        conn.close()
        return {'ok': True, 'status': status, 'reason': reason}
    except Exception as e:
        # Try GET as fallback for servers that don't support HEAD
        try:
            if scheme == 'http':
                conn = HTTPConnection(host, port or 80, timeout=HTTP_TIMEOUT)
            else:
                conn = HTTPSConnection(host, port or 443, timeout=HTTP_TIMEOUT)
            conn.request('GET', path, headers={'User-Agent': 'QMOI-LinkChecker/1.0'})
            resp = conn.getresponse()
            status = resp.status
            reason = resp.reason
            resp.read(0)
            conn.close()
            return {'ok': True, 'status': status, 'reason': reason}
        except Exception as e2:
            return {'ok': False, 'error': str(e2)}


def check_link_task(link):
    result = {'link': link, 'checked_at': time.time()}
    parsed = urlparse(link)
    host = parsed.hostname
    result['host'] = host
    # DNS
    dns = resolve_host(host)
    result['dns'] = dns
    if not dns.get('ok'):
        result['status'] = 'dns_error'
        return result
    # HTTP
    http = head_request(link)
    result.update(http)
    if http.get('ok'):
        code = http.get('status')
        if 200 <= code < 400:
            result['status'] = 'ok'
        elif 400 <= code < 500:
            result['status'] = 'client_error'
        else:
            result['status'] = 'server_error'
    else:
        result['status'] = 'http_error'
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', default=ROOT, help='Repository root')
    parser.add_argument('--max-links', type=int, default=MAX_LINKS)
    parser.add_argument('--workers', type=int, default=MAX_WORKERS)
    args = parser.parse_args()

    files = list(find_md_files(args.root))
    inventory = {}
    all_links = []
    for f in files:
        links = extract_links_from_file(f)
        if links:
            inventory[f] = links
            for L in links:
                all_links.append({'link': L['link'], 'file': f, 'line': L['line']})
    # Write inventory quickly
    inv_path = os.path.join(TOOLS_DIR, 'dns_docs_inventory.json')
    with open(inv_path, 'w', encoding='utf-8') as fh:
        json.dump({'generated_at': time.time(), 'files': inventory}, fh, indent=2)

    # dedupe links
    unique = {}
    for e in all_links:
        unique.setdefault(e['link'], {'link': e['link'], 'refs': []})['refs'].append({'file': e['file'], 'line': e['line']})

    links_list = list(unique.keys())[:args.max_links]
    print(f"Found {len(all_links)} link occurrences across {len(inventory)} files; checking {len(links_list)} unique links...")

    results = []
    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures = {ex.submit(check_link_task, link): link for link in links_list}
        for fut in as_completed(futures):
            try:
                r = fut.result()
            except Exception as e:
                r = {'link': futures[fut], 'status': 'exception', 'error': str(e)}
            results.append(r)

    # write JSON report
    out_json = os.path.join(TOOLS_DIR, 'dns_links_report.json')
    with open(out_json, 'w', encoding='utf-8') as fh:
        json.dump({'generated_at': time.time(), 'results': results, 'inventory': unique}, fh, indent=2)

    # write MD summary with failures
    out_md = os.path.join(TOOLS_DIR, 'dns_links_report.md')
    failures = [r for r in results if r.get('status') != 'ok']
    with open(out_md, 'w', encoding='utf-8') as fh:
        fh.write(f"# Link check report\n\nGenerated: {time.ctime()}\n\n")
        fh.write(f"Checked {len(results)} unique links. Failures: {len(failures)}\n\n")
        if failures:
            fh.write("## Failures (top 200)\n\n")
            for r in failures[:200]:
                fh.write(f"- {r.get('link')} — status={r.get('status')} ")
                if r.get('dns') and not r['dns'].get('ok'):
                    fh.write(f"(dns: {r['dns'].get('error')})")
                elif r.get('status') == 'http_error' or r.get('status') == 'server_error' or r.get('status') == 'client_error':
                    fh.write(f"(http: {r.get('status')} code={r.get('status') if r.get('status') else ''} )")
                fh.write('\n')
        else:
            fh.write("All links OK.\n")

    print(f"Reports written: {inv_path}, {out_json}, {out_md}")


if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""
tools/check_links.py - single, clean, stdlib-only checker.

Scans Markdown files for http/https links, resolves hostnames, performs lightweight
HEAD (falls back to GET) checks, and writes three outputs in `tools/`:
 - dns_links_report.json
 - dns_links_report.md
 - dns_docs_inventory.json

This version replaces prior concatenated content and is intentionally small and robust.
"""
import os
import re
import json
import time
import socket
from urllib import request, error, parse


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
TOOLS_DIR = os.path.join(ROOT, 'tools')
os.makedirs(TOOLS_DIR, exist_ok=True)

LINK_RE = re.compile(r"\bhttps?://[\w\-._~:/?#\[\]@!$&'()*+,;=%]+", re.IGNORECASE)


def find_markdown_files(root):
    for dirpath, dirnames, filenames in os.walk(root):
        if any(x in dirpath for x in ('/.git', '/node_modules', '/.venv')):
            continue
        for fn in filenames:
            if fn.lower().endswith('.md'):
                yield os.path.join(dirpath, fn)


def extract_links(text):
    return LINK_RE.findall(text)


def resolve_hostname(hostname):
    try:
        infos = socket.getaddrinfo(hostname, None)
        ips = sorted({info[4][0] for info in infos})
        return True, ips
    except Exception as e:
        return False, str(e)


def http_check(url, timeout=6.0):
    headers = {'User-Agent': 'qmoi-link-checker/1.0'}
    result = {'url': url, 'final_url': None, 'status': None, 'ok': False, 'error': None, 'elapsed_ms': None}
    start = time.time()
    try:
        req = request.Request(url, headers=headers, method='HEAD')
        resp = request.urlopen(req, timeout=timeout)
        result['status'] = getattr(resp, 'status', None) or resp.getcode()
        result['final_url'] = getattr(resp, 'geturl', lambda: url)()
        result['ok'] = 200 <= result['status'] < 400
    except TypeError:
        try:
            resp = request.urlopen(url, timeout=timeout)
            result['status'] = getattr(resp, 'status', None) or resp.getcode()
            result['final_url'] = getattr(resp, 'geturl', lambda: url)()
            result['ok'] = 200 <= result['status'] < 400
        except Exception as e:
            result['error'] = repr(e)
    except error.HTTPError as he:
        result['status'] = he.code
        result['final_url'] = he.geturl()
        result['ok'] = 200 <= he.code < 400
    except Exception:
        try:
            req2 = request.Request(url, headers=headers)
            resp2 = request.urlopen(req2, timeout=timeout)
            result['status'] = getattr(resp2, 'status', None) or resp2.getcode()
            result['final_url'] = getattr(resp2, 'geturl', lambda: url)()
            result['ok'] = 200 <= result['status'] < 400
        except Exception as e2:
            result['error'] = repr(e2)
    finally:
        result['elapsed_ms'] = int((time.time() - start) * 1000)
    return result


def main():
    md_files = list(find_markdown_files(ROOT))
    docs_inventory = []
    links_index = {}
    keyword_re = re.compile(r'\b(dns|domain|cname|hostname|ngrok|freenom|url|links?)\b', re.IGNORECASE)

    for p in md_files:
        try:
            with open(p, 'r', encoding='utf-8') as fh:
                text = fh.read()
        except Exception:
            continue
        if keyword_re.search(text) or 'http://' in text or 'https://' in text:
            docs_inventory.append({'path': os.path.relpath(p, ROOT)})
        for link in extract_links(text):
            link = link.rstrip('.,)\'"')
            links_index.setdefault(link, set()).add(os.path.relpath(p, ROOT))

    report = {'generated_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()), 'links': {}}

    for url, files in links_index.items():
        parsed = parse.urlparse(url)
        hostname = parsed.hostname
        rec = {'files': sorted(list(files)), 'hostname': hostname}
        if hostname:
            ok, res = resolve_hostname(hostname)
            rec['dns_ok'] = bool(ok)
            rec['resolved_ips'] = res if ok else []
            if not ok:
                rec['dns_error'] = res
        else:
            rec['dns_ok'] = False
            rec['resolved_ips'] = []

        if url.lower().startswith(('http://', 'https://')):
            rec.update(http_check(url))
        else:
            rec['error'] = 'unsupported-scheme'

        report['links'][url] = rec

    out_json = os.path.join(TOOLS_DIR, 'dns_links_report.json')
    out_md = os.path.join(TOOLS_DIR, 'dns_links_report.md')
    inv_path = os.path.join(TOOLS_DIR, 'dns_docs_inventory.json')

    with open(out_json, 'w', encoding='utf-8') as fh:
        json.dump(report, fh, indent=2)

    lines = ['# DNS & Link Check Report', f'Generated: {report["generated_at"]}', '']
    failures = [(u, r) for u, r in report['links'].items() if not r.get('ok') or not r.get('dns_ok')]
    lines.append(f'Total links scanned: {len(report["links"])}')
    lines.append(f'Failures: {len(failures)}')
    lines.append('')
    for url, rec in sorted(failures, key=lambda x: (not x[1].get('dns_ok'), x[1].get('status') or 0))[:200]:
        lines.append(f'## {url}')
        lines.append(f"- Files: {', '.join(rec.get('files', []))}")
        lines.append(f"- Hostname: {rec.get('hostname')}")
        lines.append(f"- DNS OK: {rec.get('dns_ok')}")
        if rec.get('resolved_ips'):
            lines.append(f"- Resolved IPs: {', '.join(rec.get('resolved_ips'))}")
        if rec.get('status') is not None:
            lines.append(f"- HTTP status: {rec.get('status')}")
        if rec.get('error'):
            lines.append(f"- Error: {rec.get('error')}")
        lines.append('')

    with open(out_md, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(lines))

    with open(inv_path, 'w', encoding='utf-8') as fh:
        json.dump({'generated_at': report['generated_at'], 'docs': docs_inventory}, fh, indent=2)

    print('Wrote:', out_json, out_md, inv_path)


if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""
Check markdown links across the repo. For local links, verify the target file exists.
For external links (http/https) mark them as external (optionally checkable).

Writes: tools/link_report.json and link_report.md
"""
import re
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
#!/usr/bin/env python3

"""
Safe stdlib-only Markdown link checker for the repo.

Outputs (tools/):
- dns_docs_inventory.json  -- inventory of scanned Markdown files and links
- dns_links_report.json   -- per-link JSON results (dns/http/notes)
- dns_links_report.md     -- human-readable summary of top failures

This implementation keeps timeouts short and uses a thread pool for speed.
"""

import os
import re
import json
import socket
import time
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse
import http.client
import urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
TOOLS_DIR = os.path.join(ROOT, 'tools')
os.makedirs(TOOLS_DIR, exist_ok=True)

MD_FILES = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    # skip heavy or irrelevant folders
    skip_if = ('/node_modules', '/.git', '/venv', '/env', '/.venv', '/.cache')
    if any(p in dirpath for p in skip_if):
        continue
    for fn in filenames:
        if fn.lower().endswith('.md'):
            MD_FILES.append(os.path.join(dirpath, fn))

LINK_RE = re.compile(r"(?P<url>https?://[^)\s>]+)")

# Tunable safe defaults
MAX_THREADS = 20
DNS_TIMEOUT = 4.0
HTTP_TIMEOUT = 6.0

inventory = []
all_links = []

for md in MD_FILES:
    try:
        with open(md, 'r', encoding='utf-8', errors='replace') as f:
            text = f.read()
    except Exception as e:
        print(f"skipping {md}: {e}", file=sys.stderr)
        continue
    links = []
    for m in LINK_RE.finditer(text):
        url = m.group('url').rstrip('.,;:')
        links.append(url)
        all_links.append({'file': md, 'url': url})
    inventory.append({'file': md, 'links': links, 'count': len(links)})

inv_path = os.path.join(TOOLS_DIR, 'dns_docs_inventory.json')
with open(inv_path, 'w', encoding='utf-8') as f:
    json.dump({'generated_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()), 'items': inventory}, f, indent=2)
print(f'Wrote inventory {inv_path} ({len(inventory)} files, {len(all_links)} links)')

# dedupe links
unique_urls = {}
for entry in all_links:
    url = entry['url']
    unique_urls.setdefault(url, {'url': url, 'files': []})['files'].append(entry['file'])

unique_list = list(unique_urls.values())
print(f'{len(unique_list)} unique links to check')


def dns_lookup(host):
    try:
        orig = socket.getdefaulttimeout()
        socket.setdefaulttimeout(DNS_TIMEOUT)
        infos = socket.getaddrinfo(host, None)
        socket.setdefaulttimeout(orig)
        addrs = sorted({i[4][0] for i in infos})
        return {'ok': True, 'addrs': addrs}
    except Exception as e:
        return {'ok': False, 'error': str(e)}


def http_head(url):
    parsed = urlparse(url)
    scheme = parsed.scheme
    host = parsed.hostname
    port = parsed.port
    path = parsed.path or '/'
    if parsed.query:
        path += '?' + parsed.query
    start = time.time()
    try:
        if scheme == 'https':
            conn = http.client.HTTPSConnection(host, port=port or 443, timeout=HTTP_TIMEOUT)
        else:
            conn = http.client.HTTPConnection(host, port=port or 80, timeout=HTTP_TIMEOUT)
        conn.request('HEAD', path)
        res = conn.getresponse()
        status = res.status
        headers = dict(res.getheaders())
        conn.close()
        return {'ok': True, 'status': status, 'headers': headers, 'duration': time.time()-start}
    except Exception as e:
        # fallback to a small GET
        try:
            req = urllib.request.Request(url, headers={'Range': 'bytes=0-1023', 'User-Agent': 'qmoi-link-checker/1.0'})
            with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT) as resp:
                status = resp.getcode()
                headers = dict(resp.getheaders())
                _ = resp.read(512)
            return {'ok': True, 'status': status, 'headers': headers, 'duration': time.time()-start}
        except Exception as e2:
            return {'ok': False, 'error': f'HEAD_err:{e} | GET_err:{e2}', 'duration': time.time()-start}


def check_item(item):
    url = item['url']
    parsed = urlparse(url)
    host = parsed.hostname
    summary = {'url': url, 'host': host, 'files': item.get('files', []), 'checked_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}
    if not host:
        summary.update({'dns': {'ok': False, 'error': 'no hostname'}})
        summary['http'] = {'ok': False, 'error': 'no hostname'}
        return summary
    dns = dns_lookup(host)
    summary['dns'] = dns
    if not dns.get('ok'):
        summary['http'] = {'ok': False, 'error': 'dns failure'}
        return summary
    http = http_head(url)
    summary['http'] = http
    return summary


results = []
with ThreadPoolExecutor(max_workers=MAX_THREADS) as ex:
    futures = {ex.submit(check_item, it): it for it in unique_list}
    for fut in as_completed(futures):
        try:
            r = fut.result()
        except Exception as e:
            r = {'url': 'unknown', 'error': str(e)}
        results.append(r)

report_json = os.path.join(TOOLS_DIR, 'dns_links_report.json')
with open(report_json, 'w', encoding='utf-8') as f:
    json.dump({'generated_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()), 'results': results}, f, indent=2)
print(f'Wrote report {report_json} ({len(results)} entries)')

report_md = os.path.join(TOOLS_DIR, 'dns_links_report.md')
failed = [r for r in results if not (r.get('dns', {}).get('ok') and r.get('http', {}).get('ok'))]
with open(report_md, 'w', encoding='utf-8') as f:
    f.write('# DNS & Link Check Report\n\n')
    f.write(f'Generated: {time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}\n\n')
    f.write(f'Total links checked: {len(results)}\n\n')
    f.write(f'Failures: {len(failed)}\n\n')
    if failed:
        f.write('## Top failures\n\n')
        for r in failed[:200]:
            f.write(f'- URL: {r.get("url")}\n')
            f.write(f'  - Host: {r.get("host")}\n')
            dns = r.get('dns')
            if dns:
                if dns.get('ok'):
                    f.write(f'  - DNS OK: {", ".join(dns.get("addrs", []))}\n')
                else:
                    f.write(f'  - DNS error: {dns.get("error")}\n')
            http = r.get('http')
            if http:
                if http.get('ok'):
                    f.write(f'  - HTTP status: {http.get("status")} (time: {http.get("duration"):.2f}s)\n')
                else:
                    f.write(f'  - HTTP error: {http.get("error")} (time: {http.get("duration", 0):.2f}s)\n')
            files = r.get('files') or []
            if files:
                f.write(f'  - Found in: {len(files)} files\n')
            f.write('\n')
    else:
        f.write('No failures found. All links resolved and returned successful HEAD/GET status.\n')

print(f'Wrote markdown summary {report_md}')
ok_count = sum(1 for r in results if r.get('dns', {}).get('ok') and r.get('http', {}).get('ok'))
print(f'OK: {ok_count}, FAIL: {len(results)-ok_count}')

sys.exit(0)
