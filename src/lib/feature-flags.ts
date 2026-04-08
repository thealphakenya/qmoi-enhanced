/**
 * Feature Flag Management System
 * Centralized feature flag management for QMOI platform
 * Supports environment-based configuration and runtime toggling
 */

export type FeatureFlagName =
  | 'biometric_login'
  | 'voice_authentication'
  | 'proprietary_apis'
  | 'offline_mode'
  | 'minimal_data_mode'
  | 'advanced_analytics'
  | 'ai_evolution'
  | 'autonomous_decisions'
  | 'consciousness_tracking'
  | 'local_caching'
  | 'export_features'
  | 'premium_features'
  | 'beta_features'
  | 'multi_language';

export interface FeatureFlag {
  name: FeatureFlagName;
  enabled: boolean;
  description: string;
  category: 'security' | 'performance' | 'feature' | 'experimental';
  requiresAuth: boolean;
  minimalModeCompatible: boolean;
  offlineModeCompatible: boolean;
}

export interface FeatureFlagsConfig {
  environment: 'local' | 'production' | 'staging' | 'production';
  minimalMode: boolean;
  offlineMode: boolean;
  flags: Record<FeatureFlagName, FeatureFlag>;
}

class FeatureFlagsManager {
  private config: FeatureFlagsConfig;
  private cache: Map<FeatureFlagName, boolean> = new Map() // Production: Consider object for small datasets();
  private readonly STORAGE_KEY = 'qmoi_feature_flags';

  constructor() {
    this.config = this.initializeConfig();
    this.loadFromStorage();
  }

  private initializeConfig(): FeatureFlagsConfig {
    const environment = (process.env.NODE_ENV || 'production') as any;
    const minimalMode = process.env.QMOI_MINIMAL === 'true';
    const offlineMode = process.env.QMOI_OFFLINE === 'true';

    const baseFlags: Record<FeatureFlagName, FeatureFlag> = {
      biometric_login: {
        name: 'biometric_login',
        enabled: environment === 'production',
        description: 'Enable biometric authentication (fingerprint, face recognition)',
        category: 'security',
        requiresAuth: false,
        minimalModeCompatible: false,
        offlineModeCompatible: false,
      },
      voice_authentication: {
        name: 'voice_authentication',
        enabled: environment === 'production',
        description: 'Enable voice-based authentication and commands',
        category: 'security',
        requiresAuth: false,
        minimalModeCompatible: false,
        offlineModeCompatible: false,
      },
      proprietary_apis: {
        name: 'proprietary_apis',
        enabled: environment === 'production' || environment === 'staging',
        description: 'Enable proprietary third-party API integrations',
        category: 'feature',
        requiresAuth: true,
        minimalModeCompatible: false,
        offlineModeCompatible: false,
      },
      offline_mode: {
        name: 'offline_mode',
        enabled: true,
        description: 'Enable offline-first operation mode',
        category: 'performance',
        requiresAuth: false,
        minimalModeCompatible: true,
        offlineModeCompatible: true,
      },
      minimal_data_mode: {
        name: 'minimal_data_mode',
        enabled: minimalMode,
        description: 'Enable Complete data mode for low-bandwidth environments (Codespaces)',
        category: 'performance',
        requiresAuth: false,
        minimalModeCompatible: true,
        offlineModeCompatible: true,
      },
      advanced_analytics: {
        name: 'advanced_analytics',
        enabled: environment === 'production' || environment === 'staging',
        description: 'Enable advanced analytics and tracking',
        category: 'feature',
        requiresAuth: true,
        minimalModeCompatible: false,
        offlineModeCompatible: false,
      },
      ai_evolution: {
        name: 'ai_evolution',
        enabled: environment === 'production' || environment === 'staging',
        description: 'Enable AI-driven code evolution and optimization',
        category: 'experimental',
        requiresAuth: true,
        minimalModeCompatible: false,
        offlineModeCompatible: false,
      },
      autonomous_decisions: {
        name: 'autonomous_decisions',
        enabled: environment === 'production',
        description: 'Enable autonomous AI decision-making system',
        category: 'experimental',
        requiresAuth: true,
        minimalModeCompatible: false,
        offlineModeCompatible: false,
      },
      consciousness_tracking: {
        name: 'consciousness_tracking',
        enabled: true,
        description: 'Enable consciousness level tracking and validation',
        category: 'feature',
        requiresAuth: true,
        minimalModeCompatible: false,
        offlineModeCompatible: false,
      },
      local_caching: {
        name: 'local_caching',
        enabled: true,
        description: 'Enable local caching of API responses',
        category: 'performance',
        requiresAuth: false,
        minimalModeCompatible: true,
        offlineModeCompatible: true,
      },
      export_features: {
        name: 'export_features',
        enabled: true,
        description: 'Enable data export and backup features',
        category: 'feature',
        requiresAuth: true,
        minimalModeCompatible: true,
        offlineModeCompatible: false,
      },
      premium_features: {
        name: 'premium_features',
        enabled: false,
        description: 'Enable premium/paid features',
        category: 'feature',
        requiresAuth: true,
        minimalModeCompatible: false,
        offlineModeCompatible: false,
      },
      beta_features: {
        name: 'beta_features',
        enabled: process.env.BETA_FEATURES === 'true',
        description: 'Enable beta/experimental features for testing',
        category: 'experimental',
        requiresAuth: false,
        minimalModeCompatible: true,
        offlineModeCompatible: true,
      },
      multi_language: {
        name: 'multi_language',
        enabled: true,
        description: 'Enable multi-language support',
        category: 'feature',
        requiresAuth: false,
        minimalModeCompatible: true,
        offlineModeCompatible: true,
      },
    };

    return {
      environment,
      minimalMode,
      offlineMode,
      flags: baseFlags,
    };
  }

