/**
 * production Revenue Validator API Integration
 * Provides type-safe client for revenue validation
 */

export interface RevenueValidationResponse {
  timestamp: string;
  daily_target: number;
  current_revenue: number;
  achievement_rate: number;
  status: string;
  actions_taken: string[];
  revenue_sources: Record<string, number>;
  predictions: {
    predicted_end_of_day: number;
    confidence: number;
    trend: string;
    recommendations: string[];
  };
  alerts: string[];
}

export interface SystemStatus {
  latest_validation?: RevenueValidationResponse;
  system_health: {
    overall_status: string;
    checks: Array<{
      component: string;
      status: string;
      error?: string;
    }>;
    last_check: string;
  };
  monitoring_stats: Record<string, any>;
  targets: Record<string, number>;
  thresholds: Record<string, number>;
}

/**
 * Revenue Validator API Client
 */
export class RevenueValidatorClient {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string = "/api/revenue", token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      ...(this.token && { "Authorization": `Bearer ${this.token}` })
    };
  }

  /**
   * Validate revenue against targets
   */
  async validate(): Promise<RevenueValidationResponse> {
    const res = await fetch(`${this.baseUrl}/validate`, {
      method: "GET",
      headers: this.getHeaders()
    });
    
    if (!res.ok) {
      throw new Error(`Validation failed: ${res.statusText}`);
    }
    
    return res.json();
  }

  /**
   * Get system status
   */
  async getStatus(): Promise<SystemStatus> {
    const res = await fetch(`${this.baseUrl}/status`, {
      method: "GET",
      headers: this.getHeaders()
    });
    
    if (!res.ok) {
      throw new Error(`Status check failed: ${res.statusText}`);
    }
    
    return res.json();
  }

  /**
   * Control monitoring
   */
  async setMonitoring(enabled: boolean): Promise<{ monitoring: boolean }> {
    const res = await fetch(`${this.baseUrl}/monitor`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ enabled })
    });
    
    if (!res.ok) {
      throw new Error(`Monitoring control failed: ${res.statusText}`);
    }
    
    return res.json();
  }

  /**
   * Get analytics
   */
  async getAnalytics(): Promise<Record<string, any>> {
    const res = await fetch(`${this.baseUrl}/analytics`, {
      method: "GET",
      headers: this.getHeaders()
    });
    
    if (!res.ok) {
      throw new Error(`Analytics fetch failed: ${res.statusText}`);
    }
    
    return res.json();
  }
}

// Singleton instance
export const revenueValidator = new RevenueValidatorClient();
