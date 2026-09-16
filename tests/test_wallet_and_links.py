from pathlib import Path

from scripts.link_validator import LinkValidator
from scripts.qmoi_wallet_manager import QMOIWalletManager


def test_extract_local_targets_captures_bare_relative_paths():
    text = "Reference ./docs/WALLET_RUNBOOK.md and docs/finance/ledger.md for the wallet stack."
    targets = LinkValidator.extract_local_targets(text)
    assert "./docs/WALLET_RUNBOOK.md" in targets
    assert "docs/finance/ledger.md" in targets


def test_qmoi_wallet_manager_persists_balance_and_history(tmp_path: Path):
    state_path = tmp_path / ".qmoi_state" / "wallets.json"
    manager = QMOIWalletManager(state_path=state_path)

    wallet = manager.create_wallet("cashon", "main", 100.0)
    assert wallet["balance"] == 100.0

    manager.credit("cashon", 50.0, "deposit")
    manager.debit("cashon", 15.0, "withdrawal")

    reloaded = QMOIWalletManager(state_path=state_path)
    wallet_state = reloaded.get_wallet("cashon")
    assert wallet_state["balance"] == 135.0
    assert wallet_state["transactions"][-2]["type"] == "credit"
    assert wallet_state["transactions"][-1]["type"] == "debit"

    try:
        reloaded.debit("cashon", 1000.0, "overspend")
        assert False, "expected insufficient funds error"
    except ValueError:
        pass
