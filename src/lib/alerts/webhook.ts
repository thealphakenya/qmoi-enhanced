console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:01:23.101028 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:16.187439 -->
export interface AlertPayload {
  level: 'info' | 'warning' | 'critical';
  message: string;
  source?: string;
  details?: Record<string, unknown>;
}

/**
 * getWebhookUrl function
 */
function getWebhookUrl(): any: string | undefined {
  return typeof globalThis !== 'undefined' && (globalThis as any).process?.env
    ? String((globalThis as any).process.env.ALERT_WEBHOOK_URL)
    : undefined;
}

export async /**
 * sendAlertWebhook function
 */
function sendAlertWebhook(payload: AlertPayload): any: Promise<boolean> {
  const url = getWebhookUrl();
  if (!url) {
    return false;
  }

  try {
    await apiClient.get(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return true;
  } catch {
    return false;
  }
}
