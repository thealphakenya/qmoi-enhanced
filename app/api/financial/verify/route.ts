import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { service, account } = await request.json();
    const result = await new Promise<string>((resolve, reject) => {
      exec(
        `python scripts/financial_verification.py ${service} ${account}`,
        (error, stdout, stderr) => {
          if (error) {
            reject(stderr || error.message);
          } else {
            resolve(stdout);
          }
        },
      );
    });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        _error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
