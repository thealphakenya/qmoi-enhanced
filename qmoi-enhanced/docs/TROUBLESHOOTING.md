# Troubleshooting Guide

## PowerShell Display Issues

### PSReadLine Errors

- If you see errors like `Actual value was 1. at System.Console.SetCursorPosition`, this is a known PowerShell/Windows issue with long output or commit messages.
- **Workarounds:**
  - Use shorter commit messages, or use `git commit -F message.txt` to commit with a file.
  - Use Git Bash or WSL for a more robust terminal experience.
  - Upgrade PowerShell and PSReadLine to the latest version.

## Husky Hook Failures

### Pre-commit/Pre-push Fails with Missing Script

- If you see `npm error Missing script: "qmoi:always-fix-all"`, the hook is referencing a script that does not exist.
- **Solution:**
  - The hooks now check for `fix:all` and skip gracefully if not found.
  - Update your hooks as shown in `.husky/pre-commit` and `.husky/pre-push`.

### Skipping Hooks

- You can bypass hooks with `--no-verify` if needed:
  - `git commit --no-verify -m "message"`
  - `git push --no-verify`

## General Git Issues

- If you see errors about line endings, run `git config --global core.autocrlf true` on Windows.
- For permission issues, ensure you have the correct SSH keys or HTTPS credentials.

## Security Vulnerabilities

- If GitHub reports vulnerabilities, run `npm audit fix` and `snyk wizard`.
- See `SECURITY_AUTOMATION.md` for automated remediation.

## More Help

- For further issues, check the README or open an issue on GitHub.
