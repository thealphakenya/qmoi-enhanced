/**
 * QMOI production Integration Examples
 * 
 * Complete working examples showing how to use all QMOI production systems
 * in real-world scenarios.
 */

import QMOIIntegratedServices from '@/qmoi/core/integration/services-production';
import { Logger } from '@/services/logging';
import { CacheService } from '@/services/cache';
import { DatabaseService } from '@/services/database';
import { QVS } from '@/services/qvs';

// Initialize services
const logger = new Logger('QMOIExamples');
const cache = new CacheService();
const db = new DatabaseService();
const qvs = new QVS();

const qmoi = new QMOIIntegratedServices(logger, cache, db, qvs);

/**
 * EXAMPLE 1: Complete User Session Flow
 * 
 * Shows how to create a session, process multiple thoughts,
 * make decisions, and handle emotions.
 */
export async function exampleCompleteUserSession() {
  console.log('=== EXAMPLE 1: Complete User Session ===\n');

  const userId = 'user:123-456-789';

  try {
    // Step 1: Initialize session
    console.log('1. Initializing QMOI session...');
    const session = await qmoi.initializeSession(userId);
    console.log(`✓ Session created: ${session.sessionId}`);
    console.log(`  Focus Level: ${session.consciousness.focusLevel}`);
    console.log(`  Engagement: ${session.consciousness.engagementLevel}\n`);

    // Step 2: Set consciousness mode
    console.log('2. Setting consciousness to analytical mode...');
    const engine = qmoi.getConsciousnessEngine();
    await engine.setDecisionMode(userId, 'analytical');
    console.log('✓ Consciousness mode set to analytical\n');

    // Step 3: Process first thought
    console.log('3. Processing thought: "I need to optimize the API response time"');
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
    console.log(`✓ Thought processed`);
    console.log(`  Confidence: ${(action1.confidence * 100).toFixed(1)}%`);
    console.log(`  Impact Score: ${action1.impact.toFixed(1)}`);
    console.log(`  Thought stored in memory\n`);

    // Step 4: Process decision
    console.log('4. Making decision: Choose optimization strategy...');
    const action2 = await qmoi.processIntegratedAction(
      session.sessionId,
      'decision',
      'Which optimization strategy should we implement?',
      {
        options: [
          {
            id: 'opt-caching',
            description: 'Implement Redis caching layer',
            pros: ['Fast retrieval', 'Reduces database load', 'Proven solution'],
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
            cons: ['Complex implementation', 'Debugging difficulty'],
            estimatedOutcome: 'Response time reduced by 100-150ms',
            riskLevel: 'high',
          },
        ],
      }
    );
    console.log(`✓ Decision made`);
    console.log(`  Chosen: ${action2.result.decision.chosenOption.description}`);
    console.log(`  Confidence: ${(action2.result.decision.confidence * 100).toFixed(1)}%\n`);

    // Step 5: Process emotional input
    console.log('5. Processing emotional input: "Excited about the optimization work!"');
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
    console.log(`✓ Emotional input processed`);
    console.log(`  Dominant Emotion: ${action3.result.empathyResponse.supportMessage}\n`);

    // Step 6: Get updated metrics
    console.log('6. Retrieving session metrics...');
    const metrics = await qmoi.getMetrics();
    console.log(`✓ Active sessions: ${metrics.sessionsActive}`);
    console.log(`  Total thoughts processed: ${metrics.totalThoughts}`);
    console.log(`  Avg consciousness level: ${metrics.avgConsciousnessLevel.toFixed(1)}%`);
    console.log(`  Avg emotional stability: ${metrics.avgEmotionalStability.toFixed(1)}%\n`);

    // Step 7: Close session
    console.log('7. Closing session...');
    await qmoi.closeSession(session.sessionId);
    console.log('✓ Session closed successfully\n');

    console.log('=== SESSION COMPLETED SUCCESSFULLY ===\n\n');
  } catch (error) {
    logger.error('Example 1 failed', { error });
  }
}

/**
 * EXAMPLE 2: Memory System Deep Dive
 * 
 * Shows how to use the memory system for different memory types
 * and retrieve them based on various criteria.
 */
