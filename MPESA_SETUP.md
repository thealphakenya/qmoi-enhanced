# M-Pesa Setup Guide (QMOI)

This document outlines the minimal steps to configure M-Pesa credentials and run basic connectivity checks.

1) Obtain Safaricom M-Pesa credentials
   - Sign up for a Safaricom Daraja (M-Pesa) account and request API access.
   - You'll receive a Consumer Key and Consumer Secret for OAuth.
   - For STK Push you will also receive a Shortcode and Passkey.

2) Configure environment variables (don't commit secrets)
   - Copy `vercel.env.example` to `vercel.env` locally and fill in values:
     - MPESA_CONSUMER_KEY
     - MPESA_CONSUMER_SECRET
     - MPESA_PASSKEY
     - MPESA_SHORTCODE
     - MPESA_ENV (sandbox or production)
     - MPESA_CALLBACK_URL (your publicly accessible callback endpoint)

3) Local test (requires Node >=18)
   - Install dependencies:

```bash
npm ci
```

   - Run the sample test (the repo has a Jest test for the adapter):

```bash
npm test -- src/integrations/mpesa/adapter.test.ts
```

4) Production notes
   - Store secrets in your CI/CD provider (GitHub Secrets, Vercel Environment Variables, Vault) instead of committing them.
   - Rotate the Shortcode/Passkey immediately if they are accidentally exposed.

5) Callback handling
   - Ensure `/api/mpesa/callback` is reachable and handles `stkCallback` or `ResultCode` payloads as described in `app/api/mpesa/callback/route.ts`.

6) Troubleshooting
   - If token fetch fails, verify `consumerKey`/`consumerSecret` and network connectivity.
   - Check timestamps and passkey composition for STK pushes: Shortcode + Passkey + Timestamp (YYYYMMDDHHMMSS).

