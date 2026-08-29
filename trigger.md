# Triggering GitHub Actions Workflows

Practical instructions for triggering and verifying the eight workflow files in `.github/workflows/`. All runs execute on GitHub-hosted runners.

## Security First

Never put a real token in this document, `.env.example`, source code, a commit, an issue, or a workflow log. The token pasted in chat should be considered exposed and revoked/rotated in GitHub before use. Create a replacement token in GitHub and store it only in a local, ignored `.env` file.

The root `.gitignore` ignores `.env` and all `.env.*` files except `.env.example`. Create the local file with:

```bash
cp .env.example .env
$EDITOR .env
chmod 600 .env
```

Set `GITHUB_TOKEN` to a fine-grained token with access to `thealphakenya/qmoi-enhanced` and **Actions: Read and write** permission. Also grant repository permissions required by the workflow, such as Contents and Pull requests, only when needed. A classic PAT needs `repo` and `workflow` scopes for private-repository workflow operations.

Load the file only into the current shell:

```bash
set -a
. ./.env
set +a
```

Do not print `$GITHUB_TOKEN`, use it as a command argument, or paste it into a chat or terminal transcript.

## Fixing HTTP 403

A successful `gh auth status` only proves that a session exists. It does not prove that its token can dispatch workflows. The earlier 403 came from the Codespaces `GITHUB_TOKEN` lacking the required integration permission.

After loading `.env`, replace the active CLI credential without displaying the token:

```bash
printf '%s\n' "$GITHUB_TOKEN" | gh auth login --hostname github.com --with-token
gh auth status
gh api -H 'Accept: application/vnd.github+json' \
  /repos/$GITHUB_REPOSITORY/actions/permissions \
  --jq '{enabled,allowed_actions}'
```

If dispatch still returns 403, verify:

1. The token has access to this exact repository.
2. Fine-grained token permission **Actions: Read and write** is enabled.
3. For a classic PAT, `repo` and `workflow` scopes are present.
4. Organization SSO authorization is completed if required.
5. The workflow exists on the default branch and contains `workflow_dispatch:`.
6. The account is allowed to run Actions in this repository.

Do not weaken repository security or place a PAT in workflow YAML to work around a 403. Rotate the token if it was exposed.

## Workflows That Can Be Dispatched

All eight local workflows declare `workflow_dispatch:`:

```text
auto-merge-automated-pr.yml
branch-sync.yml
ollama-autonomous-agent-realtime-monitor.yml
ollama-autonomous-agent.yml
ollama-master-orchestrator.yml
ollama-pr-validation.yml
pr-monitor.yml
workflow-tracker.yml
```

## Recommended Trigger Order

Trigger the validation and orchestration chain first. The autonomous workflow has dependencies and its final status must be verified from its artifact.

```bash
gh workflow run ollama-pr-validation.yml -R "$GITHUB_REPOSITORY" --ref "$GITHUB_REF"
gh run list -R "$GITHUB_REPOSITORY" -w ollama-pr-validation.yml -L 1
```

After PR validation succeeds, trigger the orchestrator:

```bash
gh workflow run ollama-master-orchestrator.yml -R "$GITHUB_REPOSITORY" --ref "$GITHUB_REF"
```

The orchestrator may dispatch `ollama-autonomous-agent.yml` itself. Do not manually start a duplicate autonomous run while one is active. For a deliberate manual agent run:

```bash
gh workflow run ollama-autonomous-agent.yml -R "$GITHUB_REPOSITORY" --ref "$GITHUB_REF"
```

The remaining workflows can be dispatched independently after checking their conditions:

```bash
for workflow in \
  branch-sync.yml \
  ollama-autonomous-agent-realtime-monitor.yml \
  pr-monitor.yml \
  workflow-tracker.yml \
  auto-merge-automated-pr.yml; do
  gh workflow run "$workflow" -R "$GITHUB_REPOSITORY" --ref "$GITHUB_REF"
done
```

`auto-merge-automated-pr.yml` should only be triggered when its PR, approval, and check requirements are satisfied. A successful dispatch response means only that GitHub accepted the event; it is not a workflow success result.

## Trigger Through the GitHub API

Use the API when CLI workflow resolution is unavailable. The token remains in the environment and is not printed:

```bash
curl --fail-with-body -sS \
  -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H 'Accept: application/vnd.github+json' \
  -H 'X-GitHub-Api-Version: 2022-11-28' \
  "https://api.github.com/repos/$GITHUB_REPOSITORY/actions/workflows/ollama-pr-validation.yml/dispatches" \
  -d "$(python -c 'import json, os; print(json.dumps({"ref": os.environ["GITHUB_REF"]}))')"
```

The API returns HTTP 204 when the dispatch is accepted. A 401 means the token is invalid; a 403 means the token/account lacks permission; a 404 commonly means the repository or workflow is inaccessible to that token.

## Monitor Every Run

List all recent runs for the current branch:

```bash
gh run list -R "$GITHUB_REPOSITORY" --branch "$GITHUB_REF" -L 20
```

Watch a run until GitHub reports completion:

```bash
gh run watch <RUN_ID> -R "$GITHUB_REPOSITORY" --interval 30 --exit-status
```

Inspect jobs without an interactive pager:

```bash
GH_PAGER=cat gh run view <RUN_ID> -R "$GITHUB_REPOSITORY" \
  --json status,conclusion,jobs,headSha,createdAt,updatedAt \
  | jq
```

The repository monitor polls active runs every 30 seconds:

```bash
python scripts/monitor_workflows.py
```

Use the [GitHub Actions dashboard](https://github.com/thealphakenya/qmoi-enhanced/actions) for live logs and job details.

## Autonomous-Agent Success Proof

Never report autonomous success because dispatch succeeded, a monitor is green, or a log contains a success sentence. Download and verify the agent artifact:

```bash
gh run download <RUN_ID> -R "$GITHUB_REPOSITORY" -D ./artifacts
jq '{final_status,workflow_run_id,repository,commit,ollama_started,ollama_healthy,
     model,model_available,inference_verified,llm_coding_started,
     validation_passed,checkpoint_created}' \
  ./artifacts/ollamatracks/OLLAMA_SUCCESS.json
```

Accept the autonomous run only when the contract belongs to the expected run and commit, `final_status` is exactly `"SUCCESS"`, Ollama is healthy, the configured model and real inference are verified, the bounded coding loop ran, post-loop validation passed, and a checkpoint was created.

If `OLLAMA_SUCCESS.json` is missing, stale, malformed, or has any required field set to false, the autonomous workflow is failed or unproven.

## Trigger Completion Checklist

- [ ] Local `.env` exists, is mode `600`, and is ignored by Git.
- [ ] Token has repository access and Actions write permission.
- [ ] `gh auth status` shows the intended account after loading `.env`.
- [ ] Dispatch returns success without exposing the token.
- [ ] Each run is monitored to a terminal conclusion.
- [ ] Failed or cancelled runs are not counted as successful.
- [ ] Autonomous artifacts are downloaded and verified.
- [ ] `OLLAMA_SUCCESS.json` proves real inference and post-loop validation.
- [ ] No token appears in tracked files, logs, or documentation.

Related references: [monitor.md](monitor.md), [WORKFLOW_STATUS_DASHBOARD.md](WORKFLOW_STATUS_DASHBOARD.md), [github.md](github.md), and [REAL_TIME_MONITORING_GUIDE.md](REAL_TIME_MONITORING_GUIDE.md).

Last updated: 2026-08-29
