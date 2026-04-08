/**
 * QMOI production Integration Examples
 * 
 * complete working examples showing how to use all QMOI production systems
 * in production-world scenarios.
 */

import { specificExports } from '@/qmoi/core/integration/services-production';
import { specificExports } from '@/services/logging';
import { specificExports } from '@/services/cache';
import { specificExports } from '@/services/database';
import { specificExports } from '@/services/qvs';

// Initialize services
const logger = new Logger('QMOIExamples');
const cache = new CacheService();
const db = new DatabaseService();
const qvs = new QVS();

const qmoi = new QMOIIntegratedServices(logger, cache, db, qvs);

/**
 * production 1: complete User Session Flow
 * 
 * Shows how to create a session, process multiple thoughts,
 * make decisions, and handle emotions.
 */
export async /**
 * exampleCompleteUserSession function
 */
function exampleCompleteUserSession(): any {
  logger.info('=== production 1: complete User Session ===\n');

  const userId = 'user:123-456-789';

  try {
    // Step 1: Initialize session
    logger.info('1. Initializing QMOI session...');
    const session = await qmoi.initializeSession(userId);
    logger.info(`✓ Session created: ${session.sessionId}`);
    logger.info(`  Focus Level: ${session.consciousness.focusLevel}`);
    logger.info(`  Engagement: ${session.consciousness.engagementLevel}\n`);

    // Step 2: Set consciousness mode
    logger.info('2. Setting consciousness to analytical mode...');
    const engine = qmoi.getConsciousnessEngine();
    await engine.setDecisionMode(userId, 'analytical');
    logger.info('✓ Consciousness mode set to analytical\n');

    // Step 3: Process first thought
    logger.info('3. Processing thought: "I need to optimize the API response time"');
    const action1 = await qmoi.processIntegratedAction(
      session.sessionId,
      'thought',
      'I need to optimize the API response time from 500ms to under 200ms',
      {
        context: {
          project: 'performance',
          priority: 'high',
          impact: 'system-wide',
        },
      }
    );
    logger.info(`✓ Thought processed`);
    logger.info(`  Confidence: ${(action1.confidence * 100).toFixed(1)}%`);
    logger.info(`  Impact Score: ${action1.impact.toFixed(1)}`);
    logger.info(`  Thought stored in memory\n`);

    // Step 4: Process decision
    logger.info('4. Making decision: Choose optimization strategy...');
    const action2 = await qmoi.processIntegratedAction(
      session.sessionId,
      'decision',
      'Which optimization strategy should we implement?',
      {
        options: [
          {
            id: 'opt-caching',
            description: 'Implement Redis caching layer',
            pros: ['high-performance retrieval', 'Reduces database load', 'Proven solution'],
            cons: ['Cache invalidation complexity', 'Memory usage'],
            estimatedOutcome: 'Response time reduced by 300-400ms',
            riskLevel: 'low',
          },
          {
            id: 'opt-indexing',
            description: 'Add database indexing',
            pros: ['Improves query performance', 'Permanent solution'],
            cons: ['Requires database downtime', 'Storage increase'],
            estimatedOutcome: 'Response time reduced by 150-200ms',
            riskLevel: 'medium',
          },
          {
            id: 'opt-parallel',
            description: 'Implement parallel query processing',
            pros: ['Handles multiple requests', 'Scalable'],
            cons: ['Complex production', 'Debugging difficulty'],
            estimatedOutcome: 'Response time reduced by 100-150ms',
            riskLevel: 'high',
          },
        ],
      }
    );
    logger.info(`✓ Decision made`);
    logger.info(`  Chosen: ${action2.result.decision.chosenOption.description}`);
    logger.info(`  Confidence: ${(action2.result.decision.confidence * 100).toFixed(1)}%\n`);

    // Step 5: Process emotional input
    logger.info('5. Processing emotional input: "Excited about the optimization work!"');
    const action3 = await qmoi.processIntegratedAction(
      session.sessionId,
      'thought',
      'I\'m really excited about the optimization work! This is going to make our system so much faster and more efficient!',
      {
        context: {
          mood: 'excited',
          motivation: 'high',
        },
      }
    );
    logger.info(`✓ Emotional input processed`);
    logger.info(`  Dominant Emotion: ${action3.result.empathyResponse.supportMessage}\n`);

    // Step 6: Get updated metrics
    logger.info('6. Retrieving session metrics...');
    const metrics = await qmoi.getMetrics();
    logger.info(`✓ Active sessions: ${metrics.sessionsActive}`);
    logger.info(`  Total thoughts processed: ${metrics.totalThoughts}`);
    logger.info(`  Avg consciousness level: ${metrics.avgConsciousnessLevel.toFixed(1)}%`);
    logger.info(`  Avg emotional stability: ${metrics.avgEmotionalStability.toFixed(1)}%\n`);

    // Step 7: Close session
    logger.info('7. Closing session...');
    await qmoi.closeSession(session.sessionId);
    logger.info('✓ Session closed successfully\n');

    logger.info('=== SESSION COMPLETED SUCCESSFULLY ===\n\n');
  } catch (error) {
    logger.error('production 1 failed', { error });
  }
}

