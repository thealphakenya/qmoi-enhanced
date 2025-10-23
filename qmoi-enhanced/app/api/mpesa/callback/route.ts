// Lightweight ambient declarations to keep this route file portable in the monorepo
// and avoid adding a top-level @types/node dependency in this change.
declare const process: any;
import { NextRequest, NextResponse } from 'next/server';
import { logEvent } from '../../../../lib/security_check';
import paymentStoreV2 from '../../../../src/services/paymentStoreV2';

const LOG_DIR = path.resolve(process.cwd(), 'logs');
const MPESA_LOG = path.join(LOG_DIR, 'mpesa-transactions.log');

async function ensureLogDir() {
  try {
    const fs = await import('fs');
    const pathMod = await import('path');
    const dir = pathMod.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return dir;
  } catch (e) {
    console.warn('Failed to create log dir', (e as any)?.message || e);
    return null;
  }
}

async function appendJsonLine(filePath: string, obj: any) {
  try {
    const fs = await import('fs');
    const line = JSON.stringify(obj) + '\n';
    // use appendFile (async) to play nicely in serverless environments
    await fs.promises.appendFile(filePath, line, { encoding: 'utf8' });
  } catch (e) {
    console.error('Failed to append log', (e as any)?.message || e);
  }
}

async function triggerPostPaymentActions(details: any) {
  // Lightweight hooks: emit logs, call webhook if configured, or invoke in-memory handlers.
  logEvent('mpesa_post_actions_triggered', { checkoutRequestId: details.checkoutRequestId });

  // Example: optional webhook
  const webhook = process?.env?.MPESA_POST_PAYMENT_WEBHOOK;
  if (webhook) {
    try {
      // fire-and-forget
      fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      }).catch(err => console.warn('Post-payment webhook failed', err?.message || err));
    } catch (e) {
      console.warn('Failed to trigger post-payment webhook', (e as any)?.message || e);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Log the callback for debugging
    console.log('M-Pesa Callback received');

  // Persist raw callback (JSONL) for audit and reprocessing
  await ensureLogDir();
  await appendJsonLine(MPESA_LOG, { receivedAt: new Date().toISOString(), payload: body });

    // Defensive extraction - support different callback shapes
    const stkCallback = body?.Body?.stkCallback || body?.Body?.StkCallback || null;
    if (!stkCallback) {
      logEvent('mpesa_callback_unknown_shape', { bodySample: JSON.stringify(body).slice(0, 1000) });
      return NextResponse.json({ success: false, message: 'Unknown callback shape' }, { status: 400 });
    }

    const CheckoutRequestID = stkCallback.CheckoutRequestID || stkCallback.CheckoutRequestID;
    const ResultCode = String(stkCallback.ResultCode ?? stkCallback.ResultCode ?? '');
    const ResultDesc = stkCallback.ResultDesc || stkCallback.ResultDesc || '';
    const CallbackMetadata = stkCallback.CallbackMetadata || stkCallback.CallbackMetadata || null;

    if (ResultCode === '0' || ResultCode === '0') {
      // Payment successful
      const metadata = CallbackMetadata?.Item || CallbackMetadata?.item || [];
      const amount = metadata.find((item: any) => item.Name === 'Amount')?.Value || 0;
      const mpesaReceiptNumber = metadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value || '';
      const transactionDate = metadata.find((item: any) => item.Name === 'TransactionDate')?.Value || '';
      const phoneNumber = metadata.find((item: any) => item.Name === 'PhoneNumber')?.Value || '';

      const details = {
        checkoutRequestId: CheckoutRequestID,
        amount,
        receiptNumber: mpesaReceiptNumber,
        phoneNumber,
        transactionDate,
        raw: body
      };

      logEvent('mpesa_payment_success', details);

      // Persist a compact success record
      await appendJsonLine(MPESA_LOG, { type: 'success', processedAt: new Date().toISOString(), details });

      // Save transaction to paymentStore and reconcile
      try {
  await paymentStoreV2.appendMpesaTransactionV2({ receivedAt: new Date().toISOString(), details });
  // Attempt to find payment by CheckoutRequestID and mark completed
  const updated = await paymentStoreV2.updatePaymentV2(CheckoutRequestID, { status: 'completed', processedAt: Date.now(), result: { reference: CheckoutRequestID, raw: body } });
        if (updated) logEvent('mpesa_reconciled', { checkoutRequestId: CheckoutRequestID, paymentId: updated.id });
      } catch (e) {
        console.warn('Failed to persist/reconcile mpesa transaction', (e as any)?.message || e);
      }

      // Trigger lightweight post-payment actions (webhook, analytics, etc.)
      await triggerPostPaymentActions(details);

      return NextResponse.json({ success: true, message: 'Payment processed successfully' });
    } else {
      // Payment failed
      logEvent('mpesa_payment_failed', {
        checkoutRequestId: CheckoutRequestID,
        resultCode: ResultCode,
        resultDesc: ResultDesc
      });

      appendJsonLine(MPESA_LOG, { type: 'failure', processedAt: new Date().toISOString(), checkoutRequestId: CheckoutRequestID, resultCode: ResultCode, resultDesc: ResultDesc, raw: body });

      return NextResponse.json({ success: false, message: ResultDesc });
    }
  } catch (error) {
    console.error('M-Pesa callback processing failed:', error);
    logEvent('mpesa_callback_error', { error: (error as Error).message });

    return NextResponse.json({ success: false, message: 'Callback processing failed' }, { status: 500 });
  }
}