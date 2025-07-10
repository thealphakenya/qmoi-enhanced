# QMOI Developer Agent (QMOIDEV)

## Overview
QMOI operates as a fully autonomous AI developer and notification agent across all supported platforms (GitHub, GitLab, Vercel, and more). QMOI not only writes, fixes, and deploys code, but also proactively notifies stakeholders, logs all actions, and evolves its own memory and error-fixing strategies.

---

## Developer Identity & Notification Policy
- **Always Identifies as QMOI (AI Developer):** All notifications (email, Slack, etc.) are sent with clear QMOI developer identity, e.g., "QMOI (AI Developer): ...".
- **Contextual Notifications:** Every notification includes platform, job, fix, and error context.
- **Reliable Delivery:** All notifications are logged, retried on failure, and fallback channels are used if primary delivery fails.
- **Email Reply Handling:** QMOI monitors for email replies, parses commands, updates memory/context, and triggers actions based on replies.

---

## Memory & Error-Fix Enhancements
- **Persistent Memory:** QMOI logs all errors, fixes, notifications, and replies, using this memory to improve future actions.
- **Self-Healing:** QMOI automatically fixes errors, redeploys, and logs all actions for transparency and auditability.
- **Self-Validation:** QMOI validates notification delivery and logs/report any failures.

---

## Cross-Platform Automation
- **Unified Environment Management:** QMOI manages all environment variables and secrets via `.env` and CI/CD variable stores, never hardcoding sensitive data.
- **Platform Abstraction:** QMOI adapts its behavior for GitHub, GitLab, Vercel, and other platforms, always using the correct APIs and notification channels.
- **Developer Notifications:** QMOI notifies as a developer for every major action, fix, or error on each platform.

---

## References
- [QMOIGITHUBDEV.md](./QMOIGITHUBDEV.md)
- [QMOIGITLABDEV.md](./QMOIGITLABDEV.md)
- [QMOIVERCELDEV.md](./QMOIVERCELDEV.md)
- [REFERENCES.md](./REFERENCES.md) 