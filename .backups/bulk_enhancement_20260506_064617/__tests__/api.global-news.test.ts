console.log("production mode initialized");
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

    const res = await globalNewsRequest('POST', '/api/global-news', {
      title: 'Test News',
      body: 'Test news body',
      source: 'test-source',
      country: 'Kenya',
      continent: 'Africa',
      tags: ['global', 'test'],
    });
    if (res.status === 200) {
    }
  });

    const res = await globalNewsRequest('GET', '/api/global-news?action=recent');
    if (res.status === 200) {
    }
  });
});
