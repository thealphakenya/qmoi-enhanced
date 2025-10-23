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
