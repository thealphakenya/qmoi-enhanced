/* eslint-env node */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { generateKeyPairSync } = require("crypto");

const secretsDir = path.join(__dirname, "..", "secrets");
const pubKey = path.join(secretsDir, "bitget_public.pem");
const privKey = path.join(secretsDir, "bitget_private.pem");

function ensureSecretsDir() {
  if (!fs.existsSync(secretsDir)) {
    fs.mkdirSync(secretsDir, { recursive: true, mode: 0o700 });
  }
}

function keysExist() {
  return fs.existsSync(pubKey) && fs.existsSync(privKey);
}

function generateKeys() {
  ensureSecretsDir();
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  fs.writeFileSync(pubKey, publicKey, { mode: 0o600 });
  fs.writeFileSync(privKey, privateKey, { mode: 0o600 });
  return { pubKey, privKey };
}

async function fetchPublicIp() {
  // Prefer built-in fetch (Node 18+), fallback to python script if available
  try {
    if (typeof fetch !== "undefined") {
      const _res = await fetch("https://api.ipify.org");
      const ip = (await _res.text()).trim();
      const out = `Your public IP address is: ${ip}`;
      console.log(out);
      return out;
    }
  } catch (_e) {
    // continue to python fallback
  }

  try {
    const out = require("child_process")
      .execSync("python scripts/get_public_ip.py")
      .toString()
      .trim();
    console.log(out);
    return out;
  } catch (_e) {
    throw new Error("Unable to fetch public IP");
  }
}

function exitWithMessage(msg, code = 1) {
  // eslint-disable-next-line no-console
  console.log(msg);
  process.exit(code);
}

async function main(argv = process.argv.slice(2)) {
  const opts = new Set(argv);
  if (opts.has("--genkey") || opts.has("-g")) {
    generateKeys();
    console.log("Generated Bitget RSA keypair.");
    return;
  }

  if (opts.has("--publicip") || opts.has("-p")) {
    try {
      await fetchPublicIp();
    } catch (_e) {
      exitWithMessage("Could not fetch public IP (fallback failed).", 1);
    }
    return;
  }

  // Default check mode: auto-fix missing pieces
  try {
    if (!keysExist()) {
      console.log("Bitget RSA keys not found. Generating...");
      generateKeys();
      console.log("Keys generated.");
    }
    try {
      const ipOut = await fetchPublicIp();
      if (!ipOut || !ipOut.includes("Your public IP address is:")) {
        exitWithMessage("Could not fetch public IP.", 1);
      }
    } catch (_e) {
      exitWithMessage("Could not fetch public IP.", 1);
    }
  } catch (_e) {
    exitWithMessage(`Setup failed: ${_e.message}`, 1);
  }

  console.log(
    "All trading setup checks passed. Starting trading automation...",
  );
  // Place trading automation logic here
}

if (require.main === module) {
  // run main and handle promise
  main().catch((_e) => exitWithMessage(_e.message || String(_e), 1));
}

module.exports = {
  keysExist,
  generateKeys,
  fetchPublicIp,
  main,
};
