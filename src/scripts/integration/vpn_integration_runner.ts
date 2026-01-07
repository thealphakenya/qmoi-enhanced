#!/usr/bin/env ts-node
import { vpnService } from "../../src/services/VPNService";

(async () => {
  try {
    console.log("Starting VPN integration runner...");
    const res = await vpnService.validateController();
    if (!res.success) {
      console.error("VPN validation failed:", res);
      process.exit(2);
    }
    console.log("VPN validation succeeded:", res);
    process.exit(0);
  } catch (err) {
    console.error("VPN integration runner error:", err);
    process.exit(3);
  }
})();
