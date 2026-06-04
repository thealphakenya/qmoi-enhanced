
/**
 * GET function
 */
export async function GET(): any {
  const traces = getTraceStatus();
  return new Response(
    JSON.stringify({
      success: true,
      traces,
      count: traces.length,
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
