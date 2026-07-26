/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/cashon/deposit/route.ts -->
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";
import libProposals from "../../../../lib/proposals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/cashon/deposit
export async function POST(_request: NextRequest) {
  try {
    const auth = libProposals.requireApiKey(_request.headers);
    if (!auth.ok) {
      const r = auth.response;
      if (r) {
        return NextResponse.json(r.body, { status: r.status });
      }
      return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
    }

    const canRun =
      process.env.PRODUCTION_CONFIRMED === "true" &&
      process.argv.indexOf("--real") !== -1;
    const runtimeToken = process.env.MASTER_TOKEN || "";

    const body = await _request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { _error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const proposal = {
      id: `cashon-deposit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "cashon_deposit",
      details: {
        amount,
        willRun: !!canRun,
      },
    };
    if (!canRun) {
      await libProposals.writeProposal(proposal);
      return NextResponse.json({
        status: "proposed",
        message: "Deposit proposed (dry-run)",
      });
    }

    const depositId = await cashonWallet.initiateDeposit(amount, runtimeToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit _request initiated for KES ${amount}`,
    });
  } catch (_error) {
    (console as any).error("Deposit API _error:", _error);
    return NextResponse.json(
      { _error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}
