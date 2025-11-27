// NetworkManager: Handles all device network connections, prioritization, and health monitoring
import { EventEmitter } from "events";

export type NetworkType =
  | "wifi"
  | "cellular"
  | "zero-rated"
  | "ethernet"
  | "unknown";
export interface Network {
  id: string;
  type: NetworkType;
  name: string;
  signalStrength: number;
  isConnected: boolean;
  isZeroRated?: boolean;
}

export interface PlatformNetworkAdapter {
  scanNetworks?: () => Promise<Network[]>;
  connectToNetwork?: (networkId: string) => Promise<boolean>;
}

export class NetworkManager extends EventEmitter {
  private networks: Network[] = [];
  private currentNetwork: Network | null = null;
  private adapter?: PlatformNetworkAdapter;
  private monitorInterval?: ReturnType<typeof setInterval>;

  constructor(adapter?: PlatformNetworkAdapter) {
    super();
    this.adapter = adapter;
    this.monitorConnection();
  }

  async scanNetworks(): Promise<Network[]> {
    // Prefer platform adapter if available
    if (this.adapter && typeof this.adapter.scanNetworks === "function") {
      try {
        this.networks = await this.adapter.scanNetworks();
        this.emit("networksUpdated", this.networks);
        return this.networks;
      } catch (err) {
        console.warn("Platform adapter scanNetworks failed:", err);
      }
    }

    // Fallback: Simulate scan
    // TODO: Integrate with platform-specific APIs to scan for networks
    this.networks = [
      {
        id: "wifi-1",
        type: "wifi",
        name: "Home WiFi",
        signalStrength: 80,
        isConnected: false,
      },
      {
        id: "cell-1",
        type: "cellular",
        name: "4G LTE",
        signalStrength: 60,
        isConnected: false,
      },
      {
        id: "zero-1",
        type: "zero-rated",
        name: "Zero Free",
        signalStrength: 50,
        isConnected: false,
        isZeroRated: true,
      },
    ];
    this.emit("networksUpdated", this.networks);
    return this.networks;
  }

  async connectBestNetwork(): Promise<Network | null> {
    await this.scanNetworks();
    // Prioritize: WiFi > Ethernet > Cellular > Zero-rated
    const sorted = this.networks.sort((a, b) => {
      const priority = (n: Network) =>
        n.type === "wifi"
          ? 4
          : n.type === "ethernet"
            ? 3
            : n.type === "cellular"
              ? 2
              : n.isZeroRated
                ? 1
                : 0;
      return priority(b) - priority(a) || b.signalStrength - a.signalStrength;
    });
    const best = sorted[0];
    if (best) {
      await this.connectToNetwork(best.id);
      this.currentNetwork = best;
      this.emit("connected", best);
      return best;
    }
    return null;
  }

  async connectToNetwork(networkId: string): Promise<boolean> {
    // Prefer platform adapter if available
    if (this.adapter && typeof this.adapter.connectToNetwork === "function") {
      try {
        const ok = await this.adapter.connectToNetwork(networkId);
        if (ok) {
          this.networks = this.networks.map((n) => ({ ...n, isConnected: n.id === networkId }));
          this.currentNetwork = this.networks.find((n) => n.id === networkId) || null;
          this.emit("connected", this.currentNetwork);
          return true;
        }
      } catch (err) {
        console.warn("Platform adapter connectToNetwork failed:", err);
      }
    }

    // Fallback: Simulate connection
    // TODO: Integrate with platform-specific APIs to connect
    this.networks = this.networks.map((n) => ({
      ...n,
      isConnected: n.id === networkId,
    }));
    this.currentNetwork = this.networks.find((n) => n.id === networkId) || null;
    this.emit("connected", this.currentNetwork);
    return true;
  }

  monitorConnection() {
    // Best-effort periodic monitor. For production, replace with platform-specific event-based monitoring.
    this.monitorInterval = setInterval(async () => {
      try {
        if (!this.currentNetwork || !this.currentNetwork.isConnected) {
          await this.connectBestNetwork();
        }
      } catch (err) {
        console.warn('Network monitor failed:', err);
      }
    }, 10000); // Check every 10s
  }

  // Stop background monitoring (useful for tests and graceful shutdown)
  public stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval as any);
      this.monitorInterval = undefined;
    }
  }

  async fallbackToZeroRated() {
    const zero = this.networks.find((n) => n.isZeroRated);
    if (zero) {
      await this.connectToNetwork(zero.id);
      this.emit("fallback", zero);
    }
  }

  exposeAPI() {
    // Expose methods for UI and master controls
    return {
      scanNetworks: this.scanNetworks.bind(this),
      connectBestNetwork: this.connectBestNetwork.bind(this),
      fallbackToZeroRated: this.fallbackToZeroRated.bind(this),
      getCurrentNetwork: () => this.currentNetwork,
      getNetworks: () => this.networks,
    };
  }
}
