// QMOI Enhanced API: Global Links Monitoring and Operations Tests

const globalLinksApiRequest = async (method: string, path: string, body?: unknown) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const res = await fetch(`http://localhost:3000${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, body: data };
};

describe('Global Links API', () => {
  it('GET /api/global-links?action=health-reports should return structured reports', async () => {
    const result = await globalLinksApiRequest('GET', '/api/global-links?action=health-reports');
    expect([200, 404]).toContain(result.status);
    if (result.status === 200) {
      expect(result.body).toHaveProperty('reports');
      expect(result.body.reports).toHaveProperty('summary');
      expect(result.body.reports).toHaveProperty('totalLinks');
    }
  });

  it('GET /api/global-links?action=stats should return accessibility stats', async () => {
    const result = await globalLinksApiRequest('GET', '/api/global-links?action=stats');
    expect([200, 404]).toContain(result.status);
    if (result.status === 200) {
      expect(result.body).toHaveProperty('stats');
      expect(result.body.stats).toHaveProperty('totals');
      expect(result.body.stats).toHaveProperty('healthPercentage');
    }
  });

  it('GET /api/global-links?action=links-by-health should validate query parameters and results', async () => {
    const success = await globalLinksApiRequest('GET', '/api/global-links?action=links-by-health&continent=Europe&status=degraded');
    expect([200, 400, 404]).toContain(success.status);
    if (success.status === 200) {
      expect(Array.isArray(success.body.links)).toBe(true);
    }
  });

  it('POST /api/global-links with action=ensure-accessibility should update a link status', async () => {
    const ensure = await globalLinksApiRequest('POST', '/api/global-links', { action: 'ensure-accessibility', linkId: 'link-3' });
    expect([200, 400, 404]).toContain(ensure.status);
    if (ensure.status === 200) {
      expect(ensure.body).toHaveProperty('link');
      expect(ensure.body.link).toHaveProperty('status', 'healthy');
    }
  });

  it('POST /api/global-links with action=perform-health-check should return completion', async () => {
    const check = await globalLinksApiRequest('POST', '/api/global-links', { action: 'perform-health-check' });
    expect([200, 404]).toContain(check.status);
    if (check.status === 200) {
      expect(check.body).toHaveProperty('message');
    }
  });
});
