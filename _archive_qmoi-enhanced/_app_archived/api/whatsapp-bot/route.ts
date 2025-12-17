import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, phoneNumber } = body;

    if (!message || !phoneNumber) {
      return NextResponse.json(
        { error: "Message and phone number are required" },
        { status: 400 },
      );
    }

    // Here you would implement the actual WhatsApp message sending logic
    // For now, we'll just return a success response
    return NextResponse.json({
      status: "success",
      message: `Message sent to ${phoneNumber} successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
