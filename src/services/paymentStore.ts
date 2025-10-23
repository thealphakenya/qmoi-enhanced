import * as v2 from './paymentStoreV2';

// Compatibility wrapper: map old API to V2 implementations.
export async function savePayment(payment: unknown) {
  return v2.savePaymentV2(payment);
}

export async function updatePayment(id: string, updates: unknown) {
  return v2.updatePaymentV2(id, updates);
}

export async function findPaymentByReference(ref: string) {
  return v2.findPaymentByReferenceV2(ref);
}

export async function getPayments(filter?: Record<string, unknown>) {
  const arr = await v2.readPaymentsV2();
  if (!filter) return arr;
  return arr.filter((p: any) => {
    for (const k of Object.keys(filter)) {
      if ((p as any)[k] !== (filter as any)[k]) return false;
    }
    return true;
  });
}

export async function appendMpesaTransaction(tx: unknown) {
  return v2.appendMpesaTransactionV2(tx);
}

export default {
  savePayment,
  updatePayment,
  findPaymentByReference,
  getPayments,
  appendMpesaTransaction,
};
