#!/usr/bin/env python3
"""Integration test for deals and sponsored flows against qmoi_control_server.app

This uses the Flask test client (no network) to exercise flows:
- signup/login master and users
- add sponsored user
- create deal
- purchase deal as sponsored and non-sponsored users
- check admin access endpoints
"""
from qmoi_control_server import app
import json

def pretty(resp):
    try:
        return json.dumps(resp.json, indent=2)
    except Exception:
        return str(resp.data)

def ensure_signup(client, username, password='pass'):
    r = client.post('/signup', json={'username': username, 'password': password})
    if r.status_code not in (200, 409):
        print('signup failed for', username, r.status_code, r.data)
        return False
    return True

def login(client, username, password='pass'):
    r = client.post('/login', json={'username': username, 'password': password})
    if r.status_code != 200:
        print('login failed for', username, r.status_code, r.data)
        return None
    return r.json.get('token')

def main():
    client = app.test_client()

    # Ensure master exists
    ensure_signup(client, 'master', 'masterpass')
    master_token = login(client, 'master', 'masterpass')
    if not master_token:
        print('Master login failed; aborting')
        return

    headers_master = {'Authorization': f'Bearer {master_token}'}

    # Create buyer and mark sponsored
    ensure_signup(client, 'buyer', 'buyerpass')
    buyer_token = login(client, 'buyer', 'buyerpass')
    assert buyer_token, 'buyer login failed'

    # Add buyer to sponsored via master
    r = client.post('/sponsored/add', json={'username': 'buyer'}, headers=headers_master)
    print('/sponsored/add', r.status_code, pretty(r))

    # Create a deal
    r = client.post('/deals/create', json={'title':'Test Deal','description':'Test','price_cents':500}, headers=headers_master)
    print('/deals/create', r.status_code, pretty(r))
    did = None
    if r.status_code == 200:
        did = r.json.get('id')

    # List deals
    r = client.get('/deals')
    print('/deals', r.status_code, pretty(r))

    # Buyer purchases (sponsored => free)
    r = client.post(f'/deals/{did}/purchase', headers={'Authorization': f'Bearer {buyer_token}'})
    print(f'/deals/{did}/purchase (buyer sponsored)', r.status_code, pretty(r))

    # Create payer user (not sponsored)
    ensure_signup(client, 'payer', 'payerpass')
    payer_token = login(client, 'payer', 'payerpass')
    assert payer_token

    # Payer purchases (should pay price)
    r = client.post(f'/deals/{did}/purchase', headers={'Authorization': f'Bearer {payer_token}'})
    print(f'/deals/{did}/purchase (payer)', r.status_code, pretty(r))

    # Admin check access for payer
    r = client.get(f'/admin/check-access/payer/feature', headers=headers_master)
    print('/admin/check-access/payer/feature', r.status_code, pretty(r))

    # Master lists users
    r = client.get('/admin/users', headers=headers_master)
    print('/admin/users', r.status_code, pretty(r))

if __name__ == '__main__':
    main()
