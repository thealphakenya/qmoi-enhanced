import os
from pathlib import Path

from scripts.adapters import telephony_adapter


def test_telephony_dry_run(tmp_path):
    # Ensure dry-run behaviour when TELEPHONY_ENABLED not set
    env = os.environ.get('TELEPHONY_ENABLED')
    if env:
        del os.environ['TELEPHONY_ENABLED']
    res = telephony_adapter.make_call('+1234567890', 'test message', {'foo': 'bar'})
    assert res.get('ok') is True
    assert res.get('detail') == 'dry_run'
    entry = res.get('entry')
    assert entry and entry.get('status') == 'dry_run'
    # log file should be present in .qmoi_validation/calls.log
    log = Path('.qmoi_validation') / 'calls.log'
    assert log.exists()
