# QMOI - Production Readiness Checklist

This checklist summarizes steps and configuration recommended before running QMOI in production.

1. Model & Hosting

- Decide on model hosting: managed inference (cloud provider) or self-hosted.
- Ensure `QMOI_API_BASE` is set in the environment to the model inference endpoint.
- Do not rely on the local test helper (`scripts/qmoi_chat_server.py`) in production.

2. Secrets & Environment

- Store secrets (API keys, DB credentials) in a secrets manager; do not commit to repo.
- Ensure `NODE_ENV=production` and `QMOI_API_BASE` are set for production deployment.

3. Networking & Security

- Use TLS for all endpoints (HTTPS) and terminate TLS at the edge or load balancer.
- Enable authentication and authorization on any public API endpoints.
- Apply rate limiting and request validation to protect from abuse.

4. Observability

- Add structured logging and distributed tracing (OpenTelemetry recommended).
- Export metrics (request latency, error rates, token usage) to monitoring (Prometheus/Grafana or cloud provider).
- Configure alerting for high error-rate or latency spikes.

5. Persistence & Memory

- Use a durable store (SQL, NoSQL) for long-term memory instead of local JSON files.
- Ensure backups and retention policies are in place.
- Prefer a shared memory store (Redis, managed DB) for cross-platform sync and eventing.
- Use `QMOI_REDIS_URL` to point to your Redis instance and set `QMOI_MEMORY_SECRET` to secure HTTP sync endpoints.

6. Safety & Moderation

- Add content moderation filters (blocklisted tokens, safety classifiers) before passing content to the model or feeding back to users.
- Log moderated events for review.

7. Rate Limits & Cost Controls

- Set request/response token limits and enforce them server-side.
- Implement quotas per user and routing rules for cost-conscious model selection.

8. Testing & CI/CD

- Add end-to-end tests and integration tests for the chat pipeline.
- Use deployments with healthchecks and canary rollouts.

9. Compliance

- Review data retention, privacy, and regional compliance (GDPR, CCPA) for user memory storage.

10. Runtime Safety

- Do not expose master/debug headers in production.
- In `app/api/qmoi/chat/route.ts` ensure `QMOI_API_BASE` is present when `NODE_ENV=production`.

Quick commands

```
# Start production Next (example)
NODE_ENV=production QMOI_API_BASE=https://qmoi-inference.example.com npm run start
```

If you want, I can expand any checklist item into concrete CI/CD steps, IaC templates, or monitoring dashboards.


---

## Merged source: qmoi-enhanced-history-14/docs/PRODUCTION_CHECKLIST.md

---
title: "Production Checklist for QMOI"
qmoi_validation_frontmatter: true
---

# Production Checklist for QMOI

This checklist helps prepare the QMOI repository and runtime for production deployments. Follow each step and verify in CI or locally before enabling production runs.

1. Configuration

- Ensure `config.json` has the correct production model (e.g., `claude-sonnet-3.5` or a locally-hosted QMOI model).
- Store sensitive credentials in a secrets manager or environment variables. DO NOT commit keys to the repo.

2. Replace all [AUTOFIXED by Ollama at 2026-07-20T01:19:39.206227Z: please review]s and prod-markers

- Run: `python3 scripts/[AUTOFIXED by Ollama at 2026-07-20T01:19:39.206227Z: please review]_scanner.py --root . --report reports/[AUTOFIXED by Ollama at 2026-07-20T01:19:39.206227Z: please review]s.json`
- Generate suggested replacements: `python3 scripts/[AUTOFIXED by Ollama at 2026-07-20T01:19:39.206227Z: please review]_scanner.py --root . --report reports/[AUTOFIXED by Ollama at 2026-07-20T01:19:39.206227Z: please review]s.json --suggest suggestions.json`
- Review `suggestions.json`. If acceptable, apply with caution: `python3 scripts/[AUTOFIXED by Ollama at 2026-07-20T01:19:39.206227Z: please review]_scanner.py --root . --apply --mapping suggestions.json`

3. Offload large assets

- Find large files: `python3 scripts/strip_large_files.py --root . --threshold 50MB --report reports/large_files.json`
- Move eligible files to QVS: `python3 scripts/strip_large_files.py --root . --threshold 50MB --move-to-qvs large_checkpoints`

4. Validate device integrations

- Ensure `components/device/DeviceIntegrationStubs.ts` uses lightweight simulation by default and respects env flags `QMOI_DISABLE_HW=1` and `QMOI_DISABLE_CLOUD=1`.

5. QMOI Model backups

- Use `lib/qvs.py` to store model checkpoints and backups.
- Implement scheduled snapshotting and retention in LION or Cron.

6. LION orchestration

- Wire tasks to use `lib/parallel_executor.py` and fallback to local models when cloud providers are unavailable.
- Set resource limits and monitor job health.

7. Tests and Validation

- Run unit tests and integration checks.
- Use dry-run flags for any tool that modifies code ([AUTOFIXED by Ollama at 2026-07-20T01:19:39.206227Z: please review] scanner, strip tool).

8. Monitoring and Observability

- Add monitoring for latency, error rates, and token usage.
- Ensure logs are stored and rotated (optionally in QVS for large logs).

9. Documentation

- Update `docs/CLAUDE_SONNET_CONFIG.md`, `docs/LIGHTWEIGHT_STRATEGY.md`, and `docs/VALIDATION_STRATEGIES.md` with production notes.

10. Final review

- After applying fixes and offloads, run the full test suite and a smoke test.
- Remove completed todos from `continuetodos.txt`.

Notes

- The automated suggestion system is conservative. Always review suggested code replacements before applying.
- If you want me to apply the suggested replacements automatically, run the scanner with `--apply --mapping suggestions.json` or tell me and I'll apply them (I will create backups before changing files).

<!-- QMOI_VALIDATION_START -->

{
"file": "docs/PRODUCTION_CHECKLIST.md",
"validated_at": "2025-10-26T20:51:22.705978Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "Production Checklist for QMOI"
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


---
Automated update by Ollama agent at 2026-07-20T01:19:39.206227Z. Please review changes above.
