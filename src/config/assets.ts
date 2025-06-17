export interface Asset {
  type: 'spot' | 'futures' | 'otc';
  currency: string;
  balance: number;
  usdValue: number;
  lastUpdated: Date;
}

export interface AssetManager {
  getAssets(): Promise<Asset[]>;
  getAssetBalance(type: Asset['type'], currency: string): Promise<number>;
  getTotalBalance(): Promise<number>;
  updateAsset(type: Asset['type'], currency: string, balance: number): Promise<void>;
  convertToUSD(amount: number, currency: string): Promise<number>;
}

export class AssetManagerImpl implements AssetManager {
  private static instance: AssetManagerImpl;
  private assets: Map<string, Asset>;

  private constructor() {
    this.assets = new Map();
    this.initializeAssets();
  }

  public static getInstance(): AssetManagerImpl {
    if (!AssetManagerImpl.instance) {
      AssetManagerImpl.instance = new AssetManagerImpl();
    }
    return AssetManagerImpl.instance;
  }

  private initializeAssets() {
    // Initialize with current balances
    this.assets.set('spot_usdt', {
      type: 'spot',
      currency: 'USDT',
      balance: 3.84,
      usdValue: 3.84,
      lastUpdated: new Date(),
    });

    this.assets.set('futures_btc', {
      type: 'futures',
      currency: 'BTC',
      balance: 0.000009,
      usdValue: 1,
      lastUpdated: new Date(),
    });

    this.assets.set('otc_btc', {
      type: 'otc',
      currency: 'BTC',
      balance: 0.000026,
      usdValue: 2.84,
      lastUpdated: new Date(),
    });
  }

  public async getAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values());
  }

  public async getAssetBalance(type: Asset['type'], currency: string): Promise<number> {
    const key = `${type}_${currency.toLowerCase()}`;
    const asset = this.assets.get(key);
    return asset?.balance || 0;
  }

  public async getTotalBalance(): Promise<number> {
    const assets = await this.getAssets();
    return assets.reduce((total, asset) => total + asset.usdValue, 0);
  }

  public async updateAsset(type: Asset['type'], currency: string, balance: number): Promise<void> {
    const key = `${type}_${currency.toLowerCase()}`;
    const usdValue = await this.convertToUSD(balance, currency);
    
    this.assets.set(key, {
      type,
      currency,
      balance,
      usdValue,
      lastUpdated: new Date(),
    });
  }

  public async convertToUSD(amount: number, currency: string): Promise<number> {
    // In a real implementation, this would fetch current exchange rates
    const rates: Record<string, number> = {
      'USDT': 1,
      'BTC': 50000, // Example BTC price
    };
    
    return amount * (rates[currency] || 0);
  }

  public async optimizeAssetAllocation(): Promise<void> {
    const assets = await this.getAssets();
    const totalBalance = await this.getTotalBalance();

    // Example optimization strategy:
    // 1. Keep 20% in USDT for quick trading
    // 2. Allocate 40% to futures for leveraged positions
    // 3. Keep 40% in OTC for stable long-term holdings

    const targetAllocations = {
      spot: 0.2,
      futures: 0.4,
      otc: 0.4,
    };

    for (const [type, allocation] of Object.entries(targetAllocations)) {
      const targetAmount = totalBalance * allocation;
      const currentAmount = assets
        .filter(a => a.type === type)
        .reduce((sum, a) => sum + a.usdValue, 0);

      if (Math.abs(targetAmount - currentAmount) > 1) { // 1 USD threshold
        // Implement rebalancing logic here
        console.log(`Rebalancing ${type} from ${currentAmount} to ${targetAmount}`);
      }
    }
  }

  public async getProfitOpportunities(): Promise<{
    type: string;
    opportunity: string;
    potentialProfit: number;
    risk: 'low' | 'medium' | 'high';
  }[]> {
    const opportunities = [];

    // Example opportunities based on current assets
    const spotBalance = await this.getAssetBalance('spot', 'USDT');
    if (spotBalance > 1) {
      opportunities.push({
        type: 'spot',
        opportunity: 'USDT to BTC conversion',
        potentialProfit: spotBalance * 0.02, // 2% potential profit
        risk: 'low',
      });
    }

    const futuresBalance = await this.getAssetBalance('futures', 'BTC');
    if (futuresBalance > 0) {
      opportunities.push({
        type: 'futures',
        opportunity: 'BTC futures leverage',
        potentialProfit: futuresBalance * 50000 * 0.05, // 5% potential profit
        risk: 'high',
      });
    }

    return opportunities;
  }
} 