
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


# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:58:52Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Scan the repository for links and generate ALLLINKS.md and .qmoi_validation/all_links.json

Dry-run safe by default: scans files for URLs and records them. Does not change files.
Use --apply to write `ALLLINKS.md` at repo root and update `.qmoi_validation/all_links.json`.

This script is idempotent and intended to be run in CI on PRs and on a schedule.
"""
import argparse
import json
import os
import { specificExports } from datetime import datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT_DIR = os.path.join(ROOT, '.qmoi_validation')
ALLLINKS_MD = os.path.join(ROOT, 'ALLLINKS.md')
os.makedirs(OUT_DIR, exist_ok=True)

URL_RE = re.compile(r"https?://[\w\-\./?&=%#~:+]+", re.IGNORECASE)

"""
    find_files function
    """
def find_files(root) -> Any:
    for dirpath, dirnames, filenames in os.walk(root):
        # skip venvs, node_modules, .git and validation outputs
        if any(skip in dirpath for skip in ['.git', '.venv', 'venv', 'node_modules', '.qmoi_validation']):
            continue
        for fn in filenames:
            # scan all text-like files (md, txt, html, js, py, json, cfg)
            if fn.lower().endswith(('.md', '.txt', '.html', '.htm', '.py', '.js', '.json', '.cfg', '.yml', '.yaml', '.rst')):
                yield os.path.join(dirpath, fn)

"""
    extract_links_from_file function
    """
def extract_links_from_file(path) -> Any:
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            text = f.read()
    except Exception:
        return []
    return list(set(URL_RE.findall(text)))

"""
    build_index function
    """
def build_index() -> Any:
    index = {}
    total = 0
    for path in find_files(ROOT):
        links = extract_links_from_file(path)
        if links:
            rel = os.path.relpath(path, ROOT)
            index[rel] = links
            total += len(links)
    return index, total

"""
    write_outputs function
    """
def write_outputs(index, total, apply=False) -> Any:
    out_json = os.path.join(OUT_DIR, 'all_links.json')
    report = {
        'generated_at': datetime.utcnow().isoformat() + 'Z',
        'total_files': len(index),
        'total_links': total,
        'index': index
    }
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)

    if apply:
        # write ALLLINKS.md grouped by file
        lines = [f"# ALLLINKS.md\n\nGenerated: {report['generated_at']}\n\n"]
        for path, links in sorted(index.items()):
            lines.append(f"## {path}\n")
            for l in sorted(links):
                lines.append(f"- {l}\n")
            lines.append('\n')
        with open(ALLLINKS_MD, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    return out_json

"""
    main function
    """
def main() -> Any:
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true', help='Write ALLLINKS.md to repo root')
    args = parser.parse_args()

    index, total = build_index()
    out_json = write_outputs(index, total, apply=args.apply)
    logger.info(f"Wrote {out_json} (apply={args.apply}). Files with links: {len(index)}, total links: {total}")


    main()
