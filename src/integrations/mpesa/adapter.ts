/* eslint-env node */
/* eslint-disable no-undef, @typescript-eslint/no-explicit-any */
// Note: we dynamically import 'node-fetch' inside methods to ensure Jest
// module mocks (hoisted by tests) are respected when tests run. Do not
// use a static top-level import here.
import { Buffer } from 'buffer';
import fetchWithRetry, { FetchResult } from '../../utils/fetchWithRetry';

export type MpesaConfig = {
  consumerKey: string;
  consumerSecret: string;
  passkey?: string;
  shortcode?: string;
  env?: 'sandbox' | 'production';
};

export class MpesaAdapter {
  config: MpesaConfig;
  // simple in-memory token cache to avoid repeated token requests during a
  // short-lived process (helps tests and reduces token churn)
  private _tokenCache: string | null = null;
  private _tokenExpiry = 0;

  constructor(config: MpesaConfig) {
    this.config = config;
  }

  // Obtain OAuth token (sandbox or prod depending on env)
  async getToken(): Promise<string> {
    // Return cached token when still valid (only if we previously cached with an expiry)
    if (this._tokenCache && Date.now() < this._tokenExpiry) {
      try { console.debug('MpesaAdapter.getToken - returning cached token'); } catch (e) { /* ignore */ }
      return this._tokenCache;
    }

    const auth = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString('base64');
    const url = this.config.env === 'production'
      ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

    // dynamic import so Jest's module mocking works with ESM/ts-jest
    try { console.debug('MpesaAdapter.getToken - calling fetchWithRetry'); } catch (e) { /* ignore */ }
    const tokenRes: FetchResult = await fetchWithRetry(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    }, 2, 200);

