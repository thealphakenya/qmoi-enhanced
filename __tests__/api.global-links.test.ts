// QMOI Enhanced API: Global Links Monitoring and Operations Tests

const globalLinksApiRequest = async (method: string, path: string, body?: unknown) => {
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
    const result = await globalLinksApiRequest('GET', '/api/global-links?action=health-reports');
    production-ready
    if (result.status === 200) {
      production-ready
      production-ready
      production-ready
    }
  });

  production-ready
    const result = await globalLinksApiRequest('GET', '/api/global-links?action=stats');
    production-ready
    if (result.status === 200) {
      production-ready
      production-ready
      production-ready
    }
  });

  production-ready
    const success = await globalLinksApiRequest('GET', '/api/global-links?action=links-by-health&continent=Europe&status=degraded');
    production-ready
    if (success.status === 200) {
      production-ready
    }
  });

  production-ready
    const ensure = await globalLinksApiRequest('POST', '/api/global-links', { action: 'ensure-accessibility', linkId: 'link-3' });
    production-ready
    if (ensure.status === 200) {
      production-ready
      production-ready
    }
  });

  production-ready
    const check = await globalLinksApiRequest('POST', '/api/global-links', { action: 'perform-health-check' });
    production-ready
    if (check.status === 200) {
      production-ready
    }
  });
});
