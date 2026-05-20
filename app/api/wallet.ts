import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/db/prisma";
import { authService } from "../../lib/auth/service";
import { logger } from "../../lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getTokenFromReq(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : req.cookies.get("accessToken")?.value;
  return token;
}

export async function GET(req: NextRequest) {
  try {
    const token = await getTokenFromReq(req);

    // Allow unauthenticated requests to receive a minimal route notice
    if (!token) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const decoded = authService.decodeToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, role: true } });
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const url = new URL(req.url);
    const pendingOnly = url.searchParams.get("pending_wallets");

    // Master-only: access to pending wallet requests
    if (pendingOnly) {
      if (user.role !== "master") {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
      const pending = await prisma.walletRequest.findMany({ where: { status: "pending" }, orderBy: { createdAt: "desc" } });
      return NextResponse.json({ success: true, pending });
    }

    // For regular wallet listing: master gets full view; others get limited view
    if (user.role === "master") {
      const wallets = await prisma.wallet.findMany({ orderBy: { isPrimary: 'desc' } });
      return NextResponse.json({ success: true, wallets });
    }

    // Non-master: return limited wallet metadata (no balances)
    const wallets = await prisma.wallet.findMany({ select: { id: true, currency: true, isPrimary: true, name: true } });
    return NextResponse.json({ success: true, wallets });

  } catch (error) {
    logger.error("/api/wallet GET error", error);
    return NextResponse.json({ success: false, error: "Failed to fetch wallets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getTokenFromReq(req);
    if (!token) return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });

    const decoded = authService.decodeToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, role: true, email: true } });
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { action } = body;

    // Safe actions that do not move funds
    if (action === "request_wallet") {
      // create a pending wallet request
      const { email, username } = body;
      const wr = await prisma.walletRequest.create({ data: { email, username, status: "pending", requestedBy: user.id } });
      await prisma.auditLog.create({ data: { userId: user.id, username: user.email || user.id, action: 'wallet_request', resource: 'wallet', details: JSON.stringify({ email, username }), ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'), riskLevel: 'low', status: 'pending' } as any });
      return NextResponse.json({ success: true, status: 'pending', request: wr });
    }

    // Actions that modify funds or approve wallets must be master-only
    const masterOnlyActions = new Set(['approve_wallet', 'transfer', 'withdraw', 'approve_transfer']);
    if (masterOnlyActions.has(action)) {
      if (user.role !== 'master') {
        await prisma.auditLog.create({ data: { userId: user.id, username: user.email || user.id, action: 'forbidden_attempt', resource: 'wallet', details: JSON.stringify({ action }), ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'), riskLevel: 'high', status: 'failure' } as any });
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }

      if (action === 'approve_wallet') {
        const { email } = body;
        const wr = await prisma.walletRequest.findFirst({ where: { email, status: 'pending' } });
        if (!wr) return NextResponse.json({ success: false, error: 'Pending request not found' }, { status: 404 });
        const approved = await prisma.walletRequest.update({ where: { id: wr.id }, data: { status: 'approved', approvedBy: user.id, approvedAt: new Date() } });
        await prisma.auditLog.create({ data: { userId: user.id, username: user.email || user.id, action: 'approve_wallet', resource: 'wallet', details: JSON.stringify({ email }), ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'), riskLevel: 'high', status: 'success' } as any });
        return NextResponse.json({ success: true, status: 'approved', request: approved });
      }

      // Transfers and withdrawals are intentionally gated: log and require manual multi-sig approval
      if (action === 'transfer' || action === 'withdraw' || action === 'approve_transfer') {
        // Create a transfer request record instead of performing the transfer automatically
        const { fromWalletId, toWalletId, amount, currency, reason } = body;
        const txRequest = await prisma.transferRequest.create({ data: { fromWalletId, toWalletId, amount: Number(amount) || 0, currency: currency || 'USD', reason: reason || '', requestedBy: user.id, status: 'pending' } });
        await prisma.auditLog.create({ data: { userId: user.id, username: user.email || user.id, action: 'create_transfer_request', resource: 'wallet', details: JSON.stringify({ fromWalletId, toWalletId, amount, currency }), ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'), riskLevel: 'high', status: 'pending' } as any });
        return NextResponse.json({ success: true, status: 'pending', transferRequest: txRequest });
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid or unhandled action' }, { status: 400 });

  } catch (error) {
    logger.error('/api/wallet POST error', error);
    return NextResponse.json({ success: false, error: 'Failed to process wallet action' }, { status: 500 });
  }
}
