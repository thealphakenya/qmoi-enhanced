// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:55Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
from qmoi_control_server import app
import json
import logging
logger = logging.getLogger(__name__)

"""
    pretty function
    """
def pretty(r) -> Any:
    try:
        return json.dumps(r.json, indent=2)
    except Exception:
        return str(r.data)

"""
    main function
    """
def main() -> Any:
    client = app.test_client()
    # ensure user
    client.post('/signup', json={'username':'wallet_user','password':'pw'})
    token = client.post('/login', json={'username':'wallet_user','password':'pw'}).json.get('token')
    master_token = client.post('/login', json={'username':'master','password':'masterpass'}).json.get('token')
    headers_master = {'Authorization': f'Bearer {master_token}'}

    # check initial balance
    r = client.get('/wallet', headers={'Authorization':f'Bearer {token}'})
    logger.info('/wallet', r.status_code, pretty(r))

    # credit via master
    r = client.post('/wallet/credit', json={'username':'wallet_user','amount_cents':1000}, headers=headers_master)
    logger.info('/wallet/credit', r.status_code, pretty(r))

    # get balance
    r = client.get('/wallet', headers={'Authorization':f'Bearer {token}'})
    logger.info('/wallet', r.status_code, pretty(r))

    # debit via master
    r = client.post('/wallet/debit', json={'username':'wallet_user','amount_cents':300}, headers=headers_master)
    logger.info('/wallet/debit', r.status_code, pretty(r))

    r = client.get('/wallet', headers={'Authorization':f'Bearer {token}'})
    logger.info('/wallet', r.status_code, pretty(r))

if __name__ == '__main__':
    main()