    if (!tokenRes || !tokenRes.ok) throw new Error(`Token request failed: ${tokenRes && tokenRes.status} ${tokenRes && tokenRes.text}`);
    const data = tokenRes.data;
    const token = data && (data.access_token || data.accessToken || data.token);
    // Only cache when the provider returns an expires_in value; this avoids
    // surprising test interactions where mocks don't include expiry.
    const expiresInRaw = data && (data.expires_in || data.expiresIn);
    if (expiresInRaw) {
      const expiresIn = Number(expiresInRaw) || 300;
      this._tokenCache = token;
      this._tokenExpiry = Date.now() + (expiresIn * 1000) - 1000; // small buffer
      try { console.debug('MpesaAdapter.getToken - cached token for', expiresIn, 'seconds'); } catch (e) { /* ignore */ }
    } else if (token) {
      // No explicit expiry provided by the mock/provider; cache briefly to
      // avoid duplicate token requests within the same process (helps tests).
      const defaultSecs = 30;
      this._tokenCache = token;
      this._tokenExpiry = Date.now() + (defaultSecs * 1000) - 1000;
      try { console.debug('MpesaAdapter.getToken - cached token with default expiry', defaultSecs, 'seconds'); } catch (e) { /* ignore */ }
    }
    return token;
  }

  // Example: send STK push request skeleton (returning API response)
  async sendStkPush(phoneNumber: string, amount: number, accountRef = 'QMOI'): Promise<any> {
    const token = await this.getToken();
    const url = this.config.env === 'production'
      ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const passkey = this.config.passkey || '';
    const shortcode = this.config.shortcode || '';
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: process.env.MPESA_CALLBACK_URL || process.env.MPESA_CALLBACK || 'https://example.com/api/mpesa/callback',
      AccountReference: accountRef,
      TransactionDesc: `QMOI payment`,
    };

    

    try { console.debug('MpesaAdapter.sendStkPush - calling fetchWithRetry POST'); } catch (e) { /* ignore */ }
    const stkRes = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }, 3, 300);

    if (!stkRes || !stkRes.ok) throw new Error(`STK Push failed: ${stkRes && stkRes.status} ${stkRes && stkRes.text}`);
    const data = stkRes.data;
    return data;
  }

  // Business to Customer (B2C) - send funds to customers
  async b2cPayment(phoneNumber: string, amount: number, remarks = 'Payout', occasion = ''): Promise<any> {
    const token = await this.getToken();
    const url = this.config.env === 'production'
      ? 'https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest'
      : 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest';

    const payload = {
      InitiatorName: process.env.MPESA_INITIATOR_NAME || 'testapi',
      SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL || '',
      CommandID: 'BusinessPayment',
      Amount: amount,
      PartyA: this.config.shortcode || process.env.MPESA_SHORTCODE,
      PartyB: phoneNumber,
      Remarks: remarks,
      QueueTimeOutURL: process.env.MPESA_B2C_TIMEOUT_URL || process.env.MPESA_CALLBACK_URL || 'https://example.com/mpesa/b2c/timeout',
      ResultURL: process.env.MPESA_B2C_RESULT_URL || process.env.MPESA_CALLBACK_URL || 'https://example.com/mpesa/b2c/result',
      Occasion: occasion,
    };

    

    try { console.debug('MpesaAdapter.b2cPayment - calling fetchWithRetry POST'); } catch (e) { /* ignore */ }
    const b2cRes = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }, 3, 300);

    if (!b2cRes || !b2cRes.ok) throw new Error(`B2C failed: ${b2cRes && b2cRes.status} ${b2cRes && b2cRes.text}`);
    const data = b2cRes.data;
    return data;
  }

  // Requery transaction status
  async requeryTransaction(transactionId: string): Promise<any> {
    const token = await this.getToken();
    const url = this.config.env === 'production'
      ? 'https://api.safaricom.co.ke/mpesa/transactionstatus/v1/query'
      : 'https://sandbox.safaricom.co.ke/mpesa/transactionstatus/v1/query';

    const payload = {
      Initiator: process.env.MPESA_INITIATOR_NAME || 'testapi',
      SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL || '',
      CommandID: 'TransactionStatusQuery',
      TransactionID: transactionId,
      PartyA: this.config.shortcode || process.env.MPESA_SHORTCODE,
      IdentifierType: '4',
      ResultURL: process.env.MPESA_REQUERY_RESULT_URL || process.env.MPESA_CALLBACK_URL || 'https://example.com/mpesa/requery/result',
      QueueTimeOutURL: process.env.MPESA_REQUERY_TIMEOUT_URL || process.env.MPESA_CALLBACK_URL || 'https://example.com/mpesa/requery/timeout',
      Remarks: 'requery',
    };

    

    try { console.debug('MpesaAdapter.requeryTransaction - calling fetchWithRetry POST'); } catch (e) { /* ignore */ }
    const rqRes = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }, 2, 200);

    if (!rqRes || !rqRes.ok) throw new Error(`Requery failed: ${rqRes && rqRes.status} ${rqRes && rqRes.text}`);
    const data = rqRes.data;
    return data;
  }

  // Reversal - request to reverse a transaction
  async reversal(transactionId: string, amount: number, remarks = 'Reversal'): Promise<any> {
    const token = await this.getToken();
    const url = this.config.env === 'production'
      ? 'https://api.safaricom.co.ke/mpesa/reversal/v1/request'
      : 'https://sandbox.safaricom.co.ke/mpesa/reversal/v1/request';

    const payload = {
      Initiator: process.env.MPESA_INITIATOR_NAME || 'testapi',
      SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL || '',
      CommandID: 'TransactionReversal',
      TransactionID: transactionId,
      Amount: amount,
      ReceiverParty: this.config.shortcode || process.env.MPESA_SHORTCODE,
      RecieverIdentifierType: '11',
      ResultURL: process.env.MPESA_REVERSAL_RESULT_URL || process.env.MPESA_CALLBACK_URL || 'https://example.com/mpesa/reversal/result',
      QueueTimeOutURL: process.env.MPESA_REVERSAL_TIMEOUT_URL || process.env.MPESA_CALLBACK_URL || 'https://example.com/mpesa/reversal/timeout',
      Remarks: remarks,
    };

    

    try { console.debug('MpesaAdapter.reversal - calling fetchWithRetry POST'); } catch (e) { /* ignore */ }
    const revRes = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }, 2, 200);

    if (!revRes || !revRes.ok) throw new Error(`Reversal failed: ${revRes && revRes.status} ${revRes && revRes.text}`);
    const data = revRes.data;
    return data;
  }
}

export default MpesaAdapter;
