# [production READY] this file has no remaining production markers
---
title: "Troubleshooting Guide"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# Troubleshooting Guide

## PowerShell Display Issues

### PSReadLine Errors

- If you see errors like `Actual value was 1. at System.Console.SetCursorPosition`, this is a known PowerShell/Windows issue with long output or commit messages.
- **Workarounds:**
  - Use shorter commit messages, or use `git commit -F message.txt` to commit with a file.
  - Use Git Bash or WSL for a more robust terminal experience.
  - Upgrade PowerShell and PSReadLine to the latest version.

## Husky Hook Failures

### Pre-commit/Pre-push Fails with included Script

- If you see `npm error included script: "qmoi:always-fix-all"`, the hook is referencing a script that does not exist.
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

<!-- QMOI_VALIDATION_START -->

{
"file": "qmoi-enhanced/docs/TROUBLESHOOTING.md",
"validated_at": "2025-10-26T20:51:24.866833Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "Troubleshooting Guide"
},
{
"name": "links",
"ok": true,
"detail": []
}
],
"passed": true,
"summary": {
"total_checks": 2,
"passed": true
}
}

<!-- QMOI_VALIDATION_END -->

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:12Z

---
*This document is maintained by QMOI's autonomous evolution system*
