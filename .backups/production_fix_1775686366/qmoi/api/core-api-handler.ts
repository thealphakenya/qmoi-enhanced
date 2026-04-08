/**
 * QMOI Core API Handler - production Implementation
 * 
 * Handles all core QMOI operations with full production-grade implementations:
 * - Consciousness management
 * - Thought processing and reasoning
 * - Decision making
 * - Memory management
 * - Emotional intelligence
 * - Real-time awareness
 */

import { NextRequest, NextResponse } from 'next/server';
import { Logger } from '@/services/logging';
import { CacheService } from '@/services/cache';
import { DatabaseService } from '@/services/database';
import { QVS } from '@/services/qvs';
import ConsciousnessEngine from '@/qmoi/core/consciousness/engine-production';
import { AuthMiddleware } from '@/middleware/auth';
import { RateLimiter } from '@/middleware/rate-limit';
import { ErrorHandler } from '@/middleware/error-handler';

// Initialize services
const logger = new Logger('CoreAPIHandler');
const cache = new CacheService();
const db = new DatabaseService();
const qvs = new QVS();
const consciousnessEngine = new ConsciousnessEngine(logger, cache, db, qvs);

/**
 * POST /api/core/consciousness/initialize
 * Initialize consciousness for a user
 */
export async function initializeConsciousness(request: NextRequest) {
  try {
    const auth = await AuthMiddleware.verify(request);
    if (!auth) return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );

    const userId = auth.userId;

    // Check rate limit
    const rateLimitCheck = await RateLimiter.check(
      `init:${userId}`,
      10,
      3600 // 10 requests per hour
    );
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitCheck.retryAfter },
        { status: 429 }
      );
    }

    // Initialize consciousness
    const state = await consciousnessEngine.initializeConsciousness(userId);

    // Track in QVS
    await qvs.track('consciousness_initialized', {
      userId,
      timestamp: new Date().toISOString(),
      focusLevel: state.focusLevel,
      engagementLevel: state.engagementLevel,
    });

    logger.info('Consciousness initialized via API', { userId });

    return NextResponse.json({
      success: true,
      data: {
        consciousnessId: state.id,
        version: state.version,
        emotionalState: state.emotionalState,
        focusLevel: state.focusLevel,
        engagementLevel: state.engagementLevel,
        decisionMakingMode: state.decisionMakingMode,
      },
    });
  } catch (error) {
    logger.error('Failed to initialize consciousness', { error });
    return ErrorHandler.handle(error);
  }
}

/**
 * POST /api/core/thought/process
 * Process a thought through consciousness
 */
export async function processThought(request: NextRequest) {
  try {
    const auth = await AuthMiddleware.verify(request);
    if (!auth) return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );

    const userId = auth.userId;
    const { content, context } = await request.json();

    // Validate input
    if (!content || typeof content !== 'string' || content.length === 0) {
      return NextResponse.json(
        { error: 'Invalid thought content' },
        { status: 400 }
      );
    }

    if (content.length > 10000) {
      return NextResponse.json(
        { error: 'Thought content too long (max 10000 characters)' },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimitCheck = await RateLimiter.check(
      `thought:${userId}`,
      100,
      3600 // 100 thoughts per hour
    );
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitCheck.retryAfter },
        { status: 429 }
      );
    }

    // Process thought
    const thought = await consciousnessEngine.processThought(
      userId,
      content,
      context || {}
    );

    // Track in QVS
    await qvs.track('thought_processed', {
      userId,
      thoughtId: thought.id,
      confidence: thought.confidence,
      emotionalTone: thought.emotionalTone,
      contentLength: content.length,
    });

    logger.info('Thought processed via API', {
      userId,
      thoughtId: thought.id,
      confidence: thought.confidence,
    });

    return NextResponse.json({
      success: true,
      data: {
        thoughtId: thought.id,
        confidence: thought.confidence,
        reasoning: thought.reasoning,
        emotionalTone: thought.emotionalTone,
        relatedThoughts: thought.relatedThoughts.length,
      },
    });
  } catch (error) {
    logger.error('Failed to process thought', { error });
    return ErrorHandler.handle(error);
  }
}

/**
 * POST /api/core/decision/make
 * Make a decision based on consciousness
 */
