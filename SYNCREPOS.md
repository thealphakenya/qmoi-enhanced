
# Cross-Repository Sync & Setup Guide: Alpha-Q-ai ↔ qmoi-enhanced

This guide explains how to keep the `Alpha-Q-ai` and `qmoi-enhanced` repositories (both under thealphakenya) in sync, and what modifications or best practices should be applied in the `qmoi-enhanced` repo to ensure seamless collaboration and backup.

---

## 1. How the Repos Work Together

- **Alpha-Q-ai**: Main automation, orchestration, and AI system. Relies on `qmoi-enhanced` for core engine and advanced features.
- **qmoi-enhanced**: Core engine and shared library. All foundational enhancements and fixes should be made here first, then integrated into `Alpha-Q-ai`.

---

## 2. Sync Workflow

### a. Code Sync
- Make foundational changes in `qmoi-enhanced`.
- Regularly merge or cherry-pick updates from `qmoi-enhanced` into `Alpha-Q-ai`.
- Use remotes to fetch and merge changes:

```bash
# In Alpha-Q-ai
# Add qmoi-enhanced as a remote if not already
git remote add qmoi-enhanced https://github.com/thealphakenya/qmoi-enhanced.git
# Fetch and merge
git fetch qmoi-enhanced
git merge qmoi-enhanced/main
```

### b. Backup & Automation
- Both repos should have automated backup scripts (e.g., to Hugging Face, cloud, or other storage).
- Use scripts like `ai_self_update.py` for model and project backups.
- Example:

```bash
python ai_self_update.py --backup path/to/model.pt --repo thealphakenya/qmoi-model-backup --token $HF_TOKEN
```

### c. CI/CD & Automation
- Ensure both repos have CI/CD workflows for tests, linting, and auto-fix.
- Use GitHub Actions or Jenkins as shown in the README.
- Keep automation scripts in sync and update both repos when changes are made.

---

## 3. Modifications to Make in `qmoi-enhanced`

- Add or update backup/restore scripts (see `ai_self_update.py` in Alpha-Q-ai for reference).
- Document the sync and backup process in the `qmoi-enhanced` README or a similar SYNCREPOS.md file.
- Ensure all automation, error-fix, and monitoring scripts are up to date and compatible with Alpha-Q-ai.
- Add instructions for setting up remotes and merging changes from Alpha-Q-ai if needed.
- Keep configuration files (e.g., for tests, monitoring, backup) up to date and well-documented.

---

## 4. Best Practices

- Always pull the latest changes from both repos before starting new work.
- Test all automation and backup scripts after updates.
- Use consistent naming and structure for scripts and configs.
- Document any repo-specific setup or requirements.
- Communicate major changes across both repos.

---

## 5. Example: Keeping Both Repos in Sync

```bash
# In Alpha-Q-ai
git pull origin main
git fetch qmoi-enhanced
git merge qmoi-enhanced/main
git push origin main

# In qmoi-enhanced
git pull origin main
git fetch alpha-q-ai
git merge alpha-q-ai/main
git push origin main
```

---

## 6. References
- See the `README.md` in both repos for more details on features, automation, and backup.
- For issues or questions, open a GitHub Issue in the relevant repo.

---

**Maintained by [thealphakenya](https://github.com/thealphakenya)**
