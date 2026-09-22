import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'WiFi service is running' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ssid, password } = body;

    if (!ssid || !password) {
      return NextResponse.json(
        { error: 'SSID and password are required' },
        { status: 400 }
      );
    }

    // Here you would implement the actual WiFi configuration logic
    // For now, we'll just return a success response
    return NextResponse.json({
      status: 'success',
      message: `WiFi network ${ssid} configured successfully`
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 