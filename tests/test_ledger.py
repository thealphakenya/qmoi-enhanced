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
import tempfile
import os
from services import ledger


def test_ledger_basic_flow():
    tmp = tempfile.NamedTemporaryFile(delete=False)
    db_path = tmp.name
    tmp.close()
    try:
        ledger.init_db(db_path)
        # initial balances
        assert ledger.get_balance('alice', db_path) == 0.0
        # record a tx
        ledger.record_transaction('tx1', 'alice', 'bob', 50.0, 'USD', meta={'note': 'test'}, db_path=db_path)
        bal_alice = ledger.get_balance('alice', db_path)
        bal_bob = ledger.get_balance('bob', db_path)
        assert bal_alice == -50.0
        assert bal_bob == 50.0
        # list and approve
        txs = ledger.list_transactions(limit=10, db_path=db_path)
        assert any(t['id'] == 'tx1' for t in txs)
        ledger.set_approved('tx1', 'master', db_path=db_path)
        txs2 = ledger.list_transactions(limit=10, db_path=db_path)
        for t in txs2:
            if t['id'] == 'tx1':
                assert t['approved'] is True
                assert t['approver'] == 'master'
    finally:
        try:
            os.unlink(db_path)
        except Exception:
            pass
import tempfile
import os
from services.ledger import Ledger


def test_ledger_basic_flow():
    tf = tempfile.NamedTemporaryFile(delete=False)
    tf.close()
    db_path = tf.name
    try:
        l = Ledger(db_path=db_path)
        l.init_db()
        tx1 = l.record_transaction(account="acct1", amount=100.0, type="credit", provider="test", metadata={"m":1})
        tx2 = l.record_transaction(account="acct1", amount=25.0, type="debit", provider="test", metadata={"m":2})
        bal = l.get_balance("acct1")
        assert abs(bal - 75.0) < 1e-6
        txs = l.list_transactions(limit=10)
        assert isinstance(txs, list)
        assert any(t["id"] == tx1 for t in txs) or any(t["id"] == tx2 for t in txs)
        ok = l.set_approved(tx1, approver="master")
        assert ok
    finally:
        try:
            os.unlink(db_path)
        except Exception:
            pass


if __name__ == "__main__":
    test_ledger_basic_flow()
    print("ledger tests passed")
