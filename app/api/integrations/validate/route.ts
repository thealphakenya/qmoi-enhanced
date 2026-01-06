import { NextRequest, NextResponse } from "next/server";
import { isProductionConfirmed } from "../../../../lib/prodGuard";

/**
 * Validate configured credentials for a given provider.
 * Query param: provider=mpesa|pesapal|airtel|twilio|whatsapp_cloud
 * Returns: success boolean and minimal result/error
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const provider = (searchParams.get("provider") || "").toLowerCase();

  try {
    switch (provider) {
      case "mpesa": {
        const key = process.env.MPESA_CONSUMER_KEY;
        const secret = process.env.MPESA_CONSUMER_SECRET;
        if (!key || !secret)
          return NextResponse.json(
            { success: false, _error: "M-Pesa credentials missing" },
            { status: 400 }
          );
        // Conservative non-destructive check: call oauth endpoint to validate keys (no state changes)
        const oauthUrl =
          process.env.MPESA_OAUTH_URL ||
          (process.env.MPESA_ENVIRONMENT === "production"
            ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
            : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials");
        const res = await fetch(oauthUrl, {
          method: "GET",
          headers: {
            Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString(
              "base64"
            )}`,
          },
        });
        if (!res.ok) {
          const txt = await res.text();
          return NextResponse.json(
            {
              success: false,
              _error: `M-Pesa oauth error ${res.status}: ${txt}`,
            },
            { status: 502 }
          );
        }
        return NextResponse.json({ success: true, provider: "mpesa" });
      }

      case "pesapal": {
        const key = process.env.PESAPAL_CONSUMER_KEY;
        const secret = process.env.PESAPAL_CONSUMER_SECRET;
        if (!key || !secret)
          return NextResponse.json(
            { success: false, _error: "Pesapal credentials missing" },
            { status: 400 }
          );
        // Non-destructive connectivity check: call base API /api/ just to ensure reachable
        const base =
          process.env.PESAPAL_API_URL ||
          (process.env.PESAPAL_ENVIRONMENT === "production"
            ? "https://api.pesapal.com"
            : "https://sandbox.pesapal.com");
        const res = await fetch(`${base}/api`, {
          method: "GET",
          headers: { Authorization: `Bearer ${key}` },
        });
        if (res.status !== 200 && res.status !== 404) {
          const txt = await res.text();
          return NextResponse.json(
            {
              success: false,
              _error: `Pesapal connectivity error ${res.status}: ${txt}`,
            },
            { status: 502 }
          );
        }
        return NextResponse.json({ success: true, provider: "pesapal" });
      }

      case "airtel": {
        const cid = process.env.AIRTEL_CLIENT_ID;
        if (!cid)
          return NextResponse.json(
            { success: false, _error: "Airtel credentials missing" },
            { status: 400 }
          );
        // Test a simple GET to the merchant status endpoint
        const base =
          process.env.AIRTEL_API_URL || "https://openapiuat.airtel.africa";
        const res = await fetch(`${base}/merchant/v1/status`, {
          method: "GET",
          headers: { Authorization: `Bearer ${cid}` },
        });
        if (!res.ok) {
          const txt = await res.text();
          return NextResponse.json(
            {
              success: false,
              _error: `Airtel connectivity error ${res.status}: ${txt}`,
            },
            { status: 502 }
          );
        }
        return NextResponse.json({ success: true, provider: "airtel" });
      }

      case "twilio": {
        const sid = process.env.TWILIO_ACCOUNT_SID;
        const token = process.env.TWILIO_AUTH_TOKEN;
        if (!sid || !token)
          return NextResponse.json(
            { success: false, _error: "Twilio credentials missing" },
            { status: 400 }
          );
        // Try listing messages with pageSize=1 to verify credentials
        const res = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json?PageSize=1`,
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString(
                "base64"
              )}`,
            },
          }
        );
        if (!res.ok) {
          const txt = await res.text();
          return NextResponse.json(
            {
              success: false,
              _error: `Twilio connectivity error ${res.status}: ${txt}`,
            },
            { status: 502 }
          );
        }
        return NextResponse.json({ success: true, provider: "twilio" });
      }

      case "whatsapp_cloud": {
        const token = process.env.WHATSAPP_CLOUD_TOKEN;
        const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        if (!token || !phoneId)
          return NextResponse.json(
            { success: false, _error: "WhatsApp Cloud credentials missing" },
            { status: 400 }
          );
        const res = await fetch(
          `https://graph.facebook.com/v17.0/${phoneId}/messages?limit=1`,
          { method: "GET", headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          const txt = await res.text();
          return NextResponse.json(
            {
              success: false,
              _error: `WhatsApp Cloud connectivity error ${res.status}: ${txt}`,
            },
            { status: 502 }
          );
        }
        return NextResponse.json({ success: true, provider: "whatsapp_cloud" });
      }

      default:
        return NextResponse.json(
          { success: false, _error: "Unknown provider" },
          { status: 400 }
        );
    }
  } catch (_err) {
    const msg = _err instanceof Error ? _err.message : String(_err);
    return NextResponse.json({ success: false, _error: msg }, { status: 500 });
  }
}
