# Workspace Light Mode (Low-data / Codespaces Optimizations)

Purpose: reduce data and CPU usage when opening and using this workspace in a browser-based editor (Codespaces, GitHub.dev, VS Code Web). These are non-invasive, reversible changes and only add helpers and documentation — nothing will be auto-executed.

Principles
- Avoid downloading large folders (node_modules, .qmoi_validation, build outputs).
- Prefer sparse-checkout and shallow clones for git operations.
- Run heavy scans or installs in CI or on demand (server-side).
- Serve files on-demand and compress responses.

Quick actions (commands you can run locally or in Codespace terminal)

- Sparse checkout (git 2.25+):

  ```bash
  git clone --no-checkout <repo> repo-light
  cd repo-light
  git sparse-checkout init --cone
  git sparse-checkout set src app docs
  git checkout
  ```

- Shallow clone (reduce history):

  ```bash
  git clone --depth 1 <repo>
  ```

- Avoid installing dependencies in the browser workspace; run `npm ci` in CI or a remote builder. Use the CI workflow added to run tests and heavy tasks.

Files and tools added here
- `tools/build_light_index.py` — creates `tools/light_index.json` with top large files and suggestions to exclude them locally.
- `tools/start_light_server.py` — simple on-demand HTTP server that serves files under a size limit or from a whitelist in the light index.
- `.vscode/settings.json` — hides large folders from Explorer (non-destructive editor setting).

Best practices
- Use Codespaces for editing and run heavy commands in CI.
- Use the `tools/light_index.json` to know which files to avoid opening in the browser.
- If you must open large files, consider opening them via the server preview (the light server) which streams and compresses content.

Safety note
- These helpers do not modify source files. They only generate indexes and provide lightweight servers.
- If you want me to create a branch that removes or trims large generated files, ask and I'll prepare a safe PR with recommendations and patch suggestions.
