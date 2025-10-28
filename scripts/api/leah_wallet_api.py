#!/usr/bin/env python3
"""Leah wallet API (development/stub)

Provides simple endpoints for Leah's wallet UI to fetch balance, transactions,
and to submit credentials. This is intentionally conservative: it will not
perform real-money transfers. It uses `services.providers_v2` to query simulated
provider balances and stores supplied credentials in `.qmoi/env_generated.json`
only when the client includes `confirm_store=true` in the POST body.

Run with: uvicorn scripts.api.leah_wallet_api:app --reload --port 8081
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

ROOT = Path(__file__).resolve().parents[2]
QM = ROOT / '.qmoi'
QM.mkdir(exist_ok=True)
ENV_STORE = QM / 'env_generated.json'

try:
    from services.providers_v2 import get_client
except Exception:
    # fallback import path for some layouts
    import sys
    sys.path.append(str(ROOT))
    from services.providers_v2 import get_client

app = FastAPI(title="Leah Wallet API (stub)")


def _load_env_store() -> Dict[str, Any]:
    if not ENV_STORE.exists():
        ENV_STORE.write_text(json.dumps({}))
    try:
        return json.loads(ENV_STORE.read_text())
    except Exception:
        return {}


def _save_env_store(d: Dict[str, Any]):
    ENV_STORE.write_text(json.dumps(d, indent=2))


@app.get('/api/leah_wallet/info')
def info():
    return {"service": "leah_wallet_api", "status": "ok"}


@app.get('/api/leah_wallet/providers')
def list_providers():
    # list available provider names
    return {"providers": ["cashon", "mpesa", "binance"]}


@app.get('/api/leah_wallet/balance')
def get_balance(provider: str = 'cashon'):
    try:
        c = get_client(provider)
        bal = c.get_balance()
        return bal
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get('/api/leah_wallet/transactions')
def list_transactions(provider: str = 'cashon'):
    # Return idempotency store contents as a stand-in for transactions
    try:
        c = get_client(provider)
        store = Path('.qmoi') / f'idempotency_{c.name}.json'
        if not store.exists():
            return {"transactions": []}
        data = json.loads(store.read_text())
        # transform stored idempotent txs into a list
        txs = list(data.values())
        return {"transactions": txs}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post('/api/leah_wallet/credentials')
async def set_credentials(request: Request):
    body = await request.json()
    provider = body.get('provider')
    creds = body.get('credentials')
    confirm = bool(body.get('confirm_store', False))
    if not provider or not isinstance(creds, dict):
        raise HTTPException(status_code=400, detail="provider and credentials required")
    # validate keys are strings
    for k, v in creds.items():
        if not isinstance(v, str):
            raise HTTPException(status_code=400, detail=f"credential {k} must be a string")

    store = _load_env_store()
    if provider not in store:
        store[provider] = {}
    # If confirm is False, only return required env names for the provider
    if not confirm:
        # Try to detect required env keys from provider class
        try:
            c = get_client(provider)
            req = getattr(c, 'required_env', [])
        except Exception:
            req = []
        return {"required_env": req, "message": "Send back with confirm_store=true to persist credentials"}

    # Save credentials under provider key; mark as stored_by='manual' for audit
    store = _load_env_store()
    if provider not in store:
        store[provider] = {}
    for k, v in creds.items():
        store[provider][k] = {"value": v, "stored_by": "manual", "ts": "auto"}
    _save_env_store(store)
    return JSONResponse({"ok": True, "msg": "credentials saved (in .qmoi/env_generated.json)"})


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8081)
