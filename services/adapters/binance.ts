/**
 * Binance Exchange Adapter
 * Production implementation for autonomous trading on Binance
 */

import { createHmac } from 'crypto';

interface BinanceConfig {
  apiKey: string;
  apiSecret: string;
  testnet?: boolean;
}

interface OrderRequest {
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price?: number;
  type: 'MARKET' | 'LIMIT';
}

interface OrderResponse {
  orderId: string;
  clientOrderId: string;
  transactTime: number;
  status: 'NEW' | 'FILLED' | 'CANCELED';
  executedQty: number;
  cummulativeQuoteAssetTransacted: number;
}

export class BinanceAdapter {
  private baseUrl = 'https://api.binance.com';
  private testnetUrl = 'https://testnet.binance.vision';
  private config: BinanceConfig;

  constructor(config: BinanceConfig) {
    this.config = config;
    if (config.testnet) {
      this.baseUrl = this.testnetUrl;
    }
  }

  /**
   * Generate signature for Binance API request
   */
  private generateSignature(queryString: string): string {
    return createHmac('sha256', this.config.apiSecret)
      .update(queryString)
      .digest('hex');
  }

  /**
   * Get account information
   */
  async getAccountInfo(): Promise<any> {
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    const signature = this.generateSignature(queryString);

    const response = await fetch(`${this.baseUrl}/api/v3/account?${queryString}&signature=${signature}`, {
      headers: {
        'X-MBX-APIKEY': this.config.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get account info: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get account balances
   */
  async getBalances(): Promise<Map<string, number>> {
    const account = await this.getAccountInfo();
    const balances = new Map<string, number>();

    account.balances.forEach((balance: any) => {
      const free = parseFloat(balance.free);
      if (free > 0) {
        balances.set(balance.asset, free);
      }
    });

    return balances;
  }

  /**
   * Place market order
   */
  async placeMarketOrder(request: OrderRequest): Promise<OrderResponse> {
    if (request.type !== 'MARKET') {
      throw new Error('Use placeLimitOrder for limit orders');
    }

    const timestamp = Date.now();
    const params = {
      symbol: request.symbol,
      side: request.side,
      type: 'MARKET',
      quantity: request.quantity,
      timestamp,
    };

    const queryString = new URLSearchParams(params as any).toString();
    const signature = this.generateSignature(queryString);

    const response = await fetch(
      `${this.baseUrl}/api/v3/order?${queryString}&signature=${signature}`,
      {
        method: 'POST',
        headers: {
          'X-MBX-APIKEY': this.config.apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Order placement failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Place limit order
   */
  async placeLimitOrder(request: OrderRequest): Promise<OrderResponse> {
    if (request.type !== 'LIMIT' || !request.price) {
      throw new Error('Limit orders require price parameter');
    }

    const timestamp = Date.now();
    const params = {
      symbol: request.symbol,
      side: request.side,
      type: 'LIMIT',
      timeInForce: 'GTC',
      quantity: request.quantity,
      price: request.price,
      timestamp,
    };

    const queryString = new URLSearchParams(params as any).toString();
    const signature = this.generateSignature(queryString);

    const response = await fetch(
      `${this.baseUrl}/api/v3/order?${queryString}&signature=${signature}`,
      {
        method: 'POST',
        headers: {
          'X-MBX-APIKEY': this.config.apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Order placement failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Cancel order
   */
  async cancelOrder(symbol: string, orderId: string): Promise<any> {
    const timestamp = Date.now();
    const params = {
      symbol,
      orderId,
      timestamp,
    };

    const queryString = new URLSearchParams(params as any).toString();
    const signature = this.generateSignature(queryString);

    const response = await fetch(
      `${this.baseUrl}/api/v3/order?${queryString}&signature=${signature}`,
      {
        method: 'DELETE',
        headers: {
          'X-MBX-APIKEY': this.config.apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Order cancellation failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get order status
   */
  async getOrderStatus(symbol: string, orderId: string): Promise<any> {
    const timestamp = Date.now();
    const queryString = `symbol=${symbol}&orderId=${orderId}&timestamp=${timestamp}`;
    const signature = this.generateSignature(queryString);

    const response = await fetch(
      `${this.baseUrl}/api/v3/order?${queryString}&signature=${signature}`,
      {
        headers: {
          'X-MBX-APIKEY': this.config.apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get order status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get klines (candlestick data)
   */
  async getKlines(symbol: string, interval: string, limit: number = 100): Promise<any[]> {
    const response = await fetch(
      `${this.baseUrl}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Failed to get klines: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get current price
   */
  async getPrice(symbol: string): Promise<number> {
    const response = await fetch(`${this.baseUrl}/api/v3/ticker/price?symbol=${symbol}`);

    if (!response.ok) {
      throw new Error(`Failed to get price: ${response.status}`);
    }

    const data = await response.json();
    return parseFloat(data.price);
  }

  /**
   * Health check - test API connectivity
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v3/ping`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
