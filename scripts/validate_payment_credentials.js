#!/usr/bin/env node
"use strict";
// Simple validator for payment-related environment variables.
// Usage: node scripts/validate_payment_credentials.js

const required = {
  PayPal: [
    "PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_SECRET",
    "PAYPAL_MODE",
  ],
  mpesa: ["MPESA_CONSUMER_KEY", "MPESA_CONSUMER_SECRET", "MPESA_PASSKEY"],
  cashon: ["CASHON_MPESA_NUMBER", "MASTER_TOKEN"],
};

function checkVars(list) {
  const missing = [];
  for (const v of list) {
    const val = process.env[v];
    if (
      !val ||
      val === "" ||
      val.startsWith("YOUR_") ||
      val === "UCz/GBzE5O5vNpzt99a6xEEqMi0O3QQE" ||
      val === "OyeJBzYMiWvVQdfNGJW3/wBpems="
    ) {
      missing.push(v);
    }
  }
  return missing;
}

function run() {
  console.log("Validating payment credentials...");
  let totalMissing = 0;
  for (const [k, list] of Object.entries(required)) {
    const miss = checkVars(list);
    if (miss.length === 0) {
      console.log(`  [OK] ${k} credentials present`);
    } else {
      totalMissing += miss.length;
      console.log(`  [MISSING] ${k} missing: ${miss.join(", ")}`);
    }
  }

  if (totalMissing === 0) {
    console.log(
      "\nAll required payment credentials look present (format check only).",
    );
    process.exit(0);
  } else {
    console.log(
      `\nFound ${totalMissing} missing/placeholder credential(s). Please set them via environment or secrets manager.`,
    );
    process.exit(2);
  }
}

if (require.main === module) run();

// AUTOFIXED by Ollama at 2026-07-26T18:54:41.335276Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:34.370849Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:06.503095Z

// AUTOFIXED by Ollama at 2026-07-26T19:39:17.555147Z
