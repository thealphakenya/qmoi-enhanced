# CI / CD Environments

QMOI uses GitHub Actions for CI by default. Workflows are in `.github/workflows`.

CI job guidance:
- Run linters and targeted tests only for changed files to reduce runtime.
- Use artifacts to pass build outputs between workflow jobs.
