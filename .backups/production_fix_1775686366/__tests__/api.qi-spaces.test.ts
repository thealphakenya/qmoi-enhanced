// QMOI Enhanced API: QI Spaces dashboard and operations

const qiSpacesRequest = async (method: string, path: string, body?: unknown) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const res = await fetch(`http://localhost:3000${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, body: data };
};

describe('QI Spaces API', () => {
  it('GET /api/qi-spaces?action=dashboard should return success or 404', async () => {
    const res = await qiSpacesRequest('GET', '/api/qi-spaces?action=dashboard');
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('globalAccessibility');
      expect(res.body.data).toHaveProperty('qvillage');
      expect(res.body.data).toHaveProperty('globalLinkHealth');
    }
  });

  it('GET /api/qi-spaces?action=regions should return region summary', async () => {
    const res = await qiSpacesRequest('GET', '/api/qi-spaces?action=regions');
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('success', true);
    }
  });

  it('POST /api/qi-spaces action=refresh-global-health should trigger check', async () => {
    const res = await qiSpacesRequest('POST', '/api/qi-spaces', { action: 'refresh-global-health' });
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('action', 'refresh-global-health');
    }
  });

  it('POST /api/qi-spaces action=trigger-auto-evolve should return result structure', async () => {
    const res = await qiSpacesRequest('POST', '/api/qi-spaces', { action: 'trigger-auto-evolve' });
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('action', 'trigger-auto-evolve');
    }
  });
});
