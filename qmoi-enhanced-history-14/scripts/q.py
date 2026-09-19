"""Compatibility shim module `q` used by some tests.

Provides small helper functions expected by tests: `push_memory_to_backends`,
`pull_memory_from_backends`, and minimal wrappers to `qmoi_local_server` functions.
This is intentionally lightweight and deterministic for test environments.
"""
from pathlib import Path
import json
import os

# Reuse the helper server's memory file if present
BASE = Path(__file__).resolve().parent
MEMORY_FILE = Path(os.environ.get('QMOI_MEMORY_FILE', str(BASE / 'qmoi_memory.json')))


def _read_memory():
    if not MEMORY_FILE.exists():
        return {}
    try:
        return json.loads(MEMORY_FILE.read_text(encoding='utf-8'))
    except Exception:
        return {}


def _write_memory(data):
    MEMORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    MEMORY_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')


def push_memory_to_backends(memory: dict):
    """Test-friendly push: write to memory file and return True.

    Real backends (gist/hf/scp) are not contacted here; tests introspect behavior.
    """
    if not isinstance(memory, dict):
        raise TypeError('memory must be a dict')
    _write_memory(memory)
    return True


def pull_memory_from_backends():
    """Return memory dict from the local memory file as a deterministic fallback."""
    return _read_memory()


def save_memory(memory: dict):
    return push_memory_to_backends(memory)


def load_memory():
    return pull_memory_from_backends()
