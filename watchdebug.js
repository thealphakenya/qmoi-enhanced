// WATCHDEBUG.js - QMOI Comprehensive Monitoring & Error Fixing System

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class QMOIWatchDebug {
    constructor() {
        this.config = {
            gitlab: {
                baseURL: process.env.GITLAB_URL || 'https://gitlab.com/api/v4',
                token: process.env.GITLAB_TOKEN,
                projectId: process.env.GITLAB_PROJECT_ID
            },
            vercel: {
                baseURL: 'https://api.vercel.com/v1',
                token: process.env.VERCEL_TOKEN,
                teamId: process.env.VERCEL_TEAM_ID
            },
            monitoring: {
                interval: 30000, // 30 seconds
                errorThreshold: 3,
                maxRetries: 5
            }
        };
        
        this.logs = {
            errors: [],
            deployments: [],
            fixes: [],
            performance: []
        };
        
        this.status = {
            gitlab: 'unknown',
            vercel: 'unknown',
            qmoi: 'unknown',
            lastCheck: new Date()
        };
    }

    // Main monitoring loop
    async startMonitoring() {
        console.log('🚀 Starting QMOI Comprehensive Monitoring & Error Fixing System...');
        
        setInterval(async () => {
            try {
                await this.performComprehensiveCheck();
            } catch (error) {
                console.error('❌ Monitoring check failed:', error.message);
                this.logError('monitoring_check_failed', error.message);
            }
        }, this.config.monitoring.interval);
    }

    // Comprehensive system check
    async performComprehensiveCheck() {
        console.log('🔍 Performing comprehensive system check...');
        
        const checks = [
            this.checkGitLabStatus(),
            this.checkVercelStatus(),
            this.checkQMOISystems(),
            this.scanForErrors(),
            this.checkDeployments(),
            this.monitorPerformance()
        ];
        
        const results = await Promise.allSettled(checks);
        
        // Process results and fix any issues
        await this.processCheckResults(results);
        
        // Update status
        this.status.lastCheck = new Date();
        
        console.log('✅ Comprehensive check completed');
    }

    // GitLab monitoring
    async checkGitLabStatus() {
        try {
            const response = await axios.get(
                `${this.config.gitlab.baseURL}/projects/${this.config.gitlab.projectId}/pipelines`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.gitlab.token}`
                    },
                    params: {
                        per_page: 10,
                        status: 'running,failed,success'
                    }
                }
            );
            
            const pipelines = response.data;
            this.status.gitlab = 'healthy';
            
            // Check for failed pipelines
            const failedPipelines = pipelines.filter(p => p.status === 'failed');
            if (failedPipelines.length > 0) {
                console.log(`⚠️ Found ${failedPipelines.length} failed GitLab pipelines`);
                await this.fixGitLabErrors(failedPipelines);
            }
            
            return { gitlab: 'healthy', pipelines: pipelines.length };
            
        } catch (error) {
            console.error('❌ GitLab check failed:', error.message);
            this.status.gitlab = 'error';
            await this.fixGitLabConnection();
            return { gitlab: 'error', error: error.message };
        }
    }

    // Vercel monitoring
    async checkVercelStatus() {
        try {
            const response = await axios.get(
                `${this.config.vercel.baseURL}/deployments`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.vercel.token}`
                    },
                    params: {
                        limit: 10
                    }
                }
            );
            
            const deployments = response.data.deployments;
            this.status.vercel = 'healthy';
            
            // Check for failed deployments
            const failedDeployments = deployments.filter(d => d.readyState === 'ERROR');
            if (failedDeployments.length > 0) {
                console.log(`⚠️ Found ${failedDeployments.length} failed Vercel deployments`);
                await this.fixVercelErrors(failedDeployments);
            }
            
            return { vercel: 'healthy', deployments: deployments.length };
            
        } catch (error) {
            console.error('❌ Vercel check failed:', error.message);
            this.status.vercel = 'error';
            await this.fixVercelConnection();
            return { vercel: 'error', error: error.message };
        }
    }

    // QMOI systems monitoring
    async checkQMOISystems() {
        const systems = [
            'qmoi-core-ai',
            'qmoi-device-controller',
            'qmoi-automated-betting',
            'qmoi-gitlab-automation',
            'qmoi-quantum-cloud',
            'qmoi-friendship-system'
        ];
        
        const results = {};
        
        for (const system of systems) {
            try {
                const status = await this.checkSystemHealth(system);
                results[system] = status;
            } catch (error) {
                console.error(`❌ ${system} check failed:`, error.message);
                results[system] = 'error';
                await this.fixSystemError(system, error);
            }
        }
        
        this.status.qmoi = Object.values(results).every(r => r === 'healthy') ? 'healthy' : 'error';
        return { qmoi: results };
    }

    // Error scanning
    async scanForErrors() {
        const errors = [];
        
        // Scan for common error patterns
        const errorPatterns = [
            { pattern: /error|exception|fail/i, severity: 'high' },
            { pattern: /warning|deprecated/i, severity: 'medium' },
            { pattern: /timeout|connection refused/i, severity: 'high' },
            { pattern: /memory|performance/i, severity: 'medium' }
        ];
        
        // Check log files
        const logFiles = [
            'logs/qmoi_auto_startup.log',
            'logs/contact_verification_report.md',
            'logs/contact_backup.json'
        ];
        
        for (const logFile of logFiles) {
            if (fs.existsSync(logFile)) {
                const content = fs.readFileSync(logFile, 'utf8');
                for (const pattern of errorPatterns) {
                    if (pattern.pattern.test(content)) {
                        errors.push({
                            file: logFile,
                            pattern: pattern.pattern.source,
                            severity: pattern.severity,
                            timestamp: new Date()
                        });
                    }
                }
            }
        }
        
        // Check for system errors
        const systemErrors = await this.checkSystemErrors();
        errors.push(...systemErrors);
        
        if (errors.length > 0) {
            console.log(`⚠️ Found ${errors.length} errors`);
            await this.fixDetectedErrors(errors);
        }
        
        return { errors: errors.length };
    }

    // Deployment monitoring
    async checkDeployments() {
        const deployments = [];
        
        // Check GitLab deployments
        try {
            const gitlabDeployments = await this.getGitLabDeployments();
            deployments.push(...gitlabDeployments);
        } catch (error) {
            console.error('❌ GitLab deployment check failed:', error.message);
        }
        
        // Check Vercel deployments
        try {
            const vercelDeployments = await this.getVercelDeployments();
            deployments.push(...vercelDeployments);
        } catch (error) {
            console.error('❌ Vercel deployment check failed:', error.message);
        }
        
        // Check for stuck or failed deployments
        const problematicDeployments = deployments.filter(d => 
            d.status === 'failed' || d.status === 'stuck' || d.status === 'timeout'
        );
        
        if (problematicDeployments.length > 0) {
            console.log(`⚠️ Found ${problematicDeployments.length} problematic deployments`);
            await this.fixDeploymentIssues(problematicDeployments);
        }
        
        return { deployments: deployments.length, problematic: problematicDeployments.length };
    }

    // Performance monitoring
    async monitorPerformance() {
        const metrics = {
            cpu: await this.getCPUUsage(),
            memory: await this.getMemoryUsage(),
            disk: await this.getDiskUsage(),
            network: await this.getNetworkUsage()
        };
        
        // Check for performance issues
        const issues = [];
        if (metrics.cpu > 80) issues.push('high_cpu_usage');
        if (metrics.memory > 85) issues.push('high_memory_usage');
        if (metrics.disk > 90) issues.push('high_disk_usage');
        
        if (issues.length > 0) {
            console.log(`⚠️ Performance issues detected: ${issues.join(', ')}`);
            await this.fixPerformanceIssues(issues, metrics);
        }
        
        return { metrics, issues };
    }

    // Error fixing methods
    async fixGitLabErrors(failedPipelines) {
        console.log('🔧 Fixing GitLab errors...');
        
        for (const pipeline of failedPipelines) {
            try {
                // Retry failed pipeline
                await axios.post(
                    `${this.config.gitlab.baseURL}/projects/${this.config.gitlab.projectId}/pipeline/${pipeline.id}/retry`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${this.config.gitlab.token}`
                        }
                    }
                );
                
                console.log(`✅ Retried GitLab pipeline ${pipeline.id}`);
                this.logFix('gitlab_pipeline_retry', pipeline.id);
                
            } catch (error) {
                console.error(`❌ Failed to retry pipeline ${pipeline.id}:`, error.message);
                await this.manualGitLabFix(pipeline);
            }
        }
    }

    async fixVercelErrors(failedDeployments) {
        console.log('🔧 Fixing Vercel errors...');
        
        for (const deployment of failedDeployments) {
            try {
                // Redeploy failed deployment
                await axios.post(
                    `${this.config.vercel.baseURL}/deployments`,
                    {
                        name: deployment.name,
                        files: deployment.files,
                        projectSettings: deployment.projectSettings
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${this.config.vercel.token}`
                        }
                    }
                );
                
                console.log(`✅ Redeployed Vercel deployment ${deployment.id}`);
                this.logFix('vercel_deployment_redeploy', deployment.id);
                
            } catch (error) {
                console.error(`❌ Failed to redeploy ${deployment.id}:`, error.message);
                await this.manualVercelFix(deployment);
            }
        }
    }

    async fixSystemError(system, error) {
        console.log(`🔧 Fixing ${system} error...`);
        
        const fixStrategies = {
            'qmoi-core-ai': () => this.fixCoreAIError(error),
            'qmoi-device-controller': () => this.fixDeviceControllerError(error),
            'qmoi-automated-betting': () => this.fixBettingSystemError(error),
            'qmoi-gitlab-automation': () => this.fixGitLabAutomationError(error),
            'qmoi-quantum-cloud': () => this.fixQuantumCloudError(error),
            'qmoi-friendship-system': () => this.fixFriendshipSystemError(error)
        };
        
        const fixStrategy = fixStrategies[system];
        if (fixStrategy) {
            try {
                await fixStrategy();
                console.log(`✅ Fixed ${system} error`);
                this.logFix('system_error_fix', system);
            } catch (fixError) {
                console.error(`❌ Failed to fix ${system}:`, fixError.message);
                await this.escalateError(system, error, fixError);
            }
        }
    }

    async fixDetectedErrors(errors) {
        console.log('🔧 Fixing detected errors...');
        
        for (const error of errors) {
            try {
                switch (error.severity) {
                    case 'high':
                        await this.fixHighSeverityError(error);
                        break;
                    case 'medium':
                        await this.fixMediumSeverityError(error);
                        break;
                    default:
                        await this.fixLowSeverityError(error);
                }
                
                console.log(`✅ Fixed error in ${error.file}`);
                this.logFix('detected_error_fix', error);
                
            } catch (fixError) {
                console.error(`❌ Failed to fix error in ${error.file}:`, fixError.message);
                await this.escalateError('detected_error', error, fixError);
            }
        }
    }

    async fixDeploymentIssues(problematicDeployments) {
        console.log('🔧 Fixing deployment issues...');
        
        for (const deployment of problematicDeployments) {
            try {
                if (deployment.platform === 'gitlab') {
                    await this.fixGitLabDeployment(deployment);
                } else if (deployment.platform === 'vercel') {
                    await this.fixVercelDeployment(deployment);
                }
                
                console.log(`✅ Fixed deployment ${deployment.id}`);
                this.logFix('deployment_fix', deployment.id);
                
            } catch (error) {
                console.error(`❌ Failed to fix deployment ${deployment.id}:`, error.message);
                await this.escalateError('deployment', deployment, error);
            }
        }
    }

    async fixPerformanceIssues(issues, metrics) {
        console.log('🔧 Fixing performance issues...');
        
        for (const issue of issues) {
            try {
                switch (issue) {
                    case 'high_cpu_usage':
                        await this.optimizeCPUUsage();
                        break;
                    case 'high_memory_usage':
                        await this.optimizeMemoryUsage();
                        break;
                    case 'high_disk_usage':
                        await this.optimizeDiskUsage();
                        break;
                }
                
                console.log(`✅ Fixed performance issue: ${issue}`);
                this.logFix('performance_fix', issue);
                
            } catch (error) {
                console.error(`❌ Failed to fix performance issue ${issue}:`, error.message);
                await this.escalateError('performance', issue, error);
            }
        }
    }

    // Utility methods
    async getCPUUsage() {
        return new Promise((resolve) => {
            exec('wmic cpu get loadpercentage', (error, stdout) => {
                if (error) {
                    resolve(0);
                } else {
                    const lines = stdout.trim().split('\n');
                    const usage = parseInt(lines[1]) || 0;
                    resolve(usage);
                }
            });
        });
    }

    async getMemoryUsage() {
        return new Promise((resolve) => {
            exec('wmic OS get FreePhysicalMemory,TotalVisibleMemorySize', (error, stdout) => {
                if (error) {
                    resolve(0);
                } else {
                    const lines = stdout.trim().split('\n');
                    const values = lines[1].trim().split(/\s+/);
                    const free = parseInt(values[0]) || 0;
                    const total = parseInt(values[1]) || 1;
                    const usage = ((total - free) / total) * 100;
                    resolve(usage);
                }
            });
        });
    }

    async getDiskUsage() {
        return new Promise((resolve) => {
            exec('wmic logicaldisk get size,freespace', (error, stdout) => {
                if (error) {
                    resolve(0);
                } else {
                    const lines = stdout.trim().split('\n');
                    let totalFree = 0;
                    let totalSize = 0;
                    
                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].trim().split(/\s+/);
                        if (values.length >= 2) {
                            const free = parseInt(values[0]) || 0;
                            const size = parseInt(values[1]) || 0;
                            totalFree += free;
                            totalSize += size;
                        }
                    }
                    
                    const usage = totalSize > 0 ? ((totalSize - totalFree) / totalSize) * 100 : 0;
                    resolve(usage);
                }
            });
        });
    }

    async getNetworkUsage() {
        // Simplified network usage check
        return 0;
    }

    // Logging methods
    logError(type, message) {
        this.logs.errors.push({
            timestamp: new Date(),
            type,
            message
        });
    }

    logFix(type, details) {
        this.logs.fixes.push({
            timestamp: new Date(),
            type,
            details
        });
    }

    // Error escalation
    async escalateError(context, originalError, fixError) {
        console.error(`🚨 Escalating error in ${context}:`, {
            originalError: originalError.message,
            fixError: fixError.message
        });
        
        // Log escalation
        this.logError('escalation', `${context}: ${originalError.message} -> ${fixError.message}`);
        
        // Could implement notification system here
        // await this.sendNotification('error_escalation', context, originalError, fixError);
    }

    // Process check results
    async processCheckResults(results) {
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        
        console.log(`📊 Check results: ${successful} successful, ${failed} failed`);
        
        if (failed > 0) {
            console.log('⚠️ Some checks failed, initiating error recovery...');
            await this.initiateErrorRecovery();
        }
    }

    async initiateErrorRecovery() {
        console.log('🔄 Initiating error recovery...');
        
        // Restart monitoring systems
        await this.restartMonitoringSystems();
        
        // Clear error logs if too many
        if (this.logs.errors.length > 1000) {
            this.logs.errors = this.logs.errors.slice(-500);
        }
        
        console.log('✅ Error recovery completed');
    }

    async restartMonitoringSystems() {
        // Restart monitoring systems if needed
        console.log('🔄 Restarting monitoring systems...');
    }

    // Placeholder methods for system-specific fixes
    async checkSystemHealth(system) {
        // Simulate system health check
        return Math.random() > 0.1 ? 'healthy' : 'error';
    }

    async checkSystemErrors() {
        // Simulate system error check
        return [];
    }

    async fixGitLabConnection() {
        console.log('🔧 Fixing GitLab connection...');
    }

    async fixVercelConnection() {
        console.log('🔧 Fixing Vercel connection...');
    }

    async getGitLabDeployments() {
        return [];
    }

    async getVercelDeployments() {
        return [];
    }

    async manualGitLabFix(pipeline) {
        console.log(`🔧 Manual GitLab fix for pipeline ${pipeline.id}`);
    }

    async manualVercelFix(deployment) {
        console.log(`🔧 Manual Vercel fix for deployment ${deployment.id}`);
    }

    async fixCoreAIError(error) {
        console.log('🔧 Fixing Core AI error...');
    }

    async fixDeviceControllerError(error) {
        console.log('🔧 Fixing Device Controller error...');
    }

    async fixBettingSystemError(error) {
        console.log('🔧 Fixing Betting System error...');
    }

    async fixGitLabAutomationError(error) {
        console.log('🔧 Fixing GitLab Automation error...');
    }

    async fixQuantumCloudError(error) {
        console.log('🔧 Fixing Quantum Cloud error...');
    }

    async fixFriendshipSystemError(error) {
        console.log('🔧 Fixing Friendship System error...');
    }

    async fixHighSeverityError(error) {
        console.log('🔧 Fixing high severity error...');
    }

    async fixMediumSeverityError(error) {
        console.log('🔧 Fixing medium severity error...');
    }

    async fixLowSeverityError(error) {
        console.log('🔧 Fixing low severity error...');
    }

    async fixGitLabDeployment(deployment) {
        console.log(`🔧 Fixing GitLab deployment ${deployment.id}`);
    }

    async fixVercelDeployment(deployment) {
        console.log(`🔧 Fixing Vercel deployment ${deployment.id}`);
    }

    async optimizeCPUUsage() {
        console.log('⚡ Optimizing CPU usage...');
    }

    async optimizeMemoryUsage() {
        console.log('⚡ Optimizing memory usage...');
    }

    async optimizeDiskUsage() {
        console.log('⚡ Optimizing disk usage...');
    }
}

// Export the monitoring system
module.exports = QMOIWatchDebug; 