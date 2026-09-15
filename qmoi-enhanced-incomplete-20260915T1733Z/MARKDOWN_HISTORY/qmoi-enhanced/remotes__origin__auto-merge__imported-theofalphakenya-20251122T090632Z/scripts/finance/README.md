Finance scripts
===============

This folder contains helper scripts to aggregate wallet balances and produce a Cashon ledger for review.

Usage
-----
- Dry-run (safe):

  python3 scripts/finance/settle_to_cashon.py --report .qmoi_validation/cashon_ledger.json

- Real mode (REQUIRES explicit human approval):

  export PRODUCTION_CONFIRMED=true
  python3 scripts/finance/settle_to_cashon.py --report .qmoi_validation/cashon_ledger.json --real

Notes
-----
- By default, the script reads `.qmoi_validation/all_wallets_qvs.json`. Make sure your wallet QV runs have been executed in dry-run mode before attempting settlement.
- Real transfer code is intentionally NOT implemented in this repository. Implementing live API calls requires adding provider-specific, audited code and secrets stored in a secure vault.
