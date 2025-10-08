# QMOI Unused API Endpoints Report

This file lists all API endpoints discovered in the codebase and documentation that are NOT currently used in backend, UI, or test scripts. These endpoints should be prioritized for integration, testing, or deprecation review.

---

## Unused Endpoints (as of 2025-10-08)

- /api/media
- /api/media/:id
- /api/media/logs
- /api/predictions
- /fix_error
- /list
- /automation/optimize
- /automation/trends
- /automation/history
- /automation/metrics
- /automation/config
- /automation/start
- /automation/stop
- /automation/tasks
- /automation/status
- /automation
- /model/info
- /ping
- /qmessage
- /token

> Note: This list is auto-generated. If any endpoint above is in use but not detected, please update the usage scripts or report a false positive.

---

## Next Steps
- For each endpoint above, generate a minimal integration stub (backend or UI) or add a test in qmoi_test.sh.
- Update API.md and CURLCOMMANDS.md to reflect new usage/tests.
- Rerun endpoint usage checks after integration.
