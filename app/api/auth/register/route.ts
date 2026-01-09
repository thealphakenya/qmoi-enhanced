import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = authService.validatePasswordStrength(
      body.password
    );
    if (!passwordValidation.isStrong) {
      return NextResponse.json(
        { error: "Password too weak", details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await userService.getByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Create user
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      role: "user",
    });

    // Create default wallet (USD)
    await walletService.create(user.id, "USD");

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id);

    // Send welcome email
    try {
      await emailService.sendTransactional(body.email, "welcome", {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
        },
        tokens,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
