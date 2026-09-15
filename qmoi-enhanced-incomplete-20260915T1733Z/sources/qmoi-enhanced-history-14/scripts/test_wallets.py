#!/usr/bin/env python3
from qmoi_control_server import app
import json

def pretty(r):
    try:
        return json.dumps(r.json, indent=2)
    except Exception:
        return str(r.data)

def main():
    client = app.test_client()
    # ensure user
    client.post('/signup', json={'username':'wallet_user','password':'pw'})
    token = client.post('/login', json={'username':'wallet_user','password':'pw'}).json.get('token')
    master_token = client.post('/login', json={'username':'master','password':'masterpass'}).json.get('token')
    headers_master = {'Authorization': f'Bearer {master_token}'}

    # check initial balance
    r = client.get('/wallet', headers={'Authorization':f'Bearer {token}'})
    print('/wallet', r.status_code, pretty(r))

    # credit via master
    r = client.post('/wallet/credit', json={'username':'wallet_user','amount_cents':1000}, headers=headers_master)
    print('/wallet/credit', r.status_code, pretty(r))

    # get balance
    r = client.get('/wallet', headers={'Authorization':f'Bearer {token}'})
    print('/wallet', r.status_code, pretty(r))

    # debit via master
    r = client.post('/wallet/debit', json={'username':'wallet_user','amount_cents':300}, headers=headers_master)
    print('/wallet/debit', r.status_code, pretty(r))

    r = client.get('/wallet', headers={'Authorization':f'Bearer {token}'})
    print('/wallet', r.status_code, pretty(r))

if __name__ == '__main__':
    main()
