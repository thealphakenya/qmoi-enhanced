// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/qmoi/revenue/transactions/route.ts -->
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "../../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    // Prefer API key based auth, fallback to QMOI_MASTER_API_KEY
    const apiAuth = requireApiKey(_request.headers);
    const authHeader = _request.headers.get("authorization");
    const masterKey =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    if (!apiAuth.ok && masterKey !== process.env.QMOI_MASTER_API_KEY) {
      const _r = apiAuth.response;
      return NextResponse.json(
        _r?.body ?? { _error: "Master access required" },
        { status: _r?.status ?? 401 },
      );
    }

    const mod = await import("../../../../../lib/qmoi-revenue-engine");
    const qmoiRevenueEngine: unknown =
      mod.qmoiRevenueEngine || mod.default || mod;

    const transactions = qmoiRevenueEngine.getTransactionHistory
      ? qmoiRevenueEngine.getTransactionHistory(50)
      : qmoiRevenueEngine.getTransactions
        ? qmoiRevenueEngine.getTransactions(50)
        : [];

    return NextResponse.json(transactions);
  } catch (_error) {
    (console as any).error("Get transactions _error:", _error);
    return NextResponse.json(
      { _error: "Failed to get transactions" },
      { status: 500 },
    );
  }
}
