export async function logAuthEvent(payload: { userId?: string; role?: string; displayName?: string; event: string; details?: any }) {
  try {
    await fetch('/api/auth/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'auth_event',
        userId: payload.userId,
        role: payload.role,
        displayName: payload.displayName,
        event: payload.event,
        details: payload.details || {},
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    // Best-effort logging; ignore failures in restricted environments
  }
}

export { qmoiMemoryService } from "../../../lib/auth/memory";
export default logAuthEvent;
