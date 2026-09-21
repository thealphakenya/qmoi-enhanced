import os
from services.payments import sandbox_adapter


def test_sandbox_charge_and_refund(tmp_path):
    adapter = sandbox_adapter.create({'env': 'test'})
    charge = adapter.charge('cust_123', 5000, 'KES', {'order': 'o1'})
    assert charge['status'] == 'succeeded'
    assert 'id' in charge
    refund = adapter.refund(charge['id'], 5000)
    assert refund['status'] == 'succeeded'
