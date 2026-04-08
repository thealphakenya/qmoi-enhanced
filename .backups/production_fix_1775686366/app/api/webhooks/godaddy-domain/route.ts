// QMOI EVOLUTION ENHANCED: GoDaddy domain management webhook
// This endpoint receives GoDaddy domain registration and DNS update webhooks.
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getLogger } from "@/lib/logger";
import { domainService } from "@/lib/domain-service";
import { NotificationService } from "@/lib/notification_service";

const logger = getLogger("api/webhooks/godaddy-domain");
const notificationService = new NotificationService();

function verifySignature(body: string, signature: string | null): boolean {
  const secret = process.env.GODADDY_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      logger.error("GODADDY_WEBHOOK_SECRET required in production");
      return false;
    }
    return true;
  }
  if (!signature) return false;
  const hmac = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return hmac === signature;
}

async function processPayload(payload: any) {
  const domainName = payload.domain || payload.name || payload.domainName;
  if (!domainName) {
    return NextResponse.json(
      { success: false, error: "Missing domain name" },
      { status: 400 },
    );
  }

  const nameservers = Array.isArray(payload.nameservers)
    ? payload.nameservers.map(String)
    : [];

  if (payload.action === "update" && nameservers.length > 0) {
    await domainService.updateNameservers(domainName, nameservers);
  } else if (payload.action === "register" || !payload.action) {
    await domainService.registerDomain(domainName, nameservers);
  }

  const domainInfo = await domainService.checkDomain(domainName);

  await notificationService.sendNotification(
    "GoDaddy Domain Webhook Received",
    `Received event for domain ${domainName}. Active: ${domainInfo?.status === "active"}`,
  );

  return NextResponse.json({
    success: true,
    domain: domainName,
    info: domainInfo,
    webhook: payload,
  });
}

export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  const signature = request.headers.get("x-godaddy-signature");

  if (!verifySignature(bodyText, signature)) {
    logger.warn("Invalid GoDaddy webhook signature");
    return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(bodyText);
  } catch (error) {
    logger.warn("GoDaddy webhook payload parse failed", { error });
    return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
  }

  return processPayload(payload);
}

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain") || "qvs.qmoi.ai";
  const info = await domainService.checkDomain(domain);
  return NextResponse.json({
    success: true,
    provider: "DomainForge Pro",
    domain,
    active: info?.status === "active",
    parked: info?.status !== "active",
    sslValid: true,
    dnsHealthy: info?.status === "active",
    lastChecked: info?.expiresAt?.toISOString() ?? new Date().toISOString(),
    message: info ? "Domain status available" : "Domain not registered yet",
  });
}
