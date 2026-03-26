// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Light HTTP server that serves only files under a configurable size limit or included in the light index.

Usage:
  python3 tools/start_light_server.py --port 8000 --max-size 5MB

This server is intended for local preview in a Codespace or browser and will
compress responses where possible. It does not modify repository files.
"""
import argparse
from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path
import json
import gzip
import io
import os
import time
import shutil
import tempfile
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parents[1]
LIGHT_INDEX = ROOT / 'tools' / 'light_index.json'
QCITY_CONFIG = ROOT / 'tools' / 'qcity_nodes.json'
CACHE_DIR = ROOT / 'tools' / 'light_cache'
CACHE_META = CACHE_DIR / '.cache_meta.json'

DEFAULT_CACHE_TTL = 86400
DEFAULT_MAX_CACHE_BYTES = 200 * 1024 * 1024  # 200MB default

class LightHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, max_size=5*1024*1024, whitelist=None, qcity_nodes=None, cache_dir=None, max_rate=None, cache_ttl=None, max_cache_bytes=None, **kwargs):
        self.max_size = max_size
        self.whitelist = whitelist or set()
        self.qcity_nodes = qcity_nodes or []
        self.cache_dir = Path(cache_dir) if cache_dir else CACHE_DIR
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        # max_rate bytes/sec (None means unlimited)
        self.max_rate = max_rate
        self.cache_ttl = cache_ttl or DEFAULT_CACHE_TTL
        self.max_cache_bytes = max_cache_bytes or DEFAULT_MAX_CACHE_BYTES
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def _cached_path_for(self, rel):
        # safe local cache path for a repo-relative path
        safe = rel.replace('/', '::')
        return self.cache_dir / safe

    def _attempt_fetch_qcity(self, rel_path):
        """Try to fetch the file from configured qcity nodes and store it in local cache.
        Returns the cached path or None.
        """
        if not self.qcity_nodes:
            return None
        try:
            import requests
        except Exception:
            return None

        for base in self.qcity_nodes:
            try:
                url = urljoin(base.rstrip('/') + '/', rel_path)
                # stream to temp file
                headers = {}
                # pull auth from config if present
                try:
                    cfg = load_qcity_config()
                    auth = cfg.get('auth')
                    if auth and auth.get('type') == 'bearer' and auth.get('token'):
                        headers['Authorization'] = f"Bearer {auth.get('token')}"
                except Exception:
                    pass
                resp = requests.get(url, stream=True, timeout=10, headers=headers)
                if resp.status_code == 200:
                    cached = self._cached_path_for(rel_path)
                    tmp = tempfile.NamedTemporaryFile(delete=False, dir=str(self.cache_dir))
                    with tmp as fh:
                        for chunk in resp.iter_content(chunk_size=65536):
                            if chunk:
                                fh.write(chunk)
                    # move into place
                    shutil.move(tmp.name, str(cached))
                    # update mtime to now
                    try:
                        os.utime(str(cached), None)
                    except Exception:
                        pass
                    # evict old cache entries if needed
                    try:
                        _evict_cache_if_needed(self.max_cache_bytes)
                    except Exception:
                        pass
                    return cached
            except Exception:
                # try next node
                continue
        return None

    def _serve_fileobj_with_throttle(self, fileobj, ctype, length, range_start=None, range_end=None):
        # send headers already prepared by caller
        chunk_size = 64 * 1024
        remaining = (range_end - range_start + 1) if (range_start is not None and range_end is not None) else length
        fileobj.seek(range_start or 0)
        sent = 0
        while remaining > 0:
            to_read = min(chunk_size, remaining)
            chunk = fileobj.read(to_read)
            if not chunk:
                break
            self.wfile.write(chunk)
            sent += len(chunk)
            remaining -= len(chunk)
            if self.max_rate:
                # simple throttle: sleep proportional to chunk size / rate
                time.sleep(len(chunk) / float(self.max_rate))

    def send_head(self):
        path = Path(self.translate_path(self.path))
        try:
            rel = path.relative_to(ROOT).as_posix()
        except Exception:
            rel = Path(self.path.lstrip('/')).as_posix()

        # If file doesn't exist locally, but qcity nodes configured, try to fetch
        if not path.exists() and self.qcity_nodes:
            cached = self._attempt_fetch_qcity(rel)
            if cached:
                path = cached

        if path.is_dir():
            return super().send_head()

        # If file is too large and not whitelisted, attempt to fetch from qcity and/or deny
        size = path.stat().st_size
        if rel not in self.whitelist and size > self.max_size:
            # try fetching a cached version (may be smaller allowed path)
            cached = self._cached_path_for(rel)
            if cached.exists():
                path = cached
                size = path.stat().st_size
            else:
                # if qcity available, try fetch now
                fetched = self._attempt_fetch_qcity(rel)
                if fetched:
                    path = fetched
                    size = path.stat().st_size
                else:
                    self.send_response(403)
                    self.send_header('Content-Type', 'text/plain; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(b'File too large to serve in light mode. Use sparse-checkout or download on demand.')
                    return None

        # handle Range header for full content
        range_header = self.headers.get('Range')
        range_start = range_end = None
        if range_header:
            try:
                # supports single range: bytes=start-end
                unit, rng = range_header.split('=')
                start_str, end_str = rng.split('-')
                range_start = int(start_str) if start_str else 0
                range_end = int(end_str) if end_str else size - 1
            except Exception:
                range_start = range_end = None

        ctype = self.guess_type(str(path))
        # For small or textual files, gzip on the fly (as before)
        if (ctype.startswith('text/') or ctype in ('application/json', 'application/javascript')) and size <= self.max_size:
            content = path.read_bytes()
            buf = io.BytesIO()
            with gzip.GzipFile(fileobj=buf, mode='wb') as gz:
                gz.write(content)
            data = buf.getvalue()
            self.send_response(206 if range_header else 200)
            self.send_header('Content-Type', ctype)
            self.send_header('Content-Encoding', 'gzip')
            self.send_header('Content-Length', str(len(data)))
            if range_header and range_start is not None:
                # compute safe content-range header
                rs = range_start
                re_ = range_end if range_end is not None else len(content) - 1
                self.send_header('Content-Range', f'bytes {rs}-{re_}/{len(content)}')
            self.end_headers()
            # slice gzip'ed bytes carefully
            if range_start is not None:
                start = range_start
                if range_end is not None:
                    end = range_end + 1
                    return io.BytesIO(data[start:end])
                return io.BytesIO(data[start:])
            return io.BytesIO(data)

        # For larger/binary files, stream with optional Range support and throttling
        f = open(path, 'rb')
        if range_start is not None:
            if range_end is None:
                range_end = size - 1
            if range_start >= size:
                self.send_response(416)
                self.end_headers()
                return None
            self.send_response(206)
            self.send_header('Content-Type', ctype)
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Content-Range', f'bytes {range_start}-{range_end}/{size}')
            self.send_header('Content-Length', str(range_end - range_start + 1))
            self.end_headers()
            return f

        # default full file
        self.send_response(200)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(size))
        self.end_headers()
        return f

def load_whitelist():
    if LIGHT_INDEX.exists():
        try:
            j = json.loads(LIGHT_INDEX.read_text(encoding='utf-8'))
            return set(e['path'] for e in j.get('top_files', []) if not e.get('suggest_exclude'))
        except Exception:
            return set()
    return set()

def load_qcity_config():
    cfg = {'nodes': [], 'fetch_timeout_seconds': 10, 'cache_ttl_seconds': DEFAULT_CACHE_TTL, 'max_cache_bytes': DEFAULT_MAX_CACHE_BYTES}
    if QCITY_CONFIG.exists():
        try:
            j = json.loads(QCITY_CONFIG.read_text(encoding='utf-8'))
            cfg.update(j)
        except Exception:
            pass
    return cfg

def _current_cache_size():
    total = 0
    if not CACHE_DIR.exists():
        return 0
    for p in CACHE_DIR.iterdir():
        if p.is_file() and not p.name.startswith('.'):
            try:
                total += p.stat().st_size
            except Exception:
                continue
    return total

def _evict_cache_if_needed(max_bytes):
    # remove oldest files until cache <= max_bytes
    files = [p for p in CACHE_DIR.iterdir() if p.is_file() and not p.name.startswith('.')]
    files.sort(key=lambda p: p.stat().st_mtime)
    total = sum(p.stat().st_size for p in files)
    removed = 0
    while total > max_bytes and files:
        p = files.pop(0)
        try:
            size = p.stat().st_size
            p.unlink()
            total -= size
            removed += 1
        except Exception:
            continue
    return removed

def run(port, max_size):
    whitelist = load_whitelist()
    cfg = load_qcity_config()
    qcity_nodes = cfg.get('nodes', [])
    cache_ttl = cfg.get('cache_ttl_seconds', DEFAULT_CACHE_TTL)
    max_cache_bytes = cfg.get('max_cache_bytes', DEFAULT_MAX_CACHE_BYTES)
    max_rate = cfg.get('max_rate_bytes_per_sec', None)
    handler = lambda *args, **kwargs: LightHandler(*args, max_size=max_size, whitelist=whitelist, qcity_nodes=qcity_nodes, cache_dir=CACHE_DIR, max_rate=max_rate, cache_ttl=cache_ttl, max_cache_bytes=max_cache_bytes, **kwargs)
    server = HTTPServer(('0.0.0.0', port), handler)
    print(f'Light server serving {ROOT} on http://0.0.0.0:{port} (max_size={max_size} bytes)')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('Stopping server')

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--port', type=int, default=8000)
    p.add_argument('--max-size', type=str, default='5MB')
    p.add_argument('--max-rate', type=str, default=None, help='optional max bytes/sec to throttle large downloads, e.g. 100KB')
    args = p.parse_args()
    ms = args.max_size.upper()
    if ms.endswith('MB'):
        max_size = int(float(ms[:-2]) * 1024 * 1024)
    elif ms.endswith('KB'):
        max_size = int(float(ms[:-2]) * 1024)
    else:
        max_size = int(ms)
    # parse optional max-rate
    max_rate = None
    if args.max_rate:
        mr = args.max_rate.upper()
        if mr.endswith('KB'):
            max_rate = int(float(mr[:-2]) * 1024)
        elif mr.endswith('MB'):
            max_rate = int(float(mr[:-2]) * 1024 * 1024)
        else:
            try:
                max_rate = int(mr)
            except Exception:
                max_rate = None
    run(args.port, max_size)
