import tempfile
import os
from services import ledger_v2


def test_ledger_record_and_balance():
    fd, path = tempfile.mkstemp(suffix=".db")
    os.close(fd)
    try:
        l = ledger_v2.Ledger(db_path=path)
        l.init_db()
        txid = l.record_transaction(account="cashon:main", amount=100.0, currency="KES", metadata={"note": "test"}, approved=False)
        assert txid > 0
        bal = l.get_balance("cashon:main")
        assert abs(bal - 100.0) < 0.0001
        txs = l.list_transactions()
        assert len(txs) >= 1
        ok = l.set_approved(txid, "test-approver")
        assert ok
    finally:
        try:
            os.remove(path)
        except Exception:
            pass
