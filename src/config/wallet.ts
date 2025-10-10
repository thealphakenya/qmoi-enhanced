export interface WalletBalance {
  currency: string;
  balance: number;
  usdValue: number;
}

export interface WalletConfig {
  spot: {
    currency: string;
    balance: number;
  }[];
  futures: {
    currency: string;
    balance: number;
  }[];
  otc: {
    currency: string;
    balance: number;
  }[];
}

export class WalletManager {
  private static instance: WalletManager;
  private config: WalletConfig;
  private balances: WalletBalance[];

  private constructor() {
    this.config = {
      spot: [{ currency: "USDT", balance: 3.84 }],
      futures: [{ currency: "BTC", balance: 0.000009 }],
      otc: [{ currency: "BTC", balance: 0.000026 }],
    };
    this.balances = [];
  }

  public static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  public async updateBalances(): Promise<void> {
    try {
      const spotBalances = await Promise.all(
        this.config.spot.map(async (wallet) => ({
          currency: wallet.currency,
          balance: wallet.balance,
          usdValue:
            wallet.balance *
            (wallet.currency === "USDT"
              ? 1
              : await this.getUsdPrice(wallet.currency)),
        })),
      );

      const futuresBalances = await Promise.all(
        this.config.futures.map(async (wallet) => ({
          currency: wallet.currency,
          balance: wallet.balance,
          usdValue: wallet.balance * (await this.getUsdPrice(wallet.currency)),
        })),
      );

      const otcBalances = await Promise.all(
        this.config.otc.map(async (wallet) => ({
          currency: wallet.currency,
          balance: wallet.balance,
          usdValue: wallet.balance * (await this.getUsdPrice(wallet.currency)),
        })),
      );

      this.balances = [...spotBalances, ...futuresBalances, ...otcBalances];
    } catch (error) {
      console.error("Error updating wallet balances:", error);
      throw error;
    }
  }

  private async getUsdPrice(currency: string): Promise<number> {
    if (currency === "USDT") return 1;
    try {
      // Implement price fetching logic here
      return 0; // Placeholder
    } catch (error) {
      console.error(`Error fetching USD price for ${currency}:`, error);
      return 0;
    }
  }

  public async getBalances(): Promise<WalletBalance[]> {
    await this.updateBalances();
    return this.balances;
  }

  public getConfig(): WalletConfig {
    return this.config;
  }

  public async updateBalance(
    type: "spot" | "futures" | "otc",
    currency: string,
    balance: number,
  ): Promise<void> {
    const walletIndex = this.config[type].findIndex(
      (w) => w.currency === currency,
    );
    if (walletIndex !== -1) {
      this.config[type][walletIndex].balance = balance;
      await this.updateBalances();
    }
  }
}
