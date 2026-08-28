/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { domainService } from "@/lib/domain-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, domain, category, oldDomain, newDomain, description } =
      body;

    switch (action) {
      case "add":
        if (!domain || !category) {
          return NextResponse.json(
            { error: "Domain and category are required for add action" },
            { status: 400 },
          );
        }
        const addSuccess = await domainService.addDomain(
          domain,
          category,
          undefined,
          description,
        );
        return NextResponse.json({
          success: addSuccess,
          message: addSuccess
            ? `Domain ${domain} added successfully`
            : `Failed to add domain ${domain}`,
        });

      case "update":
        if (!oldDomain || !newDomain) {
          return NextResponse.json(
            { error: "oldDomain and newDomain are required for update action" },
            { status: 400 },
          );
        }
        const updateSuccess = await domainService.updateDomain(
          oldDomain,
          newDomain,
        );
        return NextResponse.json({
          success: updateSuccess,
          message: updateSuccess
            ? `Domain updated from ${oldDomain} to ${newDomain}`
            : `Failed to update domain`,
        });

      case "remove":
        if (!domain) {
          return NextResponse.json(
            { error: "Domain is required for remove action" },
            { status: 400 },
          );
        }
        const removeSuccess = await domainService.removeDomain(domain);
        return NextResponse.json({
          success: removeSuccess,
          message: removeSuccess
            ? `Domain ${domain} removed successfully`
            : `Failed to remove domain ${domain}`,
        });

      case "validate":
        const validation = await domainService.validateDomains();
        return NextResponse.json({
          success: true,
          message: `Validation complete: ${validation.valid.length} valid, ${validation.invalid.length} invalid`,
          data: validation,
        });

      case "scan":
        const newDomains = await domainService.scanCodebaseForDomains();
        return NextResponse.json({
          success: true,
          message: `Scan complete. Found ${newDomains.length} potential new domains`,
          data: newDomains,
        });

      case "autoUpdate":
        const autoUpdateResult = await domainService.autoUpdateDomains();
        return NextResponse.json({
          success: true,
          message: `Auto-update complete. Added: ${autoUpdateResult.added}, Updated: ${autoUpdateResult.updated}, Removed: ${autoUpdateResult.removed}`,
          data: autoUpdateResult,
        });

      case "list":
        const allDomains = domainService.getAllDomains();
        const categories = [...new Set(allDomains.map((d) => d.category))];
        const categorySummary = categories.map((cat) => ({
          category: cat,
          count: domainService.getDomainsByCategory(cat).length,
          domains: domainService.getDomainsByCategory(cat).slice(0, 5),
        }));

        return NextResponse.json({
          success: true,
          message: `Found ${allDomains.length} domains across ${categories.length} categories`,
          data: {
            total: allDomains.length,
            categories: categorySummary,
            domains: allDomains,
          },
        });

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Supported actions: add, update, remove, validate, scan, autoUpdate, list",
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Domain management API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const allDomains = domainService.getAllDomains();
    const categories = [...new Set(allDomains.map((d) => d.category))];

    return NextResponse.json({
      success: true,
      message: `QMOI Domain Management System - ${allDomains.length} domains monitored`,
      data: {
        totalDomains: allDomains.length,
        categories: categories.length,
        lastUpdate: new Date().toISOString(),
        capabilities: [
          "Auto-discovery of new domains",
          "Automatic categorization",
          "Link validation",
          "File auto-updates",
          "Manual management commands",
        ],
      },
    });
  } catch (error) {
    console.error("Domain management GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
