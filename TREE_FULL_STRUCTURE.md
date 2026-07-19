# TREE_FULL_STRUCTURE

This file is the canonical full repository structure inventory for QMOI Enhanced.
It is intended to support the Ollama autonomous agent, merge planning, and documentation consolidation by ensuring that no major directory, app shell, or documentation cluster is missed.

## Top-level directories

- .backup/
- .consciousness/
- .continue/
- .devcontainer/
- .disabled-files/
- .evolution_logs/
- .git/
- .github/
- .husky/
- .memory_sync/
- .qmoi_backups/
- .qmoi_state/
- .secrets/
- .venv/
- .venv_qmoi_control/
- .vscode/
- .vscodes/
- ALL_APPS/
- DOCS/
- QVS/
- Qmoi_downloaded_apps/
- _BACKUPS_corrupted_20251115_222941/
- __mocks__/
- __tests__/
- adapters/
- ai/
- api/
- app/
- archives/
- assets/
- autodev/
- backend/
- ci-debug-outputs/
- cloud_config/
- components/
- config/
- cypress/
- dashboard/
- data/
- database/
- datasets/
- db/
- deploy/
- docker/
- docs/
- docs_site/
- domain-management/
- downloads/
- earnvault/
- error-reports/
- examples/
- gh_2.89.0_linux_amd64/
- git-lfs-3.5.1/
- github/
- hf_space_qvillage/
- huggingface_space/
- installer/
- issues/
- k6/
- k8s/
- lib/
- logrotate/
- migrations/
- ml/
- mobile/
- models/
- monitoring/
- nginx/
- notebooks/
- pages/
- payments/
- performance_optimized/
- pgdata/
- prisma/
- production/
- scripts/
- services/
- src/
- ssl/
- tests/
- tools/
- utils/
- var/
- video/
- webhooks/
- whatsapp-qmoi-bot/
- workflows/

## Core app directories

- app/admin/
- app/api/
- app/components/
- app/dev/
- app/devices/
- app/friendship/
- app/lib/
- app/master/
- app/qalpha/
- app/qcity/
- app/qmoi-ai/
- app/qmoi-space/
- app/qvillage/
- app/reset-password/
- app/universal/
- app/verify-email/

## Core source and library directories

- src/
- components/
- lib/
- lib/auth/
- lib/components/
- lib/consciousness/
- lib/db/
- lib/email/
- lib/master/
- lib/monitoring/
- lib/notifications/
- lib/payments/
- lib/qmoi/
- lib/qvs/
- lib/rbac/
- lib/services/

## Documentation and markdown clusters

- docs/
- docs/components/
- docs/features/
- docs/help/
- docs/implementation/
- docs/lion_evolution/
- docs/lion_variations/
- docs/navigation/
- docs/screens/
- docs/settings/
- docs/ui/
- docs/validation/
- docs_site/

## Data, config, and deployment directories

- config/
- data/
- data/wallets/
- database/
- db/
- db/migrations/
- deploy/
- docker/
- k8s/
- monitoring/
- nginx/
- prisma/
- prisma/generated/
- prisma/migrations/
- production/
- workflows/

## Test and automation directories

- __tests__/
- __tests__/api/
- __tests__/auth/
- __tests__/cache/
- __tests__/components/
- __tests__/integration/
- __tests__/ngrok/
- __tests__/political/
- __tests__/utils/
- __tests__/webhooks/
- cypress/
- cypress/e2e/
- cypress/support/
- scripts/
- tools/
- tests/

## Notes for the autonomous agent

- Treat this file as the canonical repository-wide structure reference.
- Use it when scanning directories, planning merges, and deciding whether a path belongs to the canonical app tree or a legacy duplicate.
- Keep this file synchronized with TREE.md, MERGE.md, API.md, ENDPOINTS.md, ROUTES.md, DOCS.md, allrefs.md, and resumefromhere.txt whenever directories, routes, docs, or validations are consolidated.
- Ensure the autonomous agent uses this inventory to avoid missing files in any directory, including app/, api/, scripts/, tools/, docs/, data/, tests/, ci/, and deployment folders.
- Keep allrefs.md aligned with the same inventory and update both when new directories or major files are introduced.

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T22:37:43.321538Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 212
- words: 578
- characters: 3983
- headings: 9
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
