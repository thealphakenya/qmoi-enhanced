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

### Verification

- The agent records the latest run summary in the repository resume plan and the activity feed.
- The workflow should be considered successful when the run summary shows a real Ollama response rather than the old simulated fallback message.
