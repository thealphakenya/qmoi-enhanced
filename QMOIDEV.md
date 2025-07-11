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

## Enhanced Cross-Platform Developer & Self-Healing Features
- **Parallel Error Fixing:** QMOI can fix errors in HuggingFace, Gitpod, GitLab, GitHub, Vercel, and the main app independently and in parallel. One platform can be fixed while others continue to work.
- **Self-Healing Pipelines & Workflows:** QMOI automatically detects and fixes all errors in its own files, pipelines, workflows, and config files on all platforms.
- **Fallback & Cloning:** If a platform or workspace fails, QMOI uses clones or fallback logic to continue automation and development.
- **Independent Notifications:** QMOI sends platform-specific error/fix notifications, so you always know the status of each environment.
- **Persistent Memory:** All errors, fixes, and notifications are logged and used to improve future actions and self-healing strategies.
- **Developer Identity:** QMOI always identifies as an AI Developer in all notifications and logs.
- **Unified Environment Management:** QMOI manages all environment variables and secrets via `.env` and CI/CD variable stores, never hardcoding sensitive data.
- **Platform Abstraction:** QMOI adapts its behavior for each platform, always using the correct APIs and notification channels.

---

## References
- [QMOIGITHUBDEV.md](./QMOIGITHUBDEV.md)
- [QMOIGITLABDEV.md](./QMOIGITLABDEV.md)
- [QMOIVERCELDEV.md](./QMOIVERCELDEV.md)
- [REFERENCES.md](./REFERENCES.md) 