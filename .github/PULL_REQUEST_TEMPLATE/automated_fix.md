<!-- Automated PR Template -->

## Summary

This PR was created automatically by the QMOI CI helper to propose a fix for a common Android build or release issue.

## What changed

- Added/updated CI build helper files or configuration as detected by the auto-runner.

## Why

- To resolve failures detected during CI (keystore, missing SDK, signing issues, or build-tool mismatches).

## Notes

- Review the changes before merging. Do NOT merge keystore or secret material into the repository.
- If this PR includes environment changes, update repo secrets instead of committing credentials.

## Checklist

- [ ] I have reviewed the changes and confirmed they do not include secrets.
- [ ] CI passes after the changes are applied.
