# QMOIMODELTESTS.md - QMOI Model Test Plan

## Required Evidence

1. Runtime integrity and provider selection.
2. Portable seed size, manifest hash verification, safe expansion, and failure handling.
3. Model-card, QVS, QMOIMODEL, and QMOIMODELTESTS documentation presence and consistency.
4. Cross-platform feature registry and application validation.
5. API, endpoint, route, port, link, workflow, and Markdown checks.
6. QVS, mask, memory, parallel, trading, account, wallet, Cashon, and financial-manager safety checks.
	Wallet checks include persistence across reloads, positive-amount enforcement,
	insufficient-funds rejection, and no-provider fallback behavior.
7. GitHub-hosted workflow status, local keepalive status, checkpoint, telemetry, and success-contract evidence.
8. Comparative benchmark reproducibility with pinned model/provider versions and task-specific scores.

## Comparison Rules

- Never compare models using undocumented prompts or changing hardware.
- Record model name, provider, version, dataset, seed, hardware, latency, failures, and safety outcomes.
- Report confidence intervals or repeated-run variance when the benchmark supports it.
- Do not convert one benchmark score into a universal “best AI” claim.
- A failed or missing comparator is `review_required`, not a pass.

## Automation

Run `python3 scripts/qmoi_model_evaluation.py --output ollamatracks/model_evaluation.json`. The autonomous runner should preserve the resulting JSON and link it from model-card evidence.
