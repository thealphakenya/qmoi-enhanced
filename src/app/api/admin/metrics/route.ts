
/**
 * GET function
 */
export async function GET(request: Request): any {
  const acceptHeader = request.headers.get('accept') || '';
  if (acceptHeader.includes('text/plain')) {
    return new Response(exportPrometheusMetrics(), {
      headers: {
        'Content-Type': 'text/plain; version=0.0.4',
      },
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      metrics: getDashboardMetrics(),
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
