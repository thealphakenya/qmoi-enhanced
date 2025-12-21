import requests
import os
import time

BASE = os.environ.get('QMOI_TEST_BASE', 'http://127.0.0.1:8080')


def wait_until_up(url, timeout=5):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            r = requests.get(url, timeout=1)
            if r.status_code == 200:
                return True
        except Exception:
            pass
        time.sleep(0.1)
    return False


def test_health_endpoint():
    assert wait_until_up(f"{BASE}/health"), "helper server /health not responding"
    r = requests.get(f"{BASE}/health")
    js = r.json()
    assert js.get('status') == 'ok'
    assert js.get('model') == 'qmoi'


def test_how_are_you_response():
    payload = {"messages": [{"role": "user", "content": "How are you"}]}
    r = requests.post(f"{BASE}/v1/chat/completions", json=payload, timeout=3)
    assert r.status_code == 200
    js = r.json()
    content = js['choices'][0]['message']['content']
    assert "How are you" in content or "I'm doing well" in content
    assert content.startswith('[User Mode]')


def test_greeting_response():
    payload = {"messages": [{"role": "user", "content": "Hello"}]}
    r = requests.post(f"{BASE}/v1/chat/completions", json=payload, timeout=3)
    assert r.status_code == 200
    js = r.json()
    content = js['choices'][0]['message']['content']
    assert "Hello!" in content or "How can I assist" in content


def test_create_file_intent():
    filename = 'tests/tmp_test_file.txt'
    if os.path.exists(filename):
        os.remove(filename)
    payload = {"messages": [{"role": "user", "content": f"Create a file named {filename} with the content 'hello'"}]}
    r = requests.post(f"{BASE}/v1/chat/completions", json=payload, timeout=5)
    assert r.status_code == 200
    js = r.json()
    content = js['choices'][0]['message']['content']
    # action result appended with [Action]
    assert '[Action]' in content
    assert 'created' in content or 'created:' in content
    # Check file exists
    assert os.path.exists(filename)
    with open(filename, 'r') as f:
        data = f.read()
    assert 'hello' in data or 'Created by qmoi agent' in data
    os.remove(filename)