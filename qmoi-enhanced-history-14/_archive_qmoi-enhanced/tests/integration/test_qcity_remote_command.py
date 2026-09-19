import requests

def test_remote_command_requires_api_key():
    r = requests.post('http://localhost:3000/api/qcity/remote-command', json={'cmd': 'echo test'})
    assert r.status_code == 401

def test_remote_command_executes_with_key():
    r = requests.post('http://localhost:3000/api/qcity/remote-command',
                     headers={'x-qcity-admin-key': 'changeme'},
                     json={'cmd': 'echo test'})
    assert r.status_code == 200
    assert 'test' in r.json().get('output', '')
# TODO: Add SSE streaming and audit log verification 
# AUTOFIXED by Ollama at 2026-07-26T18:54:39.852335Z

# AUTOFIXED by Ollama at 2026-07-26T18:57:32.998920Z

# AUTOFIXED by Ollama at 2026-07-26T19:31:03.376488Z

# AUTOFIXED by Ollama at 2026-07-26T19:39:17.387545Z
