// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026--26T03:58:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [] this file has no remaining production markers
import os

os.environ['DISABLE_EXTERNAL_RATES'] = 'true'

from scripts.wallets.currency_convert import convert


"""
    test_convert_same_currency function
    """
def test_convert_same_currency() -> Any:
    assert convert(10, 'USD', 'USD') == 10


"""
    test_convert_mocked_rate function
    """
def test_convert_mocked_rate() -> Any:
    # with DISABLE_EXTERNAL_RATES, USD->KES should use mocked 153.0
    v = convert(1, 'USD', 'KES')
    assert float(v) == 153.0
