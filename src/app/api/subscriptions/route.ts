import {
  getAvailablePlans,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  type SubscriptionTier,
} from '@/lib/subscription';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function getQueryParam(request: Request, key: string): string | null {
  const url = new URL(request.url);
  return url.searchParams.get(key);
}

export async function GET(request: Request) {
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

export async function POST(request: Request) {
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

export async function DELETE(request: Request) {
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
