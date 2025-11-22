<!-- QMOI_OWNER_START -->
owner: unknown
role: unknown
updated_at: 2025-11-22T13:51:57Z
<!-- QMOI_OWNER_END -->

# API / Routes Enhancement Plan

Purpose
- Produce a verified API inventory, ensure `API.md` and `ENDPOINTS.md` contain live-verified examples, and add automated endpoint checks to CI.

Steps
1. Extraction
   - Extract server routes and API handlers from `app/api` and server folders using static analysis and small runtime probes.
2. Validation
   - Create a test harness that can run against a dev server or a mocked server to validate status codes, schemas, and auth flows.
3. Documentation
   - Auto-generate `API.md` sections from verified endpoints and include example curl requests and Postman collections.
4. RSA / Security
   - Update `RSAAPIREADME.md` with concrete configuration, key rotation instructions, and example signed request flows.
5. WPA / Security Review
   - If WPA refers to wireless auth or a project-specific acronym, run an explicit security audit and document findings in `docs/WPA-REVIEW.md`.

Short term actionable tasks
- Add `scripts/extract_endpoints.py` to generate a `docs/api_endpoint_index.json` (can be run in CI).
- Add `tests/integration/test_endpoints.py` (pytest) to run against a running dev server for core endpoints.
- Add a GitHub Action to run endpoint smoke tests on push to main.

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/API_ENHANCEMENTS_PLAN.md",
  "validated_at": "2025-10-26T20:51:22.675357Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "API / Routes Enhancement Plan"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": true,
  "summary": {
    "total_checks": 2,
    "passed": true
  }
}
<!-- QMOI_VALIDATION_END -->
