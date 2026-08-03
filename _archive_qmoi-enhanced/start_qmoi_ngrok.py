import os
import shutil
import json
import time
import subprocess
import threading
from typing import Optional

_HAS_FASTAPI = False
try:
    # Defer heavy imports; modules may not exist in lightweight test envs
    from fastapi import FastAPI  # type: ignore
    from fastapi.staticfiles import StaticFiles  # type: ignore
    import uvicorn  # type: ignore
    _HAS_FASTAPI = True
except Exception:
    FastAPI = None
    StaticFiles = None
    uvicorn = None

try:
    from pyngrok import ngrok
except Exception:
    ngrok = None

# try to import secret manager (optional)
try:
    from scripts.qmoi_secret_manager import decrypt_secret_if_present, get_named_secret
except Exception:
    decrypt_secret_if_present = None
    get_named_secret = None


def load_ngrok_token() -> Optional[str]:
    """Load ngrok auth token securely from environment or a protected file.

    Priority:
    1. NGROK_AUTH_TOKEN environment variable
    2. ~/.qmoi/ngrok_token file (owner-only readable)
    """
    # 1. env var
    token = os.getenv("NGROK_AUTH_TOKEN")
    if token:
        return token.strip()

    # 2. encrypted secret managed by qmoi
    enc_path = os.path.join(".qmoi", "ngrok_token.enc")
    if decrypt_secret_if_present is not None:
        try:
            dec = decrypt_secret_if_present(enc_path)
            if dec:
                return dec.strip()
        except Exception:
            pass

    token_path = os.path.expanduser("~/.qmoi/ngrok_token")
    try:
        if os.path.exists(token_path):
            with open(token_path, "r") as f:
                t = f.read().strip()
                if t:
                    return t
    except Exception:
        pass

    return None


def write_tunnel_info(public_url: str):
    os.makedirs(".qmoi", exist_ok=True)
    with open("ngrok_tunnel.txt", "w") as f:
        f.write(public_url)
    info = {"public_url": public_url, "timestamp": int(time.time())}
    with open(os.path.join(".qmoi", "ngrok_tunnel.json"), "w") as f:
        json.dump(info, f)
    # also update memory snapshot
    try:
        snapshot = {
            "last_public_url": public_url,
            "timestamp": int(time.time())
        }
        with open(os.path.join('.qmoi', 'memory.json'), 'w') as mf:
            json.dump(snapshot, mf)
    except Exception:
        pass


def get_public_url_from_local_api(api_url: str = "http://127.0.0.1:4040/api/tunnels") -> Optional[str]:
    try:
        import urllib.request
        with urllib.request.urlopen(api_url, timeout=5) as resp:
            data = json.load(resp)
            tunnels = data.get("tunnels", [])
            if tunnels:
                return tunnels[0].get("public_url")
    except Exception:
        return None


def start_ngrok_with_pyngrok(token: Optional[str], port: int = 8080, retries: int = 3) -> Optional[str]:
    if ngrok is None:
        return None
    if token:
        try:
            ngrok.set_auth_token(token)
        except Exception:
            # continue without raising; attempt to connect
            pass

    backoff = 1
    for attempt in range(1, retries + 1):
        try:
            tunnel = ngrok.connect(port)
            public_url = getattr(tunnel, "public_url", None) or str(tunnel)
            if public_url:
                return public_url
        except Exception:
            time.sleep(backoff)
            backoff *= 2
    return None


