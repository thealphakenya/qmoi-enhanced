import requests


def test_audit_log_requires_api_key():
    r = requests.get("http://localhost:3000/api/qcity/audit-log")
    assert r.status_code == 401


def test_audit_log_with_key():
    r = requests.get(
        "http://localhost:3000/api/qcity/audit-log",
        headers={"x-qcity-admin-key": "changeme"},
    )
    assert r.status_code == 200
    assert "logs" in r.json()


# TODO: Add filtering and export tests
