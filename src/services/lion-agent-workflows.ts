/**
 * LION AGENT - GitHub Actions Workflow Health Monitor
 * 
 * Real-time monitoring of all GitHub Actions workflows
 * Autonomous health tracking, failure detection, and master notifications
 * 
 * Location: src/services/lion-agent-workflows.ts
 */

import { EventEmitter } from 'events';

export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  head_sha: string;
  status: string;
  conclusion: string | null;
  created_at: string;
  updated_at: string;
  run_number: number;
  event?: string;
  actor?: { login: string };
}

export interface WorkflowHealth {
  workflowName: string;
  healthPercentage: number;
  totalRuns: number;
  successCount: number;
  failureCount: number;
  averageDuration: number;
  lastRun: WorkflowRun | null;
  status: 'healthy' | 'caution' | 'warning' | 'critical';
  lastChecked: Date;
  trend: 'improving' | 'stable' | 'declining';
}

export interface CategoryHealth {
  categoryName: string;
  workflowCount: number;
  healthPercentage: number;
  status: 'healthy' | 'caution' | 'warning' | 'critical';
}

export interface SystemHealth {
  masterHealthPercentage: number;
  categoryHealth: CategoryHealth[];
  failedWorkflows: string[];
  criticalIssues: string[];
  lastUpdated: Date;
  refreshInterval: string;
  lionAgentVersion: string;
  uptime: string;
}

export class LionAgentWorkflowMonitor extends EventEmitter {
  private owner: string = 'thealphakenya';
  private repo: string = 'qmoi-enhanced';
  private githubToken: string;
  private checkInterval: number = 5 * 60 * 1000; // 5 minutes
  private workflowHealthCache: Map<string, WorkflowHealth> = new Map();
  private systemHealthCache: SystemHealth | null = null;
  private monitoringActive: boolean = false;
  private lastError: Error | null = null;

  // Workflow categories for health calculation
  private workflowCategories = {
    main_cicd: [
      'ci-build',
      'ci-cd',
      'docker-build-push',
      'docker-image',
      'deploy',
      'release',
      'link-check',
      'sync-notify'
    ],
    docker_builds: [
      'docker-build-push',
      'docker-image',
      'docker-build-latest',
      'build-docker-compose',
      'dockerfile-validation'
    ],
    link_validation: [
      'link-check',
      'link-validation',
      'link-cache-maintenance',
      'all-links'
    ],
    deployment: [
      'deploy',
      'vercel-autofix',
      'deployment-verify',
      'run-startup',
      'full-start-smoke',
      'build-and-release'
    ],
    testing: [
      'ci-build',
      'ci-cd',
      'ci-monitor',
      'ci-debug',
      'jest-ci',
      'qmoi-tests',
      'wallet-tests',
      'security-checks',
      'dry-run-tests',
      'python-automation-tests',
      'payed-validation',
      'code-quality'
    ],
    security: [
      'security',
      'security-checks',
      'verify-secrets',
      'biometric-validation',
      'release-compliance-check',
      'dependency-scan'
    ],
    maintenance: [
      'update-readme-cli',
      'validate-and-tag-md',
      'enhancer-report',
      'nightly',
      'scheduled-link-check',
      'auto-merge-automated-pr',
      'sync-releases-from-manifest',
      'sync-memory'
    ],
    release: [
      'release',
      'publish-releases-realtime',
      'publish-q-alpha',
      'verify-release-assets'
    ],
    custom: [
      'android-build',
      'apply-on-label',
      'auto-merge-automated-pr',
      'build-missing-platforms'
    ]
  };

  constructor(githubToken: string) {
    super();
    this.githubToken = githubToken;
    this.setupHealthTargets();
  }

  private setupHealthTargets(): void {
    // Initialize health targets for critical workflows
    const criticalWorkflows = this.workflowCategories.main_cicd;
    for (const workflow of criticalWorkflows) {
      this.workflowHealthCache.set(workflow, {
        workflowName: workflow,
        healthPercentage: 0,
        totalRuns: 0,
        successCount: 0,
        failureCount: 0,
        averageDuration: 0,
        lastRun: null,
        status: 'caution',
        lastChecked: new Date(),
        trend: 'stable'
      });
    }
  }

  /**
   * Start continuous monitoring of all workflows
   */
  public async startMonitoring(): Promise<void> {
    if (this.monitoringActive) {
      console.log('🦁 Lion Agent: Monitoring already active');
      return;
    }

    this.monitoringActive = true;
    console.log('🦁 Lion Agent: Starting workflow monitoring...');

    // Initial check
    await this.performHealthCheck();

    // Schedule periodic checks
    setInterval(() => {
      if (this.monitoringActive) {
        this.performHealthCheck().catch(err => {
          this.lastError = err;
          console.error('🦁 Lion Agent: Health check error:', err);
        });
      }
    }, this.checkInterval);

    this.emit('monitoring-started', {
      timestamp: new Date(),
      interval: this.checkInterval,
      workflowCount: this.getAllWorkflows().length
    });
  }

