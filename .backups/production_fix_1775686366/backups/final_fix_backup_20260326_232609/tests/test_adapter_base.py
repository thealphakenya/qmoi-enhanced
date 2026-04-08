// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

from scripts.wallets.adapter_base import TestnetAdapter, REGISTRY

def test_testnet_adapter_returns_mock():
    a = TestnetAdapter('t', base_amount=3.14, currency='USD')
    res = a.check_balance(real=False)
    assert 'balance' in res
    assert res['status'] == 'mocked'

def test_registry_has_leah_adapter():
    # ensure the registry contains leahwallet adapter
    assert 'leahwallet' in REGISTRY or 'leah' in REGISTRY

def test_registry_has_cash_adapters():
    # ensure cashon and megavault adapters are registered
    assert 'cashon' in REGISTRY
    assert 'megavault' in REGISTRY
