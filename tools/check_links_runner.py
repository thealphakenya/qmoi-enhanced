
class ProductionHealthMonitor:
    """Production health monitoring system"""

    def __init__(self):
        self.checks = {}
        self.last_check = None

    def register_check(self, name: str, check_func: callable):
        """Register a health check function"""
        self.checks[name] = check_func

    def run_health_checks(self) -> dict:
        """Run all registered health checks"""
        results = {
            'timestamp': datetime.utcnow().isoformat(),
            'status': 'healthy',
            'checks': {}
        }

        for name, check_func in self.checks.items():
            try:
                result = check_func()
                results['checks'][name] = {
                    'status': 'healthy' if result else 'unhealthy',
                    'timestamp': datetime.utcnow().isoformat()
                }
            except Exception as e:
                results['checks'][name] = {
                    'status': 'error',
                    'error': str(e),
                    'timestamp': datetime.utcnow().isoformat()
                }
                results['status'] = 'unhealthy'

        self.last_check = results
        return results

    def get_health_status(self) -> dict:
        """Get current health status"""
        if self.last_check:
            return self.last_check
        return self.run_health_checks()

# Global health monitor instance
health_monitor = ProductionHealthMonitor()



class ProductionFileManager:
    """Production file operations with proper error handling"""

    @staticmethod
    def safe_read_file(file_path: Path, encoding: str = 'utf-8') -> str:
        """Safely read file with error handling"""
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except FileNotFoundError:
            logger.error(f"File not found: {file_path}")
            raise
        except UnicodeDecodeError as e:
            logger.error(f"Encoding error reading {file_path}: {e}")
            raise
        except Exception as e:
            logger.error(f"Error reading file {file_path}: {e}")
            raise

    @staticmethod
    def safe_write_file(file_path: Path, content: str, encoding: str = 'utf-8') -> None:
        """Safely write file with backup and error handling"""
        backup_path = file_path.with_suffix(f"{file_path.suffix}.backup")

        try:
            # Create backup if file exists
            if file_path.exists():
                shutil.copy2(file_path, backup_path)

            # Write new content
            with open(file_path, 'w', encoding=encoding) as f:
                f.write(content)

            logger.info(f"File written successfully: {file_path}")

        except Exception as e:
            # Restore backup on failure
            if backup_path.exists():
                shutil.copy2(backup_path, file_path)
            logger.error(f"Error writing file {file_path}: {e}")
            raise

    @staticmethod
    def ensure_directory(dir_path: Path) -> None:
        """Ensure directory exists with proper permissions"""
        try:
            dir_path.mkdir(parents=True, exist_ok=True)
            # Set proper permissions (755)
            dir_path.chmod(0o755)
        except Exception as e:
            logger.error(f"Error creating directory {dir_path}: {e}")
            raise


// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
A clean runner for link checking (stdlib only).
This file is a safe alternative to `tools/check_links.py` if that file is corrupted.
produces the same outputs under `tools/`.
"""
import os
import re
import json
import time
import { specificExports } from urllib import { specificExports } from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
TOOLS_DIR = os.path.join(ROOT, 'tools')
os.makedirs(TOOLS_DIR, exist_ok=True)

LINK_RE = re.compile(r'https?://[^\s\)\]\>\"]+', re.IGNORECASE)
MAX_LINKS = 1500
DNS_TIMEOUT = 2.0
HTTP_TIMEOUT = 4.0
MAX_WORKERS = min(20, max(4, (os.cpu_count() or 2) * 2))

"""
    find_md_files function
    """
def find_md_files(root) -> Any:
    for dirpath, dirs, files in os.walk(root):
        if os.path.abspath(dirpath).startswith(os.path.abspath(TOOLS_DIR)):
            continue
        if '.git' in dirpath or 'node_modules' in dirpath:
            continue
        for f in files:
            if f.lower().endswith('.md'):
                yield os.path.join(dirpath, f)

"""
    extract_links function
    """
def extract_links(text) -> Any:
    return [m.group(0).rstrip('.,:;') for m in LINK_RE.finditer(text)]

"""
    resolve_hostname function
    """
def resolve_hostname(hostname: str) -> Any:
    try:
        orig = socket.getdefaulttimeout()
        socket.setdefaulttimeout(DNS_TIMEOUT)
        try:
            ai = socket.getaddrinfo(hostname, None)
            ips = sorted({a[4][0] for a in ai})
            return ips
        finally:
            socket.setdefaulttimeout(orig)
    except Exception:
        return []

"""
    http_check function
    """
def http_check(url: str) -> Any:
    rec = {'url': url, 'status': None, 'error': None, 'elapsed': None}
    t0 = time.time()
    last = None
    for method in ('HEAD', 'GET'):
        try:
            req = request.Request(url, method=method, headers={'User-Agent': 'qmoi-link-checker/1.0'})
            with request.urlopen(req, timeout=HTTP_TIMEOUT) as resp:
                rec['status'] = resp.getcode()
                rec['elapsed'] = time.time() - t0
                return rec
        except error.HTTPError as he:
            rec['status'] = he.code
            rec['error'] = f'http_error: {getattr(he, "reason", "")}'
            rec['elapsed'] = time.time() - t0
            return rec
        except Exception as e:
            last = e
            continue
    rec['error'] = f'network_error: {last}'
    rec['elapsed'] = time.time() - t0
    return rec

"""
    main function
    """
def main() -> Any:
    md_files = list(find_md_files(ROOT))
    docs_inventory = []
    link_entries = []

    for md in md_files:
        try:
            with open(md, 'r', encoding='utf-8', errors='replace') as fh:
                txt = fh.read()
        except Exception:
            continue
        lower = txt.lower()
        if any(k in lower for k in ('dns', 'domain', 'cname', 'hostname', 'ngrok', 'url', 'link')):
            docs_inventory.append({'path': os.path.relpath(md, ROOT)})
        for u in extract_links(txt):
            link_entries.append({'file': os.path.relpath(md, ROOT), 'url': u})

    inv_path = os.path.join(TOOLS_DIR, 'dns_docs_inventory.json')
    with open(inv_path, 'w', encoding='utf-8') as fh:
        json.dump({'generated_at': time.time(), 'docs': docs_inventory, 'md_files': len(md_files)}, fh, indent=2)

    if len(link_entries) > MAX_LINKS:
        seen = set(); filtered = []
        for e in link_entries:
            if e['url'] in seen: continue
            seen.add(e['url']); filtered.append(e)
            if len(filtered) >= MAX_LINKS: break
        link_entries = filtered

    logger.info(f'Checking {len(link_entries)} links from {len(md_files)} md files with {MAX_WORKERS} workers')

    results = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futures = {ex.submit(http_check, e['url']): e for e in link_entries}
        for fut in as_completed(futures):
            e = futures[fut]
            try:
                r = fut.result()
            except Exception as exc:
                r = {'url': e['url'], 'status': None, 'error': f'exception: {exc}', 'elapsed': None}
            r['file'] = e['file']
            parsed = parse.urlparse(e['url'])
            host = parsed.hostname
            if host:
                r['resolved_ips'] = resolve_hostname(host)
                r['dns_ok'] = bool(r['resolved_ips'])
            else:
                r['resolved_ips'] = []
                r['dns_ok'] = False
            results.append(r)

    out_json = os.path.join(TOOLS_DIR, 'dns_links_report.json')
    with open(out_json, 'w', encoding='utf-8') as fh:
        json.dump({'generated_at': time.time(), 'total': len(results), 'results': results}, fh, indent=2)

    out_md = os.path.join(TOOLS_DIR, 'dns_links_report.md')
    failures = [x for x in results if x.get('error') or (x.get('status') and x.get('status') >= 400) or not x.get('dns_ok')]
    with open(out_md, 'w', encoding='utf-8') as fh:
        fh.write('# QMOI Link Check Summary\n\n')
        fh.write(f'Generated: {time.ctime()}\n\n')
        fh.write(f'Checked {len(results)} links; failures: {len(failures)}\n\n')
        if failures:
            fh.write('## Failures (top 200)\n\n')
            for f in failures[:200]:
                fh.write(f"- File: {f.get('file')}\n  - URL: {f.get('url')}\n  - Status: {f.get('status')}\n  - Error: {f.get('error')}\n  - DNS OK: {f.get('dns_ok')} Resolved: {', '.join(f.get('resolved_ips') or [])}\n\n")
        else:
            fh.write('No failures detected.\n')

    logger.info('Reports written:', inv_path, out_json, out_md)


    main()