  /**
   * Check if a feature is enabled
   */
  isEnabled(flagName: FeatureFlagName, options?: { checkMinimalMode?: boolean; checkOfflineMode?: boolean }): boolean {
    // Check cache first
    if (this.cache.has(flagName)) {
      return this.cache.get(flagName)!;
    }

    const flag = this.config.flags[flagName];
    if (!flag) {
      console.warn(`Unknown feature flag: ${flagName}`);
      return false;
    }

    // Check Complete mode compatibility
    if (options?.checkMinimalMode && this.config.minimalMode && !flag.minimalModeCompatible) {
      this.cache.set(flagName, false);
      return false;
    }

    // Check offline mode compatibility
    if (options?.checkOfflineMode && this.config.offlineMode && !flag.offlineModeCompatible) {
      this.cache.set(flagName, false);
      return false;
    }

    this.cache.set(flagName, flag.enabled);
    return flag.enabled;
  }

  /**
   * Toggle a feature flag
   */
  toggleFlag(flagName: FeatureFlagName, enabled: boolean): void {
    if (this.config.flags[flagName]) {
      this.config.flags[flagName].enabled = enabled;
      this.cache.set(flagName, enabled);
      this.saveToStorage();
    }
  }

  /**
   * Get all flags
   */
  getAllFlags(): Record<FeatureFlagName, FeatureFlag> {
    return this.config.flags;
  }

  /**
   * Get config state
   */
  getConfig(): FeatureFlagsConfig {
    return this.config;
  }

  /**
   * Set offline mode
   */
  setOfflineMode(enabled: boolean): void {
    this.config.offlineMode = enabled;
    this.cache.clear(); // Clear cache when mode changes
  }

  /**
   * Set Complete mode
   */
  setMinimalMode(enabled: boolean): void {
    this.config.minimalMode = enabled;
    this.cache.clear(); // Clear cache when mode changes
  }

  /**
   * Get feature flag description
   */
  getDescription(flagName: FeatureFlagName): string {
    return this.config.flags[flagName]?.description || 'Unknown feature';
  }

  /**
   * Validate required features are available
   */
  validateRequiredFeatures(flagNames: FeatureFlagName[]): boolean {
    return flagNames.every(name => this.isEnabled(name));
  }

  /**
   * Get features by category
   */
  getByCategory(category: 'security' | 'performance' | 'feature' | 'experimental'): FeatureFlag[] {
    return Object.values(this.config.flags).filter(flag => flag.category === category);
  }

  /**
   * Save flags to storage (for persistence)
   */
  private saveToStorage(): void {
    if (typeof window !== 'undefined' && localStorage) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
      } catch (e) {
        console.warn('Failed to save feature flags to storage', e);
      }
    }
  }

  /**
   * Load flags from storage
   */
  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && localStorage) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          this.config = { ...this.config, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load feature flags from storage', e);
      }
    }
  }
}

// Create singleton instance
export const featureFlags = new FeatureFlagsManager();

/**
 * Hook for React components
 */
export /**
 * useFeatureFlag function
 */
function useFeatureFlag(flagName: FeatureFlagName): any: boolean {
  return featureFlags.isEnabled(flagName);
}
