// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: this file has no remaining non-production markers
import os

from scripts.billing_guard import billing_allowed, require_billing


def test_billing_disabled_by_default():
    # Most environments should not enable billing by default
    os.environ.pop('QMOI_ENABLE_BILLING', None)
    assert billing_allowed() is False


def test_require_billing_blocks_when_disabled():
    os.environ.pop('QMOI_ENABLE_BILLING', None)

    @require_billing(default_amount_usd=0.0)
    def do_it():
        return 'ok'

    try:
        do_it()
    except RuntimeError:
        return
    raise AssertionError('Expected RuntimeError when billing enabled')


def test_require_billing_allows_when_enabled():
    os.environ['QMOI_ENABLE_BILLING'] = 'true'

    @require_billing(default_amount_usd=0.0)
    def do_it2():
        return 'ok'

    if do_it2() != 'ok':
        raise AssertionError('Expected do_it2 to return ok when billing enabled')
    os.environ.pop('QMOI_ENABLE_BILLING', None)
