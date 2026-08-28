"""Simple test to simulate payments flow using provider_stub and control server DB.

Run: PYTHONPATH=/workspaces/qmoi-enhanced python3 scripts/test_payments.py
"""
import os
import sqlite3
import datetime
from payments import provider_stub

ROOT = os.path.dirname(os.path.dirname(__file__))
DB = os.path.join(ROOT, 'qmoi.db')

# Ensure DB exists and has transactions table
conn = sqlite3.connect(DB)
cur = conn.cursor()
cur.execute('CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, username TEXT, deal_id TEXT, amount_cents INTEGER, status TEXT, provider TEXT, provider_ref TEXT, created TEXT, settled_at TEXT)')
conn.commit()

# Simulate creating a provider charge
res = provider_stub.create_charge('alice', 500)
print('Provider created charge:', res)

# Insert transaction as pending
txid = 'test-tx-1'
now = datetime.datetime.utcnow().isoformat()
cur.execute('INSERT OR REPLACE INTO transactions (id,username,deal_id,amount_cents,status,provider,provider_ref,created,settled_at) VALUES (?,?,?,?,?,?,?,?,?)', (txid, 'alice', 'deal-test', 500, 'pending', 'stub', res.get('provider_ref'), now, None))
conn.commit()

# Simulate webhook: provider reports settled
evt = {'id': res.get('provider_ref'), 'type': 'charge.settled', 'data': {'id': res.get('provider_ref'), 'status': 'settled'}}
handled = provider_stub.handle_webhook(evt)
print('Webhook handled:', handled)

# Mark transaction as settled locally
cur.execute('UPDATE transactions SET status=?, settled_at=? WHERE id=?', ('settled', datetime.datetime.utcnow().isoformat(), txid))
conn.commit()

# Verify
cur.execute('SELECT id,username,amount_cents,status,provider_ref,created,settled_at FROM transactions WHERE id=?', (txid,))
row = cur.fetchone()
print('Transaction row:', row)
conn.close()
