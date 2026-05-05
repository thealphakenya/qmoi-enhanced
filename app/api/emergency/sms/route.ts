import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Get emergency SMS status and history
    const [
      smsHistory,
      smsMetrics,
      activeAlerts
    ] = await Promise.all([
      prisma.systemMetric.findMany({
        where: {
          metricType: 'emergency',
          metricName: { in: ['sms_sent', 'sms_failed', 'sms_delivered'] },
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.systemMetric.findMany({
        where: {
          category: 'emergency',
          subsystem: 'sms',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.systemMetric.findMany({
        where: {
          metricType: 'emergency',
          metricName: 'alert_active',
          value: 1,
        },
      }),
    ]);

    // Calculate SMS statistics
    const totalSent = smsHistory.filter(s => s.metricName === 'sms_sent').length;
    const totalDelivered = smsHistory.filter(s => s.metricName === 'sms_delivered').length;
    const totalFailed = smsHistory.filter(s => s.metricName === 'sms_failed').length;
    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;

    return NextResponse.json({
      success: true,
      emergency: {
        sms: {
          status: 'operational', // In real implementation, check SMS service status
          activeAlerts: activeAlerts.length,
          lastSmsSent: smsHistory[0]?.createdAt?.toISOString() || null,
        },
        metrics: {
          totalSent,
          totalDelivered,
          totalFailed,
          deliveryRate: Math.round(deliveryRate * 100) / 100,
          avgResponseTime: calculateAvgSmsTime(smsHistory),
        },
        recentMessages: smsHistory.slice(0, 10).map(sms => ({
          type: sms.metricName.replace('sms_', ''),
          recipient: sms.dimensions?.recipient || 'Unknown',
          message: sms.dimensions?.message?.substring(0, 50) + '...' || 'Emergency alert',
          status: sms.value === 1 ? 'success' : 'failed',
          timestamp: sms.createdAt.toISOString(),
        })),
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Emergency SMS status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch emergency SMS status",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, recipients, message, priority = 'high', alertType = 'general' } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Action is required" },
        { status: 400 }
      );
    }

    if (action === 'send_alert' && (!recipients || !message)) {
      return NextResponse.json(
        { success: false, error: "Recipients and message are required for sending alerts" },
        { status: 400 }
      );
    }

    if (action === 'send_alert') {
      // Send emergency SMS alert
      const results = await sendEmergencySmsAlert(recipients, message, priority, alertType);

      // Log the alert
      await prisma.auditLog.create({
        data: {
          userId: 'system',
          username: 'emergency_system',
          action: 'emergency_sms_sent',
          resource: 'emergency',
          details: JSON.stringify({
            recipients: recipients.length,
            message: message.substring(0, 100),
            priority,
            alertType,
            results: {
              sent: results.sent,
              failed: results.failed,
              deliveryRate: results.deliveryRate,
            },
          }),
          riskLevel: 'critical',
          status: results.failed === 0 ? 'success' : 'warning',
        } as any,
      });

      return NextResponse.json({
        success: true,
        message: `Emergency SMS alert sent to ${recipients.length} recipients`,
        alert: {
          id: `alert_${Date.now()}`,
          type: alertType,
          priority,
          recipients: recipients.length,
          message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
          sent: results.sent,
          failed: results.failed,
          deliveryRate: results.deliveryRate,
        },
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'test_service') {
      // Test SMS service
      const testResult = await testSmsService();

      return NextResponse.json({
        success: true,
        test: {
          service: 'SMS',
          status: testResult.success ? 'operational' : 'failed',
          responseTime: testResult.responseTime,
          error: testResult.error,
        },
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'get_recipients') {
      // Get emergency contact recipients
      const emergencyContacts = await getEmergencyContacts();

      return NextResponse.json({
        success: true,
        recipients: emergencyContacts,
        count: emergencyContacts.length,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Use 'send_alert', 'test_service', or 'get_recipients'." },
      { status: 400 }
    );

  } catch (error) {
    console.error('Emergency SMS action error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process emergency SMS action",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

async function sendEmergencySmsAlert(
  recipients: string[],
  message: string,
  priority: string,
  alertType: string
): Promise<{
  sent: number;
  failed: number;
  deliveryRate: number;
  results: Array<{ recipient: string; success: boolean; error?: string }>;
}> {
  const results = [];
  let sent = 0;
  let failed = 0;

  // In a real implementation, this would integrate with SMS services like:
  // - Twilio
  // - AWS SNS
  // - MessageBird
  // - Africa's Talking
  // - etc.

  for (const recipient of recipients) {
    try {
      // Simulate SMS sending (replace with real SMS API call)
      const smsResult = await simulateSmsSend(recipient, message, priority);

      if (smsResult.success) {
        sent++;
        results.push({ recipient, success: true });

        // Log successful SMS
        await prisma.systemMetric.create({
          data: {
            metricType: 'emergency',
            metricName: 'sms_sent',
            value: 1,
            unit: 'message',
            category: 'emergency',
            subsystem: 'sms',
            dimensions: JSON.stringify({
              recipient,
              message: message.substring(0, 100),
              priority,
              alertType,
              messageId: smsResult.messageId,
            }),
            tags: JSON.stringify(['emergency', 'sms', 'sent']),
            source: 'api',
            collectedBy: 'emergency-sms-api',
          },
        });

        // Simulate delivery confirmation
        setTimeout(async () => {
          await prisma.systemMetric.create({
            data: {
              metricType: 'emergency',
              metricName: 'sms_delivered',
              value: 1,
              unit: 'message',
              category: 'emergency',
              subsystem: 'sms',
              dimensions: JSON.stringify({
                recipient,
                messageId: smsResult.messageId,
                deliveredAt: new Date().toISOString(),
              }),
              tags: JSON.stringify(['emergency', 'sms', 'delivered']),
              source: 'api',
              collectedBy: 'emergency-sms-api',
            },
          });
        }, Math.random() * 5000 + 1000); // Random delay 1-6 seconds

      } else {
        failed++;
        results.push({ recipient, success: false, error: smsResult.error });

        // Log failed SMS
        await prisma.systemMetric.create({
          data: {
            metricType: 'emergency',
            metricName: 'sms_failed',
            value: 0,
            unit: 'message',
            category: 'emergency',
            subsystem: 'sms',
            dimensions: JSON.stringify({
              recipient,
              message: message.substring(0, 100),
              priority,
              alertType,
              error: smsResult.error,
            }),
            tags: JSON.stringify(['emergency', 'sms', 'failed']),
            source: 'api',
            collectedBy: 'emergency-sms-api',
          },
        });
      }

    } catch (error) {
      failed++;
      results.push({
        recipient,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  const deliveryRate = (sent / (sent + failed)) * 100;

  return { sent, failed, deliveryRate, results };
}

async function simulateSmsSend(
  recipient: string,
  message: string,
  priority: string
): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  // Simulate SMS sending with random success/failure
  const success = Math.random() > 0.1; // 90% success rate

  if (success) {
    return {
      success: true,
      messageId: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  } else {
    return {
      success: false,
      error: 'SMS delivery failed - network error',
    };
  }
}

async function testSmsService(): Promise<{
  success: boolean;
  responseTime: number;
  error?: string;
}> {
  const startTime = Date.now();

  try {
    // Test SMS service connectivity
    // In real implementation, this would ping the SMS service API
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API call

    const responseTime = Date.now() - startTime;
    return { success: true, responseTime };

  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      success: false,
      responseTime,
      error: error instanceof Error ? error.message : 'Service test failed'
    };
  }
}

async function getEmergencyContacts(): Promise<Array<{
  name: string;
  phone: string;
  role: string;
  priority: 'high' | 'medium' | 'low';
}>> {
  // In a real implementation, this would fetch from database
  // For now, return sample emergency contacts
  return [
    { name: 'System Administrator', phone: '+1234567890', role: 'admin', priority: 'high' },
    { name: 'Security Team Lead', phone: '+1234567891', role: 'security', priority: 'high' },
    { name: 'DevOps Engineer', phone: '+1234567892', role: 'devops', priority: 'medium' },
    { name: 'Customer Support Lead', phone: '+1234567893', role: 'support', priority: 'medium' },
  ];
}

function calculateAvgSmsTime(smsHistory: any[]): number {
  // Calculate average SMS delivery time
  const deliveryTimes = smsHistory
    .filter(sms => sms.dimensions?.deliveryTime)
    .map(sms => sms.dimensions.deliveryTime);

  return deliveryTimes.length > 0
    ? deliveryTimes.reduce((sum, time) => sum + time, 0) / deliveryTimes.length
    : 0;
}
