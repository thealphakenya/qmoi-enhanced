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

- Do not expose admin/debug headers in production.
- In `app/api/qmoi/chat/route.ts` ensure `QMOI_API_BASE` is present when `NODE_ENV=production`.

Quick commands

```
# Start production Next (example)
NODE_ENV=production QMOI_API_BASE=https://qmoi-inference.example.com npm run start
```

If you want, I can expand any checklist item into concrete CI/CD steps, IaC templates, or monitoring dashboards.
