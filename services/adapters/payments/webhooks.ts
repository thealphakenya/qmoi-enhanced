import { verifyWebhookSignature } from './utils';

export function handlePaymentWebhook(payload: string | Buffer, signatureHeader: string | undefined, secret: string) {
  const valid = verifyWebhookSignature(payload, signatureHeader, secret);
  if (!valid) {
    throw new Error('Invalid webhook signature');
  }
  return { success: true };
}

export default { handlePaymentWebhook };
