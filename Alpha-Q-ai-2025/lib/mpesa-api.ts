import axios from 'axios';
import crypto from 'crypto';

interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  shortcode: string;
  environment: 'sandbox' | 'production';
}

interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  reference: string;
  description: string;
}

interface TransactionStatus {
  transactionId: string;
  status: 'pending' | 'success' | 'failed';
  amount: number;
  phoneNumber: string;
  timestamp: string;
}

class MpesaAPI {
  private config: MpesaConfig;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: MpesaConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString('base64');
    
    try {
      const response = await axios.post(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {}, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get M-Pesa access token:', error);
      throw new Error('M-Pesa authentication failed');
    }
  }

  private generateTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  private generatePassword(): string {
    const timestamp = this.generateTimestamp();
    const password = Buffer.from(`${this.config.shortcode}${this.config.passkey}${timestamp}`).toString('base64');
    return password;
  }

  async initiateSTKPush(request: STKPushRequest): Promise<{ CheckoutRequestID: string; MerchantRequestID: string }> {
    const accessToken = await this.getAccessToken();
    const timestamp = this.generateTimestamp();
    const password = this.generatePassword();

    const payload = {
      BusinessShortCode: this.config.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(request.amount),
      PartyA: request.phoneNumber,
      PartyB: this.config.shortcode,
      PhoneNumber: request.phoneNumber,
      CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`,
      AccountReference: request.reference,
      TransactionDesc: request.description
    };

    try {
      const response = await axios.post(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        CheckoutRequestID: response.data.CheckoutRequestID,
        MerchantRequestID: response.data.MerchantRequestID
      };
    } catch (error) {
      console.error('STK Push failed:', error);
      throw new Error('Failed to initiate M-Pesa payment');
    }
  }

  async checkTransactionStatus(checkoutRequestId: string): Promise<TransactionStatus> {
    const accessToken = await this.getAccessToken();
    const timestamp = this.generateTimestamp();
    const password = this.generatePassword();

    const payload = {
      BusinessShortCode: this.config.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    };

    try {
      const response = await axios.post(`${this.baseUrl}/mpesa/stkpushquery/v1/query`, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const result = response.data.ResultCode;
      const resultDesc = response.data.ResultDesc;

      return {
        transactionId: response.data.MerchantRequestID,
        status: result === '0' ? 'success' : result === '1' ? 'pending' : 'failed',
        amount: response.data.Amount || 0,
        phoneNumber: response.data.PhoneNumber || '',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Transaction status check failed:', error);
      throw new Error('Failed to check transaction status');
    }
  }

  async reverseTransaction(transactionId: string, amount: number, phoneNumber: string): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    const timestamp = this.generateTimestamp();
    const password = this.generatePassword();

    const payload = {
      Initiator: process.env.MPESA_INITIATOR_NAME || 'QMOI',
      SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL || '',
      CommandID: 'TransactionReversal',
      TransactionID: transactionId,
      Amount: Math.round(amount),
      PartyA: this.config.shortcode,
      PartyB: phoneNumber,
      Remarks: 'QMOI transaction reversal',
      QueueTimeOutURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/timeout`,
      ResultURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/result`,
      Occasion: 'QMOI reversal'
    };

    try {
      const response = await axios.post(`${this.baseUrl}/mpesa/reversal/v1/request`, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.ResultCode === '0';
    } catch (error) {
      console.error('Transaction reversal failed:', error);
      return false;
    }
  }
}

// Initialize M-Pesa API with environment variables
export const mpesaAPI = new MpesaAPI({
  consumerKey: process.env.MPESA_CONSUMER_KEY || '',
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
  passkey: process.env.MPESA_PASSKEY || '',
  shortcode: process.env.MPESA_SHORTCODE || '',
  environment: (process.env.MPESA_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'
});

export { MpesaAPI, type STKPushRequest, type TransactionStatus }; 