export async function exampleMemorySystemUsage() {
  console.log('=== EXAMPLE 2: Memory System Usage ===\n');

  const userId = 'user:987-654-321';
  const memory = qmoi.getMemorySystem();

  try {
    // Store different memory types
    console.log('1. Storing different types of memories...');

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
    console.log(`✓ Episodic: ${episodic.id}`);

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
    console.log(`✓ Semantic: ${semantic.id}`);

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
    console.log(`✓ Procedural: ${procedural.id}`);

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
    console.log(`✓ Emotional: ${emotional.id}\n`);

    // Retrieve memories by query
    console.log('2. Retrieving memories by query...');
    const results = await memory.retrieveMemories({
      userId,
      query: 'optimization',
      limit: 5,
    });
    console.log(`✓ Found ${results.length} memories matching "optimization"`);
    for (const mem of results) {
      console.log(`  - ${mem.type}: "${mem.content.substring(0, 50)}..."`);
    }
    console.log();

    // Search by tags
    console.log('3. Searching memories by tags...');
    const tagResults = await memory.searchByTags(userId, ['success', 'achievement'], 3);
    console.log(`✓ Found ${tagResults.length} memories with success/achievement tags`);
    console.log();

    // Get time-based memories
    console.log('4. Getting memories from today...');
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
    console.log(`✓ Found ${todayMemories.length} memories from today\n`);

    // Get memory statistics
    console.log('5. Memory statistics...');
    const stats = await memory.getMemoryStats(userId);
    console.log(`✓ Total memories: ${stats.totalMemories}`);
    console.log(`  By type:`, stats.byType);
    console.log(`  Average importance: ${stats.averageImportance.toFixed(1)}`);
    console.log(`  Average strength: ${stats.averageStrength.toFixed(1)}\n`);

    // Update memory importance
    console.log('6. Updating memory importance...');
    await memory.updateMemoryImportance(episodic.id, 100);
    console.log(`✓ Memory importance updated to 100\n`);

    // Apply forgetting curve
    console.log('7. Applying forgetting curve...');
    await memory.applyForgettingCurve(userId);
    console.log(`✓ Forgetting curve applied - older memories may have reduced strength\n`);

    console.log('=== MEMORY SYSTEM EXAMPLE COMPLETED ===\n\n');
  } catch (error) {
    logger.error('Example 2 failed', { error });
  }
}

/**
 * EXAMPLE 3: Emotional Intelligence Analysis
 * 
 * Shows how to analyze emotions, generate empathetic responses,
 * and learn emotional patterns.
 */
