# QMOI Placeholder Checker

This utility scans the repository for placeholders like `{AVATAR}` and `{PLACE}` and optionally replaces them with values from configuration files.

## Usage

- Scan only:
  ```bash
  node scripts/qmoi_placeholder_checker.js --scan
  ```

- Scan and apply replacements (dry-run):
  ```bash
  node scripts/qmoi_placeholder_checker.js --scan --apply --dry-run
  ```

- Scan and apply replacements (apply changes):
  ```bash
  node scripts/qmoi_placeholder_checker.js --scan --apply
  ```
  For safety, if `applyWithConfirmation` is enabled in `config/qmoi_master_config.json`, add `--force` to actually apply changes:
  ```bash
  node scripts/qmoi_placeholder_checker.js --scan --apply --force
  ```
  
  Disable notifications when running in CI or local tests:
  ```bash
  node scripts/qmoi_placeholder_checker.js --scan --no-notify
  ```

- Restrict to a directory:
  ```bash
  node scripts/qmoi_placeholder_checker.js --dir docs --scan
  ```


- `config/avatar-config.json` - avatar defaults and config
- `config/place-mappings.json` - a list of place names used to replace `{PLACE}` placeholders
## Behavior & Safety

- The script does not replace unknown placeholders by default; safe tokens are AVATAR and PLACE.
- Replacements are only applied to files with the following extensions: `.md`, `.json`, `.html`, `.txt`, `.js`, `.ts`, `.tsx`, `.py`.
 Test-run helper script:
 ```bash
 npm run placeholder:run-test
 ```
- Backups are created before any write operation: `file.bak`.
 - Approval flow: `config/placeholder_approvals.json` defines tokens that require manual approval. The checker will skip applying replacements for tokens listed in `requireApprovalFor` unless they are included in `safeTokens` or you pass `--force`.

## Integration


## Limitations

 - Additionally supports {FACE}, {FACE_NAME}, {FACE_STYLE}, {AVATAR_FACE} and {AVATAR_FACE_NAME} placeholders (mapping from `config/face-mappings.json`).
 - Additionally supports {FACE}, {FACE_NAME}, {FACE_STYLE}, {AVATAR_FACE} and {AVATAR_FACE_NAME} placeholders (mapping from `config/face-mappings.json`).
 - If `scripts/qmoi_release_report.json` is present, supports tokens like `{RELEASE_WINDOWS_STATUS}` and `{RELEASE_ANDROID_FILE}` which map to fields in that JSON.

Failing the CI on disallowed placeholders

 Use this in CI or GitHub Actions to block merges if placeholders are present.

## PR Approval Flow

To block PR merges on placeholders, enable the PR check workflow (`.github/workflows/placeholder-pr-check.yml`). This workflow runs the scan with `--fail-on-find` and will report a blocked check if the denylist/approval rules are violated.

 Approval flow and CLI
 ---------------------

 Add tokens to the approvals list to let the checker accept certain tokens or to approve tokens that otherwise require manual approval:

 ```bash
 node scripts/approve_placeholder.js RELEASE_WINDOWS_STATUS
 # or
 npm run approve:placeholder -- RELEASE_WINDOWS_STATUS
 ```

 The approvals file is `config/placeholder_approvals.json` and by default contains `RELEASE_*` as a pattern requiring approval. The approval CLI adds tokens to the `approved` list.

Manual apply workflow
---------------------

You can apply placeholders automatically using the `Placeholder Apply` workflow (manual dispatch). This will run `qmoi_placeholder_checker.js --scan --apply --force` and commit and push any changes to the current branch (or a specified `target-branch` provided at workflow dispatch).

This workflow is targeted for maintainers and should be run only after review and approvals of placeholders on the PR.

Revoke approvals
---------------

To revoke a placeholder that was previously approved, use the revoke CLI:

```bash
node scripts/revoke_placeholder.js RELEASE_WINDOWS_STATUS
# or
npm run revoke:placeholder -- RELEASE_WINDOWS_STATUS
```
PR approval flow

Maintainers can approve placeholders from PR comments. Add a comment on the PR with the `/approve-placeholder` command followed by one or more tokens to approve. Example:

```text
/approve-placeholder RELEASE_WINDOWS_STATUS RELEASE_ANDROID_STATUS
```

This will run an action that validates the commenter's repository permission and, if allowed, adds the tokens to `config/placeholder_approvals.json` and commits the change. The action will then post a confirmation comment on the PR.

Use this in CI or GitHub Actions to block merges if placeholders are present.

## Extendability

- Add new mappings to `config/place-mappings.json` or `config/avatar-config.json`.
- Extend `applyMapping` to add more behavior.
