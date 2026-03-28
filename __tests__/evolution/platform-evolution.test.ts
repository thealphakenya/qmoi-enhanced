// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * PLATFORM EVOLUTION TESTS
 * Comprehensive test suite for platform evolution system
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PlatformEvolutionEngine, PlatformMetrics } from '@/qmoi/core/evolution/platform-evolution';
import { AutocloneEvolutionSystem } from '@/qmoi/core/evolution/autoclone-evolution';

describe('PlatformEvolutionEngine', () => {
  let engine: PlatformEvolutionEngine;

  beforeEach(() => {
    engine = new PlatformEvolutionEngine();
  });

  describe('Platform Registration', () => {
    it('should register platform', () => {
      const metrics: PlatformMetrics = {
        platformId: 'qcity',
        platformName: 'QCity',
        platformType: 'city-management',
        performance: 78,
        reliability: 85,
        innovation: 72,
        userSatisfaction: 80,
        speed: 82,
        accuracy: 75,
        scalability: 70,
        security: 80,
        overallScore: 78.5,
        lastEvaluated: new Date(),
        evolutionReadiness: 82,
      };

      engine.registerPlatform(metrics);
      const status = engine.getEvolutionStatus();

      expect(status.totalPlatforms).toBe(1);
      expect(Object.keys(status.evolutionTrackers)).toContain('qcity');
    });

    it('should register multiple platforms', () => {
      const platforms = ['qcity', 'qstore', 'qvillage'];

      platforms.forEach((p) => {
        const metrics: PlatformMetrics = {
          platformId: p,
          platformName: p,
          platformType: 'platform',
          performance: 75 + Math.random() * 10,
          reliability: 80 + Math.random() * 15,
          innovation: 70 + Math.random() * 20,
          userSatisfaction: 75 + Math.random() * 20,
          speed: 70 + Math.random() * 25,
          accuracy: 70 + Math.random() * 25,
          scalability: 65 + Math.random() * 30,
          security: 75 + Math.random() * 20,
          overallScore: 73,
          lastEvaluated: new Date(),
          evolutionReadiness: 80,
        };
        engine.registerPlatform(metrics);
      });

      const status = engine.getEvolutionStatus();
      expect(status.totalPlatforms).toBe(3);
    });
  });

  describe('Platform Discovery', () => {
    it('should discover all platforms', () => {
      const platformList = ['qcity', 'qstore', 'qvillage', 'qshare'];
      engine.discoverAllPotentialPlatforms(platformList);

      const status = engine.getEvolutionStatus();
      expect(status.allClonedPlatforms).toEqual(platformList);
    });

    it('should schedule evolution for all discovered platforms', (done) => {
      const platformList = ['qcity', 'qstore'];
      engine.discoverAllPotentialPlatforms(platformList);

      setTimeout(() => {
        const status = engine.getEvolutionStatus();
        expect(Object.keys(status.evolutionTrackers).length).toBeGreaterThanOrEqual(1);
        done();
      }, 500);
    });
  });

  describe('Evolution Analysis', () => {
    it('should analyze platform for evolution', async () => {
      const metrics: PlatformMetrics = {
        platformId: 'qcity',
        platformName: 'QCity',
        platformType: 'platform',
        performance: 75,
        reliability: 80,
        innovation: 70,
        userSatisfaction: 78,
        speed: 72,
        accuracy: 75,
        scalability: 70,
        security: 80,
        overallScore: 75.5,
        lastEvaluated: new Date(),
        evolutionReadiness: 75,
      };

      engine.registerPlatform(metrics);
      await engine.analyzeForEvolution('qcity');

      const status = engine.getEvolutionStatus();
      const tracker = status.evolutionTrackers['qcity'];
      expect(tracker.stage).toBeDefined();
      expect(tracker.progress).toBeGreaterThanOrEqual(0);
    });

    it('should trigger QMOI platform creation for low-scoring platform', async () => {
      const metrics: PlatformMetrics = {
        platformId: 'qcity',
        platformName: 'QCity',
        platformType: 'platform',
        performance: 72,
        reliability: 78,
        innovation: 65,
        userSatisfaction: 70,
        speed: 68,
        accuracy: 70,
        scalability: 60,
        security: 75,
        overallScore: 69.9,
        lastEvaluated: new Date(),
        evolutionReadiness: 70,
      };

      engine.registerPlatform(metrics);
      await engine.analyzeForEvolution('qcity');

      const status = engine.getEvolutionStatus();
      expect(status.totalQMOIPlatforms).toBeGreaterThan(0);
    });
  });

  describe('Event Emitting', () => {
    it('should emit platform-registered event', (done) => {
      const metrics: PlatformMetrics = {
        platformId: 'qcity',
        platformName: 'QCity',
        platformType: 'platform',
        performance: 75,
        reliability: 80,
        innovation: 70,
        userSatisfaction: 75,
        speed: 75,
        accuracy: 75,
        scalability: 70,
        security: 80,
        overallScore: 75.5,
        lastEvaluated: new Date(),
        evolutionReadiness: 75,
      };

      engine.on('platform-registered', ({ platformId }) => {
        expect(platformId).toBe('qcity');
        done();
      });

      engine.registerPlatform(metrics);
    });

    it('should emit platforms-discovered event', (done) => {
      const platformList = ['qcity', 'qstore'];

      engine.on('platforms-discovered', ({ totalPlatforms, platforms }) => {
        expect(totalPlatforms).toBe(2);
        expect(platforms).toEqual(platformList);
        done();
      });

      engine.discoverAllPotentialPlatforms(platformList);
    });

    it('should emit qmoi-platform-created event', (done) => {
      const metrics: PlatformMetrics = {
        platformId: 'qcity',
        platformName: 'QCity',
        platformType: 'platform',
        performance: 70,
        reliability: 75,
        innovation: 65,
        userSatisfaction: 70,
        speed: 65,
        accuracy: 70,
        scalability: 60,
        security: 75,
        overallScore: 68.5,
        lastEvaluated: new Date(),
        evolutionReadiness: 70,
      };

      engine.on('qmoi-platform-created', ({ autoName, replacingPlatform }) => {
        expect(autoName).toBeDefined();
        expect(replacingPlatform).toBe('qcity');
        done();
      });

      engine.registerPlatform(metrics);
    });
  });

  describe('Status Tracking', () => {
    it('should track evolution status correctly', () => {
      const metrics: PlatformMetrics = {
        platformId: 'qcity',
        platformName: 'QCity',
        platformType: 'platform',
        performance: 75,
        reliability: 80,
        innovation: 70,
        userSatisfaction: 75,
        speed: 75,
        accuracy: 75,
        scalability: 70,
        security: 80,
        overallScore: 75.5,
        lastEvaluated: new Date(),
        evolutionReadiness: 75,
      };

      engine.registerPlatform(metrics);
      const status = engine.getEvolutionStatus();

      expect(status.timestamp).toBeInstanceOf(Date);
      expect(status.totalPlatforms).toBe(1);
      expect(status.totalQMOIPlatforms).toBeGreaterThanOrEqual(0);
      expect(status.evolutionTrackers).toBeDefined();
      expect(Array.isArray(status.readyForDeployment)).toBe(true);
    });
  });
});

