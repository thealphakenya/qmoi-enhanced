import { NextRequest, NextResponse } from "next/server";
import { cashonWallet } from "@/lib/cashon-wallet";

// Verify master token
function verifyMasterToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const masterToken = process.env.MASTER_TOKEN;

  return token === masterToken ? token : null;
}

// POST /api/cashon/deposit
export async function POST(request: NextRequest) {
  try {
    const masterToken = verifyMasterToken(request);
    if (!masterToken) {
      return NextResponse.json(
        { error: "Master access required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { amount } = body;

    if (!amount || amount < 10) {
      return NextResponse.json(
        { error: "Invalid amount - minimum KES 10" },
        { status: 400 },
      );
    }

    const depositId = await cashonWallet.initiateDeposit(amount, masterToken);
    return NextResponse.json({
      success: true,
      depositId,
      message: `Deposit request initiated for KES ${amount}`,
    });
  } catch (error) {
    console.error("Deposit API error:", error);
    return NextResponse.json(
      { error: "Failed to initiate deposit" },
      { status: 500 },
    );
  }
}
