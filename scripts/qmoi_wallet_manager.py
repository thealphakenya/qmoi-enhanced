"""Persistent wallet ledger for QMOI local execution.

This module intentionally keeps wallet state on disk so balances and transaction
history survive process restarts and cannot be silently lost. It supports the
Cashon-style wallet flows referenced across the repository without depending on a
live external payment provider.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from tempfile import NamedTemporaryFile
from typing import Any


class QMOIWalletManager:
    """Lightweight durable wallet manager for local and hosted execution."""

    def __init__(self, state_path: str | Path | None = None):
        self.state_path = Path(state_path) if state_path else Path(".qmoi_state") / "wallets.json"
        self.state_path.parent.mkdir(parents=True, exist_ok=True)
        self._state = self._load_state()

    def _load_state(self) -> dict[str, Any]:
        if not self.state_path.exists():
            return {"wallets": {}}
        try:
            raw = self.state_path.read_text(encoding="utf-8")
            payload = json.loads(raw) if raw.strip() else {"wallets": {}}
            if not isinstance(payload, dict):
                return {"wallets": {}}
            wallets = payload.get("wallets", {})
            if not isinstance(wallets, dict):
                return {"wallets": {}}
            return {"wallets": wallets}
        except json.JSONDecodeError:
            return {"wallets": {}}

    def _write_state(self) -> None:
        self.state_path.parent.mkdir(parents=True, exist_ok=True)
        with NamedTemporaryFile("w", encoding="utf-8", dir=str(self.state_path.parent), delete=False) as handle:
            json.dump(self._state, handle, indent=2, sort_keys=True)
            handle.write("\n")
            temp_name = handle.name
        Path(temp_name).replace(self.state_path)

    def create_wallet(
        self,
        wallet_id: str,
        wallet_type: str = "cashon",
        starting_balance: float = 0.0,
        **metadata: Any,
    ) -> dict[str, Any]:
        starting_balance = self._validate_amount(starting_balance, "starting_balance", allow_zero=True)
        wallets = self._state.setdefault("wallets", {})
        if wallet_id in wallets:
            raise ValueError(f"wallet already exists: {wallet_id}")

        wallet = {
            "id": wallet_id,
            "type": wallet_type,
            "currency": metadata.get("currency", "USD"),
            "balance": float(starting_balance),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "metadata": metadata,
            "transactions": [],
        }

        if starting_balance > 0:
            self._append_transaction(wallet, "credit", float(starting_balance), "initial_funding")

        wallets[wallet_id] = wallet
        self._write_state()
        return wallet

    def _append_transaction(self, wallet: dict[str, Any], tx_type: str, amount: float, description: str) -> None:
        wallet.setdefault("transactions", []).append(
            {
                "type": tx_type,
                "amount": float(amount),
                "description": description,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )

    @staticmethod
    def _validate_amount(amount: float, name: str = "amount", allow_zero: bool = False) -> float:
        value = float(amount)
        if value < 0 or (value == 0 and not allow_zero):
            raise ValueError(f"{name} must be {'non-negative' if allow_zero else 'positive'}")
        return value

    def _get_wallet(self, wallet_id: str) -> dict[str, Any]:
        wallets = self._state.setdefault("wallets", {})
        if wallet_id not in wallets:
            raise KeyError(f"wallet not found: {wallet_id}")
        return wallets[wallet_id]

    def get_wallet(self, wallet_id: str) -> dict[str, Any]:
        return self._get_wallet(wallet_id)

    def credit(self, wallet_id: str, amount: float, description: str = "credit") -> dict[str, Any]:
        wallet = self._get_wallet(wallet_id)
        amount = self._validate_amount(amount)
        wallet["balance"] = float(wallet.get("balance", 0.0)) + amount
        self._append_transaction(wallet, "credit", amount, description)
        self._write_state()
        return wallet

    def debit(self, wallet_id: str, amount: float, description: str = "debit") -> dict[str, Any]:
        wallet = self._get_wallet(wallet_id)
        current = float(wallet.get("balance", 0.0))
        amount = self._validate_amount(amount)
        if current < amount:
            raise ValueError(f"insufficient funds in wallet '{wallet_id}'")
        wallet["balance"] = current - amount
        self._append_transaction(wallet, "debit", amount, description)
        self._write_state()
        return wallet

    def list_wallets(self) -> list[dict[str, Any]]:
        return list(self._state.get("wallets", {}).values())


if __name__ == "__main__":
    manager = QMOIWalletManager()
    print(json.dumps(manager.list_wallets(), indent=2, sort_keys=True))
