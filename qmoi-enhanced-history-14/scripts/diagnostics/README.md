# Diagnostics helpers

This small folder contains tools useful for diagnosing Next.js build performance and hot paths.

- `parse_next_trace.cjs`: Parses `.next/trace` and prints the top modules by total duration and layer totals.

Usage (locally with an existing `.next/trace`):

```bash
npm run diagnose:trace
# or
node ./scripts/diagnostics/parse_next_trace.cjs .next/trace 20
```

CI Integration:

- The repo now contains a GitHub Actions workflow that runs the build and tests, captures `.next/trace`, and uploads it as an artifact (CI Build and Tests: `.github/workflows/ci.yml`).
