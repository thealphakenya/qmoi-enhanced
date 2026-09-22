import { NextRequest, NextResponse } from 'next/server';

interface AnomalyError {
  message: string;
  count?: number;
}

interface AnomalyResponse {
  errors?: AnomalyError[];
  status?: string;
  error?: string;
}

export async function GET(request: NextRequest) {
  const adminToken = request.headers.get('x-admin-token');
  if (adminToken !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  if (searchParams.get('errors')) {
    try {
      // Proxy to anomaly service for error list
      const result = await fetch('http://localhost:5001/analytics', { method: 'GET' }).then(r => r.json());
      // Simulate error list for demo
      const errors: AnomalyError[] = result.top_ips && result.top_ips.length 
        ? result.top_ips.map(([ip, count]: [string, number]) => ({ 
            message: `Suspicious activity from ${ip}`, 
            count 
          })) 
        : [];
      return NextResponse.json({ errors });
    } catch (e: unknown) {
      return NextResponse.json({ 
        error: e instanceof Error ? e.message : String(e) 
      }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Unknown GET action' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const adminToken = request.headers.get('x-admin-token');
  if (adminToken !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  if (searchParams.get('fix')) {
    try {
      // Simulate auto-fix (could trigger a script, restart service, etc.)
      // In production, implement real fix logic
      return NextResponse.json({ status: 'fixed' });
    } catch (e: unknown) {
      return NextResponse.json({ 
        error: e instanceof Error ? e.message : String(e) 
      }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Unknown POST action' }, { status: 400 });
} 