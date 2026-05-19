import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { authService } from "@/lib/auth/service";
import { log } from "@/lib/logger";
import crypto from 'crypto';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      acceptTerms = false,
      acceptPrivacy = false,
      acceptMarketing = false,
      referralCode,
      timezone,
      language = 'en',
    } = body;

    // Validation
    if (!email || !password || !username) {
      return NextResponse.json(
        { success: false, error: "Email, password, and username are required" },
        { status: 400 }
      );
    }

    if (!acceptTerms || !acceptPrivacy) {
      return NextResponse.json(
        { success: false, error: "You must accept the terms of service and privacy policy" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Username validation
    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { success: false, error: "Username must be between 3 and 30 characters" },
        { status: 400 }
      );
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { success: false, error: "Username can only contain letters, numbers, underscores, and hyphens" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "Email is already registered" },
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: "Username is already taken" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await authService.hashPassword(password);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        firstName: firstName || null,
        lastName: lastName || null,
        passwordHash,
        role: 'user',
        isActive: true,
        emailVerified: false,
        emailVerificationToken,
        emailVerificationExpires,
        twoFactorEnabled: false,
        profile: {
          create: {
            timezone: timezone || 'UTC',
            language,
            bio: null,
            avatar: null,
            website: null,
            location: null,
            company: null,
            jobTitle: null,
            socialLinks: JSON.stringify({}),
          },
        },
        consents: {
          create: {
            termsAccepted: true,
            termsAcceptedAt: new Date(),
            privacyAccepted: true,
            privacyAcceptedAt: new Date(),
            marketingAccepted: acceptMarketing,
            marketingAcceptedAt: acceptMarketing ? new Date() : null,
          },
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Create default wallet
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
        currency: 'USD',
        isPrimary: true,
      },
    });

    // Handle referral code if provided
    if (referralCode) {
      const referrer = await prisma.user.findFirst({
        where: {
          OR: [
            { referralCode },
            { id: referralCode },
          ],
        },
      });

      if (referrer) {
        // Create referral relationship
        await prisma.referral.create({
          data: {
            referrerId: referrer.id,
            referredId: user.id,
            code: referralCode,
            status: 'completed',
          },
        });

        // Award referral bonus
        if (referrer) {
          await prisma.auditLog.create({
            data: {
              userId: referrer.id,
              username: referrer.email,
              action: 'referral_bonus_awarded',
              resource: 'auth',
              details: JSON.stringify({
                referredUser: user.email,
                bonusAmount: 10,
                bonusType: 'welcome_credit',
              }),
              ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
              riskLevel: 'low',
              status: 'success',
            } as any,
          });
        }
      }
    }

    // Create main signup audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        username: user.email,
        action: 'user_signup',
        resource: 'auth',
        details: JSON.stringify({
          email,
          username,
          firstName,
          lastName,
          referralCode: referralCode || null,
          timezone,
          language,
          acceptMarketing,
          userAgent: req.headers.get('user-agent'),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        }),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        riskLevel: 'low',
        status: 'success',
      } as any,
    });

    // Send email verification using production email service
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          username: user.email,
          action: 'email_verification_sent',
          resource: 'auth',
          details: JSON.stringify({
            email,
            token: emailVerificationToken,
            timestamp: new Date().toISOString(),
          }),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          riskLevel: 'low',
          status: 'success',
        } as any,
      });

      await sendVerificationEmail(user.email, emailVerificationToken, user.username);
    } catch (emailError) {
      log.error('Failed to send verification email:', emailError as Error);
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please check your email to verify your account.",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
      nextSteps: [
        "Check your email for verification link",
        "Complete your profile setup",
        "Set up two-factor authentication (recommended)",
        "Create your first wallet",
      ],
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    log.error('Signup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Account creation failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

async function sendVerificationEmail(email: string, token: string, username: string) {
  const fromAddress = process.env.SENDGRID_VERIFICATION_FROM;
  const apiKey = process.env.SENDGRID_API_KEY;
  const verificationUrl = `${process.env.APP_BASE_URL || 'https://qmoi-enhanced.com'}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  if (!apiKey || !fromAddress) {
    log.warn('Verification email not sent because SendGrid is not configured', {
      email,
      sendGridConfigured: Boolean(apiKey && fromAddress),
    });
    return;
  }

  const payload = {
    personalizations: [{
      to: [{ email }],
      subject: 'Verify your QMOI account',
    }],
    from: { email: fromAddress, name: 'QMOI Authentication' },
    content: [
      {
        type: 'text/html',
        value: `<p>Hi ${username || 'User'},</p><p>Please verify your email address by clicking the link below:</p><p><a href="${verificationUrl}">Verify Email</a></p><p>If you did not create an account, ignore this message.</p>`,
      },
    ],
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendGrid email send failed: ${response.status} ${errorText}`);
  }

  log.info('Verification email queued via SendGrid', { email });
}

export async function GET(req: NextRequest) {
  // Return signup requirements and validation rules
  return NextResponse.json({
    success: true,
    message: "Signup requirements retrieved",
    requirements: {
      email: {
        required: true,
        format: "Valid email address",
        unique: true,
      },
      password: {
        required: true,
        minLength: 8,
        description: "At least 8 characters",
      },
      username: {
        required: true,
        minLength: 3,
        maxLength: 30,
        pattern: "^[a-zA-Z0-9_-]+$",
        unique: true,
        description: "Letters, numbers, underscores, and hyphens only",
      },
      firstName: {
        required: false,
        maxLength: 50,
      },
      lastName: {
        required: false,
        maxLength: 50,
      },
      consents: {
        terms: {
          required: true,
          description: "Terms of Service",
        },
        privacy: {
          required: true,
          description: "Privacy Policy",
        },
        marketing: {
          required: false,
          description: "Marketing communications",
        },
      },
      optional: {
        referralCode: "Referral code for bonuses",
        timezone: "User timezone (defaults to UTC)",
        language: "Preferred language (defaults to English)",
      },
    },
    timestamp: new Date().toISOString()
  });
}
