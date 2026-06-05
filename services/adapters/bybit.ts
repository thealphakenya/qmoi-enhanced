/**
 * Bybit Exchange Adapter
 * Production implementation for autonomous trading on Bybit
 */

import { createHmac } from 'crypto';

interface BybitConfig {
  apiKey: string;
  apiSecret: string;
  testnet?: boolean;
}

interface OrderRequest {
  symbol: string;
  side: 'Buy' | 'Sell';
  orderType: 'Market' | 'Limit';
  qty: string;
  price?: string;
}

export class BybitAdapter {
  private baseUrl = 'https://api.bybit.com';
  private testnetUrl = 'https://testnet.bybit.com';
  private config: BybitConfig;

  constructor(config: BybitConfig) {
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
    let message = '';

    if (method === 'GET') {
      message = timestamp + this.config.apiKey + '5000' + path;
    } else {
      message = timestamp + this.config.apiKey + '5000' + body;
    }

    return createHmac('sha256', this.config.apiSecret)
      .update(message)
      .digest('hex');
  }

  /**
   * Make authenticated request
   */
  private async request(
    method: string,
    path: string,
    body?: any
  ): Promise<any> {
    const url = this.config.testnet ? this.testnetUrl : this.baseUrl;
    const timestamp = Date.now().toString();
    const bodyString = body ? JSON.stringify(body) : '';
    const signature = this.generateSignature(timestamp, method, path, bodyString);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-BAPI-SIGN': signature,
      'X-BAPI-API-KEY': this.config.apiKey,
      'X-BAPI-TIMESTAMP': timestamp,
      'X-BAPI-RECV-WINDOW': '5000',
    };

    const response = await fetch(`${url}${path}`, {
      method,
      headers,
      body: bodyString || undefined,
    });

    if (!response.ok) {
      throw new Error(`Bybit API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get wallet balance
   */
  async getBalance(coin: string = 'USDT'): Promise<number> {
    const response = await this.request(
      'GET',
      `/v5/account/wallet-balance?accountType=UNIFIED&coin=${coin}`
    );

    if (response.result && response.result.list && response.result.list[0]) {
      const coins = response.result.list[0].coin;
      const usdtCoin = coins.find((c: any) => c.coin === coin);
      return parseFloat(usdtCoin?.walletBalance || '0');
    }

    return 0;
  }

  /**
   * Get account information
   */
  async getAccountInfo(): Promise<any> {
    return this.request('GET', '/v5/account/wallet-balance?accountType=UNIFIED');
  }

  /**
   * Get all balances
   */
  async getBalances(): Promise<Map<string, number>> {
    const response = await this.getAccountInfo();
    const balances = new Map<string, number>();

    if (response.result && response.result.list && response.result.list[0]) {
      const coins = response.result.list[0].coin;
      coins.forEach((coin: any) => {
        const balance = parseFloat(coin.walletBalance);
        if (balance > 0) {
          balances.set(coin.coin, balance);
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
      category: 'spot',
      symbol: request.symbol,
      side: request.side,
      orderType: request.orderType,
      qty: request.qty,
      price: request.price,
    };

    return this.request('POST', '/v5/order/create', body);
  }

  /**
   * Place market order
   */
  async placeMarketOrder(
    symbol: string,
    side: 'Buy' | 'Sell',
    qty: string
  ): Promise<any> {
    return this.placeOrder({
      symbol,
      side,
      orderType: 'Market',
      qty,
    });
  }

  /**
   * Place limit order
   */
  async placeLimitOrder(
    symbol: string,
    side: 'Buy' | 'Sell',
    qty: string,
    price: string
  ): Promise<any> {
    return this.placeOrder({
      symbol,
      side,
      orderType: 'Limit',
      qty,
      price,
    });
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, symbol: string): Promise<any> {
    const body = {
      category: 'spot',
      orderId,
      symbol,
    };

    return this.request('POST', '/v5/order/cancel', body);
  }

  /**
   * Get order status
   */
  async getOrderStatus(orderId: string, symbol: string): Promise<any> {
    return this.request(
      'GET',
      `/v5/order/realtime?category=spot&orderId=${orderId}&symbol=${symbol}`
    );
  }

  /**
   * Get market ticker
   */
  async getTicker(symbol: string): Promise<any> {
    const response = await this.request(
      'GET',
      `/v5/market/tickers?category=spot&symbol=${symbol}`
    );

    if (response.result && response.result.list && response.result.list[0]) {
      return response.result.list[0];
    }

    throw new Error(`No ticker data for ${symbol}`);
  }

  /**
   * Get klines (candlestick data)
   */
  async getKlines(
    symbol: string,
    interval: string,
    limit: number = 100
  ): Promise<any[]> {
    const response = await this.request(
      'GET',
      `/v5/market/kline?category=spot&symbol=${symbol}&interval=${interval}&limit=${limit}`
    );

    return response.result?.list || [];
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.request('GET', '/v5/market/time');
      return !!response.result;
    } catch {
      return false;
    }
  }
}
