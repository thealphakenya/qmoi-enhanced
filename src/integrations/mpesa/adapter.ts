import fetch from 'node-fetch';

export type MpesaConfig = {
  consumerKey: string;
  consumerSecret: string;
  passkey?: string;
  shortcode?: string;
  env?: 'sandbox' | 'production';
};

export class MpesaAdapter {
  config: MpesaConfig;

  constructor(config: MpesaConfig) {
    this.config = config;
  }

  // Obtain OAuth token (sandbox or prod depending on env)
  async getToken(): Promise<string> {
    const auth = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString('base64');
    const url = this.config.env === 'production'
      ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) throw new Error(`Token request failed: ${res.status}`);
    const data = await res.json();
    return data.access_token;
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

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    return data;
  }
}

export default MpesaAdapter;
