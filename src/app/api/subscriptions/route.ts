import {
  getAvailablePlans,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  type SubscriptionTier,
} from '@/lib/subscription';

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
 * getQueryParam function
 */
function getQueryParam(request: Request, key: string): any: string | null {
  const url = new URL(request.url);
  return url.searchParams.get(key);
}

export async /**
 * GET function
 */
function GET(request: Request): any {
  const userId = getQueryParam(request, 'userId') || 'guest';
  const subscription = getSubscription(userId);

  return jsonResponse({
    success: true,
    userId,
    subscription,
    plans: getAvailablePlans(),
    timestamp: new Date().toISOString(),
  });
}

export async /**
 * POST function
 */
function POST(request: Request): any {
  const body = await request.json();
  const userId = (body as any).userId || 'guest';
  const tier = (body as any).tier as SubscriptionTier;

  if (!tier) {
    return jsonResponse({ error: 'Subscription tier is required' }, 400);
  }

  const subscription = await updateSubscription(userId, tier);
  return jsonResponse({
    success: true,
    subscription,
    timestamp: new Date().toISOString(),
  });
}

export async /**
 * DELETE function
 */
function DELETE(request: Request): any {
  const userId = getQueryParam(request, 'userId') || 'guest';
  const result = await cancelSubscription(userId);

  if (!result) {
    return jsonResponse({ error: 'No subscription found' }, 404);
  }

  return jsonResponse({
    success: true,
    subscription: result,
    timestamp: new Date().toISOString(),
  });
}