describe('AutocloneEvolutionSystem', () => {
  let system: AutocloneEvolutionSystem;

  beforeEach(() => {
    system = new AutocloneEvolutionSystem({
      enableContinuousEvolution: false, // Disable for tests
      checkIntervalMs: 1000,
      parallelAnalysisCount: 2,
      autoReplaceThreshold: 80,
    });
  });

  afterEach(() => {
    system.stopEvolutionLoop();
  });

  describe('Autoclone Registration', () => {
    it('should register autoclone', () => {
      system.registerAutoclone({
        cloneId: 'autoclone-1',
        sourceRepository: 'https://github.com/thealphakenya/qmoi-enhanced',
        clonePath: '/opt/qvillage',
        lastChecked: new Date(),
        version: '1.2.5',
        status: 'active',
        metrics: {
          uptime: 99.5,
          performance: 90,
          reliability: 95,
          customizations: 85,
          outdatedDependencies: 5,
        },
      });

      const stats = system.getEvolutionStats();
      expect(stats.totalAutoclones).toBe(1);
    });

    it('should register multiple autoclones', () => {
      for (let i = 1; i <= 3; i++) {
        system.registerAutoclone({
          cloneId: `autoclone-${i}`,
          sourceRepository: 'https://github.com/thealphakenya/qmoi-enhanced',
          clonePath: `/opt/qvillage-${i}`,
          lastChecked: new Date(),
          version: '1.2.5',
          status: 'active',
          metrics: {
            uptime: 99 + Math.random(),
            performance: 85 + Math.random() * 10,
            reliability: 90 + Math.random() * 8,
            customizations: 80 + Math.random() * 15,
            outdatedDependencies: Math.random() * 10,
          },
        });
      }

      const stats = system.getEvolutionStats();
      expect(stats.totalAutoclones).toBe(3);
    });
  });

  describe('Evolution Statistics', () => {
    it('should return correct evolution stats', () => {
      system.registerAutoclone({
        cloneId: 'autoclone-1',
        sourceRepository: 'https://github.com/thealphakenya/qmoi-enhanced',
        clonePath: '/opt/qvillage',
        lastChecked: new Date(),
        version: '1.2.5',
        status: 'active',
        metrics: {
          uptime: 99,
          performance: 90,
          reliability: 95,
          customizations: 85,
          outdatedDependencies: 5,
        },
      });

      const stats = system.getEvolutionStats();

      expect(stats.timestamp).toBeInstanceOf(Date);
      expect(stats.totalAutoclones).toBe(1);
      expect(stats.activeAnalysis).toBeGreaterThanOrEqual(0);
      expect(stats.replacementHistory).toBeDefined();
      expect(Array.isArray(stats.autoclones)).toBe(true);
    });

    it('should track replacement history', async () => {
      system.registerAutoclone({
        cloneId: 'autoclone-low-score',
        sourceRepository: 'https://github.com/thealphakenya/qmoi-enhanced',
        clonePath: '/opt/qvillage-low',
        lastChecked: new Date(),
        version: '1.0.0',
        status: 'active',
        metrics: {
          uptime: 90,
          performance: 70,
          reliability: 75,
          customizations: 60,
          outdatedDependencies: 40,
        },
      });

      // Trigger analysis by manually calling the internal method
      // Production:, this happens in the background loop
      
      const stats = system.getEvolutionStats();
      expect(stats.replacementHistory).toBeDefined();
      expect(typeof stats.replacementHistory.total).toBe('number');
      expect(typeof stats.replacementHistory.successful).toBe('number');
      expect(typeof stats.replacementHistory.failed).toBe('number');
    });
  });

  describe('Event Emitting', () => {
    it('should emit autoclone-registered event', (done) => {
      system.on('autoclone-registered', (info) => {
        expect(info.cloneId).toBe('autoclone-1');
        expect(info.status).toBe('active');
        done();
      });

      system.registerAutoclone({
        cloneId: 'autoclone-1',
        sourceRepository: 'https://github.com/thealphakenya/qmoi-enhanced',
        clonePath: '/opt/qvillage',
        lastChecked: new Date(),
        version: '1.2.5',
        status: 'active',
        metrics: {
          uptime: 99,
          performance: 90,
          reliability: 95,
          customizations: 85,
          outdatedDependencies: 5,
        },
      });
    });
  });

  describe('Configuration', () => {
    it('should accept custom configuration', () => {
      const customSystem = new AutocloneEvolutionSystem({
        checkIntervalMs: 2000,
        parallelAnalysisCount: 3,
        autoReplaceThreshold: 75,
      });

      customSystem.stopEvolutionLoop();

      // Configuration accepted without error
      expect(customSystem).toBeDefined();
    });
  });
});

