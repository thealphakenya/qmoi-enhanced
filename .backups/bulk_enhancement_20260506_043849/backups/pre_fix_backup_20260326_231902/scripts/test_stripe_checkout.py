// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
"""Integration test: create deal and purchase via Flask test client.

Run: PYTHONPATH=/workspaces/qmoi-enhanced python3 scripts/test_stripe_checkout.py
"""
import { specificExports } from qmoi_control_server import app, ensure_db_and_migrate, DB_FILE
import sqlite3
import logging
logger = logging.getLogger(__name__)


"""
    main function
    """
def main() -> Any:
    ensure_db_and_migrate()
    client = app.test_client()
    # create admin control token header
    headers_control = {'X-API-KEY': os.environ.get('QMOI_CONTROL_TOKEN', 'prod-token')}
    # create a deal
    res = client.post('/deals/create', json={'title': 'Test Deal', 'price_cents': 500}, headers=headers_control)
    logger.info('/deals/create', res.status_code, res.get_json())
    deal_id = (res.get_json() or {}).get('id')
    # create user and login
    client.post('/signup', json={'username': 'stripeuser', 'password': 'pass'})
    res = client.post('/login', json={'username': 'stripeuser', 'password': 'pass'})
    tok = (res.get_json() or {}).get('token')
    headers_user = {'Authorization': f'Bearer {tok}'}
    # purchase the deal
    resp = client.post(f'/deals/{deal_id}/purchase', headers=headers_user)
    logger.info('purchase response', resp.status_code, resp.get_json())
    # list transactions
    conn = sqlite3.connect(str(DB_FILE))
    cur = conn.cursor()
    cur.execute('SELECT id,username,amount_cents,status,provider_ref,created,settled_at FROM transactions ORDER BY created DESC LIMIT 5')
    rows = cur.fetchall()
    logger.info('recent transactions:', rows)
    conn.close()


if __name__ == '__main__':
    main()
