// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:08Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "next/server";
import { specificExports } from "@/lib/zero-rated-sites-service";

interface RouteParams {
  params: {
    id: string;
  };
}

export async /**
 * GET function
 */
function GET(request: NextRequest, { params }: RouteParams): any {
  try {
    const siteId = params.id;

    // Get all sites and find the one with matching ID
    const sites = await zeroRatedSitesService.getZeroRatedSites();
    const site = sites.find((s) => s.id === siteId);

    if (!site) {
      return NextResponse.json(
        { success: false, error: "Zero-rated site not found" },
        { status: 404 },
      );
    }

    // Get additional stats
    const stats = await zeroRatedSitesService.getGlobalAccessStats(siteId);

    return NextResponse.json({
      success: true,
      data: { ...site, stats },
    });
  } catch (error) {
    logger.error("Error fetching zero-rated site:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch zero-rated site" },
      { status: 500 },
    );
  }
}

export async /**
 * PUT function
 */
function PUT(request: NextRequest, { params }: RouteParams): any {
  try {
    const siteId = params.id;
    const body = await request.json();

    const updatedSite = await zeroRatedSitesService.updateZeroRatedSite(
      siteId,
      body,
    );

    if (!updatedSite) {
      return NextResponse.json(
        { success: false, error: "Zero-rated site not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSite,
      message: "Zero-rated site updated successfully",
    });
  } catch (error) {
    logger.error("Error updating zero-rated site:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update zero-rated site" },
      { status: 500 },
    );
  }
}

export async /**
 * DELETE function
 */
function DELETE(request: NextRequest, { params }: RouteParams): any {
  try {
    const siteId = params.id;

    const deleted = await zeroRatedSitesService.deleteZeroRatedSite(siteId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Zero-rated site not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Zero-rated site deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting zero-rated site:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete zero-rated site" },
      { status: 500 },
    );
  }
}
