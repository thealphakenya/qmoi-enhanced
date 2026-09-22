import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

interface AIHealthMetrics {
  cpu: {
    usage: number;
    temperature: number;
    cores: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    swap: {
      total: number;
      used: number;
      free: number;
    };
  };
  gpu?: {
    usage: number;
    temperature: number;
    memory: {
      total: number;
      used: number;
      free: number;
    };
  };
  disk: {
    total: number;
    used: number;
    free: number;
    iops: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
  };
}

interface AIComponentStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'critical';
  lastCheck: string;
  metrics: {
    latency: number;
    errorRate: number;
    requestsPerMinute: number;
  };
}

interface AIHealthStatus {
  overall: 'healthy' | 'degraded' | 'critical';
  timestamp: string;
  components: AIComponentStatus[];
  metrics: AIHealthMetrics;
  alerts: {
    level: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }[];
  licenseStatus: string;
  lintStatus: string;
  testStatus: string;
  deployStatus: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const detailed = searchParams.get('detailed') === 'true';

    // Mock health metrics - replace with actual system monitoring
    const mockMetrics: AIHealthMetrics = {
      cpu: {
        usage: 45.2,
        temperature: 65.3,
        cores: 8
      },
      memory: {
        total: 16384,
        used: 8192,
        free: 8192,
        swap: {
          total: 8192,
          used: 2048,
          free: 6144
        }
      },
      gpu: {
        usage: 32.1,
        temperature: 72.5,
        memory: {
          total: 8192,
          used: 4096,
          free: 4096
        }
      },
      disk: {
        total: 512000,
        used: 256000,
        free: 256000,
        iops: 1500
      },
      network: {
        bytesIn: 1024000,
        bytesOut: 512000,
        packetsIn: 1500,
        packetsOut: 750
      }
    };

    // License compliance check
    let licenseStatus = 'unknown';
    try {
      const licenseReport = JSON.parse(fs.readFileSync('license-report.json', 'utf-8'));
      const allowed = ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause'];
      const offenders = Object.entries(licenseReport).filter(([pkg, meta]: [string, any]) => meta.licenses && !allowed.includes(meta.licenses));
      licenseStatus = offenders.length === 0 ? 'compliant' : 'non-compliant';
    } catch (e) {
      licenseStatus = 'error';
    }

    // Lint/test status
    let lintStatus = 'unknown';
    let testStatus = 'unknown';
    try {
      const lintLog = fs.readFileSync('logs/lint-errors.json', 'utf-8');
      lintStatus = lintLog.includes('error') ? 'failed' : 'passed';
    } catch {}
    try {
      const testLog = fs.readFileSync('logs/auto-lint.log', 'utf-8');
      testStatus = testLog.includes('FAIL') ? 'failed' : 'passed';
    } catch {}

    // Deployment status
    let deployStatus = 'unknown';
    try {
      const deployLog = fs.readFileSync('logs/vercel_auto_deploy.log', 'utf-8');
      if (deployLog.includes('successful')) deployStatus = 'success';
      else if (deployLog.includes('failed')) deployStatus = 'failed';
    } catch {}

    // Mock component statuses - replace with actual component monitoring
    const mockComponents: AIComponentStatus[] = [
      {
        name: 'QMOI Model',
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        metrics: {
          latency: 150,
          errorRate: 0.1,
          requestsPerMinute: 120
        }
      },
      {
        name: 'Trading Engine',
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        metrics: {
          latency: 200,
          errorRate: 0.05,
          requestsPerMinute: 60
        }
      },
      {
        name: 'Media Generator',
        status: 'degraded',
        lastCheck: new Date().toISOString(),
        metrics: {
          latency: 5000,
          errorRate: 2.5,
          requestsPerMinute: 10
        }
      },
      {
        name: 'License Compliance',
        status: licenseStatus === 'compliant' ? 'healthy' : (licenseStatus === 'non-compliant' ? 'critical' : 'degraded'),
        lastCheck: new Date().toISOString(),
        metrics: {
          latency: 0,
          errorRate: licenseStatus === 'compliant' ? 0 : 1,
          requestsPerMinute: 0
        }
      },
      {
        name: 'Lint/Test',
        status: lintStatus === 'passed' && testStatus === 'passed' ? 'healthy' : 'degraded',
        lastCheck: new Date().toISOString(),
        metrics: {
          latency: 0,
          errorRate: lintStatus === 'passed' && testStatus === 'passed' ? 0 : 1,
          requestsPerMinute: 0
        }
      },
      {
        name: 'Deployment',
        status: deployStatus === 'success' ? 'healthy' : (deployStatus === 'failed' ? 'critical' : 'degraded'),
        lastCheck: new Date().toISOString(),
        metrics: {
          latency: 0,
          errorRate: deployStatus === 'success' ? 0 : 1,
          requestsPerMinute: 0
        }
      }
    ];

    // Mock alerts - replace with actual alert system
    const mockAlerts = [
      {
        level: 'warning' as const,
        message: 'Media Generator showing increased latency',
        timestamp: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
      },
      {
        level: 'info' as const,
        message: 'System backup completed successfully',
        timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      }
    ];

    const healthStatus: AIHealthStatus = {
      overall: mockComponents.some(c => c.status === 'critical') ? 'critical' :
               mockComponents.some(c => c.status === 'degraded') ? 'degraded' : 'healthy',
      timestamp: new Date().toISOString(),
      components: mockComponents,
      metrics: mockMetrics,
      alerts: mockAlerts,
      // Add new fields for compliance and deployment
      licenseStatus,
      lintStatus,
      testStatus,
      deployStatus
    };

    return NextResponse.json(healthStatus);
  } catch (error) {
    console.error('Error in AI health endpoint:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, component, settings } = body;

    if (action === 'check-component') {
      if (!component) {
        return NextResponse.json(
          { error: 'Component name is required' },
          { status: 400 }
        );
      }

      // Mock component check - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));

      return NextResponse.json({
        status: 'success',
        message: `Health check completed for ${component}`,
        result: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          metrics: {
            latency: 150,
            errorRate: 0.1,
            requestsPerMinute: 120
          }
        }
      });
    }

    if (action === 'update-settings') {
      if (!settings) {
        return NextResponse.json(
          { error: 'Settings are required' },
          { status: 400 }
        );
      }

      // Mock settings update - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 800));

      return NextResponse.json({
        status: 'success',
        message: 'Health monitoring settings updated',
        settings: {
          ...settings,
          lastUpdate: new Date().toISOString()
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid action specified' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in AI health action endpoint:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 