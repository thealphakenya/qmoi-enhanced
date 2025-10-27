# QMOI Memory — Improvements & Implementation Plan

This document lists concrete improvements to the QMOI memory subsystem and a phased implementation plan. The goal is to make memory persistent, secure, fast, auditable, and usable across login flows, LION features, QVS, friendship/social features, and autodev.

Top-level goals
- Persistent, encrypted storage for sensitive data
- Fast local caching + optional vector-store integration for semantic recall
- Clear privacy controls, per-user consent and deletion APIs
- Integration points for login, LION, QVS, and autodev
- Auditability and owner/master mappings for accountability

20 Improvements / Enhancements (concrete)
1. Persistent SQLite-backed memory with optional file-based encryption (AEAD) for sensitive fields.
2. Namespaced memories per-tenant/user (multi-tenancy) with strict access rules.
3. Built-in schema for common entities: user_profile, session, preference, friend_relationship, qvs_validation, model_output.
4. Versioned memory entries (append-only), with TTL and retention policies configurable per-namespace.
5. Fast LRU in-memory cache for hot keys (redis-like behavior using an in-process cache) with configurable size.
6. Pluggable vector-store connector (FAISS/Annoy/Weaviate/HNSW) for semantic recall and similarity searches.
7. Automatic embedding pipeline hook (configurable) that generates document embeddings for long-form memory entries.
8. Consent and privacy flags per memory entry (consent_given, share_with_friends, is_sensitive) and API to audit/export/delete.
9. Strong defaults for encryption at rest and encryption-in-transit for connectors; optional per-field encryption.
10. High-level memory API (get, set, search, list, delete, audit) with typed models and extensible adapters.
11. Memory-backed login improvements: store last_login, device_info, factors used, and dynamic risk scores.
12. Session linking: persisted sessions stored with revocation capability and session metadata used for SSO/refresh.
13. Friendship features: consented memory shares, short-lived shared contexts, and view-only permissions.
14. QVS integration: cache recent validation results, index by target and validation type, TTL for stale validations.
15. LION integration: persist model prompts, outputs, and evaluation metrics for offline analysis and retraining.
16. Autodev awareness: store run outputs, config diffs, and rollout flags; provide a memory view for autodev dashboards.
17. Audit trail: append-only logs of important memory writes and reads with source, actor, and timestamp.
18. Searchable metadata and tags for quick lookups (e.g., user:john@example.com, topic:billing).
19. Admin utilities: migrate/export/import, compact/purge, and repair tools for offline maintenance.
20. Performance & scaling: optional sharding by tenant and async background workers for vector indexing.

Phased implementation plan
- Phase 1 (quick wins, low risk):
  - Add `qmoi/memory.py` SQLite-backed key/value store with namespacing, get/set/delete, and simple TTL.
  - Add high-level API and unit tests.
  - Wire basic writes in login endpoint (record last_login, device_info) and in friendship flows.

- Phase 2 (privacy & usability):
  - Add encryption hooks and consent flags.
  - Implement audit logs and deletion API.
  - Add in-memory LRU cache.

- Phase 3 (semantic recall):
  - Add optional vector store adapter and embedding hooks.
  - Integrate with LION for storing prompts/outputs.

- Phase 4 (scaling & autodev):
  - Add sharding, background indexing workers, and migration tools.
  - Wire autodev to store run artefacts.

Next actions (immediate)
1. Add `qmoi/memory.py` prototype and tests (Phase 1).
2. Wire memory writes into the web login flow in `qmoi_control_server.py`.
3. Run tests and update CI to include these unit tests.

Acceptance criteria
- Unit tests for basic memory API pass.
- Login flow writes memory entries for last_login and session metadata.
- Documentation updated with the improvements list and plan.
