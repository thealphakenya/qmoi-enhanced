import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";
import { authService } from "../../../../lib/auth/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Get user from auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = authService.decodeToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get emergency email history for the user
    const emergencyEmails = await prisma.auditLog.findMany({
      where: {
        userId: decoded.userId,
        action: 'emergency_email',
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        details: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Emergency email history retrieved",
      history: emergencyEmails.map(log => ({
        id: log.id,
        status: log.status,
        details: JSON.parse(log.details),
        sentAt: log.createdAt,
      })),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Emergency email GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch emergency email history",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get user from auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = authService.decodeToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      subject,
      message,
      recipients = [],
      priority = 'high',
      type = 'security_alert'
    } = body;

    // Validation
    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: "Subject and message are required" },
        { status: 400 }
      );
    }

    // Emergency email restrictions - only allow certain user roles
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true, email: true },
    });

    if (!user || !['admin', 'security', 'emergency'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions for emergency communications" },
        { status: 403 }
      );
    }

    // Default recipients if none specified
    const defaultRecipients = [
      'security@company.com',
      'admin@company.com',
      user.email, // Include sender
    ];

    const emailRecipients = recipients.length > 0 ? recipients : defaultRecipients;

    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    const emailResult = await sendEmergencyEmail({
      to: emailRecipients,
      subject: `[EMERGENCY] ${subject}`,
      message,
      priority,
      type,
      sender: user.email,
    });

    // Log the emergency email
    await prisma.auditLog.create({
      data: {
        userId: decoded.userId,
        username: user.email,
        action: 'emergency_email',
        resource: 'emergency',
        details: JSON.stringify({
          subject,
          message: message.substring(0, 200) + (message.length > 200 ? '...' : ''),
          recipients: emailRecipients,
          priority,
          type,
          emailResult,
          userAgent: req.headers.get('user-agent'),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        }),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        riskLevel: 'high',
        status: emailResult.success ? 'success' : 'failed',
      } as any,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send emergency email",
          details: emailResult.error
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Emergency email sent successfully",
      emailId: emailResult.emailId,
      recipients: emailRecipients,
      sentAt: new Date().toISOString(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Emergency email POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send emergency email",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

async function sendEmergencyEmail(params: {
  to: string[];
  subject: string;
  message: string;
  priority: string;
  type: string;
  sender: string;
}): Promise<{ success: boolean; emailId?: string; error?: string }> {
  try {
    // In production, integrate with email service provider
    // For now, simulate email sending

    if (!process.env.SMTP_HOST) {
      console.warn('SMTP not configured, simulating email send');
      return {
        success: true,
        emailId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
    }

    // Simulate email sending with delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Log email details for monitoring
    console.log('Emergency Email Sent:', {
      to: params.to,
      subject: params.subject,
      priority: params.priority,
      type: params.type,
      sender: params.sender,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      emailId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    };
  }
}