export async function exampleEmotionalIntelligence() {
  console.log('=== EXAMPLE 3: Emotional Intelligence ===\n');

  const userId = 'user:555-666-777';
  const emotionalIntel = qmoi.getEmotionalIntelligence();

  try {
    // Analyze different emotional inputs
    console.log('1. Analyzing various emotional inputs...\n');

    const inputs = [
      { text: 'I\'m so excited! This is amazing!', label: 'Positive' },
      { text: 'I\'m frustrated with these bugs. This is terrible.', label: 'Negative' },
      { text: 'I\'m concerned about the deadline, but hopeful.', label: 'Mixed' },
    ];

    const analyses = [];

    for (const input of inputs) {
      console.log(`Analyzing "${input.label}": "${input.text}"`);
      const analysis = await emotionalIntel.analyzeEmotions(userId, input.text);
      analyses.push(analysis);

      console.log(`  Dominant emotion: ${analysis.dominantEmotion}`);
      console.log(`  Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);
      console.log(`  Emotions detected:`);
      for (const emotion of analysis.emotions.slice(0, 3)) {
        console.log(`    - ${emotion.emotion}: ${emotion.score.toFixed(1)}`);
      }
      console.log();
    }

    // Generate empathetic responses
    console.log('2. Generating empathetic responses...\n');
    for (const analysis of analyses) {
      console.log(`Response for "${analysis.dominantEmotion}":`);
      const response = await emotionalIntel.generateEmpathyResponse(analysis);
      console.log(`  Acknowledgment: "${response.acknowledgment}"`);
      console.log(`  Support: "${response.supportMessage}"`);
      console.log(`  Empathy score: ${response.empathyScore.toFixed(1)}\n`);
    }

    // Get emotional profile
    console.log('3. Building emotional profile...');
    const profile = await emotionalIntel.getEmotionalProfile(userId);
    console.log(`✓ Profile built from ${Object.keys(profile.averageEmotion).length} emotion types`);
    console.log(`  Emotional range: ${profile.emotionalRange.toFixed(1)}`);
    console.log(`  Stability: ${profile.stability.toFixed(1)}`);
    console.log(`  Responsiveness: ${profile.responsiveness.toFixed(2)}\n`);

    // Detect emotional shifts
    console.log('4. Detecting emotional shifts...');
    const shift = await emotionalIntel.detectEmotionalShift(userId, 25);
    if (shift && shift.shifted) {
      console.log(`✓ Detected shift from ${shift.from} to ${shift.to}`);
      console.log(`  Change magnitude: ${shift.change.toFixed(1)}`);
    } else {
      console.log('✓ No significant emotional shift detected');
    }
    console.log();

    // Learn patterns
    console.log('5. Learning emotional patterns...');
    const patterns = await emotionalIntel.learnEmotionalPatterns(userId);
    console.log(`✓ Patterns learned`);
    console.log(`  Frequent combinations:`, patterns.frequentCombinations);
    console.log();

    console.log('=== EMOTIONAL INTELLIGENCE EXAMPLE COMPLETED ===\n\n');
  } catch (error) {
    logger.error('Example 3 failed', { error });
  }
}

/**
 * EXAMPLE 4: Complex Decision Making With Consciousness Modes
 * 
 * Shows how different consciousness modes affect decision outcomes.
 */
export async function exampleDecisionMakingModes() {
  console.log('=== EXAMPLE 4: Decision Making Modes ===\n');

  const userId = 'user:111-222-333';
  const engine = qmoi.getConsciousnessEngine();

  try {
    const question = 'Should we refactor the API architecture?';
    const options = [
      {
        id: 'refactor-yes',
        description: 'Complete refactor with modern framework',
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
      console.log(`Decision with "${mode}" mode:\n`);

      await engine.setDecisionMode(userId, mode);
      const decision = await engine.makeDecision(userId, question, options);

      console.log(`  Chosen option: ${decision.chosenOption.description}`);
      console.log(`  Confidence: ${(decision.confidence * 100).toFixed(1)}%`);
      console.log(`  Score: ${decision.chosenOption.score.toFixed(1)}`);
      console.log(`  Reasoning: ${decision.reasoning}`);
      console.log(`  Implications:`);
      for (const implication of decision.implications) {
        console.log(`    - ${implication}`);
      }
      console.log();
    }

    console.log('=== DECISION MAKING MODES EXAMPLE COMPLETED ===\n\n');
  } catch (error) {
    logger.error('Example 4 failed', { error });
  }
}

/**
 * EXAMPLE 5: Multi-Session Metrics and Cleanup
 * 
 * Shows how to manage multiple sessions and track metrics.
 */
export async function exampleMultiSessionMetrics() {
  console.log('=== EXAMPLE 5: Multi-Session Metrics ===\n');

  try {
    // Create multiple sessions
    console.log('1. Creating multiple sessions...');
    const sessions = [];
    for (let i = 1; i <= 3; i++) {
      const session = await qmoi.initializeSession(`user:${i}`);
      sessions.push(session);
      console.log(`✓ Session ${i}: ${session.sessionId}`);
    }
    console.log();

    // Process some actions
    console.log('2. Processing actions in sessions...');
    for (let i = 0; i < sessions.length; i++) {
      await qmoi.processIntegratedAction(
        sessions[i].sessionId,
        'thought',
        `This is thought ${i + 1} from session ${i + 1}`,
        {}
      );
      console.log(`✓ Action processed in session ${i + 1}`);
    }
    console.log();

    // Get metrics
    console.log('3. Retrieving metrics...');
    const metrics = await qmoi.getMetrics();
    console.log(`✓ Sessions active: ${metrics.sessionsActive}`);
    console.log(`  Total thoughts: ${metrics.totalThoughts}`);
    console.log(`  Avg consciousness: ${metrics.avgConsciousnessLevel.toFixed(1)}%`);
    console.log(`  Avg emotional stability: ${metrics.avgEmotionalStability.toFixed(1)}%`);
    console.log(`  Memory retention: ${(metrics.memoryRetentionRate * 100).toFixed(1)}%`);
    console.log(`  Decision accuracy: ${(metrics.decisionAccuracy * 100).toFixed(1)}%\n`);

    // Close sessions
    console.log('4. Closing sessions...');
    for (let i = 0; i < sessions.length; i++) {
      await qmoi.closeSession(sessions[i].sessionId);
      console.log(`✓ Session ${i + 1} closed`);
    }
    console.log();

    console.log('=== MULTI-SESSION METRICS EXAMPLE COMPLETED ===\n\n');
  } catch (error) {
    logger.error('Example 5 failed', { error });
  }
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('\n████████████████████████████████████████████████');
  console.log('    QMOI production INTEGRATION EXAMPLES v4.0');
  console.log('████████████████████████████████████████████████\n');

  await exampleCompleteUserSession();
  await exampleMemorySystemUsage();
  await exampleEmotionalIntelligence();
  await exampleDecisionMakingModes();
  await exampleMultiSessionMetrics();

  console.log('████████████████████████████████████████████████');
  console.log('         ALL EXAMPLES COMPLETED SUCCESSFULLY');
  console.log('████████████████████████████████████████████████\n');
}

// Export for testing
export { qmoi };
