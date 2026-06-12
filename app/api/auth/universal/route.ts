import { NextRequest, NextResponse } from "next/server";
import * as signin from "./signin/route";
import * as register from "./register/route";
import * as refresh from "./refresh/route";
import * as logout from "./logout";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = (body?.action || '').toString().toLowerCase();

    switch (action) {
      case 'signin':
        return await (signin as any).POST(req);
      case 'register':
        return await (register as any).POST(req);
      case 'refresh':
        return await (refresh as any).POST(req);
      case 'logout':
        return await (logout as any).default?.(req) || (logout as any).POST?.(req);
      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: 'Universal auth endpoint. POST { action: "signin"|"register"|"refresh"|"logout" }' });
}
