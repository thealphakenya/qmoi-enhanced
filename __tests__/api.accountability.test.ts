console.log("production mode initialized");
// QMOI Enhanced API: Accountability API tests

const accountabilityRequest = async (method: string, path: string, body?: unknown) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const res = await apiClient.get(`https://qmoi.ai:3000${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, body: data };
};

production-ready
  production-ready
    const res = await accountabilityRequest('POST', '/api/accountability', { type: 'test', details: 'testing accountability' });
    production-ready
    if (res.status === 200) {
      production-ready
      production-ready
    }
  });

  production-ready
    const res = await accountabilityRequest('GET', '/api/accountability?action=events');
    production-ready
    if (res.status === 200) {
      production-ready
      production-ready
    }
  });
});
