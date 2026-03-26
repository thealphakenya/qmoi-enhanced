// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { NextRequest, NextResponse } from "next/server";

/**
 * File Management Routes
 * Handles file download, delete, and retrieval
 */

const fileStorage = new Map<
  string,
  {
    name: string;
    type: string;
    data: ArrayBuffer;
    uploadedAt: Date;
    userId: string;
  }
>();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const fileId = params.id;
    const download = req.nextUrl.searchParams.get("download") === "true";

    // Get file from storage
    const fileData = fileStorage.get(fileId);

    if (!fileData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Verify user ownership
    const userId = req.headers.get("X-User-ID") || "anonymous";
    if (fileData.userId !== userId && userId !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Return file
    const response = new NextResponse(Buffer.from(fileData.data), {
      status: 200,
      headers: {
        "Content-Type": fileData.type,
        "Content-Length": fileData.data.byteLength.toString(),
        ...(download && {
          "Content-Disposition": `attachment; filename="${fileData.name}"`,
        }),
      },
    });

    return response;
  } catch (error) {
    console.error("File retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve file" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const fileId = params.id;
    const userId = req.headers.get("X-User-ID") || "anonymous";

    // Get file to verify ownership
    const fileData = fileStorage.get(fileId);

    if (!fileData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Verify user ownership
    if (fileData.userId !== userId && userId !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete file
    fileStorage.delete(fileId);

    return NextResponse.json({
      success: true,
      message: `File ${fileData.name} deleted successfully`,
    });
  } catch (error) {
    console.error("File deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
