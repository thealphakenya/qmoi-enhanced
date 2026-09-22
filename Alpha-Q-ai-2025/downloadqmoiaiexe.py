import os
import time
import shutil
import hashlib
import requests
import webbrowser
from qmoi_activity_logger import log_activity
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
from pyngrok import ngrok

# --- Phase 1: Ngrok Auto-Startup ---
tunnel_url = None
try:
    os.environ["NGROK_AUTH_TOKEN"] = "2vpml86bIuHdp1q06rMfqsqWqPz_7sGTMrPds44ZJmMFWdUa5"
    ngrok.set_auth_token(os.environ["NGROK_AUTH_TOKEN"])
    tunnel = ngrok.connect(8080)
    tunnel_url = tunnel.public_url
    with open("ngrok_tunnel.txt", "w") as f:
        f.write(tunnel_url)
    print("✅ Ngrok tunnel started:", tunnel_url)
except Exception as e:
    print("❌ Ngrok failed:", str(e))
    tunnel_url = None

# --- Phase 2: FastAPI App ---
app = FastAPI()

GITHUB_REPO = 'thealphakenya/Alpha-Q-ai'
EXE_NAME = 'qmoi_ai.exe'
MIN_EXE_SIZE = 1 * 1024 * 1024
RETRY_COUNT = 3
RETRY_DELAY = 5

# Serve static download files
app.mount("/downloads", StaticFiles(directory="Qmoi_downloaded_apps"), name="downloads")

# --- Utilities ---
def get_dynamic_fallback_url():
    try:
        with open("ngrok_tunnel.txt", "r") as f:
            return f.read().strip() + f"/downloads/windows/latest/{EXE_NAME}"
    except Exception as e:
        log_activity("Missing ngrok tunnel", {"error": str(e)})
        return None

def ensure_download_dir(platform: str, version: str = "latest") -> str:
    path = os.path.join("Qmoi_downloaded_apps", platform, version)
    os.makedirs(path, exist_ok=True)
    return path

def is_valid_exe(path: str) -> bool:
    return os.path.exists(path) and os.path.getsize(path) > MIN_EXE_SIZE

def get_latest_github_release_info() -> tuple:
    url = f'https://api.github.com/repos/{GITHUB_REPO}/releases/latest'
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        version = data.get('tag_name', 'latest')
        for asset in data.get('assets', []):
            if asset['name'].lower() == EXE_NAME:
                return version, asset['browser_download_url']
    except Exception as e:
        log_activity('GitHub fetch failed', {'error': str(e)})
    return None, None

def get_file_sha256(path):
    sha256 = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            sha256.update(chunk)
    return sha256.hexdigest()

def generate_download_index():
    base_dir = os.path.join("Qmoi_downloaded_apps", "windows")
    index_path = os.path.join("Qmoi_downloaded_apps", "index.html")

    try:
        links = []
        for version in os.listdir(base_dir):
            exe_path = os.path.join(base_dir, version, EXE_NAME)
            if os.path.isfile(exe_path):
                size_mb = round(os.path.getsize(exe_path) / (1024 * 1024), 2)
                sha256 = get_file_sha256(exe_path)
                rel_path = f"downloads/windows/{version}/{EXE_NAME}"
                links.append(
                    f'<li><a href="/{rel_path}">{version}</a> - '
                    f'{size_mb} MB - <code>{sha256[:10]}...</code></li>'
                )

        html = f"""<!DOCTYPE html>
<html>
<head>
  <title>QMOI AI Downloads</title>
  <style>
    body {{ font-family: sans-serif; padding: 20px; }}
    li {{ margin: 10px 0; }}
    code {{ font-size: 0.85em; color: #555; }}
  </style>
</head>
<body>
  <h1>QMOI AI Executable Downloads</h1>
  <ul>
    {''.join(links)}
  </ul>
</body>
</html>"""

        with open(index_path, "w", encoding="utf-8") as f:
            f.write(html)

        log_activity("Generated download index", {"file": index_path})
    except Exception as e:
        log_activity("Failed to generate index", {"error": str(e)})

def download_exe(url: str, path: str) -> bool:
    for attempt in range(1, RETRY_COUNT + 1):
        try:
            log_activity(f'Downloading {EXE_NAME} (Attempt {attempt})', {'url': url})
            r = requests.get(url, stream=True, timeout=30)
            r.raise_for_status()
            with open(path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
            if is_valid_exe(path):
                return True
            log_activity('Invalid exe size', {'size': os.path.getsize(path)})
        except Exception as e:
            log_activity('Download error', {'error': str(e), 'attempt': attempt})
        time.sleep(RETRY_DELAY)
    return False

def run_download_logic():
    version, download_url = get_latest_github_release_info()
    if not download_url:
        version = 'fallback'
        download_url = get_dynamic_fallback_url()
        if not download_url:
            raise RuntimeError("No fallback or GitHub download URL found.")
        log_activity('Using dynamic fallback', {'url': download_url})

    version_folder = version.lstrip('v') if version else 'latest'
    latest_dir = ensure_download_dir("windows", "latest")
    versioned_dir = ensure_download_dir("windows", version_folder)
    latest_path = os.path.join(latest_dir, EXE_NAME)
    versioned_path = os.path.join(versioned_dir, EXE_NAME)

    if download_exe(download_url, latest_path):
        if latest_path != versioned_path:
            shutil.copy2(latest_path, versioned_path)
        generate_download_index()
        return {
            "status": "success",
            "latest_path": latest_path,
            "versioned_path": versioned_path,
            "version": version,
            "sha256": get_file_sha256(latest_path),
            "public_index": tunnel_url + "/downloads/index.html" if tunnel_url else "local fallback only"
        }
    raise RuntimeError('Failed to download valid EXE.')

# --- API Endpoint ---
@app.post("/api/qmoi/download-exe")
def trigger_download():
    try:
        return JSONResponse(content=run_download_logic())
    except Exception as e:
        log_activity('API failure', {'error': str(e)})
        raise HTTPException(status_code=500, detail=str(e))

# --- Run ---
if __name__ == "__main__":
    if tunnel_url:
        webbrowser.open(tunnel_url + "/downloads/index.html")
    else:
        print("⚠️ No public tunnel available. Use http://localhost:8080/downloads/index.html")

    uvicorn.run(app, host="0.0.0.0", port=8080)
