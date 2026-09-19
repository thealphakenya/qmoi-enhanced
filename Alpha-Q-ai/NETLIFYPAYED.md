# NETLIFYPAYED.md

QMOI keeps Netlify parity in sync with the live GitHub repository by maintaining deployment automation, redirects, site health, and production-safe build rules. The autonomous agent keeps this document aligned with the live Netlify runtime path and the canonical repo docs.

## Active automation
- netlify.toml is kept in the repo root and matches the current deployment contract.
- QCity and Ollama automation keep Netlify deploy and redirect settings synchronized with GitHub workflow health.
- Production checks must verify build command, publish path, redirects, and deployment health before final promotion.

