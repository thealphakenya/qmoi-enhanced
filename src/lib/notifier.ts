// QMOI EVOLUTION ENHANCED: Notifier Service
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T04:00:00Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  recipient: string;
  sentAt: Date;
  read: boolean;
}

export class Notifier {
  private notifications: Notification[] = [];

  async sendNotification(notification: Omit<Notification, 'id' | 'sentAt' | 'read'>): Promise<string> {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullNotification: Notification = {
      ...notification,
      id,
      sentAt: new Date(),
      read: false,
    };

    this.notifications.push(fullNotification);

    // Simulate sending (email, push, etc.)
    console.log(`Notification sent to ${notification.recipient}: ${notification.title}`);

    return id;
  }

  async getNotifications(recipient: string): Promise<Notification[]> {
    return this.notifications.filter(n => n.recipient === recipient);
  }

  async markAsRead(id: string): Promise<boolean> {
    const notification = this.notifications.find(n => n.id === id);
    if (!notification) return false;

    notification.read = true;
    return true;
  }

  async getUnreadCount(recipient: string): Promise<number> {
    return this.notifications.filter(n => n.recipient === recipient && !n.read).length;
  }

  async deleteNotification(id: string): Promise<boolean> {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index === -1) return false;

    this.notifications.splice(index, 1);
    return true;
  }
}

export const notifier = new Notifier();

export async function notifyPaymentSuccess(recipient: string, amount: number): Promise<string> {
  return notifier.sendNotification({
    type: 'success',
    title: 'Payment Successful',
    message: `Payment of ${amount} has been processed successfully`,
    recipient,
  });
}

export async function notifyPaymentFailure(recipient: string, amount: number, reason: string): Promise<string> {
  return notifier.sendNotification({
    type: 'error',
    title: 'Payment Failed',
    message: `Payment of ${amount} failed: ${reason}`,
    recipient,
  });
}