def start_ngrok_via_subprocess(port: int = 8080) -> Optional[str]:
    # Start ngrok as a subprocess if available on PATH
    try:
        # Launch ngrok in the background
        subprocess.Popen(["ngrok", "http", str(port)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        # wait briefly for ngrok to register
        for _ in range(8):
            url = get_public_url_from_local_api()
            if url:
                return url
            time.sleep(1)
    except FileNotFoundError:
        return None
    except Exception:
        return None
    return None


def setup_runtime_git_helper():
    """If a GitHub token is available via the secret manager, create a runtime git credential helper
    that prints the token when git requests credentials. We don't store the token in cleartext.
    """
    if get_named_secret is None:
        return None
    try:
        token = get_named_secret('github')
    except Exception:
        token = None
    if not token:
        return None

    # Create an askpass helper that invokes Python to retrieve the token at runtime (safer than embedding)
    helper_path = os.path.join('.qmoi', 'git-credential-qmoi-runtime.sh')
    os.makedirs('.qmoi', exist_ok=True)
    helper_contents = """#!/usr/bin/env bash
read -r prompt
python - <<'PY'
from scripts.qmoi_secret_manager import get_named_secret
tok = get_named_secret('github')
if tok:
    # Git will ask for password; print token
    print(tok)
PY
"""
    try:
        with open(helper_path, 'w') as hf:
            hf.write(helper_contents)
        os.chmod(helper_path, 0o700)
    except Exception:
        return None

    # Configure local git to use this helper if inside a git repo
    try:
        subprocess.run(['git', 'rev-parse', '--is-inside-work-tree'], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        # set local repo credential helper
        subprocess.run(['git', 'config', 'credential.helper', helper_path], check=False)
    except Exception:
        # not a git repo or git not available; skip
        pass

    return helper_path


def run_periodic_autosync(interval_seconds: int = 60 * 30):
    """Background thread: create memory snapshot and create a backup. If a git remote exists and token present,
    attempt a push using the qmoi git wrapper. Runs forever in a daemon thread.
    """
    from pathlib import Path

    def loop():
        while True:
            try:
                # refresh memory snapshot (ensure file exists)
                Path('.qmoi').mkdir(parents=True, exist_ok=True)
                mem = { 'timestamp': int(time.time()) }
                # append few bits of state
                try:
                    if os.path.exists('ngrok_tunnel.txt'):
                        with open('ngrok_tunnel.txt','r') as f:
                            mem['public_url'] = f.read().strip()
                except Exception:
                    pass
                with open(os.path.join('.qmoi','memory.json'), 'w') as mf:
                    json.dump(mem, mf)

                # create a backup file
                try:
                    subprocess.run(['python', 'scripts/qmoi_autosync_backup.py'], check=False)
                except Exception:
                    pass

                # If repository has a remote 'origin' and token available, attempt to push backups via wrapper
                try:
                    has_remote = subprocess.run(['git', 'remote'], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
                    if b'origin' in has_remote.stdout and get_named_secret is not None and get_named_secret('github'):
                        # push backup branch in .qmoi/backup_repo if present
                        br = os.path.join('.qmoi', 'backup_repo')
                        if os.path.exists(br):
                            subprocess.run(['python', 'scripts/qmoi_git_wrapper.py', 'push', '--set-upstream', 'origin', 'qmoi/backups'], check=False, cwd=br)
                except Exception:
                    pass

            except Exception:
                pass
            time.sleep(interval_seconds)

    t = threading.Thread(target=loop, daemon=True, name='qmoi-autosync')
    t.start()



# --- Start / ensure ngrok tunnel ---
public_url = None
token = load_ngrok_token()

if token:
    public_url = start_ngrok_with_pyngrok(token)

if not public_url:
    # Try pyngrok without token (may work with free account ephemeral tunnels)
    public_url = start_ngrok_with_pyngrok(None)

if not public_url:
    # Fallback to local ngrok binary
    public_url = start_ngrok_via_subprocess()

if public_url:
    print("✅ Ngrok tunnel started!")
    print("🌍 Public URL:", public_url)
    write_tunnel_info(public_url)
else:
    print("⚠️ Ngrok tunnel could not be started. Continuing without tunnel.")


# Auto-copy fallback EXE if available and not already in downloads/
fallback_source = os.path.join("Qmoi_downloaded_apps", "windows", "latest", "qmoi_ai.exe")
target_path = os.path.join("downloads", "qmoi ai.exe")

if os.path.exists(fallback_source) and not os.path.exists(target_path):
    try:
        os.makedirs("downloads", exist_ok=True)
        shutil.copy2(fallback_source, target_path)
        print("📦 Copied fallback EXE to /downloads folder.")
    except Exception as copy_err:
        print("⚠️ Failed to copy fallback EXE:", str(copy_err))


def create_app():
    if not _HAS_FASTAPI:
        raise RuntimeError('FastAPI or uvicorn not available in this environment')
    app = FastAPI()
    # Serve the 'downloads' folder publicly at /downloads/
    os.makedirs("downloads", exist_ok=True)
    app.mount("/downloads", StaticFiles(directory="downloads"), name="downloads")
    return app


def run_server():
    if not _HAS_FASTAPI:
        print('FastAPI/uvicorn not installed; server not started.')
        return
    app = create_app()
    uvicorn.run(app, host="0.0.0.0", port=8080)


if __name__ == "__main__":
    run_server()
