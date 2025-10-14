import requests


def exploit_weak_api():
    response = requests.post(
        "https://example.com/api/login",
        json={"username": "testuser", "password": "password123"},
    )
    return response.ok
