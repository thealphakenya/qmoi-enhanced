import requests
import scripts.qmoi_local_server  # ensure local helper server is available for health checks
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

os.environ.setdefault("QMOI_HELPER_AUTOSTART", "1")
os.environ.setdefault("QMOI_LOCAL_PORT", "8080")
os.environ.setdefault("QMOI_API_HEALTH_URL", "http://127.0.0.1:8080/health")


def test_api_health():
    url = os.environ.get("QMOI_API_HEALTH_URL")
    resp = requests.get(url, timeout=5)
    assert resp.status_code == 200
    assert resp.json().get("status") == "ok"
