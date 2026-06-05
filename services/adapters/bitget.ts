/**
 * Bitget Exchange Adapter
 * Production implementation for autonomous trading on Bitget
 */

import { createHmac } from 'crypto';

interface BitgetConfig {
  apiKey: string;
  apiSecret: string;
  passphrase: string;
  sandbox?: boolean;
}

interface OrderRequest {
  symbol: string;
  side: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  size: string;
  price?: string;
}

export class BitgetAdapter {
  private baseUrl = 'https://api.bitget.com';
  private sandboxUrl = 'https://api.bitget.com/api/spot/v1';
  private config: BitgetConfig;

  constructor(config: BitgetConfig) {
    this.config = config;
  }

  /**
   * Generate request signature
   */
  private generateSignature(
    timestamp: string,
    method: string,
    path: string,
    body: string = ''
  ): string {
    const message = timestamp + method + path + body;
    return createHmac('sha256', this.config.apiSecret)
      .update(message)
      .digest('base64');
  }

  /**
   * Make authenticated request
   */
  private async request(
    method: string,
    path: string,
    body?: any
  ): Promise<any> {
    const timestamp = Date.now().toString();
    const bodyString = body ? JSON.stringify(body) : '';
    const signature = this.generateSignature(timestamp, method, path, bodyString);

    const url = `${this.baseUrl}${path}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'ACCESS-KEY': this.config.apiKey,
        'ACCESS-SIGN': signature,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-PASSPHRASE': this.config.passphrase,
      },
      body: bodyString || undefined,
    });

    if (!response.ok) {
      throw new Error(`Bitget API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get account information
   */
  async getAccountInfo(): Promise<any> {
    return this.request('GET', '/api/spot/v1/account/getInfo');
  }

  /**
   * Get account balances
   */
  async getBalances(): Promise<Map<string, number>> {
    const response = await this.request('GET', '/api/spot/v1/account/getBalance');
    const balances = new Map<string, number>();

    if (response.data && Array.isArray(response.data)) {
      response.data.forEach((balance: any) => {
        const available = parseFloat(balance.available);
        if (available > 0) {
          balances.set(balance.coin, available);
        }
      });
    }

    return balances;
  }

  /**
   * Place order
   */
  async placeOrder(request: OrderRequest): Promise<any> {
    const body = {
      symbol: request.symbol,
      side: request.side,
      orderType: request.orderType,
      size: request.size,
      price: request.price,
    };

    return this.request('POST', '/api/spot/v1/trade/orders', body);
  }

  /**
   * Place market order
   */
  async placeMarketOrder(
    symbol: string,
    side: 'buy' | 'sell',
    size: string
  ): Promise<any> {
    return this.placeOrder({
      symbol,
      side,
      orderType: 'market',
      size,
    });
  }

  /**
   * Place limit order
   */
  async placeLimitOrder(
    symbol: string,
    side: 'buy' | 'sell',
    size: string,
    price: string
  ): Promise<any> {
    return this.placeOrder({
      symbol,
      side,
      orderType: 'limit',
      size,
      price,
    });
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string): Promise<any> {
    const body = { orderId };
    return this.request('POST', '/api/spot/v1/trade/cancel_order', body);
  }

  /**
   * Get order status
   */
  async getOrderStatus(orderId: string): Promise<any> {
    return this.request(
      'GET',
      `/api/spot/v1/trade/orderInfo?orderId=${orderId}`
    );
  }

  /**
   * Get market ticker
   */
  async getTicker(symbol: string): Promise<any> {
    return this.request('GET', `/api/spot/v1/market/ticker?symbol=${symbol}`);
  }

  /**
   * Get klines (candlestick data)
   */
  async getKlines(
    symbol: string,
    period: string,
    limit: number = 100
  ): Promise<any[]> {
    const response = await this.request(
      'GET',
      `/api/spot/v1/market/candles?symbol=${symbol}&period=${period}&limit=${limit}`
    );

    return response.data || [];
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.request('GET', '/api/spot/v1/public/time');
      return !!response.data;
    } catch {
      return false;
    }
  }
}
