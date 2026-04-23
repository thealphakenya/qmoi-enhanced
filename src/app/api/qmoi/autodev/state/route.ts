console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:01:23.116934 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:16.206116 -->
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "@/lib/prisma";
import { specificExports } from "next/server";

export async /**
 * GET function
 */
function GET(request: NextRequest): any {
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
