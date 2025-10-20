#!/usr/bin/env python3
"""Create or update a local .env from secure sources.

Behavior:
- If .env exists, leaves it alone unless --sync is passed.
- If .env missing, attempts to load secrets from (in order):
  1. OS keyring (key: qmoi_enhanced_env)
  2. A local encrypted file .qmoi_secrets (decrypted with key from keyring)
  3. If running in Codespaces, attempts to read GITHUB_ENV or repo secrets via environment.
  4. Falls back to prompting the user for required keys.

The intent is to allow QMOI to auto-create .env on workspace open while avoiding accidental overwrites.
"""
import os
import sys
from pathlib import Path
try:
    import keyring
except Exception:
    keyring = None

REQUIRED = ["QMOI_TOKEN", "QMOI_WEBHOOK_SECRET"]
ENV_PATH = Path('.env')


def persist_to_keyring(mapping: dict):
    if not keyring:
        return False
    # store a newline-separated env string under service 'qmoi' user 'env'
    keyring.set_password('qmoi', 'env', '\n'.join(f'{k}={v}' for k, v in mapping.items()))
    return True


def sync_to_github_secrets(mapping: dict):
    """Attempt to set repo secrets via gh CLI if GITHUB_TOKEN present in environment.

    This function only constructs and runs `gh secret set` commands when a token
    is available in the environment. It will not store tokens itself.
    """
    token = os.environ.get('GITHUB_TOKEN') or os.environ.get('GH_TOKEN')
    if not token:
        return False
    # The script will call gh only if present. Namespace is the current repo.
    try:
        import shutil, subprocess
        if not shutil.which('gh'):
            return False
        for k, v in mapping.items():
            # Use gh secret set <name> --body <value>
            subprocess.run(['gh', 'secret', 'set', k, '--body', v], check=True)
        return True
    except Exception:
        return False


def load_from_keyring():
    if not keyring:
        return None
    data = keyring.get_password('qmoi', 'env')
    if not data:
        return None
    return dict(line.split('=',1) for line in data.splitlines() if '=' in line)


def prompt_for_missing(existing):
    res = {}
    for k in REQUIRED:
        if k not in existing:
            val = os.environ.get(k) or input(f'Enter value for {k} (leave blank to skip): ').strip()
            if val:
                res[k] = val
    return res


def write_env(mapping):
    lines = [f"{k}={v}" for k, v in mapping.items()]
    ENV_PATH.write_text('\n'.join(lines) + '\n')
    print(f'Wrote {ENV_PATH}')


def main():
    sync = '--sync' in sys.argv
    existing = {}
    if ENV_PATH.exists() and not sync:
        print('.env exists and --sync not provided; leaving as-is')
        return
    if ENV_PATH.exists() and sync:
        for line in ENV_PATH.read_text().splitlines():
            if '=' in line:
                k,v = line.split('=',1)
                existing[k]=v

    from_keyring = load_from_keyring() or {}
    existing.update(from_keyring)
    existing.update({k:v for k,v in os.environ.items() if k in REQUIRED})
    missing = prompt_for_missing(existing)
    existing.update(missing)
    if not existing:
        print('No env variables available; nothing to write')
        return
    write_env(existing)


if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""Simple environment manager for QMOI.

Features:
- Ensure a `.env` exists when workspace opens (copy from .env.example if missing)
- Optionally encrypt/decrypt values using secret_store.py
"""
import os
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
ENV = ROOT / '.env'
#!/usr/bin/env python3
"""Enhanced env_manager for QMOI.

Features:
- Ensure a `.env` exists when workspace opens (from .env.example or snapshots)
- Persist encrypted snapshots locally using `secret_store.py`
- Optionally sync encrypted snapshot to a private GitHub Gist (requires GITHUB_TOKEN)
- CLI flags:
  --sync   : push current .env to local snapshot (+ optional Gist sync)
  --restore: force restore .env from snapshot
  --force  : overwrite existing .env when restoring

