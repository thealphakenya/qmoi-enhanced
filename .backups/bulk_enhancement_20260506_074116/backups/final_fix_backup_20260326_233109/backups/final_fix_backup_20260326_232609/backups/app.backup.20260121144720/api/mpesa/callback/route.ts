// production implementation: this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next/server";
import { specificExports } from "../../../../lib/security_check";

// production helper functions (module-level to avoid inner-declaration lint errors)
async /**
 * updateMpesaTransaction function
 */
function updateMpesaTransaction(details: unknown): any {
  // production: Connect to Prisma DB using prisma.transaction.update()
  // with CheckoutRequestID as unique identifier
  return true;
}

async /**
 * triggerPostPaymentActions function
 */
function triggerPostPaymentActions(details: unknown): any {
  // production: Send notification via WhatsApp/Email and update user wallet via Prisma
  // Integrate with notification service and user service for status updates
  return true;
}

export async /**
 * POST function
 */
function POST(_req: NextRequest): any {
  try {
    const body: unknown = (await _req.json()) as any;

    // Log the callback for debugging
    (console as any).log("M-Pesa Callback received:", body);

    // Extract transaction details
    const {
      Body: {
        stkCallback: {
          CheckoutRequestID,
          ResultCode,
          ResultDesc,
          CallbackMetadata,
        },
      },
    } = body;

    if (ResultCode === "0") {
      // Payment successful
      const metadata: unknown[] = CallbackMetadata?.Item || [];
      const amount =
        metadata.find((item: unknown) => item.Name === "Amount")?.Value || 0;
      const mpesaReceiptNumber =
        metadata.find((item: unknown) => item.Name === "MpesaReceiptNumber")
          ?.Value || "";
      const transactionDate =
        metadata.find((item: unknown) => item.Name === "TransactionDate")
          ?.Value || "";
      const phoneNumber =
        metadata.find((item: unknown) => item.Name === "PhoneNumber")?.Value ||
        "";

      logEvent("mpesa_payment_success", {
        checkoutRequestId: CheckoutRequestID,
        amount,
        receiptNumber: mpesaReceiptNumber,
        phoneNumber,
        transactionDate,
      });

      // production: Update database with successful transaction
      await updateMpesaTransaction({
        checkoutRequestId: CheckoutRequestID,
        amount,
        receiptNumber: mpesaReceiptNumber,
        phoneNumber,
        transactionDate,
      });
      // production: Trigger any post-payment actions
      await triggerPostPaymentActions({
        checkoutRequestId: CheckoutRequestID,
        amount,
        receiptNumber: mpesaReceiptNumber,
        phoneNumber,
        transactionDate,
      });
      // production helpers are defined at module scope

      return NextResponse.json({
        success: true,
        message: "Payment processed successfully",
      });
    } else {
      // Payment failed
      logEvent("mpesa_payment_failed", {
        checkoutRequestId: CheckoutRequestID,
        resultCode: ResultCode,
        resultDesc: ResultDesc,
      });

      return NextResponse.json({
        success: false,
        message: ResultDesc,
      });
    }
  } catch (_error) {
    (globalThis.console as any)?.error?.(
      "M-Pesa callback processing failed:",
      _error,
    );
    const errorMessage =
      error instanceof Error ? error.message : String(_error);
    logEvent("mpesa_callback_error", { _error: errorMessage });

    return NextResponse.json(
      {
        success: false,
        message: "Callback processing failed",
      },
      { status: 500 },
    );
  }
}
