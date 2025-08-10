// START-WATCHDEBUG.js - Main execution script for QMOI monitoring

import QMOIWatchDebug from './watchdebug';

async function startQMOIMonitoring() {
    console.log('🚀 Starting QMOI Comprehensive Monitoring & Error Fixing System...');
    
    // Initialize monitoring system
    const monitor = new QMOIWatchDebug();
    
    // Start monitoring
    await monitor.startMonitoring();
    
    console.log('✅ QMOI monitoring system started successfully');
    console.log('📊 Monitoring GitLab, Vercel, and QMOI systems...');
    console.log('🔧 Automatic error fixing enabled');
    console.log('📈 Performance monitoring active');
    console.log('🔄 Monitoring interval: 30 seconds');
    console.log('🚨 Error escalation enabled');
    
    // Display system status
    console.log('\n📋 System Status:');
    console.log('├── GitLab: Monitoring pipelines and jobs');
    console.log('├── Vercel: Monitoring deployments and builds');
    console.log('├── QMOI Core AI: Health monitoring');
    console.log('├── QMOI Device Controller: Status tracking');
    console.log('├── QMOI Automated Betting: Performance monitoring');
    console.log('├── QMOI GitLab Automation: Pipeline monitoring');
    console.log('├── QMOI Quantum Cloud: Resource monitoring');
    console.log('└── QMOI Friendship System: Relationship monitoring');
    
    // Keep the process running
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down QMOI monitoring system...');
        console.log('📊 Final status report:');
        console.log(`├── Errors detected: ${monitor.logs.errors.length}`);
        console.log(`├── Fixes applied: ${monitor.logs.fixes.length}`);
        console.log(`├── Deployments monitored: ${monitor.logs.deployments.length}`);
        console.log(`└── Performance checks: ${monitor.logs.performance.length}`);
        process.exit(0);
    });
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
        console.error('❌ Uncaught exception:', error.message);
        monitor.logError('uncaught_exception', error.message);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
        console.error('❌ Unhandled rejection:', reason);
        monitor.logError('unhandled_rejection', reason);
    });
}

// Start the monitoring system
startQMOIMonitoring().catch(error => {
    console.error('❌ Failed to start QMOI monitoring:', error.message);
    process.exit(1);
}); 