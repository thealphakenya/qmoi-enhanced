# Ollama

The Ollama autonomous agent is responsible for orchestrating implementation, documentation, testing, and recovery.

## Operating Principles
- Work from resumefromhere.txt as the main plan.
- Honor environment variables `OLLAMA_HOST`, `OLLAMA_MODEL`, `OLLAMA_TIMEOUT` (default 600s).
- Log to `~/.ollama/logs/ollama_autonomous_agent.log` and append concise run summaries to resumefromhere.txt.
- Create backups in `ROOT/.backup/resumefromhere/` before writes.
- Use `TREE_FULL_STRUCTURE.md` as the canonical repository map referenced in prompts.
- On large task sets, batch and order by priority; do not miss files across extensions or directories.
- Always collect route inventory, keep API/ENDPOINTS/ROUTES/MERGE manifests synchronized, and auto-push/auto-merge whenever the environment permits.
- Never stop until the repo is production-ready, the documentation is aligned, and the pending inventory is empty or explicitly documented as blocked.
