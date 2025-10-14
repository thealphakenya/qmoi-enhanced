import requests


def test_remote_command_requires_api_key():
    r = requests.post(
        "http://localhost:3000/api/qcity/remote-command", json={"cmd": "echo test"}
    )
    assert r.status_code == 401


def test_remote_command_executes_with_key():
    r = requests.post(
        "http://localhost:3000/api/qcity/remote-command",
        headers={"x-qcity-admin-key": "changeme"},
        json={"cmd": "echo test"},
    )
    assert r.status_code == 200
    assert "test" in r.json().get("output", "")


# TODO: Add SSE streaming and audit log verification
