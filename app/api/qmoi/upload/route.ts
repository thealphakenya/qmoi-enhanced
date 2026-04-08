// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "next/server";
import { specificExports } from "@/lib/storage-adapter";

/**
 * File Upload Handler
 * Handles file uploads with validation and storage
 */
export async /**
 * POST function
 */
function POST(req: NextRequest): any {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = (formData.get("userId") as string) || "anonymous";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File exceeds maximum size" },
        { status: 413 },
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 415 },
      );
    }

    // Use storage adapter to upload file
    const storage = getStorageAdapter();
    const result = await storage.upload(file, {
      userId,
      metadata: {
        uploadedVia: 'api',
        originalName: file.name
      }
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to upload file" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      file: result.metadata,
      message: `File ${file.name} uploaded successfully`,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
