#!/usr/bin/env python3
"""
tools/check_links.py

Clean, single-version, stdlib-only Markdown link & DNS checker.

Writes:
- tools/dns_docs_inventory.json
- tools/dns_links_report.json
- tools/dns_links_report.md

Run: python3 tools/check_links.py --max-workers 12 --timeout 3
"""

from __future__ import annotations

import argparse
import concurrent.futures
import json
import os
import re
import socket
import time
from typing import Dict, List
from urllib import request, error, parse


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TOOLS_DIR = os.path.join(ROOT, "tools")
os.makedirs(TOOLS_DIR, exist_ok=True)

LINK_RE = re.compile(r"\bhttps?://[\w\-._~:/?#\[\]@!$&'()*+,;=%]+", re.IGNORECASE)


def find_md_files(root: str) -> List[str]:
    files: List[str] = []
    for dirpath, dirnames, filenames in os.walk(root):
        # skip common heavy dirs and our tools outputs
        if any(x in dirpath for x in ("/.git", "/node_modules", "/.venv", os.path.abspath(TOOLS_DIR))):
            continue
        for fn in filenames:
            if fn.lower().endswith(".md"):
                files.append(os.path.join(dirpath, fn))
    return files


def extract_links(text: str) -> List[str]:
    return [m.group(0).rstrip('.,:;') for m in LINK_RE.finditer(text)]


def resolve(hostname: str) -> List[str]:
    try:
        ai = socket.getaddrinfo(hostname, None)
        return sorted({a[4][0] for a in ai})
    except Exception:
        return []


def http_head_fallback(url: str, timeout: float = 3.0) -> Dict:
    rec: Dict = {"url": url, "status": None, "error": None}
    try:
        req = request.Request(url, method="HEAD", headers={"User-Agent": "qmoi-link-checker/1.0"})
        with request.urlopen(req, timeout=timeout) as resp:
            rec["status"] = resp.getcode()
            return rec
    except error.HTTPError as he:
        rec["status"] = he.code
        rec["error"] = getattr(he, "reason", str(he))
        return rec
    except Exception:
        # fallback to GET but read small amount
        try:
            req = request.Request(url, method="GET", headers={"User-Agent": "qmoi-link-checker/1.0"})
            with request.urlopen(req, timeout=timeout) as resp:
                rec["status"] = resp.getcode()
                return rec
        except Exception as e:
            rec["error"] = str(e)
            return rec


def check_one(entry: Dict, timeout: float) -> Dict:
    url = entry["url"]
    out: Dict = {"url": url, "file": entry.get("file")}
    parsed = parse.urlparse(url)
    host = parsed.hostname or ""
    out["host"] = host
    out["resolved_ips"] = resolve(host) if host else []
    http = http_head_fallback(url, timeout=timeout)
    out.update(http)
    return out


def main(root: str, max_workers: int, timeout: float):
    md_files = find_md_files(root)
    inventory: Dict[str, List[str]] = {}
    link_list: List[Dict] = []
    for p in md_files:
        try:
            with open(p, "r", encoding="utf-8", errors="ignore") as fh:
                txt = fh.read()
        except Exception:
            continue
        links = extract_links(txt)
        if links:
            inventory[os.path.relpath(p, root)] = links
            for u in links:
                link_list.append({"file": os.path.relpath(p, root), "url": u})

    inv_path = os.path.join(TOOLS_DIR, "dns_docs_inventory.json")
    with open(inv_path, "w", encoding="utf-8") as fh:
        json.dump({"generated_at": time.time(), "inventory": inventory}, fh, indent=2)

    # cap link checks to avoid very long runs
    MAX = 2000
    if len(link_list) > MAX:
        seen = set(); filtered = []
        for e in link_list:
            if e["url"] in seen:
                continue
            seen.add(e["url"])
            filtered.append(e)
            if len(filtered) >= MAX:
                break
        link_list = filtered

    results: List[Dict] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as ex:
        futures = {ex.submit(check_one, e, timeout): e for e in link_list}
        for fut in concurrent.futures.as_completed(futures):
            try:
                r = fut.result()
            except Exception as exc:
                r = {"url": futures[fut]["url"], "file": futures[fut]["file"], "error": str(exc)}
            results.append(r)

    report_json = os.path.join(TOOLS_DIR, "dns_links_report.json")
    with open(report_json, "w", encoding="utf-8") as fh:
        json.dump({"generated_at": time.time(), "total": len(results), "results": results}, fh, indent=2)

    report_md = os.path.join(TOOLS_DIR, "dns_links_report.md")
    failures = [r for r in results if r.get("error") or (isinstance(r.get("status"), int) and r.get("status") >= 400) or (not r.get("resolved_ips"))]
    with open(report_md, "w", encoding="utf-8") as fh:
        fh.write("# DNS & Link Check Report\n\n")
        fh.write(f"Generated: {time.ctime()}\n\n")
        fh.write(f"Total md files scanned: {len(md_files)}\n\n")
        fh.write(f"Total links checked: {len(results)}\n\n")
        fh.write(f"Failures: {len(failures)}\n\n")
        if failures:
            fh.write("## Top failures\n\n")
            for f in failures[:200]:
                fh.write(f"- File: `{f.get('file')}` URL: {f.get('url')} Status: {f.get('status')} Error: {f.get('error')} Resolved: {f.get('resolved_ips')}\n")

    print("Wrote:", inv_path, report_json, report_md)


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--root", default=ROOT)
    p.add_argument("--max-workers", type=int, default=12)
    p.add_argument("--timeout", type=float, default=3.0)
    args = p.parse_args()
    main(root=args.root, max_workers=args.max_workers, timeout=args.timeout)

