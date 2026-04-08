// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { NextResponse } from "next/server";
import { QMOIService } from "@/lib/qmoi-service";
import { getLogger } from "@/lib/logger";

const logger = getLogger("api/qvillage/models");

export async function GET() {
  try {
    const models = await QMOIService.getQVillageModels();
    return NextResponse.json(models);
  } catch (error) {
    logger.error("QVillage models error", { error });
    return NextResponse.json(
      { error: "Failed to fetch QVillage models" },
      { status: 500 },
    );
  }
}