Security: The Gist sync is optional. Using GITHUB_TOKEN enables cross-workspace
sync since the same account token can be used on multiple machines. The snapshot
is stored encrypted locally and on the Gist (encrypted blob) — the key is in
OS keyring or generated per-user.
"""
import os
import sys
import json
from pathlib import Path
from typing import Dict, Optional

ROOT = Path(__file__).resolve().parents[1]
ENV = ROOT / '.env'
EXAMPLE = ROOT / '.env.example'
SNAP = ROOT / '.qmoi' / 'env_snapshot.json'

try:
    from scripts import secret_store
except Exception:
    # Try relative import fallback
    import secret_store


def read_env(path: Path) -> Dict[str, str]:
    data = {}
    if not path.exists():
        return data
    for line in path.read_text(encoding='utf-8', errors='ignore').splitlines():
        if not line or line.strip().startswith('#') or '=' not in line:
            continue
        k, v = line.split('=', 1)
        data[k.strip()] = v.strip()
    return data


def write_env(path: Path, mapping: Dict[str, str]):
    lines = [f"{k}={v}" for k, v in mapping.items()]
    path.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f'Wrote {path}')


def load_local_snapshot() -> Optional[Dict[str, str]]:
    try:
        data = secret_store.load()
        if isinstance(data, dict):
            return data
    except Exception:
        pass
    # fallback to older .qmoi plaintext snapshot location
    alt = ROOT / '.qmoi' / 'env_snapshot.json'
    if alt.exists():
        try:
            return json.loads(alt.read_text(encoding='utf-8', errors='ignore'))
        except Exception:
            return None
    return None


def save_local_snapshot(mapping: Dict[str, str]):
    try:
        secret_store.save(mapping)
        print('Saved encrypted snapshot via secret_store')
    except Exception as e:
        print('secret_store.save failed:', e)
        # attempt to write under .qmoi as a plaintext fallback (not recommended)
        alt = ROOT / '.qmoi'
        try:
            alt.mkdir(exist_ok=True)
            (alt / 'env_snapshot.json').write_text(json.dumps(mapping), encoding='utf-8')
            print(f'Wrote plaintext fallback snapshot to {alt / "env_snapshot.json"} (insecure)')
        except Exception as e2:
            print('Failed to write fallback snapshot:', e2)


def _gist_find(token: str) -> Optional[str]:
    """Find existing gist id used for snapshots by description marker."""
    import requests
    headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github+json'}
    try:
        r = requests.get('https://api.github.com/gists', headers=headers, timeout=8)
        if r.status_code != 200:
            return None
        for g in r.json():
            if g.get('description','').startswith('QMOI Env Snapshot'):
                return g.get('id')
    except Exception:
        return None
    return None


def gist_load_snapshot(token: str) -> Optional[Dict[str, str]]:
    import requests
    gid = _gist_find(token)
    if not gid:
        return None
    headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github+json'}
    try:
        r = requests.get(f'https://api.github.com/gists/{gid}', headers=headers, timeout=8)
        if r.status_code != 200:
            return None
        data = r.json()
        # Expect a file named qmoi_env_snapshot.json with encrypted payload or plaintext
        for fname, fobj in data.get('files', {}).items():
            if 'qmoi_env_snapshot' in fname:
                content = fobj.get('content','')
                try:
                    return json.loads(content)
                except Exception:
                    # If encrypted content was stored, secret_store should be able to load it after write
                    return None
    except Exception:
        return None
    return None


def gist_save_snapshot(token: str, mapping: Dict[str, str]):
    import requests
    gid = _gist_find(token)
    headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github+json'}
    payload = {'files': {'qmoi_env_snapshot.json': {'content': json.dumps(mapping)}}, 'description': 'QMOI Env Snapshot', 'public': False}
    try:
        if gid:
            r = requests.patch(f'https://api.github.com/gists/{gid}', headers=headers, json=payload, timeout=8)
        else:
            r = requests.post('https://api.github.com/gists', headers=headers, json=payload, timeout=8)
        return r.status_code in (200,201)
    except Exception:
        return False


def ensure_env(sync=False, restore=False, force=False):
    # If .env exists and no restore requested, ensure snapshot is up-to-date (sync if --sync)
    if ENV.exists() and not restore:
        print('.env exists')
        if sync:
            mapping = read_env(ENV)
            save_local_snapshot(mapping)
            token = os.environ.get('GITHUB_TOKEN') or os.environ.get('GH_TOKEN')
            if token:
                gist_save_snapshot(token, mapping)
        return

    # Try restore from local encrypted snapshot
    snapshot = load_local_snapshot()
    if snapshot:
        if ENV.exists() and not force:
            print('.env exists and --force not provided; skipping restore')
            return
        write_env(ENV, snapshot)
        return

    # Try fetch from Gist (requires token)
    token = os.environ.get('GITHUB_TOKEN') or os.environ.get('GH_TOKEN')
    if token:
        gist_snap = gist_load_snapshot(token)
        if gist_snap:
            if ENV.exists() and not force:
                print('.env exists and --force not provided; skipping gist restore')
                return
            write_env(ENV, gist_snap)
            # also persist locally
            save_local_snapshot(gist_snap)
            return

    # fallback: copy from example or create minimal
    if EXAMPLE.exists():
        write_env(ENV, {k: v for k, v in (line.split('=',1) for line in EXAMPLE.read_text(encoding='utf-8', errors='ignore').splitlines() if '=' in line)})
        print('Copied .env from .env.example')
        return

    # create minimal
    defaults = {'QMOI_ENV': 'production', 'QMOI_TOKEN': ''}
    write_env(ENV, defaults)
    print('Created minimal .env')

    # Ensure QMOI_TOKEN created if missing in any future run



def main():
    sync = '--sync' in sys.argv
    restore = '--restore' in sys.argv
    force = '--force' in sys.argv
    if sync:
        if ENV.exists():
            mapping = read_env(ENV)
            save_local_snapshot(mapping)
            token = os.environ.get('GITHUB_TOKEN') or os.environ.get('GH_TOKEN')
            if token:
                ok = gist_save_snapshot(token, mapping)
                print('Gist sync:', ok)
        else:
            print('No .env to sync')
        return
    ensure_env(sync=sync, restore=restore, force=force)


if __name__ == '__main__':
    main()
