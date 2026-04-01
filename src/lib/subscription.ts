export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'active' | 'trial' | 'past_due' | 'cancelled';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  pricePerMonth: number;
  features: string[];
  description: string;
}

export interface SubscriptionRecord {
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startedAt: string;
  renewsAt: string;
}

const AVAILABLE_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  free: {
    tier: 'free',
    pricePerMonth: 0,
    features: ['basic avatars', 'limited analytics', 'community support'],
    description: 'Free tier with core QMOI capabilities.',
  },
  starter: {
    tier: 'starter',
    pricePerMonth: 9.99,
    features: ['advanced avatars', 'monthly reports', 'email support'],
    description: 'Starter tier for small teams and early adopters.',
  },
  professional: {
    tier: 'professional',
    pricePerMonth: 29.99,
    features: ['shared workspaces', 'real-time notifications', 'custom dashboards'],
    description: 'Professional tier for productive teams and power users.',
  },
  enterprise: {
    tier: 'enterprise',
    pricePerMonth: 99.99,
    features: ['dedicated support', 'SLA monitoring', 'custom integrations'],
    description: 'Enterprise tier for mission-critical organizations.',
  },
};

const subscriptionStore = new Map<string, SubscriptionRecord>();

function futureRenewal(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export function getAvailablePlans(): SubscriptionPlan[] {
  return Object.values(AVAILABLE_PLANS);
}

export function getSubscription(userId: string) {
  const existing = subscriptionStore.get(userId);
  if (existing) {
    return existing;
  }

  const defaultSubscription: SubscriptionRecord = {
    userId,
    tier: 'free',
    status: 'active',
    startedAt: new Date().toISOString(),
    renewsAt: futureRenewal(30),
  };

  subscriptionStore.set(userId, defaultSubscription);
  return defaultSubscription;
}

export async function updateSubscription(userId: string, tier: SubscriptionTier) {
  const plan = AVAILABLE_PLANS[tier] || AVAILABLE_PLANS.free;
  const record: SubscriptionRecord = {
    userId,
    tier: plan.tier,
    status: tier === 'free' ? 'active' : 'active',
    startedAt: new Date().toISOString(),
    renewsAt: futureRenewal(30),
  };

  subscriptionStore.set(userId, record);
  return record;
}

export async function cancelSubscription(userId: string) {
  const existing = subscriptionStore.get(userId);
  if (!existing) {
    return null;
  }

  const cancelled: SubscriptionRecord = {
    ...existing,
    status: 'cancelled',
    renewsAt: new Date().toISOString(),
  };

  subscriptionStore.set(userId, cancelled);
  return cancelled;
}
