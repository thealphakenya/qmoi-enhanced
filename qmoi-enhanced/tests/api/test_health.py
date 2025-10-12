import requests

def test_api_health():
    resp = requests.get("https://api.qmoi.app/health")
    assert resp.status_code == 200
    assert resp.json().get("status") == "ok" 