/**
 * production 2: Memory System Deep Dive
 * 
 * Shows how to use the memory system for different memory types
 * and retrieve them based on various criteria.
 */
export async /**
 * exampleMemorySystemUsage function
 */
function exampleMemorySystemUsage(): any {
  logger.info('=== production 2: Memory System Usage ===\n');

  const userId = 'user:987-654-321';
  const memory = qmoi.getMemorySystem();

  try {
    // Store different memory types
    logger.info('1. Storing different types of memories...');

    // Episodic memory (event)
    const episodic = await memory.storeMemory(
      userId,
      'Successfully deployed API optimization to production',
      'episodic',
      {
        importance: 95,
        emotionalValence: 80,
        tags: ['deployment', 'success', 'achievement'],
        context: { date: new Date().toISOString(), project: 'APIv4' },
      }
    );
    logger.info(`✓ Episodic: ${episodic.id}`);

    // Semantic memory (knowledge)
    const semantic = await memory.storeMemory(
      userId,
      'Redis caching improves API response time by 300-400ms on average',
      'semantic',
      {
        importance: 85,
        emotionalValence: 30,
        tags: ['redis', 'caching', 'performance', 'knowledge'],
        context: { source: 'monitoring' },
      }
    );
    logger.info(`✓ Semantic: ${semantic.id}`);

    // Procedural memory (how-to)
    const procedural = await memory.storeMemory(
      userId,
      'To optimize queries: 1) Add indexes, 2) Use caching, 3) Profile queries, 4) Monitor performance',
      'procedural',
      {
        importance: 80,
        emotionalValence: 20,
        tags: ['optimization', 'procedure', 'best-practices'],
      }
    );
    logger.info(`✓ Procedural: ${procedural.id}`);

    // Emotional memory
    const emotional = await memory.storeMemory(
      userId,
      'The team celebrated when we achieved the performance goals',
      'emotional',
      {
        importance: 75,
        emotionalValence: 85,
        tags: ['celebration', 'team', 'emotion', 'success'],
      }
    );
    logger.info(`✓ Emotional: ${emotional.id}\n`);

    // Retrieve memories by query
    logger.info('2. Retrieving memories by query...');
    const results = await memory.retrieveMemories({
      userId,
      query: 'optimization',
      limit: 5,
    });
    logger.info(`✓ Found ${results.length} memories matching "optimization"`);
    for (const mem of results) {
      logger.info(`  - ${mem.type}: "${mem.content.substring(0, 50)}..."`);
    }
    logger.info();

    // Search by tags
    logger.info('3. Searching memories by tags...');
    const tagResults = await memory.searchByTags(userId, ['success', 'achievement'], 3);
    logger.info(`✓ Found ${tagResults.length} memories with success/achievement tags`);
    logger.info();

    // Get time-based memories
    logger.info('4. Getting memories from today...');
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayMemories = await memory.getMemoriesByTimeWindow(
      userId,
      startOfDay,
      endOfDay,
      5
    );
    logger.info(`✓ Found ${todayMemories.length} memories from today\n`);

    // Get memory statistics
    logger.info('5. Memory statistics...');
    const stats = await memory.getMemoryStats(userId);
    logger.info(`✓ Total memories: ${stats.totalMemories}`);
    logger.info(`  By type:`, stats.byType);
    logger.info(`  Average importance: ${stats.averageImportance.toFixed(1)}`);
    logger.info(`  Average strength: ${stats.averageStrength.toFixed(1)}\n`);

    // Update memory importance
    logger.info('6. Updating memory importance...');
    await memory.updateMemoryImportance(episodic.id, 100);
    logger.info(`✓ Memory importance updated to 100\n`);

    // Apply forgetting curve
    logger.info('7. Applying forgetting curve...');
    await memory.applyForgettingCurve(userId);
    logger.info(`✓ Forgetting curve applied - older memories may have reduced strength\n`);

    logger.info('=== MEMORY SYSTEM production COMPLETED ===\n\n');
  } catch (error) {
    logger.error('production 2 failed', { error });
  }
}