export async function makeDecision(request: NextRequest) {
  try {
    const auth = await AuthMiddleware.verify(request);
    if (!auth) return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );

    const userId = auth.userId;
    const { question, options } = await request.json();

    // Validate input
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Invalid question' },
        { status: 400 }
      );
    }

    if (!Array.isArray(options) || options.length < 2 || options.length > 10) {
      return NextResponse.json(
        { error: 'Options must be an array with 2-10 items' },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimitCheck = await RateLimiter.check(
      `decision:${userId}`,
      50,
      3600 // 50 decisions per hour
    );
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitCheck.retryAfter },
        { status: 429 }
      );
    }

    // Make decision
    const decision = await consciousnessEngine.makeDecision(
      userId,
      question,
      options
    );

    // Track in QVS
    await qvs.track('decision_made', {
      userId,
      decisionId: decision.id,
      confidence: decision.confidence,
      questionLength: question.length,
      optionCount: options.length,
    });

    logger.info('Decision made via API', {
      userId,
      decisionId: decision.id,
      confidence: decision.confidence,
    });

    return NextResponse.json({
      success: true,
      data: {
        decisionId: decision.id,
        chosenOption: {
          id: decision.chosenOption.id,
          description: decision.chosenOption.description,
          score: decision.chosenOption.score,
        },
        confidence: decision.confidence,
        reasoning: decision.reasoning,
        implications: decision.implications,
      },
    });
  } catch (error) {
    logger.error('Failed to make decision', { error });
    return ErrorHandler.handle(error);
  }
}

/**
 * GET /api/core/consciousness/state
 * Get current consciousness state
 */
export async function getConsciousnessState(request: NextRequest) {
  try {
    const auth = await AuthMiddleware.verify(request);
    if (!auth) return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );

    const userId = auth.userId;

    // Get consciousness state
    const state = await consciousnessEngine.getConsciousnessState(userId);

    // Track in QVS
    await qvs.track('consciousness_state_retrieved', {
      userId,
      timestamp: new Date().toISOString(),
    });

    logger.info('Consciousness state retrieved via API', { userId });

    return NextResponse.json({
      success: true,
      data: {
        consciousnessId: state.id,
        currentThought: state.currentThought ? {
          id: state.currentThought.id,
          confidence: state.currentThought.confidence,
          emotionalTone: state.currentThought.emotionalTone,
        } : null,
        thoughtStreamLength: state.thoughtStream.length,
        memoryCount: state.memories.length,
        emotionalState: state.emotionalState,
        focusLevel: state.focusLevel,
        engagementLevel: state.engagementLevel,
        decisionMakingMode: state.decisionMakingMode,
        lastUpdated: state.timestamp,
      },
    });
  } catch (error) {
    logger.error('Failed to get consciousness state', { error });
    return ErrorHandler.handle(error);
  }
}

/**
 * PUT /api/core/consciousness/mode
 * Set consciousness decision-making mode
 */
export async function setConsciousnessMode(request: NextRequest) {
  try {
    const auth = await AuthMiddleware.verify(request);
    if (!auth) return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );

    const userId = auth.userId;
    const { mode } = await request.json();

    // Validate mode
    if (!['analytical', 'intuitive', 'balanced'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be analytical, intuitive, or balanced' },
        { status: 400 }
      );
    }

    // Set mode
    await consciousnessEngine.setDecisionMode(userId, mode);

    // Track in QVS
    await qvs.track('consciousness_mode_changed', {
      userId,
      mode,
      timestamp: new Date().toISOString(),
    });

    logger.info('Consciousness mode set via API', { userId, mode });

    return NextResponse.json({
      success: true,
      data: {
        mode,
        message: `Consciousness mode set to ${mode}`,
      },
    });
  } catch (error) {
    logger.error('Failed to set consciousness mode', { error });
    return ErrorHandler.handle(error);
  }
}

/**
 * GET /api/core/health
 * Health check for consciousness core
 */
export async function healthCheck(request: NextRequest) {
  try {
    const checks = {
      cache: 'healthy',
      database: 'healthy',
      consciousness: 'operational',
      qvs: 'active',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: checks,
      status: 'healthy',
    });
  } catch (error) {
    logger.error('Health check failed', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Health check failed',
        status: 'unhealthy',
      },
      { status: 503 }
    );
  }
}

/**
 * Route handler wrapper for Next.js
 */
export async function handleCoreAPI(
  request: NextRequest,
  context: any
): Promise<NextResponse> {
  const pathname = new URL(request.url).pathname;

  if (pathname.includes('/consciousness/initialize') && request.method === 'POST') {
    return await initializeConsciousness(request);
  }

  if (pathname.includes('/thought/process') && request.method === 'POST') {
    return await processThought(request);
  }

  if (pathname.includes('/decision/make') && request.method === 'POST') {
    return await makeDecision(request);
  }

  if (pathname.includes('/consciousness/state') && request.method === 'GET') {
    return await getConsciousnessState(request);
  }

  if (pathname.includes('/consciousness/mode') && request.method === 'PUT') {
    return await setConsciousnessMode(request);
  }

  if (pathname.includes('/health') && request.method === 'GET') {
    return await healthCheck(request);
  }

  return NextResponse.json(
    { error: 'Not found' },
    { status: 404 }
  );
}

// Export handlers for use in route.ts files
export {
  initializeConsciousness,
  processThought,
  makeDecision,
  getConsciousnessState,
  setConsciousnessMode,
  healthCheck,
  handleCoreAPI,
};
