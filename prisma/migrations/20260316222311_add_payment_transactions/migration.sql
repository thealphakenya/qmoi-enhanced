<!-- AUTODEV Enhanced: 2026-04-20T09:07:39.288808 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:10.816845 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:07.122414 -->
-- DropIndex
DROP INDEX "payment_transactions_providerTransactionId_idx";

-- DropIndex
DROP INDEX "payment_transactions_status_idx";

-- DropIndex
DROP INDEX "payment_transactions_userId_idx";

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
