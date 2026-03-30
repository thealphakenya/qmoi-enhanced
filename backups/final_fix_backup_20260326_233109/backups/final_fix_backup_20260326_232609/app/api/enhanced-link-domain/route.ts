// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import { enhancedLinkDomainService } from "@/lib/enhanced-link-domain-service";
import { qmoiTracksService } from "@/lib/tracks-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    switch (action) {
      case "scan":
        // Scan all markdown files for links
        const scanResults =
          await enhancedLinkDomainService.scanAllMarkdownFiles();

        // Create track for this operation
        const trackId = await qmoiTracksService.createTrack(
          "Markdown Link Scan",
          "link-validation",
          {
            totalFiles: scanResults.totalFiles,
            totalLinks: scanResults.totalLinks,
            validLinks: scanResults.validLinks,
            invalidLinks: scanResults.invalidLinks,
            domains: scanResults.domains,
          },
          { priority: "high" },
        );

        return NextResponse.json({
          success: true,
          trackId,
          results: scanResults,
        });

      case "stats":
        // Get validation statistics
        const stats = enhancedLinkDomainService.getValidationStats();
        return NextResponse.json({
          success: true,
          stats,
        });

      case "validate-link":
        const url = searchParams.get("url");
        if (!url) {
          return NextResponse.json(
            {
              success: false,
              error: "URL parameter required",
            },
            { status: 400 },
          );
        }

        const validation =
          await enhancedLinkDomainService.validateLinkGlobally(url);
        return NextResponse.json({
          success: true,
          validation,
        });

      case "validate-domain":
        const domain = searchParams.get("domain");
        if (!domain) {
          return NextResponse.json(
            {
              success: false,
              error: "Domain parameter required",
            },
            { status: 400 },
          );
        }

        const domainValidation =
          await enhancedLinkDomainService.validateDomainGlobally(domain);
        return NextResponse.json({
          success: true,
          validation: domainValidation,
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid action. Use: scan, stats, validate-link, validate-domain",
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Enhanced link domain service error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    switch (action) {
      case "auto-replace":
        // Auto-replace broken links in markdown files
        const replaceResults =
          await enhancedLinkDomainService.autoReplaceBrokenLinks();

        // Create track for this operation
        const replaceTrackId = await qmoiTracksService.createTrack(
          "Auto Link Replacement",
          "link-maintenance",
          {
            filesUpdated: replaceResults.filesUpdated,
            linksReplaced: replaceResults.linksReplaced,
            replacements: replaceResults.replacements,
          },
          { priority: "high" },
        );

        return NextResponse.json({
          success: true,
          trackId: replaceTrackId,
          results: replaceResults,
        });

      case "validate-batch":
        const { urls } = await request.json();
        if (!Array.isArray(urls)) {
          return NextResponse.json(
            {
              success: false,
              error: "URLs must be an array",
            },
            { status: 400 },
          );
        }

        // Create track for batch validation
        const batchTrackId = await qmoiTracksService.createTrack(
          "Batch Link Validation",
          "link-validation",
          {
            urlCount: urls.length,
          },
          { priority: "medium" },
        );

        // Validate all URLs
        const validations = await Promise.all(
          urls.map((url) =>
            enhancedLinkDomainService.validateLinkGlobally(url),
          ),
        );

        // Update track with results
        await qmoiTracksService.updateTrack(batchTrackId, {
          status: "completed",
          progress: 100,
          metadata: {
            urlCount: urls.length,
            validCount: validations.filter((v) => v.isValid).length,
            invalidCount: validations.filter((v) => !v.isValid).length,
          },
        });

        return NextResponse.json({
          success: true,
          trackId: batchTrackId,
          validations,
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action. Use: auto-replace, validate-batch",
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Enhanced link domain service POST error:", error);
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: details,
      },
      { status: 500 },
    );
  }
}
