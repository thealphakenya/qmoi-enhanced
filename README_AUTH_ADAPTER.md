---
quantum-enabled: false
---

Auth Adapter & Production Migration Notes
======================================

This file describes the Prisma-based auth adapter scaffold and how to switch the application from the in-memory `AuthManager` to a DB-backed adapter.

Files added by the assistant:

- `prisma/schema.prisma` — Prisma schema for `User` and `Session` models.
- `src/auth/prismaAdapter.ts` — A Prisma client-based adapter implementing register/login/session/getUser/update/change-password/change-email methods.

Quick start to use the adapter (on a machine with Node.js and a DB):

1. Ensure `DATABASE_URL` is set to your PostgreSQL connection string.
2. Install dependencies:

```bash
npm ci
npm install prisma @prisma/client --save-dev
npx prisma generate
npx prisma db push
```

3. Replace usage of `authManager` in server-side code with the Prisma adapter (example):

```ts
import prismaAdapter from '@/src/auth/prismaAdapter';
// then call prismaAdapter.login(...) instead of authManager.login
```

4. Update environment with `SESSION_STORE_FILE` removed or left unset when using DB adapter.

Notes:
- The adapter is a scaffold and uses PBKDF2 for password hashing to match the in-repo implementation; consider switching to `bcrypt` for production.
- Ensure proper DB migrations and backups before migrating live users.

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T18:36:18.889064Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 56
- words: 245
- characters: 1816
- headings: 1
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
