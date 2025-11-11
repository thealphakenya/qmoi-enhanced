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
  ```

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

2. Infrastructure changes:
   - Requires manual approval via PR
   - Must explicitly enable `QMOI_PROVISION_DNS`
   - Changes logged to `.qmoi_validation/`

## Safe Operations

### Making DNS Changes

1. Generate a plan:
   ```bash
   python scripts/dns_change.py plan example.com records.json
   ```

2. Review the plan:
   ```bash
   python scripts/dns_plan_signer.py verify plan.json
   ```

3. Apply changes (requires approval):
   ```bash
   QMOI_PROVISION_DNS=1 python scripts/dns_change.py apply plan.json
   ```

### Updating Links

1. Generate update plan:
   ```bash
   python scripts/generate_all_links.py --plan-only
   ```

2. Preview changes:
   ```bash
   python scripts/link_apply_preview.py
   ```

3. Apply updates:
   ```bash
   QMOI_ALLOW_NETWORK=1 python scripts/generate_all_links.py --apply
   ```

### Maintenance Tasks

1. Prune link cache:
   ```bash
   python scripts/link_cache_maintenance.py --max-age 30
   ```

2. Verify DNS records:
   ```bash
   QMOI_ALLOW_NETWORK=1 python scripts/dns_verify.py example.com
   ```

## Monitoring and Logging

All operations are logged to `.qmoi_validation/`:

- `provider_calls.log` - DNS provider API calls
- `link_validation.log` - Link check results
- `pipeline_runs/` - Orchestrator task outputs

## Safety Guidelines

1. Always use `--plan` or `--dry-run` first
2. Review generated plans before applying
3. Keep safety gates disabled by default
4. Log all operations for audit
5. Use pull requests for changes
6. Require approvals for infrastructure changes

## Troubleshooting

### Common Issues

1. Network access denied:
   - Check `QMOI_ALLOW_NETWORK` setting
   - Verify CI secrets if in workflow

2. DNS changes rejected:
   - Ensure `QMOI_PROVISION_DNS=1`
   - Verify provider credentials
   - Check plan signature

3. Link validation fails:
   - Check network connectivity
   - Verify target site accessibility
   - Review cache freshness

### Getting Help

1. Check logs in `.qmoi_validation/`
2. Review relevant documentation:
   - `HOSTLINKSDOMAINS.md`
   - Provider documentation
   - CI/CD logs

3. Contact repository maintainers

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
