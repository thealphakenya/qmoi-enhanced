import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/app.backup.20260121144720/api/auth/register/route.ts -->
import { NextRequest, NextResponse } from "next/server";
import { userService, walletService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { emailService } from "@/lib/email/service";

export async function POST(_request: NextRequest) {
  try {
    const body = (await _request.json()) as {
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { _error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!authService.validateEmail(body.email)) {
      return NextResponse.json(
        { _error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password strength. Support both boolean quick-check and
    // detailed validator used elsewhere in the codebase.
    let passwordValidationResult: { isStrong: boolean; errors: string[] };
    if (
      typeof (authService as any).validatePasswordStrengthDetailed ===
      "function"
    ) {
      passwordValidationResult = (
        authService as any
      ).validatePasswordStrengthDetailed(body.password);
    } else {
      const ok = authService.validatePasswordStrength(body.password);
      passwordValidationResult = { isStrong: Boolean(ok), errors: [] };
    }
    if (!passwordValidationResult.isStrong) {
      return NextResponse.json(
        {
          _error: "password too weak",
          details: passwordValidationResult.errors,
        },
        { status: 400 },
      );
    }

    // Basic pre-check for duplicates to provide clear status codes in tests
    const existing = await userService.getByEmail(body.email);
    if (existing) {
      console.warn("REGISTER: existing found for", body.email, existing);
      return NextResponse.json(
        { _error: "Email already exists" },
        { status: 409 },
      );
    }

    // Create user (may still throw unique constraint in race conditions)
    const passwordHash = await authService.hashPassword(body.password);
    const user = await userService.create({
      email: body.email,
      username: body.username,
      name: body.name,
      passwordHash,
      role: "user",
    });

    // Ensure we can surface createdAt (some services/clients expect it).
    let createdAt: string | undefined = (user as any).createdAt;
    try {
      const fresh = await userService.getByEmail(user.email);
      if (fresh && (fresh as any).createdAt)
        createdAt = (fresh as any).createdAt;
    } catch (_e) {
      void _e; /* ignore */
    }

    // Create default wallet (USD)
    await walletService.create({
      userId: user.id,
      address: `wallet_${user.id}`,
      balance: "0",
      network: "USD",
    });

    // Generate auth tokens
    const tokens = await authService.createAuthTokens(user.id, user.email);

    // Send welcome email
    try {
      // call with (template, to, data) to match existing test spies
      await emailService.sendTransactional("welcome", body.email, {
        name: body.name || body.username,
        email: body.email,
        confirmLink: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm?token=${tokens.accessToken}`,
        subject: "Welcome to QMOI Enhanced!",
      });
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // Don't fail the _request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          name: (user as any).name,
          createdAt: createdAt || new Date().toISOString(),
        },
        // Expose token fields at top-level for tests that expect them
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
      { status: 201 },
    );
  } catch (_error) {
    // Handle unique constraint errors from Prisma mock or generated client
    try {
      const msg = error && (error as any).message;
      const code = error && (error as any).code;
      if (
        code === "P2002" ||
        (typeof msg === "string" && msg.toLowerCase().includes("unique"))
      ) {
        return NextResponse.json(
          { _error: "Email already exists" },
          { status: 409 },
        );
      }
    } catch (_e) {
      void _e; /* ignore */
    }
    (globalThis.console as any)?.error?.("Registration _error:", _error);
    return NextResponse.json(
      { _error: "Internal server error" },
      { status: 500 },
    );
  }
}