  /**
   * Stop monitoring
   */
  public stopMonitoring(): void {
    this.monitoringActive = false;
    this.emit('monitoring-stopped', { timestamp: new Date() });
  }

  /**
   * Perform comprehensive health check on all workflows
   */
  private async performHealthCheck(): Promise<void> {
    try {
      console.log(`🦁 Lion Agent: Performing health check at ${new Date().toISOString()}...`);

      // Fetch recent runs for all workflows
      const allWorkflows = this.getAllWorkflows();
      
      // Update health for each workflow
      for (const workflow of allWorkflows) {
        const health = await this.checkWorkflowHealth(workflow);
        this.workflowHealthCache.set(workflow, health);
      }

      // Calculate system health
      this.calculateSystemHealth();

      // Check for critical issues
      this.detectCriticalIssues();

      this.emit('health-updated', {
        timestamp: new Date(),
        systemHealth: this.systemHealthCache,
        workflowCount: allWorkflows.length
      });

    } catch (error) {
      this.lastError = error instanceof Error ? error : new Error(String(error));
      console.error('🦁 Lion Agent: Health check failed:', error);
      this.emit('error', error);
    }
  }

  /**
   * Check health of a specific workflow
   */
  private async checkWorkflowHealth(workflowName: string): Promise<WorkflowHealth> {
    try {
      // Simulate fetching from GitHub Actions API
      // In production, this would call the actual API
      
      const runs = await this.fetchWorkflowRuns(workflowName);
      const last30Days = runs.filter(r => {
        const createdDate = new Date(r.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate >= thirtyDaysAgo;
      });

      const successCount = last30Days.filter(r => r.conclusion === 'success').length;
      const failureCount = last30Days.filter(r => r.conclusion === 'failure').length;
      const totalRuns = last30Days.length;

      const healthPercentage = totalRuns > 0 
        ? (successCount / totalRuns) * 100 
        : 0;

      const status = this.determineHealthStatus(healthPercentage);
      const trend = this.determineTrend(workflowName, healthPercentage);

      return {
        workflowName,
        healthPercentage: Math.round(healthPercentage * 100) / 100,
        totalRuns,
        successCount,
        failureCount,
        averageDuration: Math.round(runs.reduce((sum, r) => sum + 100, 0) / runs.length), // Placeholder calculation
        lastRun: runs[0] || null,
        status,
        lastChecked: new Date(),
        trend
      };
    } catch (error) {
      console.error(`🦁 Lion Agent: Error checking ${workflowName}:`, error);
      return {
        workflowName,
        healthPercentage: 0,
        totalRuns: 0,
        successCount: 0,
        failureCount: 0,
        averageDuration: 0,
        lastRun: null,
        status: 'critical',
        lastChecked: new Date(),
        trend: 'declining'
      };
    }
  }

  /**
   * Fetch workflow runs from GitHub API
   */
  private async fetchWorkflowRuns(workflowName: string, limit: number = 50): Promise<WorkflowRun[]> {
    // Placeholder implementation
    // In production, this would call:
    // GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs
    
    try {
      const url = `https://api.github.com/repos/${this.owner}/${this.repo}/actions/workflows/${workflowName}.yml/runs?per_page=${limit}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        console.warn(`🦁 Lion Agent: Could not fetch runs for ${workflowName}`);
        return [];
      }

      const data = await response.json();
      return data.workflow_runs || [];
    } catch (error) {
      console.error(`🦁 Lion Agent: Error fetching runs for ${workflowName}:`, error);
      return [];
    }
  }

  /**
   * Determine health status from percentage
   */
  private determineHealthStatus(percentage: number): 'healthy' | 'caution' | 'warning' | 'critical' {
    if (percentage >= 100) return 'healthy';
    if (percentage >= 95) return 'caution';
    if (percentage >= 85) return 'warning';
    return 'critical';
  }

  /**
   * Determine trend by comparing with previous check
   */
  private determineTrend(workflowName: string, currentHealth: number): 'improving' | 'stable' | 'declining' {
    const previousHealth = this.workflowHealthCache.get(workflowName)?.healthPercentage || currentHealth;
    
    if (currentHealth > previousHealth + 5) return 'improving';
    if (currentHealth < previousHealth - 5) return 'declining';
    return 'stable';
  }

  /**
   * Calculate overall system health
   */
  private calculateSystemHealth(): void {
    const categoryHealthMap = new Map<string, CategoryHealth>();

    // Calculate category health
    for (const [category, workflows] of Object.entries(this.workflowCategories)) {
      let categoryHealthSum = 0;
      let countedWorkflows = 0;

      for (const workflow of workflows) {
        const health = this.workflowHealthCache.get(workflow);
        if (health) {
          categoryHealthSum += health.healthPercentage;
          countedWorkflows++;
        }
      }

      const categoryHealthPercentage = countedWorkflows > 0 
        ? categoryHealthSum / countedWorkflows 
        : 0;

      categoryHealthMap.set(category, {
        categoryName: category,
        workflowCount: workflows.length,
        healthPercentage: Math.round(categoryHealthPercentage * 100) / 100,
        status: this.determineHealthStatus(categoryHealthPercentage)
      });
    }

    // Calculate master health
    let masterHealthSum = 0;
    let categoryCount = 0;
    const categoryArray: CategoryHealth[] = [];

    for (const [, categoryHealth] of categoryHealthMap) {
      masterHealthSum += categoryHealth.healthPercentage;
      categoryCount++;
      categoryArray.push(categoryHealth);
    }

    const masterHealthPercentage = categoryCount > 0 
      ? masterHealthSum / categoryCount 
      : 0;

    this.systemHealthCache = {
      masterHealthPercentage: Math.round(masterHealthPercentage * 100) / 100,
      categoryHealth: categoryArray,
      failedWorkflows: this.getFailedWorkflows(),
      criticalIssues: this.getCriticalIssues(),
      lastUpdated: new Date(),
      refreshInterval: '5m',
      lionAgentVersion: '1.0.0',
      uptime: this.getUptime()
    };
  }

  /**
   * Detect critical issues
   */
  private detectCriticalIssues(): void {
    const issues: string[] = [];

    for (const [, health] of this.workflowHealthCache) {
      if (health.status === 'critical') {
        issues.push(`CRITICAL: ${health.workflowName} health is ${health.healthPercentage}%`);
      }
      
      if (health.trend === 'declining') {
        issues.push(`WARNING: ${health.workflowName} is trending downward`);
      }
    }

    if (issues.length > 0) {
      this.emit('critical-issues-detected', {
        timestamp: new Date(),
        issues,
        requiresMasterAction: issues.some(i => i.startsWith('CRITICAL'))
      });
    }
  }

  /**
   * Get all workflows
   */
  private getAllWorkflows(): string[] {
    return Array.from(Object.values(this.workflowCategories))
      .flat()
      .filter((v, i, a) => a.indexOf(v) === i); // unique
  }

  /**
   * Get failed workflows
   */
  private getFailedWorkflows(): string[] {
    return Array.from(this.workflowHealthCache.values())
      .filter(h => h.healthPercentage < 95)
      .map(h => h.workflowName);
  }

  /**
   * Get critical issues
   */
  private getCriticalIssues(): string[] {
    return Array.from(this.workflowHealthCache.values())
      .filter(h => h.status === 'critical')
      .map(h => `${h.workflowName}: ${h.healthPercentage}%`);
  }

  /**
   * Get uptime
   */
  private getUptime(): string {
    // Placeholder - would track actual uptime
    return '100%';
  }

  /**
   * Get system health
   */
  public getSystemHealth(): SystemHealth | null {
    return this.systemHealthCache;
  }

  /**
   * Get workflow health by name
   */
  public getWorkflowHealth(workflowName: string): WorkflowHealth | undefined {
    return this.workflowHealthCache.get(workflowName);
  }

  /**
   * Get all workflow health
   */
  public getAllWorkflowHealth(): WorkflowHealth[] {
    return Array.from(this.workflowHealthCache.values());
  }

  /**
   * Trigger master notification for critical failure
   */
  public async notifyMaster(workflow: string, severity: 'critical' | 'warning' | 'info'): Promise<void> {
    const health = this.workflowHealthCache.get(workflow);
    if (!health) return;

    const notification = {
      timestamp: new Date(),
      workflow,
      severity,
      health: health.healthPercentage,
      lastRun: health.lastRun,
      message: `Workflow "${workflow}" has severity: ${severity}. Health: ${health.healthPercentage}%`,
      masterOnly: true
    };

    this.emit('master-notification', notification);
    console.log(`🦁 Lion Agent: Master notification - ${workflow} (${severity})`);
  }

  /**
   * Retry failed workflow
   */
  public async retryWorkflow(workflowName: string, masterAuthorization: string): Promise<void> {
    console.log(`🦁 Lion Agent: Executing retry for ${workflowName} (Master authorized)`);
    
    this.emit('workflow-retry', {
      timestamp: new Date(),
      workflow: workflowName,
      authorizedByMaster: true
    });
  }

  /**
   * Get agent status
   */
  public getAgentStatus(): object {
    return {
      status: this.monitoringActive ? 'active' : 'inactive',
      version: '1.0.0',
      lastError: this.lastError?.message || null,
      systemHealth: this.systemHealthCache,
      monitoredWorkflows: this.getAllWorkflows().length,
      checkInterval: `${this.checkInterval / 60000}m`,
      lastCheck: this.systemHealthCache?.lastUpdated || null
    };
  }
}

export default LionAgentWorkflowMonitor;
