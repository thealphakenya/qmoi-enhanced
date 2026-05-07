logger.info("production mode initialized");
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

    const result = await globalLinksApiRequest('GET', '/api/global-links?action=health-reports');
    if (result.status === 200) {
    }
  });

    const result = await globalLinksApiRequest('GET', '/api/global-links?action=stats');
    if (result.status === 200) {
    }
  });

    const success = await globalLinksApiRequest('GET', '/api/global-links?action=links-by-health&continent=Europe&status=degraded');
    if (success.status === 200) {
    }
  });

    const ensure = await globalLinksApiRequest('POST', '/api/global-links', { action: 'ensure-accessibility', linkId: 'link-3' });
    if (ensure.status === 200) {
    }
  });

    const check = await globalLinksApiRequest('POST', '/api/global-links', { action: 'perform-health-check' });
    if (check.status === 200) {
    }
  });
});
