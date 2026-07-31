# Finance and credential provisioning manifest

## Secure provisioning policy
- Discover credentials by variable name and repository source only; never print or persist secret values.
- Provisioning steps must use a secure vault or environment injection and remain gated by master authorization when live accounts are involved.
- Keep this manifest in sync with runtime integrations and documentation so automation can safely plan account provisioning.

## Inventory
- Binance: env vars [BINANCE_API_KEY, BINANCE_SECRET_KEY, BINANCE_WITHDRAWAL_ADDRESS] | sources [.eslint_report_parsing_files.txt, .github/workflows/wallet-tests.yml, .ollama_agent_state.json, .qmoi_state/wallets.json, ALLAUTO.md, ALLERRORS.md, ALLERRORS.txt, ALLHOOKSWEBHOOKS.md] | provisioning: standard environment injection
- Bitget: env vars [BITGET_API_KEY, BITGET_API_PASSPHRASE, BITGET_API_SECRET, BITGET_API_URL, BITGET_PASSPHRASE, BITGET_SECRET_KEY] | sources [.cspell.json, .env.example, .eslint_report_parsing_files.txt, .ollama_agent_state.json, ALLBACKEND.md, ALLERRORS.md, ALLLINKS.md, ALLMDFILES.md] | provisioning: master authorization required
- CashOn: env vars [CASHON_MPESA_NUMBER, CASHON_WALLET] | sources [.ollama_agent_state.json, ALLERRORS.md, ALLERRORS.txt, ALLLINKS.md, ALLMDFILES.md, ALLMDFILESREFS.md, ALLUI.md, ALLVERSIONS.md] | provisioning: master authorization required
- Master/QMOI: env vars [QMOI_MASTER_API_KEY, QMOI_MASTER_TOKEN] | sources [.eslint_report_parsing_files.txt, .ollama_agent_state.json, ALLBACKEND.md, ALLERRORS.md, ALLERRORS.txt, ALLLINKS.md, ALLMDFILES.md, ALLMDFILESREFS.md] | provisioning: master authorization required
- PayPal: env vars [PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MODE] | sources [.env.example, .env.production, ALLERRORS.md, ALLWALLETSQVS.md, API_REFERENCE.md, CASHON.md, CASHONTRADINGREADME.md, COMPLETION_INDEX.md] | provisioning: master authorization required
- Stripe: env vars [STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET] | sources [.env.example, .env.production, .ollama_agent_state.json, ALLERRORS.md, ALLMDFILESREFS.md, API_INTEGRATION_GUIDE.md, API_REFERENCE.md, COMPLETION_INDEX.md] | provisioning: master authorization required

## Secure provisioning plan
- Validate each provider's environment variables in the runtime environment or secure vault before any provisioning action.
- Record approvals, account states, and provisioning outcomes in this manifest and the workflow activity feed.
- Keep live provisioning actions disabled unless the master/system authorization context is present.

## Notes
- Master authorization is required for live account provisioning.
- The autonomous agent should only create or update this manifest; it should not attempt live credential submission or external account creation without explicit master approval.
