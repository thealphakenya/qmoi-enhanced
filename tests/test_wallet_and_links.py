from pathlib import Path

import pytest

from scripts.link_validator import LinkValidator
from scripts.qmoi_wallet_manager import QMOIWalletManager
from scripts.resilience_auto_healing import PythonRepairManager


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


def test_qmoi_wallet_manager_rejects_non_positive_transactions(tmp_path: Path):
    manager = QMOIWalletManager(state_path=tmp_path / "wallets.json")
    manager.create_wallet("cashon")

    with pytest.raises(ValueError):
        manager.credit("cashon", -1.0)
    with pytest.raises(ValueError):
        manager.debit("cashon", 0.0)


def test_python_repair_manager_removes_stray_tokens_from_repaired_content(tmp_path: Path):
    bad_file = tmp_path / "broken.py"
    bad_file.write_text("def demo():\n    print('ok')\ncc\n", encoding="utf-8")

    repaired, message = PythonRepairManager.auto_repair_python(bad_file)

    assert repaired is True
    assert "cc" not in bad_file.read_text(encoding="utf-8")
    assert "demo" in bad_file.read_text(encoding="utf-8")
    assert "Python syntax corrected" in message
