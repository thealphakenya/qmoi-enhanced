
/**
 * jsonResponse function
 */
function jsonResponse(body: unknown, status = 200): any {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * POST function
 */
export async function POST(request: Request): any {
  try {
    const body = await request.json();
    const payload = body as AlertPayload;

    if (!payload || !payload.message || !payload.level) {
      return jsonResponse({ error: 'Alert payload requires level and message' }, 400);
    }

    const success = await sendAlertWebhook(payload);
    return jsonResponse({
      success,
      delivered: success,
      payload,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unable to deliver alert webhook',
      },
      500,
    );
  }
}
