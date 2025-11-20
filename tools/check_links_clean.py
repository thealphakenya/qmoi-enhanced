#!/usr/bin/env python3
"""
tools/check_links_clean.py

Small, single-file, stdlib-only Markdown link + DNS checker.

Usage:
  python3 tools/check_links_clean.py --max-workers 12 --timeout 3

Outputs to tools/: dns_docs_inventory.json, dns_links_report.json, dns_links_report.md
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


def find_files(root: str, exts: List[str] | None = None) -> List[str]:
    """Find files under root matching extensions (defaults to Markdown + common docs/code files)."""
    if exts is None:
        exts = [".md", ".mdx", ".html", ".htm", ".js", ".ts", ".tsx", ".jsx"]
    exts = [e.lower() for e in exts]
    out: List[str] = []
    skip_paths = ("/.git", "/node_modules", "/.venv", os.path.abspath(TOOLS_DIR))
    for dirpath, dirnames, filenames in os.walk(root):
        if any(x in dirpath for x in skip_paths):
            continue
        for fn in filenames:
            lf = fn.lower()
            for e in exts:
                if lf.endswith(e):
                    out.append(os.path.join(dirpath, fn))
                    break
    return out


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
    md_files = find_files(root)
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
        fh.write(f"Total files scanned: {len(md_files)}\n\n")
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
