"""Test payments webhook flow by simulating a provider event and calling the webhook.

This script runs against the local DB and does not require network or Stripe.
"""
import os
import sqlite3
import json
import datetime
from payments import provider_stub, stripe_adapter

ROOT = os.path.dirname(os.path.dirname(__file__))
DB = os.path.join(ROOT, 'qmoi.db')

conn = sqlite3.connect(DB)
cur = conn.cursor()
cur.execute('CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, username TEXT, deal_id TEXT, amount_cents INTEGER, status TEXT, provider TEXT, provider_ref TEXT, created TEXT, settled_at TEXT)')
conn.commit()

# Simulate a provider charge
res = provider_stub.create_charge('bob', 1200)
print('Simulated provider charge:', res)

# Build a fake webhook payload (as Stripe would send) and pass to adapter verifier
evt = {'id': res.get('provider_ref'), 'type': 'charge.settled', 'data': {'object': {'id': res.get('provider_ref'), 'amount': 1200, 'metadata': {'username': 'bob'}}}}
payload = json.dumps(evt).encode('utf-8')
sig = None
ver = stripe_adapter.verify_webhook_signature(payload, sig)
print('Webhook verify result:', ver)

# Direct DB insert as webhook handler will do when it receives event
txid = 'manual-test-tx'
now = datetime.datetime.utcnow().isoformat()
cur.execute('INSERT OR REPLACE INTO transactions (id,username,deal_id,amount_cents,status,provider,provider_ref,created,settled_at) VALUES (?,?,?,?,?,?,?,?,?)', (txid, 'bob', 'deal-manual', 1200, 'settled', 'stub', res.get('provider_ref'), now, now))
conn.commit()

cur.execute('SELECT id,username,amount_cents,status,provider_ref,created,settled_at FROM transactions WHERE id=?', (txid,))
row = cur.fetchone()
print('Inserted transaction row:', row)
conn.close()