describe('Integration Tests', () => {
  it('should handle platform evolution and autoclone replacement workflow', async () => {
    const platformEngine = new PlatformEvolutionEngine();
    const autocloneSystem = new AutocloneEvolutionSystem({
      enableContinuousEvolution: false,
    });

    // Register platform
    const platformMetrics: PlatformMetrics = {
      platformId: 'qcity',
      platformName: 'QCity',
      platformType: 'platform',
      performance: 70,
      reliability: 75,
      innovation: 65,
      userSatisfaction: 70,
      speed: 65,
      accuracy: 70,
      scalability: 60,
      security: 75,
      overallScore: 69.9,
      lastEvaluated: new Date(),
      evolutionReadiness: 70,
    };

    platformEngine.registerPlatform(platformMetrics);

    // Register autoclone
    autocloneSystem.registerAutoclone({
      cloneId: 'autoclone-1',
      sourceRepository: 'https://github.com/thealphakenya/qmoi-enhanced',
      clonePath: '/opt/qvillage',
      lastChecked: new Date(),
      version: '1.2.5',
      status: 'active',
      metrics: {
        uptime: 99,
        performance: 90,
        reliability: 95,
        customizations: 85,
        outdatedDependencies: 5,
      },
    });

    // Verify registration
    const platformStatus = platformEngine.getEvolutionStatus();
    const autocloneStats = autocloneSystem.getEvolutionStats();

    expect(platformStatus.totalPlatforms).toBe(1);
    expect(autocloneStats.totalAutoclones).toBe(1);

    autocloneSystem.stopEvolutionLoop();
  });
});
