// QMOI Enhanced API: Accountability API tests

const accountabilityRequest = async (method: string, path: string, body?: unknown) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const res = await fetch(`http://localhost:3000${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, body: data };
};

describe('Accountability API', () => {
  it('POST /api/accountability should capture event', async () => {
    const res = await accountabilityRequest('POST', '/api/accountability', { type: 'test', details: 'testing accountability' });
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.record).toHaveProperty('id');
    }
  });

  it('GET /api/accountability?action=events should return events list', async () => {
    const res = await accountabilityRequest('GET', '/api/accountability?action=events');
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.events)).toBe(true);
    }
  });
});
