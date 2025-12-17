---
title: "Issue draft for docs/operations.md"
generated: 2025-11-08T16:06:38.379032Z
---

# Review needed: docs/operations.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

````
---
title: "QMOI Operations Guide"
qmoi_validation_frontmatter: true
---

# QMOI Operations Guide

This document describes how to safely operate and maintain the QMOI infrastructure, including configuration, secrets management, and operational procedures.

## Environment Variables

The following environment variables control critical functionality:

### Safety Gates

- `QMOI_ALLOW_NETWORK` (0|1) - Controls whether scripts can make network requests
  - Default: 0 (disabled)
  - Required for: Link validation, DNS verification, provider API calls
  - Example: `QMOI_ALLOW_NETWORK=1 python scripts/link_validator.py ALLLINKS.md`

- `QMOI_ENABLE_BILLING` (0|1) - Controls access to billing-related operations
  - Default: 0 (disabled)
  - Required for: Cost estimation, resource provisioning
  - Example: `QMOI_ENABLE_BILLING=1 python scripts/qcity_enhancer.py --analyze-costs`

- `QMOI_PROVISION_DNS` (0|1) - Controls DNS record modifications
  - Default: 0 (disabled)
  - Required for: Applying DNS changes via providers
  - Example: `QMOI_PROVISION_DNS=1 python scripts/dns_change.py apply plan.json`

### Provider Credentials

Each DNS/infrastructure provider requires specific credentials:

- Cloudflare:
  ```bash
  export CLOUDFLARE_API_TOKEN='your_token_here'
````

- AWS Route53:

  ```bash
  export AWS_ACCESS_KEY_ID='your_key_here'
  export AWS_SECRET_ACCESS_KEY='your_secret_here'
  ```

- Netlify:
  ```bash
  export NETLIFY_TOKEN='your_token_here'
  ```

## CI/CD Setup

### Required Secrets

Configure these secrets in your GitHub repository:

1. `QMOI_ALLOW_NETWORK` - Set to "1" for workflows that need network access
2. Provider credentials (as needed):
   - `CF_API_TOKEN` - Cloudflare API token
   - `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` - AWS credentials
   - `NETLIFY_TOKEN` - Netlify access token

### Workflow Configuration

1. Link validation and updates:
   - Scheduled daily via `alllinks-autoupdate.yml`
   - Creates PR with changes for review
   - Network access controlled by `QMOI_ALLOW_NETWORK`

2. Infras

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
```
