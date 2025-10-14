import requests


def test_whatsapp_verification():
    resp = requests.post(
        "http://localhost:3000/api/whatsapp/verify", json={"phone": "+254700000000"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"]
    assert "verification successful" in data["result"]
