// Simple integration-style dry-run checks for adapters and wallet manager.
import FacebookAdapter from "../../services/adapters/social/facebook";
import { PlatformConfig } from "../../services/adapters/types";
import WalletManager from "../../services/walletManager";

async function run() {
  console.log("Running adapter dry-run smoke tests...");
  const fb = new FacebookAdapter();
  const cfg: PlatformConfig = {
    platformId: "facebook",
    dryRun: true,
    requireMasterApproval: true,
    sandboxMode: true,
    rateLimitPerMinute: 60,
  } as any;
  await fb.initialize(cfg);
  const ok = await fb.validateCredentials();
  console.log("FB validateCredentials:", ok);

  const wallet = WalletManager.createWallet({ purpose: "test" });
  console.log("Wallet created:", wallet.id);
}

test("adapter dry-run executes without throwing", async () => {
  await expect(run()).resolves.not.toThrow();
});
