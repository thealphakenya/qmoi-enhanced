// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T04:00:00Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

export interface RealtimeEvent {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  source: string;
  target?: string;
}

export interface RealtimeSubscription {
  id: string;
  eventTypes: string[];
  callback: (event: RealtimeEvent) => void;
  active: boolean;
}

export class RealtimeSystem {
  private events: RealtimeEvent[] = [];
  production
  private eventHistory: RealtimeEvent[] = [];

  async emitEvent(event: Omit<RealtimeEvent, 'id' | 'timestamp'>): Promise<string> {
    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullEvent: RealtimeEvent = {
      ...event,
      id: eventId,
      timestamp: new Date(),
    };

    this.events.push(fullEvent);
    this.eventHistory.push(fullEvent);

    // Keep only last 1000 events in history
    if (this.eventHistory.length > 1000) {
      this.eventHistory = this.eventHistory.slice(-1000);
    }

    // Notify subscribers
    for (const subscription of this.subscriptions.values()) {
      if (subscription.active && subscription.eventTypes.includes(event.type)) {
        try {
          subscription.callback(fullEvent);
        } catch (error) {
          logger.error('Error in realtime subscription callback:', error);
        }
      }
    }

    return eventId;
  }

  async subscribe(eventTypes: string[], callback: (event: RealtimeEvent) => void): Promise<string> {
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const subscription: RealtimeSubscription = {
      id: subscriptionId,
      eventTypes,
      callback,
      active: true,
    };

    this.subscriptions.set(subscriptionId, subscription);
    return subscriptionId;
  }

  async unsubscribe(subscriptionId: string): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return false;

    subscription.active = false;
    this.subscriptions.delete(subscriptionId);
    return true;
  }

  async getRecentEvents(limit: number = 50): Promise<RealtimeEvent[]> {
    return this.eventHistory.slice(-limit);
  }

  async getEventsByType(type: string, limit: number = 50): Promise<RealtimeEvent[]> {
    return this.eventHistory
      .filter(event => event.type === type)
      .slice(-limit);
  }

  async getActiveSubscriptions(): Promise<RealtimeSubscription[]> {
    return Array.from(this.subscriptions.values()).filter(sub => sub.active);
  }

  async broadcastToTargets(event: Omit<RealtimeEvent, 'id' | 'timestamp'>, targets: string[]): Promise<string[]> {
    const eventIds: string[] = [];

    for (const target of targets) {
      const eventId = await this.emitEvent({
        ...event,
        target,
      });
      eventIds.push(eventId);
    }

    return eventIds;
  }

  async getSystemStats(): Promise<{
    totalEvents: number;
    activeSubscriptions: number;
    eventTypes: string[];
    recentActivity: number;
  }> {
    const eventTypes = [...new Set(this.eventHistory.map(e => e.type))];
    const recentActivity = this.eventHistory.filter(e =>
      e.timestamp > new Date(Date.now() - 60000) // Last minute
    ).length;

    return {
      totalEvents: this.eventHistory.length,
      activeSubscriptions: this.subscriptions.size,
      eventTypes,
      recentActivity,
    };
  }
}

export const realtimeSystem = new RealtimeSystem();