from __future__ import annotations

import argparse
import concurrent.futures
import json
import os
import re
import socket
import time
from typing import Dict, List
from urllib import request, error, parse


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TOOLS_DIR = os.path.join(ROOT, "tools")
os.makedirs(TOOLS_DIR, exist_ok=True)

LINK_RE = re.compile(r"\bhttps?://[\w\-._~:/?#\[\]@!$&'()*+,;=%]+", re.IGNORECASE)


def find_md_files(root: str) -> List[str]:
    files: List[str] = []
    for dirpath, dirnames, filenames in os.walk(root):
        # skip common heavy dirs and our tools outputs
        if any(x in dirpath for x in ("/.git", "/node_modules", "/.venv", os.path.abspath(TOOLS_DIR))):
            continue
        for fn in filenames:
            if fn.lower().endswith(".md"):
                files.append(os.path.join(dirpath, fn))
    return files


def extract_links(text: str) -> List[str]:
    return [m.group(0).rstrip('.,:;') for m in LINK_RE.finditer(text)]


def resolve(hostname: str) -> List[str]:
    try:
        ai = socket.getaddrinfo(hostname, None)
        return sorted({a[4][0] for a in ai})
    except Exception:
        return []


def http_head_fallback(url: str, timeout: float = 3.0) -> Dict:
    rec: Dict = {"url": url, "status": None, "error": None}
    try:
        req = request.Request(url, method="HEAD", headers={"User-Agent": "qmoi-link-checker/1.0"})
        with request.urlopen(req, timeout=timeout) as resp:
            rec["status"] = resp.getcode()
            return rec
    except error.HTTPError as he:
        rec["status"] = he.code
        rec["error"] = getattr(he, "reason", str(he))
        return rec
    except Exception:
        # fallback to GET but read small amount
        try:
            req = request.Request(url, method="GET", headers={"User-Agent": "qmoi-link-checker/1.0"})
            with request.urlopen(req, timeout=timeout) as resp:
                rec["status"] = resp.getcode()
                return rec
        except Exception as e:
            rec["error"] = str(e)
            return rec


def check_one(entry: Dict, timeout: float) -> Dict:
    url = entry["url"]
    out: Dict = {"url": url, "file": entry.get("file")}
    parsed = parse.urlparse(url)
    host = parsed.hostname or ""
    out["host"] = host
    out["resolved_ips"] = resolve(host) if host else []
    http = http_head_fallback(url, timeout=timeout)
    out.update(http)
    return out


def main(root: str, max_workers: int, timeout: float):
    md_files = find_md_files(root)
    inventory: Dict[str, List[str]] = {}
    link_list: List[Dict] = []
    for p in md_files:
        try:
            with open(p, "r", encoding="utf-8", errors="ignore") as fh:
                txt = fh.read()
        except Exception:
            continue
        links = extract_links(txt)
        if links:
            inventory[os.path.relpath(p, root)] = links
            for u in links:
                link_list.append({"file": os.path.relpath(p, root), "url": u})

    inv_path = os.path.join(TOOLS_DIR, "dns_docs_inventory.json")
    with open(inv_path, "w", encoding="utf-8") as fh:
        json.dump({"generated_at": time.time(), "inventory": inventory}, fh, indent=2)

    # cap link checks to avoid very long runs
    MAX = 2000
    if len(link_list) > MAX:
        seen = set(); filtered = []
        for e in link_list:
            if e["url"] in seen:
                continue
            seen.add(e["url"])
            filtered.append(e)
            if len(filtered) >= MAX:
                break
        link_list = filtered

    results: List[Dict] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as ex:
        futures = {ex.submit(check_one, e, timeout): e for e in link_list}
        for fut in concurrent.futures.as_completed(futures):
            try:
                r = fut.result()
            except Exception as exc:
                r = {"url": futures[fut]["url"], "file": futures[fut]["file"], "error": str(exc)}
            results.append(r)

    report_json = os.path.join(TOOLS_DIR, "dns_links_report.json")
    with open(report_json, "w", encoding="utf-8") as fh:
        json.dump({"generated_at": time.time(), "total": len(results), "results": results}, fh, indent=2)

    report_md = os.path.join(TOOLS_DIR, "dns_links_report.md")
    failures = [r for r in results if r.get("error") or (isinstance(r.get("status"), int) and r.get("status") >= 400) or (not r.get("resolved_ips"))]
    with open(report_md, "w", encoding="utf-8") as fh:
        fh.write("# DNS & Link Check Report\n\n")
        fh.write(f"Generated: {time.ctime()}\n\n")
        fh.write(f"Total md files scanned: {len(md_files)}\n\n")
        fh.write(f"Total links checked: {len(results)}\n\n")
        fh.write(f"Failures: {len(failures)}\n\n")
        if failures:
            fh.write("## Top failures\n\n")
            for f in failures[:200]:
                fh.write(f"- File: `{f.get('file')}` URL: {f.get('url')} Status: {f.get('status')} Error: {f.get('error')} Resolved: {f.get('resolved_ips')}\n")

    print("Wrote:", inv_path, report_json, report_md)


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--root", default=ROOT)
    p.add_argument("--max-workers", type=int, default=12)
    p.add_argument("--timeout", type=float, default=3.0)
    args = p.parse_args()
    main(root=args.root, max_workers=args.max_workers, timeout=args.timeout)
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
