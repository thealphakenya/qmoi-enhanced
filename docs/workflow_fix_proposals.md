<!-- QMOI_OWNER_START -->
owner: master
role: master
updated_at: 2025-11-22T13:51:58Z
<!-- QMOI_OWNER_END -->

# Workflow fix proposals
_generated at 2025-10-28T23:48:19.067214Z_

Repository detected: thealphakenya/qmoi-enhanced

## .github/workflows/auto_release_variations.yml
- Pin `actions/checkout` to `actions/checkout@v4`. Locations: 18
- Pin `actions/setup-python` to `actions/setup-python@v4`. Locations: 21
- Pin `docker/build-push-action` to `docker/build-push-action@v4`. Locations: 64
- Review `docker/setup-buildx-action` and consider pinning or templating. Locations: 26
- Pin `softprops/action-gh-release` to `softprops/action-gh-release@v1`. Locations: 48, 55

**Secret bootstrap commands (dry-run):**
```
# gh secret set GITHUB_TOKEN --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```
```
# gh secret set PYPI_API_TOKEN --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```
```
# gh secret set json --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```

## .github/workflows/build.yml
- Pin `actions/checkout` to `actions/checkout@v4`. Locations: 14
- Pin `actions/setup-node` to `actions/setup-node@v4`. Locations: 20
- Pin `actions/setup-python` to `actions/setup-python@v4`. Locations: 16
- Consider gating workflow steps when run from forks or other repos, e.g. use `if: github.repository == "owner/repo"` on sensitive steps.

## .github/workflows/ci.yml
- Pin `actions/checkout` to `actions/checkout@v4`. Locations: 15, 48
- Pin `actions/setup-node` to `actions/setup-node@v4`. Locations: 50
- Pin `actions/setup-python` to `actions/setup-python@v4`. Locations: 17

**Secret bootstrap commands (dry-run):**
```
# gh secret set GITHUB_TOKEN --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```

## .github/workflows/github-actions-qmoi-build.yml
- Pin `actions/checkout` to `actions/checkout@v4`. Locations: 20
- Pin `actions/setup-node` to `actions/setup-node@v4`. Locations: 22
- Pin `actions/setup-python` to `actions/setup-python@v4`. Locations: 26

**Secret bootstrap commands (dry-run):**
```
# gh secret set GITHUB_TOKEN --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```

## .github/workflows/nightly.yml
- Review `workflows/build-and-publish.yml` and consider pinning or templating. Locations: 7
- Consider gating workflow steps when run from forks or other repos, e.g. use `if: github.repository == "owner/repo"` on sensitive steps.

## .github/workflows/npm.yml
- Review `actions/cache` and consider pinning or templating. Locations: 19
- Pin `actions/checkout` to `actions/checkout@v4`. Locations: 11
- Pin `actions/setup-node` to `actions/setup-node@v4`. Locations: 13
- Consider gating workflow steps when run from forks or other repos, e.g. use `if: github.repository == "owner/repo"` on sensitive steps.

## .github/workflows/publish-q-alpha.yml
- Pin `actions/checkout` to `actions/checkout@v4`. Locations: 19
- Pin `actions/setup-node` to `actions/setup-node@v4`. Locations: 22
- Review `peaceiris/actions-gh-pages` and consider pinning or templating. Locations: 33

**Secret bootstrap commands (dry-run):**
```
# gh secret set GITHUB_TOKEN --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```

## .github/workflows/q.yml
- Pin `actions/checkout` to `actions/checkout@v4`. Locations: 9
- Pin `actions/setup-node` to `actions/setup-node@v4`. Locations: 11
- Consider gating workflow steps when run from forks or other repos, e.g. use `if: github.repository == "owner/repo"` on sensitive steps.

## .github/workflows/qmoi-app-build.yml

**Secret bootstrap commands (dry-run):**
```
# gh secret set QMOI_DISCORD_WEBHOOK --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```
```
# gh secret set QMOI_EMAIL_PASS --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```
```
# gh secret set QMOI_EMAIL_RECIPIENT --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```
```
# gh secret set QMOI_EMAIL_USER --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```
```
# gh secret set QMOI_SLACK_WEBHOOK --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```
```
# gh secret set QMOI_TELEGRAM_CHAT --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```
```
# gh secret set QMOI_TELEGRAM_TOKEN --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```
```
# gh secret set QMOI_TWILIO_SID --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```
```
# gh secret set QMOI_TWILIO_TOKEN --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```
```
# gh secret set QMOI_TWILIO_WHATSAPP --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```

## .github/workflows/qmoi-autodev.yml
- Pin `actions/checkout` to `actions/checkout@v4`. Locations: 13
- Pin `actions/setup-python` to `actions/setup-python@v4`. Locations: 15
- Consider gating workflow steps when run from forks or other repos, e.g. use `if: github.repository == "owner/repo"` on sensitive steps.

## .github/workflows/qmoi-ci.yml
- Pin `actions/checkout` to `actions/checkout@v4`. Locations: 23
- Pin `actions/setup-node` to `actions/setup-node@v4`. Locations: 26
- Pin `actions/setup-python` to `actions/setup-python@v4`. Locations: 30
- Review `actions/upload-artifact` and consider pinning or templating. Locations: 40
- Consider gating workflow steps when run from forks or other repos, e.g. use `if: github.repository == "owner/repo"` on sensitive steps.

## .github/workflows/release.yml
- Review `actions/cache` and consider pinning or templating. Locations: 21
- Pin `actions/checkout` to `actions/checkout@v4`. Locations: 17, 57
- Pin `actions/setup-node` to `actions/setup-node@v4`. Locations: 59
- Pin `actions/setup-python` to `actions/setup-python@v4`. Locations: 26, 63
- Review `actions/upload-artifact` and consider pinning or templating. Locations: 40
- Review `docker/setup-buildx-action` and consider pinning or templating. Locations: 19
- Pin `softprops/action-gh-release` to `softprops/action-gh-release@v1`. Locations: 81, 89

**Secret bootstrap commands (dry-run):**
```
# gh secret set GH_TOKEN --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```
```
# gh secret set GITHUB_TOKEN --repo thealphakenya/qmoi-enhanced  # run interactively to enter value
```

## .github/workflows/sync-notify.yml

## .github/workflows/update-readme-cli.yml
- Pin `actions/checkout` to `actions/checkout@v4`. Locations: 18
- Pin `actions/setup-python` to `actions/setup-python@v4`. Locations: 20
- Consider gating workflow steps when run from forks or other repos, e.g. use `if: github.repository == "owner/repo"` on sensitive steps.

## .github/workflows/validate-and-tag-md.yml
- Pin `actions/checkout` to `actions/checkout@v4`. Locations: 13
- Pin `actions/setup-python` to `actions/setup-python@v4`. Locations: 15
- Review `actions/upload-artifact` and consider pinning or templating. Locations: 27
- Consider gating workflow steps when run from forks or other repos, e.g. use `if: github.repository == "owner/repo"` on sensitive steps.

