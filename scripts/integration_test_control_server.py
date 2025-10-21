#!/usr/bin/env python3
"""Integration test for qmoi_control_server.py

Runs a quick sequence: signup (unique), login, sync-memory, get memories, logout, verify token revoked.
"""
import requests
import time
import uuid

BASE = 'http://127.0.0.1:8000'

def run():
    name = 'testuser_' + uuid.uuid4().hex[:6]
    pw = 'password123'
    print('signup', name)
    r = requests.post(BASE + '/signup', json={'username': name, 'password': pw})
    print('signup', r.status_code, r.text)
    print('login')
    r = requests.post(BASE + '/login', json={'username': name, 'password': pw})
    print('login', r.status_code, r.text)
    if r.status_code != 200:
        return
    token = r.json().get('token')
    headers = {'Authorization': 'Bearer ' + token}
    print('sync-memory')
    r = requests.post(BASE + '/sync-memory', json={'memories':[{'id':'it-1','key':'q.ki','value':{'note':'integration test'}}]}, headers=headers)
    print('sync-memory', r.status_code, r.text)
    print('get memories')
    r = requests.get(BASE + '/memories', headers=headers)
    print('memories', r.status_code, r.text)
    print('logout')
    r = requests.post(BASE + '/logout', headers=headers)
    print('logout', r.status_code, r.text)
    print('verify revoked')
    r = requests.get(BASE + '/memories', headers=headers)
    print('memories after logout', r.status_code, r.text)

if __name__ == '__main__':
    run()
