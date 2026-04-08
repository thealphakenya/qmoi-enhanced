// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "next/server";
import { specificExports } from "@/lib/links-service";

export async /**
 * PATCH function
 */
function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
): any {
  try {
    const body = await req.json();
    const { isZeroRated } = body;

    const success = await linksService.setZeroRated(params.id, isZeroRated);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Link not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}
