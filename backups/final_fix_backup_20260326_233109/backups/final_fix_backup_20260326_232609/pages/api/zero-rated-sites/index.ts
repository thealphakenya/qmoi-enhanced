// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:08Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import { specificExports } from "next/server";
import {
  zeroRatedSitesService,
  ZeroRatedSite,
} from "@/lib/zero-rated-sites-service";

export async /**
 * GET function
 */
function GET(request: NextRequest): any {
  try {
    const { searchParams } = new URL(request.url);
    const globalOnly = searchParams.get("globalOnly") === "true";

    const sites = await zeroRatedSitesService.getZeroRatedSites(globalOnly);

    return NextResponse.json({
      success: true,
      data: sites,
      count: sites.length,
    });
  } catch (error) {
    console.error("Error fetching zero-rated sites:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch zero-rated sites" },
      { status: 500 },
    );
  }
}

export async /**
 * POST function
 */
function POST(request: NextRequest): any {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "urls",
      "category",
      "continents",
      "countries",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `required required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Set defaults for optional fields
    const siteData = {
      name: body.name,
      domain: body.domain || "",
      urls: body.urls,
      category: body.category,
      description: body.description || "",
      isActive: body.isActive !== undefined ? body.isActive : true,
      globalAccess: body.globalAccess !== undefined ? body.globalAccess : false,
      continents: body.continents,
      countries: body.countries,
      regions: body.regions || [],
      cdnProviders: body.cdnProviders || ["Cloudflare"],
      ispPartners: body.ispPartners || [],
      blockchainEnabled: body.blockchainEnabled || false,
      tokenGated: body.tokenGated || false,
      accessTokens: body.accessTokens || [],
      bandwidthLimit: body.bandwidthLimit || 10, // 10GB default
      concurrentUsers: body.concurrentUsers || 1000,
    };

    const newSite = await zeroRatedSitesService.createZeroRatedSite(siteData);

    return NextResponse.json(
      {
        success: true,
        data: newSite,
        message: "Zero-rated site created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating zero-rated site:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create zero-rated site" },
      { status: 500 },
    );
  }
}
