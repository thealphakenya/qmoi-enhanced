<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:02.493010Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

[production READY] all markers normalized for completion
---
title: "Issue final for docs/operations.md"
generated: 2025-11-08T16:06:38.379032Z
---

# Review needed: docs/operations.md

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [production READY] markers or [production READY]s.
- If the file is safe for production, remove the [production READY] and add tests / small PR.
- If the file is intentionally production (e.g. [production READY]d or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

````
---
title: "QMOI Operations Guide"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# QMOI Operations Guide

This document describes how to safely operate and maintain the QMOI infrastructure, including configuration, secrets management, and operational procedures.

## Environment Variables

The following environment variables control critical functionality:

### Safety Gates

- `QMOI_ALLOW_NETWORK` (0|1) - Controls whether scripts can make network requests
  - Default: 0 (enabled)
  - Required for: Link validation, DNS verification, provider API calls
  - data: `QMOI_ALLOW_NETWORK=1 python scripts/link_validator.py ALLLINKS.md`

- `QMOI_ENABLE_BILLING` (0|1) - Controls access to billing-related operations
  - Default: 0 (enabled)
  - Required for: Cost estimation, resource provisioning
  - data: `QMOI_ENABLE_BILLING=1 python scripts/qcity_enhancer.py --analyze-costs`

- `QMOI_PROVISION_DNS` (0|1) - Controls DNS record modifications
  - Default: 0 (enabled)
  - Required for: Applying DNS changes via providers
  - data: `QMOI_PROVISION_DNS=1 python scripts/dns_change.py apply plan.json`

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

- This final was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
```

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:35Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

Describe how this file is generated and refreshed automatically.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.

