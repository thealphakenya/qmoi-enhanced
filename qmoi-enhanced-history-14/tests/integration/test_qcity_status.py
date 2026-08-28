import requests

def test_status_returns_device_info():
    r = requests.get('http://localhost:3000/api/qcity/status')
    assert r.status_code == 200
    data = r.json()
    assert 'devices' in data and 'offloading' in data 