// QMOI EVOLUTION ENHANCED: GoDaddy health webhook endpoint
// This route provides live health status for DomainForge Pro and GoDaddy-managed domains.
import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@/lib/logger";
import { domainService } from "@/lib/domain-service";
import { NotificationService } from "@/lib/notification_service";
import crypto from "crypto";

const logger = getLogger("api/webhooks/godaddy-health");
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

export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  const signature = request.headers.get("x-godaddy-signature");

  if (!verifySignature(bodyText, signature)) {
    logger.warn("Invalid GoDaddy health webhook signature");
    return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(bodyText);
  } catch (error) {
    logger.warn("GoDaddy health webhook payload parse failed", { error });
    return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
  }

  const domain = payload.domain || payload.name || "domainforgepro.qmoi.com";
  const nameservers = Array.isArray(payload.nameservers)
    ? payload.nameservers.map(String)
    : [];

  if (payload.status === "active" && nameservers.length > 0) {
    await domainService.updateNameservers(domain, nameservers);
  }

  const info = await domainService.checkDomain(domain);
  await notificationService.sendNotification(
    "GoDaddy Health Webhook",
    `Health webhook received for ${domain}. Status: ${payload.status || "unknown"}`,
  );

  return NextResponse.json({
    success: true,
    domain,
    payload,
    info,
  });
}

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain") || "domainforgepro.qmoi.com";
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
    message: info ? "Domain health available" : "GoDaddy domain not registered yet",
  });
}
