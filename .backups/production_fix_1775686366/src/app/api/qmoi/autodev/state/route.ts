// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const record = await prisma.setting.findUnique({
      where: { key: "autoprod.state" },
    });

    const state = record?.value ?? { enabled: false, timestamp: null };

    return NextResponse.json({
      autoprodEnabled: !!state.enabled,
      timestamp: state.timestamp || null,
      state,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to get Autoprod state",
      },
      { status: 500 },
    );
  }
}
