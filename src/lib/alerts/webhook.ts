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
