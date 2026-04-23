console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.844424 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.250462 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.072601 -->
const crypto = require("crypto");
const ENCRYPTION_KEY =
  process.env.QMOI_BOT_KEY || crypto.randomBytes(32).toString("hex");
const IV_LENGTH = 16;

function encrypt(text) {
  try {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );
  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}