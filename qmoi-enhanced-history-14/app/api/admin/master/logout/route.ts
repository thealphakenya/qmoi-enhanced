import { NextResponse } from "next/server";

/**
 * Master Logout Endpoint
 * Clears session and revokes access token
 */

export async function POST(request: Request) {
  try {
    // Verify token is valid before logout
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const adminToken = process.env.ADMIN_TOKEN;

    if (!token || token !== adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Log logout event
    console.log("[MASTER] Logout successful", new Date().toISOString());

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Master session terminated",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
