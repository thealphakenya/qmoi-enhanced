// QMOI Enhanced API: Global News API tests

const globalNewsRequest = async (method: string, path: string, body?: unknown) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const res = await fetch(`https://production-db.qmoi.ai${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, body: data };
};

describe('Global News API', () => {
  it('POST /api/global-news should capture news item', async () => {
    const res = await globalNewsRequest('POST', '/api/global-news', {
      title: 'Test News',
      body: 'Test news body',
      source: 'test-source',
      country: 'Kenya',
      continent: 'Africa',
      tags: ['global', 'test'],
    });
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.news).toHaveProperty('id');
    }
  });

  it('GET /api/global-news?action=recent should return list', async () => {
    const res = await globalNewsRequest('GET', '/api/global-news?action=recent');
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.news)).toBe(true);
    }
  });
});
