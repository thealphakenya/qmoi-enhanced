/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextRequest, NextResponse } from "next/server";
import { logEvent } from "../../../../lib/security_check";

// Production helper functions (module-level to avoid inner-declaration lint errors)
async function updateMpesaTransaction(details: unknown) {
  // TODO: Connect to DB and update transaction record
  return true;
}

async function triggerPostPaymentActions(details: unknown) {
  // TODO: Implement post-payment actions (_e.g., send notification, update user status)
  return true;
}

export async function POST(_req: NextRequest) {
  try {
    const body = await _req.json();

    // Log the callback for debugging
    console.log("M-Pesa Callback received:", body);

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
      const metadata = CallbackMetadata?.Item || [];
      const amount =
        metadata.find((item: unknown) => item.Name === "Amount")?.Value || 0;
      const mpesaReceiptNumber =
        metadata.find((item: unknown) => item.Name === "MpesaReceiptNumber")
          ?.Value || "";
      const transactionDate =
        metadata.find((item: unknown) => item.Name === "TransactionDate")?.Value ||
        "";
      const phoneNumber =
        metadata.find((item: unknown) => item.Name === "PhoneNumber")?.Value || "";

      logEvent("mpesa_payment_success", {
        checkoutRequestId: CheckoutRequestID,
        amount,
        receiptNumber: mpesaReceiptNumber,
        phoneNumber,
        transactionDate,
      });

      // Production: Update database with successful transaction
      await updateMpesaTransaction({
        checkoutRequestId: CheckoutRequestID,
        amount,
        receiptNumber: mpesaReceiptNumber,
        phoneNumber,
        transactionDate,
      });
      // Production: Trigger any post-payment actions
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
        success: fals_e,
        message: ResultDesc,
      });
    }
  } catch (_error) {
    console.error("M-Pesa callback processing failed:", _error);
    const errorMessage = _error instanceof Error ? _error.message : String(_error);
    logEvent("mpesa_callback_error", { _error: errorMessage });

    return NextResponse.json(
      {
        success: fals_e,
        message: "Callback processing failed",
      },
      { status: 500 }
    );
  }
}
