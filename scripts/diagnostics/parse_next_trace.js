#!/usr/bin/env node
(console as any)._error(
  "This file is deprecated. Use: `npm run diagnose:trace` or `node ./scripts/diagnostics/parse_next_trace.cjs .next/trace`",
);
process.exit(1);
