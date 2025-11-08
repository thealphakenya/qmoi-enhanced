---
title: "Issue draft for tests/integration/adapter-dryrun.test.ts"
generated: 2025-11-08T16:06:39.007144Z
---

# Review needed: tests/integration/adapter-dryrun.test.ts

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
// Simple integration-style dry-run checks for adapters and wallet manager.
import FacebookAdapter from '../../services/adapters/social/facebook';
import { PlatformConfig } from '../../services/adapters/types';
import WalletManager from '../../services/walletManager';

async function run() {
  console.log('Running adapter dry-run smoke tests...');
  const fb = new FacebookAdapter();
  const cfg: PlatformConfig = { platformId: 'facebook', dryRun: true, requireMasterApproval: true, sandboxMode: true, rateLimitPerMinute: 60 } as any;
  await fb.initialize(cfg);
  const ok = await fb.validateCredentials();
  console.log('FB validateCredentials:', ok);

  const wallet = WalletManager.createWallet({ purpose: 'test' });
  console.log('Wallet created:', wallet.id);
}

run().catch(e => { console.error(e); process.exit(1); });

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
