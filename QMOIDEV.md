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

## Pre-Autotest for Repo Modification

- QMOI always runs a pre-autotest before attempting to modify or update the repository.
- The pre-autotest checks for permissions, branch access, and CI/CD status to ensure QMOI can safely push changes or trigger automation.
- If the pre-autotest fails, QMOI logs the error, notifies the master, and does not proceed with the fix until the issue is resolved.
- This feature is fully integrated with QMOI's developer agent and notification system for maximum reliability.

---

## Multi-Platform Pre-Autotest Logic

- QMOI runs pre-autotests for all supported platforms (GitHub, GitLab, Vercel, HuggingFace, QCity, etc.) before any repo modification or automation.
- Results are aggregated and only if all platforms pass does QMOI proceed.
- Failures are logged, notified, and visualized in the dashboard, with master controls for resolution.
- This logic is fully integrated with QMOI's notification and dashboard systems.

---

## QMOI Parallel Auto-Development & Enhancement
- QMOI auto-develops and enhances all apps in parallel, referencing the internet, open-source projects, and related apps for planning and implementation.
- All development, enhancement, and versioning actions are managed in parallel and visualized in QCity (master-only).
- QMOI can auto-create new apps, features, and fixes based on internet research and master/Qteam suggestions.

## Billing & Error Autofix (GitHub/GitHub Actions)
- QMOI monitors for billing issues and errors in GitHub/GitHub Actions and auto-fixes by switching to self-hosted runners, alternative platforms, or free-tier strategies.
- All fixes and actions are logged, notified, and visualized for master/admin.

---

## New Integrations & Enhancements

- **QMOIAUTOMAKENEW.md Integration:** QMOI Developer Agent can now trigger autoclone/automake-new actions for any device, platform, or website from QCity, with master-only controls and audit logging.
- **QMOIBROWSER.md Integration:** QMOI Developer Agent uses the QMOI Browser to autotest and fix all links and web features in every development and notification cycle.
- **Always-On Cloud Operation:** QMOI Developer Agent is always running in QCity/cloud/Colab/Dagshub, never relying on local device for critical tasks.
- **Enhanced QCity Runners & Devices:** All runners, devices, clones, and browsers are fully automated, parallelized, and offloaded to QCity/cloud for maximum reliability and speed.
- **Auto-Updating Documentation:** All .md files are auto-updated after every development cycle, ensuring documentation is always current.
- **Increased Minimum Daily Revenue:** QMOI Developer Agent now targets a higher, dynamically increasing minimum daily revenue, using advanced strategies and statistics for all money-making features.
- **Enhanced Money-Making UI:** QCity dashboard now includes detailed statistics, charts, and controls for all QMOI money-making features, visible only to master/admin.

---

## References
- [QMOIGITHUBDEV.md](./QMOIGITHUBDEV.md)
- [QMOIGITLABDEV.md](./QMOIGITLABDEV.md)
- [QMOIVERCELDEV.md](./QMOIVERCELDEV.md)
- [REFERENCES.md](./REFERENCES.md) 