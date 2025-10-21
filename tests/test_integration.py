import requests
import os
BASE = os.environ.get('QM_BASE','http://127.0.0.1:8000')

def test_auth_and_memories():
    s = requests.Session()
    # signup
    r = s.post(BASE + '/signup', json={'username':'testint','password':'pass'})
    assert r.status_code in (200,409)
    # login
    r = s.post(BASE + '/login', json={'username':'testint','password':'pass'})
    assert r.status_code == 200
    token = r.json().get('token')
    assert token
    # sync-memory
    headers = {'Authorization':'Bearer '+token}
    r = s.post(BASE + '/sync-memory', json={'memories':[{'key':'q.ki','value':{'note':'int test'}}]}, headers=headers)
    assert r.status_code == 200
    r = s.get(BASE + '/memories', headers=headers)
    assert r.status_code == 200
    data = r.json()
    assert any(m.get('key')=='q.ki' for m in data.get('memories',[]))