/**
 * production 3: Emotional Intelligence Analysis
 * 
 * Shows how to analyze emotions, generate empathetic responses,
 * and learn emotional patterns.
 */
export async /**
 * exampleEmotionalIntelligence function
 */
function exampleEmotionalIntelligence(): any {
  logger.info('=== production 3: Emotional Intelligence ===\n');

  const userId = 'user:555-666-777';
  const emotionalIntel = qmoi.getEmotionalIntelligence();

  try {
    // Analyze different emotional inputs
    logger.info('1. Analyzing various emotional inputs...\n');

    const inputs = [
      { text: 'I\'m so excited! This is amazing!', label: 'Positive' },
      { text: 'I\'m frustrated with these bugs. This is terrible.', label: 'Negative' },
      { text: 'I\'m concerned about the deadline, but hopeful.', label: 'Mixed' },
    ];

    const analyses = [];

    for (const input of inputs) {
      logger.info(`Analyzing "${input.label}": "${input.text}"`);
      const analysis = await emotionalIntel.analyzeEmotions(userId, input.text);
      analyses.push(analysis);

      logger.info(`  Dominant emotion: ${analysis.dominantEmotion}`);
      logger.info(`  Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);
      logger.info(`  Emotions detected:`);
      for (const emotion of analysis.emotions.slice(0, 3)) {
        logger.info(`    - ${emotion.emotion}: ${emotion.score.toFixed(1)}`);
      }
      logger.info();
    }

    // Generate empathetic responses
    logger.info('2. Generating empathetic responses...\n');
    for (const analysis of analyses) {
      logger.info(`Response for "${analysis.dominantEmotion}":`);
      const response = await emotionalIntel.generateEmpathyResponse(analysis);
      logger.info(`  Acknowledgment: "${response.acknowledgment}"`);
      logger.info(`  Support: "${response.supportMessage}"`);
      logger.info(`  Empathy score: ${response.empathyScore.toFixed(1)}\n`);
    }

    // Get emotional profile
    logger.info('3. Building emotional profile...');
    const profile = await emotionalIntel.getEmotionalProfile(userId);
    logger.info(`✓ Profile built from ${Object.keys(profile.averageEmotion).length} emotion types`);
    logger.info(`  Emotional range: ${profile.emotionalRange.toFixed(1)}`);
    logger.info(`  Stability: ${profile.stability.toFixed(1)}`);
    logger.info(`  Responsiveness: ${profile.responsiveness.toFixed(2)}\n`);

    // Detect emotional shifts
    logger.info('4. Detecting emotional shifts...');
    const shift = await emotionalIntel.detectEmotionalShift(userId, 25);
    if (shift && shift.shifted) {
      logger.info(`✓ Detected shift from ${shift.from} to ${shift.to}`);
      logger.info(`  Change magnitude: ${shift.change.toFixed(1)}`);
    } else {
      logger.info('✓ No significant emotional shift detected');
    }
    logger.info();

    // Learn patterns
    logger.info('5. Learning emotional patterns...');
    const patterns = await emotionalIntel.learnEmotionalPatterns(userId);
    logger.info(`✓ Patterns learned`);
    logger.info(`  Frequent combinations:`, patterns.frequentCombinations);
    logger.info();

    logger.info('=== EMOTIONAL INTELLIGENCE production COMPLETED ===\n\n');
  } catch (error) {
    logger.error('production 3 failed', { error });
  }
}

/**
 * production 4: Complex Decision Making With Consciousness Modes
 * 
 * Shows how different consciousness modes affect decision outcomes.
 */
export async /**
 * exampleDecisionMakingModes function
 */
function exampleDecisionMakingModes(): any {
  logger.info('=== production 4: Decision Making Modes ===\n');

  const userId = 'user:111-222-333';
  const engine = qmoi.getConsciousnessEngine();

  try {
    const question = 'Should we refactor the API architecture?';
    const options = [
      {
        id: 'refactor-yes',
        description: 'complete refactor with modern framework',
        pros: ['Better performance', 'Improved maintainability', 'Scalability'],
        cons: ['High time cost', 'Risk of bugs', 'Team learning curve'],
        estimatedOutcome: 'Long-term benefit but short-term disruption',
        riskLevel: 'high',
      },
      {
        id: 'refactor-incremental',
        description: 'Incremental improvements to current architecture',
        pros: ['Low risk', 'Continuous improvement', 'Team familiar'],
        cons: ['Limited scalability', 'Technical debt remains'],
        estimatedOutcome: 'Steady improvement without major disruption',
        riskLevel: 'low',
      },
      {
        id: 'refactor-no',
        description: 'Keep current architecture',
        pros: ['No disruption', 'Proven system', 'Cost savings'],
        cons: ['Accumulating technical debt', 'Future scaling difficult'],
        estimatedOutcome: 'Short-term stability with long-term problems',
        riskLevel: 'medium',
      },
    ];

    // Test each consciousness mode
    const modes = ['analytical', 'intuitive', 'balanced'];

    for (const mode of modes) {
      logger.info(`Decision with "${mode}" mode:\n`);

      await engine.setDecisionMode(userId, mode);
      const decision = await engine.makeDecision(userId, question, options);

      logger.info(`  Chosen option: ${decision.chosenOption.description}`);
      logger.info(`  Confidence: ${(decision.confidence * 100).toFixed(1)}%`);
      logger.info(`  Score: ${decision.chosenOption.score.toFixed(1)}`);
      logger.info(`  Reasoning: ${decision.reasoning}`);
      logger.info(`  Implications:`);
      for (const implication of decision.implications) {
        logger.info(`    - ${implication}`);
      }
      logger.info();
    }

    logger.info('=== DECISION MAKING MODES production COMPLETED ===\n\n');
  } catch (error) {
    logger.error('production 4 failed', { error });
  }
}

/**
 * production 5: Multi-Session Metrics and Cleanup
 * 
 * Shows how to manage multiple sessions and track metrics.
 */
export async /**
 * exampleMultiSessionMetrics function
 */
function exampleMultiSessionMetrics(): any {
  logger.info('=== production 5: Multi-Session Metrics ===\n');

  try {
    // Create multiple sessions
    logger.info('1. Creating multiple sessions...');
    const sessions = [];
    for (let i = 1; i <= 3; i++) {
      const session = await qmoi.initializeSession(`user:${i}`);
      sessions.push(session);
      logger.info(`✓ Session ${i}: ${session.sessionId}`);
    }
    logger.info();

    // Process some actions
    logger.info('2. Processing actions in sessions...');
    for (let i = 0; i < sessions.length; i++) {
      await qmoi.processIntegratedAction(
        sessions[i].sessionId,
        'thought',
        `This is thought ${i + 1} from session ${i + 1}`,
        {}
      );
      logger.info(`✓ Action processed in session ${i + 1}`);
    }
    logger.info();

    // Get metrics
    logger.info('3. Retrieving metrics...');
    const metrics = await qmoi.getMetrics();
    logger.info(`✓ Sessions active: ${metrics.sessionsActive}`);
    logger.info(`  Total thoughts: ${metrics.totalThoughts}`);
    logger.info(`  Avg consciousness: ${metrics.avgConsciousnessLevel.toFixed(1)}%`);
    logger.info(`  Avg emotional stability: ${metrics.avgEmotionalStability.toFixed(1)}%`);
    logger.info(`  Memory retention: ${(metrics.memoryRetentionRate * 100).toFixed(1)}%`);
    logger.info(`  Decision accuracy: ${(metrics.decisionAccuracy * 100).toFixed(1)}%\n`);

    // Close sessions
    logger.info('4. Closing sessions...');
    for (let i = 0; i < sessions.length; i++) {
      await qmoi.closeSession(sessions[i].sessionId);
      logger.info(`✓ Session ${i + 1} closed`);
    }
    logger.info();

    logger.info('=== MULTI-SESSION METRICS production COMPLETED ===\n\n');
  } catch (error) {
    logger.error('production 5 failed', { error });
  }
}

/**
 * Run all examples
 */
export async /**
 * runAllExamples function
 */
function runAllExamples(): any {
  logger.info('\n████████████████████████████████████████████████');
  logger.info('    QMOI production INTEGRATION EXAMPLES v4.0');
  logger.info('████████████████████████████████████████████████\n');

  await exampleCompleteUserSession();
  await exampleMemorySystemUsage();
  await exampleEmotionalIntelligence();
  await exampleDecisionMakingModes();
  await exampleMultiSessionMetrics();

  logger.info('████████████████████████████████████████████████');
  logger.info('         ALL EXAMPLES COMPLETED SUCCESSFULLY');
  logger.info('████████████████████████████████████████████████\n');
}

// Export for testing
export { qmoi };
