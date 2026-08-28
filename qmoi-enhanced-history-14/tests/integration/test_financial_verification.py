import requests

def test_financial_verification_airtel():
    resp = requests.post('http://localhost:3000/api/financial/verify', json={
        'service': 'airtel',
        'account': 'test@master.com'
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data['success']
    assert 'verification successful' in data['result']

def test_financial_verification_mpesa():
    resp = requests.post('http://localhost:3000/api/financial/verify', json={
        'service': 'mpesa',
        'account': 'test@master.com'
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data['success']
    assert 'verification successful' in data['result'] 