// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next/server";
import {
  listDatasets,
  getDataset,
  createDataset,
  updateDataset,
  deleteDataset,
  selectDatasets,
  analyzeDatasets,
  initDatasetStore,
  getCloudSyncStatus,
  syncDatasetsWithCloud,
  autoDiscoverDatasets,
} from "@/lib/dataset-store";

export async /**
 * GET function
 */
function GET(): any {
  try {
    await initDatasetStore();

    const datasets = await listDatasets();
    const syncStatus = await getCloudSyncStatus();

    return NextResponse.json({
      success: true,
      data: datasets,
      meta: syncStatus,
    });
  } catch (error) {
    logger.error("Error listing datasets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to list datasets" },
      { status: 500 },
    );
  }
}

export async /**
 * POST function
 */
function POST(request: Request): any {
  try {
    await initDatasetStore();
    const body = (await request.json()) as any;
    const action = String(body?.action || "list").toLowerCase();

    // Selection, analysis, and dataset operations
    if (action === "list") {
      return NextResponse.json({ success: true, data: await listDatasets() });
    }

    if (action === "get") {
      const id = body.id || body.datasetId;
      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: "id is required for get",
          },
          { status: 400 },
        );
      }
      const dataset = await getDataset(id);
      if (!dataset) {
        return NextResponse.json(
          { success: false, error: "Dataset not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, dataset });
    }

    if (action === "select") {
      const context = body.context || {};
      const selectedDatasets = await selectDatasets(context);
      return NextResponse.json({ success: true, selectedDatasets });
    }

    if (action === "analyze") {
      const datasetIds: string[] = Array.isArray(body.datasetIds)
        ? body.datasetIds
        : [];
      const analyses = await analyzeDatasets(datasetIds);
      return NextResponse.json({ success: true, analyses });
    }

    if (action === "recommend") {
      const context = body.context || {};
      const selectedDatasets = await selectDatasets(context);
      const analyses = await analyzeDatasets(selectedDatasets);
      return NextResponse.json({
        success: true,
        recommendations: selectedDatasets,
        analyses,
        reasons: [],
      });
    }

    if (action === "query") {
      const filters = body.filters || body.context || {};
      const all = await listDatasets();
      const results = all.filter((d: any) => {
        if (filters.type && d.type !== filters.type) return false;
        if (typeof filters.minQuality === "number") {
          const quality = (d.stats?.totalItems ?? 0) / 200000;
          if (quality < filters.minQuality) return false;
        }
        if (typeof filters.maxAge === "number") {
          const maxAgeMs = filters.maxAge * 24 * 60 * 60 * 1000;
          if (!d.updatedAt) return false;
          const updatedMs = new Date(d.updatedAt as string).getTime();
          if (Date.now() - updatedMs > maxAgeMs) return false;
        }
        if (filters.tags && Array.isArray(filters.tags)) {
          const lowerTags = filters.tags.map((t: string) => t.toLowerCase());
          const tags = Array.isArray(d.metadata?.tags) ? d.metadata.tags : [];
          const match = tags.some((t: any) =>
            lowerTags.includes(String(t).toLowerCase()),
          );
          if (!match) return false;
        }
        return true;
      });
      return NextResponse.json({ success: true, results });
    }

    if (action === "statistics") {
      const datasets = await listDatasets();
      const totalSize = datasets.reduce(
        (acc: number, d: any) => acc + (d.size ?? 0),
        0,
      );
      const totalItems = datasets.reduce(
        (acc: number, d: any) =>
          acc + (d.itemCount ?? d.stats?.totalItems ?? 0),
        0,
      );
      const stats = {
        totalDatasets: datasets.length,
        totalSize,
        totalItems,
        cloudSync: await getCloudSyncStatus(),
      };
      return NextResponse.json({ success: true, stats });
    }

    if (
      action === "sync" ||
      action === "force_sync" ||
      action === "auto_discover"
    ) {
      // Trigger a sync to cloud and return status
      if (action === "force_sync") {
        await initDatasetStore({ forceRefresh: true });
      }

      if (action === "auto_discover") {
        const discovery = await autoDiscoverDatasets();
        const status = getCloudSyncStatus();
        return NextResponse.json({ success: true, discovery, status });
      }

      const syncResult = await syncDatasetsWithCloud();
      const status = getCloudSyncStatus();
      return NextResponse.json({
        success: syncResult.success,
        message: syncResult.message,
        status,
      });
    }

    if (action === "create") {
      const { name, description, type, metadata } = body;
      if (!name || !type) {
        return NextResponse.json(
          { success: false, error: "name and type are required" },
          { status: 400 },
        );
      }

      const dataset = await createDataset({
        name,
        type,
        description,
        size: 0, // Default size, can be updated later
        format: "json", // Default format
        metadata,
      });
      return NextResponse.json({ success: true, dataset });
    }

    if (action === "update") {
      const { id, updates } = body;
      if (!id) {
        return NextResponse.json(
          { success: false, error: "id is required for update" },
          { status: 400 },
        );
      }
      const dataset = await updateDataset(id, updates || {});
      if (!dataset) {
        return NextResponse.json(
          { success: false, error: "Dataset not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, dataset });
    }

    if (action === "delete") {
      const { id } = body;
      if (!id) {
        return NextResponse.json(
          { success: false, error: "id is required for delete" },
          { status: 400 },
        );
      }
      const deleted = await deleteDataset(id);
      return NextResponse.json({ success: deleted, id });
    }

    return NextResponse.json(
      {
        success: false,
        error: `Unknown dataset action: ${action}`,
      },
      { status: 400 },
    );
  } catch (error) {
    logger.error("Error handling dataset request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process dataset request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
