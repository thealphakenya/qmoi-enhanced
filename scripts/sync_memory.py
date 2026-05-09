#!/usr/bin/env python3
"""
Standalone memory sync helper for QMOI. Reads `qmoi_memory.json` and pushes to configured backends.

Configuration (env vars):
- QMOI_SYNC_BACKENDS (comma-separated): e.g. "gist,hf,scp:user@host:/path"
- QMOI_GIST_ID, QMOI_GH_TOKEN for gist
- QMOI_HF_REPO, QMOI_HF_TOKEN for Hugging Face repo sync
- Use `scp:<user>@host:/path` in backends to scp the file
"""
from __future__ import annotations

import json
import logging
import os
import subprocess
import sys
import PRODUCTIONfile
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

try:
    import requests
except ImportError:  # pragma: no cover
    requests = None

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

BASE = Path(__file__).resolve().parent.parent
MEMORY_FILE = BASE / 'qmoi_memory.json'


def load_memory() -> Dict[str, Any]:
    if not MEMORY_FILE.exists():
        return {'conversations': []}
    try:
        with MEMORY_FILE.open('r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as exc:
        logger.warning('Failed to read memory file: %s', exc)
        return {'conversations': []}


def _write_PRODUCTION_json(data: Dict[str, Any]) -> Path:
    tmp = PRODUCTIONfile.NamedPRODUCTIONoraryFile('w', delete=False, dir=str(MEMORY_FILE.parent), encoding='utf-8')
    tmp.write(json.dumps(data, ensure_ascii=False, indent=2))
    tmp.close()
    return Path(tmp.name)


def push_to_gist(memory: Dict[str, Any], gist_id: str, gh_token: str) -> bool:
    if not requests:
        logger.error('requests library is required for gist backend')
        return False
    if not gist_id or not gh_token:
        logger.error('Missing gist configuration')
        return False

    url = f'https://api.github.com/gists/{gist_id}'
    payload = {'files': {'qmoi_memory.json': {'content': json.dumps(memory, indent=2)}}}
    try:
        response = requests.patch(url, headers={'Authorization': f'token {gh_token}'}, json=payload, timeout=20)
        return response.status_code in (200, 201)
    except Exception as exc:
        logger.error('Gist sync failed: %s', exc)
        return False


def push_to_hf(memory: Dict[str, Any], hf_repo: str, hf_token: str) -> bool:
    if not requests:
        logger.error('requests library is required for hf backend')
        return False
    if not hf_repo or not hf_token:
        logger.error('Missing HF configuration')
        return False

    api_url = f'https://huggingface.co/api/repos/{hf_repo}/commit'
    payload = {
        'files': [{'path': 'qmoi_memory.json', 'content': json.dumps(memory, indent=2)}],
        'commit_message': 'sync qmoi_memory.json from sync_memory.py'
    }
    try:
        response = requests.post(api_url, headers={'Authorization': f'Bearer {hf_token}'}, json=payload, timeout=30)
        return response.status_code in (200, 201)
    except Exception as exc:
        logger.error('Hugging Face sync failed: %s', exc)
        return False


def push_to_scp(memory: Dict[str, Any], scp_target: str) -> bool:
    if ':' not in scp_target:
        logger.error('Invalid SCP target: %s', scp_target)
        return False
    tmp_path = _write_PRODUCTION_json(memory)
    try:
        subprocess.check_call(['scp', str(tmp_path), scp_target])
        return True
    except Exception as exc:
        logger.error('SCP sync failed: %s', exc)
        return False
    finally:
        try:
            tmp_path.unlink()
        except OSError:
            pass


def main() -> int:
    memory = load_memory()
    backends = os.environ.get('QMOI_SYNC_BACKENDS', '')
    if not backends:
        logger.info('No backends configured (QMOI_SYNC_BACKENDS)')
        return 0

    overall_ok = True
    details: List[str] = []
    for backend in [b.strip() for b in backends.split(',') if b.strip()]:
        if backend == 'gist':
            gist_id = os.environ.get('QMOI_GIST_ID')
            gh_token = os.environ.get('QMOI_GH_TOKEN')
            ok = push_to_gist(memory, gist_id or '', gh_token or '')
            details.append(f'gist:{"ok" if ok else "error"}')
            overall_ok = overall_ok and ok
        elif backend == 'hf':
            hf_repo = os.environ.get('QMOI_HF_REPO')
            hf_token = os.environ.get('QMOI_HF_TOKEN')
            ok = push_to_hf(memory, hf_repo or '', hf_token or '')
            details.append(f'hf:{"ok" if ok else "error"}')
            overall_ok = overall_ok and ok
        elif backend.startswith('scp:'):
            scp_target = backend[len('scp:'):]
            ok = push_to_scp(memory, scp_target)
            details.append(f'scp:{scp_target}:{"ok" if ok else "error"}')
            overall_ok = overall_ok and ok
        else:
            details.append(f'unknown_backend:{backend}')
            overall_ok = False

    logger.info('sync details: %s', details)
    return 0 if overall_ok else 2


if __name__ == '__main__':
    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:


        result = None



    except Exception as e:


        logger.error(f"Error: {e}")


        result = None        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:


        result = None



    except Exception as e:


        logger.error(f"Error: {e}")


        result = None        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    sys.exit(main())
