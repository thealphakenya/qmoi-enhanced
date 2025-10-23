# Lion: Complete Developer & Operator Coursebook

This coursebook covers Lion in depth. Each topic contains subtopics and practical examples. Use `scripts/lion-runner.cjs` to run the simple examples. For production flows use the adapter and sandbox strategies discussed.

## 1. Introduction to Lion
- What is Lion? Purpose and goals
- Use cases: automation, orchestration, self-heal, revenue automation
- File conventions: `.li` for source, `.lion` for packaged apps

## 2. Lion Syntax & Semantics
- Line-oriented steps: `print:`, `run:`, `calc:`
- Data interpolation and variables (planned extensions)
- Comments and structure

## 3. Lion Tooling & Runner
- `lion-runner.cjs` usage
- Debugging output and verbose flags
- Extending the runner with adapters

## 4. Den Environment Setup
- What is Den? Minimal runtime requirements
- Running Den locally and in Docker
- Offline/air-gapped considerations

## 5. Writing Plans & Best Practices
- Small, idempotent steps
- Error handling and retries
- Logging and observability hooks

## 6. Adapters & Integrations
- Adapter interface design (payments, storage, HTTP)
- Building a safe payment adapter (sandbox vs prod)
- Packaging adapters for marketplace

## 7. Testing & Autotests
- Unit testing steps with runner
- Integration testing with sandbox adapters
- Autotest harness: `scripts/lion-autotest.cjs`

## 8. Security & Sandboxing
- Principle of least privilege for adapters
- Secrets handling (ensure-env usage, vaults)
- Running untrusted plans safely (future runtime)

## 9. Packaging & Distribution (.lion apps)
- Packaging formats and metadata
- Creating a `.lion` bundle and signatures
- Cross-platform distribution considerations

## 10. Monetization Patterns
- See `LIONREVGEN.md` for 25 strategies
- Implementing metering and billing hooks

## 11. Coursebook Publishing & Auto-updates
- How coursebooks are stored and synced
- `scripts/coursebook-sync.cjs` will mirror `.md` to `.txt`
- Automated publishing workflow (CI integration)

## 12. Debugging & Observability
- Structured logs, tracing and metrics
- Reproducing plan failures

## 13. Links, Domains & Subdomains Automation
- Managing DNS using adapters (Cloud DNS, Route53)
- Automated certificate provisioning and renewals
- Creating short-links and redirect rules via plans

## 14. Encryption & Secrets Management
- Built-in encrypt/decrypt helpers in runner
- Integrating KMS or Vault systems
- Rotating keys and secret lifecycles

## 15. Advanced Parallel & QVS Features
- Using QVS for parallel execution
- Conflict resolution patterns
- Rate limiting and backpressure

## 16. Migration & Compatibility
- Versioning plans and adapters
- Backward compatibility strategies

## 17. Enterprise Deployment Patterns
- Multi-tenant deployments
- RBAC & policy controls

## 18. Case Studies & Examples
- Example: Automated backup & restore
- Example: Payment reconciliation flow for Cashon

---

Each topic above contains many subtopics; read the per-topic pages for detailed code examples, diagrams, and exercises. This file acts as the top-level coursebook and is kept in sync with the `.txt` mirror.
