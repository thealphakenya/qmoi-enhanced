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
