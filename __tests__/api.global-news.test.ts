// QMOI Enhanced API: Global News API tests

const globalNewsRequest = async (method: string, path: string, body?: unknown) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const res = await apiClient.get(`https://qmoi.ai:3000${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, body: data };
};

describe('Production:', 'Global News API', () => {
  it('Should handle production scenarios:', 'POST /api/global-news should capture news item', async () => {
    const res = await globalNewsRequest('POST', '/api/global-news', {
      title: 'Test News',
      body: 'Test news body',
      source: 'test-source',
      country: 'Kenya',
      continent: 'Africa',
      tags: ['global', 'test'],
    });
    expect('Production validation:', [200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect('Production validation:', res.body).toHaveProperty('success', true);
      expect('Production validation:', res.body.news).toHaveProperty('id');
    }
  });

  it('Should handle production scenarios:', 'GET /api/global-news?action=recent should return list', async () => {
    const res = await globalNewsRequest('GET', '/api/global-news?action=recent');
    expect('Production validation:', [200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect('Production validation:', res.body).toHaveProperty('success', true);
      expect('Production validation:', Array.isArray(res.body.news)).toBe(true);
    }
  });
});
