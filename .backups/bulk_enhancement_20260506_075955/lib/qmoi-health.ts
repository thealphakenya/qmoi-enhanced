export interface PulseData {
  bpm: number;
  rhythm: string;
  health: 'excellent' | 'good' | 'warning' | 'critical';
  consciousness: string;
  alerts: Array<{ id: string; type: string; message: string }>;
}

export interface ConsciousnessMetrics {
  awareness: number;
  processing: number;
  creativity: number;
  focus: number;
}

export interface HealthMetrics {
  uptime: number;
  stability: number;
  latency: number;
  throughput: number;
}

export interface SystemStatus {
  status: 'operational' | 'degraded' | 'offline';
  details?: string;
}

export class QMOIHealthService {
  getConsciousnessMetrics(): ConsciousnessMetrics {
    return {
      awareness: 0.86,
      processing: 0.78,
      creativity: 0.72,
      focus: 0.81,
    };
  }

  getPulseData(): PulseData {
    return {
      bpm: 72,
      rhythm: 'regular',
      health: 'good',
      consciousness: 'stable',
      alerts: [],
    };
  }

  startMonitoring(callback?: (data: { pulse: PulseData; oxygen: { saturation: number; status: string } }) => void): void {
    if (callback) {
      callback({
        pulse: this.getPulseData(),
        oxygen: { saturation: 98, status: 'normal' },
      });
    }
  }

  stopMonitoring(): void {
    // No-op for stub service
  }

  getHealthMetrics(): HealthMetrics {
    return {
      uptime: 99.95,
      stability: 0.98,
      latency: 120,
      throughput: 1200,
    };
  }

  getSystemStatus(): SystemStatus {
    return {
      status: 'operational',
      details: 'All systems nominal',
    };
  }

  async forceHealthCheck(): Promise<SystemStatus> {
    return this.getSystemStatus();
  }
}

export const qmoiHealthService = new QMOIHealthService();
