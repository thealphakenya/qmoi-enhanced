// app/api/auth/sessions/route.ts
// Session Management Endpoint - GET /api/auth/sessions

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { sessionManager } from '@/lib/auth/session-manager';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all sessions
    const sessions = await sessionManager.getUserSessions(session.user.id);

    // Mark current session
    const currentSessionId = session.sessionId; // From auth session
    const sessionsWithMarker = sessions.map((s) => ({
      ...s,
      isCurrent: s.id === currentSessionId,
    }));

    return NextResponse.json({
      sessions: sessionsWithMarker,
      activeCount: sessions.length,
      maxActive: parseInt(process.env.SESSION_MAX_ACTIVE_PER_USER || '5'),
    });
  } catch (error: any) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve sessions' },
      { status: 500 }
    );
  }
}
