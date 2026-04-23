---
title: "Bitget User-Generated RSA API Key Integration"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# Bitget User-Generated RSA API Key Integration

This guide explains how to securely set up and use User-Generated RSA API keys for Bitget with Qmoi/AI automation.

---

## 1. Generate RSA Key Pair

**required:** Use OpenSSL (or Bitget's tool)

```sh
# Generate private key (keep secret!)
openssl genpkey -algorithm RSA -out keys/private.pem -pkeyopt rsa_keygen_bits:2048

# Generate public key (to upload to Bitget)
openssl rsa -pubout -in keys/private.pem -out keys/public.pem
```

- `private.pem`: Used by Qmoi/AI to sign API requests (never share or upload)
- `public.pem`: Upload to Bitget when creating the API key

## 2. Create RSA API Key on Bitget

1. Go to Profile → API Management → Create New API
2. Select **User-generated API Keys**
3. Paste your `public.pem` contents
4. Set a Note (name) and Passphrase
5. Configure permissions (trade, transfer, etc.)
6. Complete verification (2FA, email, SMS)

## 3. Securely Store the Private Key

- Save `private.pem` in the `keys/` directory (not tracked by git)
- Qmoi/AI will use this for signing requests

## 4. How Qmoi/AI Signs Requests

Every API request must include headers:

- `ACCESS-KEY`: (API key ID from Bitget)
- `ACCESS-SIGN`: RSA-SHA256 signature (base64)
- `ACCESS-TIMESTAMP`: Current timestamp (ms)
- `ACCESS-PASSPHRASE`: Your passphrase

**Signature input:**

```
timestamp + method.toUpperCase() + requestPath + (if any) "?" + queryString + body
```

**Pseudocode:**

```js
const message = timestamp + method + path + body;
const signature = Base64(RSA_SHA256_Sign(private_key, message));
```

## 5. Security Best Practices

- Never commit `private.pem` to git
- Store keys in `keys/` (auto-ignored)
- Use strong passphrases
- Rotate keys periodically

## 6. File Locations

- `keys/private.pem`: Used by Qmoi/AI for signing
- `keys/public.pem`: Upload to Bitget
- `keys/bitget.env`: (Optional) Store API key ID and passphrase

## 7. Next Steps

1. Generate keys
2. Create Bitget API key
3. Configure Qmoi/AI to use `keys/private.pem` and `keys/bitget.env`
4. Test with Bitget endpoints

---

For more, see Bitget's [official docs](https://www.bitget.com/api-doc/common/rsa-authentication.html).

<!-- QMOI_VALIDATION_START -->

{
"file": "RSAAPIREADME.md",
"validated_at": "2025-10-26T20:51:22.619674Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "Bitget User-Generated RSA API Key Integration"
},
{
"name": "links",
"ok": true,
"detail": []
}
],
"passed": true,
"summary": {
"total_checks": 2,
"passed": true
}
}

<!-- QMOI_VALIDATION_END -->

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:30Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

Describe how this file is generated and refreshed automatically.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.

## ⚛️ Quantum Integration
This document is part of the Quantum multi orchestra intelligence (QMOI) system and includes quantum feature integration capabilities.