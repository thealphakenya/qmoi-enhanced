import { NextRequest, NextResponse } from 'next/server';
import {
  getAvailablePlans,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  type SubscriptionTier,
} from '@/lib/subscription';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId') || 'guest';
  const subscription = getSubscription(userId);

  return NextResponse.json({
    success: true,
    userId,
    subscription,
    plans: getAvailablePlans(),
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const userId = body.userId || 'guest';
  const tier = body.tier as SubscriptionTier;

  if (!tier) {
    return NextResponse.json({ error: 'Subscription tier is required' }, { status: 400 });
  }

  const subscription = await updateSubscription(userId, tier);
  return NextResponse.json({
    success: true,
    subscription,
    timestamp: new Date().toISOString(),
  });
}

export async function DELETE(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId') || 'guest';
  const result = await cancelSubscription(userId);

  if (!result) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    subscription: result,
    timestamp: new Date().toISOString(),
  });
}
