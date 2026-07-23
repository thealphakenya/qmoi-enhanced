# Workflows

## Ollama autonomous agent

The repository uses GitHub Actions to run the Ollama autonomous agent in a repeatable, observable way.

### Triggers

- Manual dispatch with `gh workflow run ollama-autonomous-agent.yml`
- Pushes to `main`, `master`, and branch patterns matching `ollama/**`, `autosync/**`, `auto/**`, and `automated/**`
- A 30-minute cron schedule

### Runtime behavior

- The workflow checks out the repository, installs Python dependencies, configures Git, starts the Ollama runtime, and runs the agent script.
- The agent updates the planning and tracking manifests, emits a live notification feed, and persists state in `.ollama_agent_state.json`.
- A GitHub issue titled `Ollama activity update` is refreshed with the latest feed content, and the feed is uploaded as an artifact.
- The workflow uses `MY_CUSTOM_TOKEN` when present and falls back to `GITHUB_TOKEN` otherwise so GitHub-based notification and issue updates continue to work reliably.

### Verification

- The agent records the latest run summary in the repository resume plan and the activity feed.
- The workflow should be considered successful when the run summary shows a real Ollama response rather than the old simulated fallback message.
- Every workflow that performs GitHub issue, PR, release, or notification work should be reviewed for token compatibility and documented in this file.

### Workflow audit coverage

The repository-wide workflow audit now covers the active automation files under .github/workflows, including:

- Ollama automation and activity updates: .github/workflows/ollama-autonomous-agent.yml
- CI monitoring and automated fix PRs: .github/workflows/ci-monitor.yml, .github/workflows/ci-debug.yml
- Release publication and asset sync: .github/workflows/publish-releases-realtime.yml, .github/workflows/auto_release_variations.yml, .github/workflows/sync-releases-from-manifest.yml, .github/workflows/ci-build-upload.yml
- PR and repository automation: .github/workflows/auto-merge-automated-pr.yml, .github/workflows/alllinks-autoupdate.yml
- Container and deployment automation: .github/workflows/docker-build-push.yml, .github/workflows/docker-image.yml, .github/workflows/publish-q-alpha.yml, .github/workflows/rebuild-deb-verify-release.yml, .github/workflows/vercel-autofix.yml
- Security and CI validation paths: .github/workflows/security.yml, .github/workflows/ci.yml, .github/workflows/release-compliance-check.yml, .github/workflows/scheduled-link-check.yml

The standard pattern is now to prefer MY_CUSTOM_TOKEN and fall back to GITHUB_TOKEN wherever the workflow authenticates to GitHub, creates issues or PRs, publishes releases, or pushes workflow-generated content.
