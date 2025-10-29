import os

os.environ['DISABLE_EXTERNAL_RATES'] = 'true'

from scripts.wallets.currency_convert import convert


def test_convert_same_currency():
    assert convert(10, 'USD', 'USD') == 10


def test_convert_mocked_rate():
    # with DISABLE_EXTERNAL_RATES, USD->KES should use mocked 153.0
    v = convert(1, 'USD', 'KES')
    assert float(v) == 153.0
