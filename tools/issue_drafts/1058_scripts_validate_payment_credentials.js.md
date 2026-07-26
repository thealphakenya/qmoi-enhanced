---
title: "Issue draft for scripts/validate_payment_credentials.js"
generated: 2025-11-08T16:06:38.996936Z
---

# Review needed: scripts/validate_payment_credentials.js

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [AUTOFIXED by Ollama at 2026-07-26T18:54:42.152530Z] markers or [AUTOFIXED by Ollama at 2026-07-26T18:54:42.152530Z]s.
- If the file is safe for production, remove the [AUTOFIXED by Ollama at 2026-07-26T18:54:42.152530Z] and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
#!/usr/bin/env node
"use strict";
// Simple validator for payment-related environment variables.
// Usage: node scripts/validate_payment_credentials.js

const required = {
  pesapal: ['PESAPAL_CONSUMER_KEY', 'PESAPAL_CONSUMER_SECRET', 'PESAPAL_ENVIRONMENT'],
  mpesa: ['MPESA_CONSUMER_KEY', 'MPESA_CONSUMER_SECRET', 'MPESA_PASSKEY'],
  cashon: ['CASHON_MPESA_NUMBER', 'MASTER_TOKEN'],
};

function checkVars(list) {
  const missing = [];
  for (const v of list) {
    const val = process.env[v];
    if (!val || val === '' || val.startsWith('YOUR_') || val === 'UCz/GBzE5O5vNpzt99a6xEEqMi0O3QQE' || val === 'OyeJBzYMiWvVQdfNGJW3/wBpems=') {
      missing.push(v);
    }
  }
  return missing;
}

function run() {
  console.log('Validating payment credentials...');
  let totalMissing = 0;
  for (const [k, list] of Object.entries(required)) {
    const miss = checkVars(list);
    if (miss.length === 0) {
      console.log(`  [OK] ${k} credentials present`);
    } else {
      totalMissing += miss.length;
      console.log(`  [MISSING] ${k} missing: ${miss.join(', ')}`);
    }
  }

  if (totalMissing === 0) {
    console.log('\nAll required payment credentials look present (format check only).');
    process.exit(0);
  } else {
    console.log(`\nFound ${totalMissing} missing/[AUTOFIXED by Ollama at 2026-07-26T18:54:42.152530Z] credential(s). Please set them via environment or secrets manager.`);
    process.exit(2);
  }
}

if (require.main === module) run();

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
