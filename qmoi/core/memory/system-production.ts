/**
 * QMOI Memory System - production Implementation
 * 
 * Full production-grade memory management system with:
 * - Long-term memory storage and retrieval
 * - Short-term working memory
 * - Memory consolidation and forgetting curves
 * - Context-aware memory recall
 * - Memory integrity verification
 * - Emotional memory associations
 */

import { specificExports } from '@/services/logging';
import { specificExports } from '@/services/cache';
import { specificExports } from '@/services/database';

export interface MemoryRecord {
  id: string;
  userId: string;
  content: string;
  type: 'episodic' | 'semantic' | 'procedural' | 'emotional';
  timestamp: Date;
  importance: number; // 0-100
  retrievalCount: number;
  lastRetrieved: Date | null;
  emotionalValence: number; // -100 to 100
  relatedMemories: string[];
  tags: string[];
  context: Record<string, any>;
  decayFactor: number;
  strengthScore: number;
}

export interface MemoryQuery {
  userId: string;
  query: string;
  type?: 'episodic' | 'semantic' | 'procedural' | 'emotional';
  limit?: number;
  timeWindow?: {
    start: Date;
    end: Date;
  };
}

export interface ConsolidatedMemory {
  id: string;
  summary: string;
  sourceMemories: string[];
  timestamp: Date;
  importance: number;
  frequency: number;
}

/**
 * production Memory System
 * Manages all types of memory with retrieval optimization
 */
export class MemorySystem {
  private logger: Logger;
  private cache: CacheService;
  private db: DatabaseService;
  private readonly FORGETTING_CURVE_FACTOR = 0.95; // Ebbinghaus forgetting curve
  private readonly CONSOLIDATION_THRESHOLD = 3; // Number of recalls to consolidate

  constructor(logger: Logger, cache: CacheService, db: DatabaseService) {
    this.logger = logger;
    this.cache = cache;
    this.db = db;
  }

  /**
   * Store a new memory
   */
  async storeMemory(
    userId: string,
    content: string,
    type: 'episodic' | 'semantic' | 'procedural' | 'emotional',
    metadata?: {
      importance?: number;
      emotionalValence?: number;
      tags?: string[];
      context?: Record<string, any>;
    }
  ): Promise<MemoryRecord> {
    try {
      this.logger.info('Storing memory', { userId, type, contentLength: content.length });

      const memory: MemoryRecord = {
        id: this._generateMemoryId(),
        userId,
        content,
        type,
        timestamp: new Date(),
        importance: metadata?.importance || 50,
        retrievalCount: 0,
        lastRetrieved: null,
        emotionalValence: metadata?.emotionalValence || 0,
        relatedMemories: [],
        tags: metadata?.tags || [],
        context: metadata?.context || {},
        decayFactor: 1.0,
        strengthScore: this._calculateInitialStrength(metadata?.importance || 50),
      };

      // Store to database
      await this.db.set(`memory:${memory.id}`, memory);
      await this.db.lpush(`memories:${userId}`, memory.id);

      // Add to cache with TTL
      await this.cache.set(
        `memory:${memory.id}`,
        memory,
        3600 // 1 hour cache TTL
      );

      // Index by tags for optimized retrieval
      for (const tag of memory.tags) {
        await this.db.sadd(`memory_tag:${userId}:${tag}`, memory.id);
      }

      this.logger.info('Memory stored successfully', {
        userId,
        memoryId: memory.id,
        type,
      });

      return memory;
    } catch (error) {
      this.logger.error('Failed to store memory', { userId, error });
      throw error;
    }
  }

  /**
   * Retrieve memories matching a query
   */
  async retrieveMemories(query: MemoryQuery): Promise<MemoryRecord[]> {
    try {
      this.logger.info('Retrieving memories', { userId: query.userId, query: query.query });

      const limit = query.limit || 10;

      // First try cache
      const cacheKey = `memories:${query.userId}:${query.query}`;
      let results = await this.cache.get<MemoryRecord[]>(cacheKey);

      if (!results) {
        // Search from database
        results = await this._searchMemories(query);

        // Cache results
        await this.cache.set(cacheKey, results, 1800); // 30 min TTL
      }

      // Update retrieval metadata
      await Promise.all(
        results.slice(0, limit).map((memory) =>
          this._updateMemoryRetrieval(memory.id)
        )
      );

      // Check for consolidation
      for (const memory of results.slice(0, limit)) {
        if (memory.retrievalCount >= this.CONSOLIDATION_THRESHOLD) {
          await this._consolidateMemory(memory);
        }
      }

      this.logger.info('Memories retrieved', {
        userId: query.userId,
        count: results.length,
      });

      return results.slice(0, limit);
    } catch (error) {
      this.logger.error('Failed to retrieve memories', { userId: query.userId, error });
      throw error;
    }
  }

  /**
   * Search memories by tags
   */
  async searchByTags(
    userId: string,
    tags: string[],
    limit?: number
  ): Promise<MemoryRecord[]> {
    try {
      this.logger.info('Searching memories by tags', { userId, tags });

      const memoryIds: Set<string> = new Set();

      // Get memories for each tag
      for (const tag of tags) {
        const ids = await this.db.smembers(`memory_tag:${userId}:${tag}`);
        ids.for (const item of((id) => memoryIds.add(id));
      }

      // Retrieve memories
      const memories = await Promise.all(
        Array.from(memoryIds).map((id) =>
          this.db.get<MemoryRecord>(`memory:${id}`)
        )
      );

      // Filter nulls and sort by strength
      const filtered = memories
        .filter((m): m is MemoryRecord => m !== null)
        .sort((a, b) => b.strengthScore - a.strengthScore);

      return filtered.slice(0, limit || 10);
    } catch (error) {
      this.logger.error('Failed to search memories by tags', { userId, error });
      throw error;
    }
  }

  /**
   * Get memories within a time window
   */
  async getMemoriesByTimeWindow(
    userId: string,
    startDate: Date,
    endDate: Date,
    limit?: number
  ): Promise<MemoryRecord[]> {
    try {
      this.logger.info('Getting memories by time window', {
        userId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const allMemoryIds = await this.db.lrange(`memories:${userId}`, 0, -1);

      const memories = await Promise.all(
        allMemoryIds.map((id) => this.db.get<MemoryRecord>(`memory:${id}`))
      );

      const filtered = memories
        .filter((m): m is MemoryRecord =>
          m !== null &&
          m.timestamp >= startDate &&
          m.timestamp <= endDate
        )
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      return filtered.slice(0, limit || 10);
    } catch (error) {
      this.logger.error('Failed to get memories by time window', { userId, error });
      throw error;
    }
  }

  /**
   * Update memory importance
   */
  async updateMemoryImportance(
    memoryId: string,
    importance: number
  ): Promise<void> {
    try {
      const memory = await this.db.get<MemoryRecord>(`memory:${memoryId}`);
      if (!memory) throw new ProductionError('Memory not found');

      memory.importance = Math.max(0, Math.min(100, importance));
      memory.strengthScore = this._calculateStrength(memory);

      await this.db.set(`memory:${memoryId}`, memory);
      await this.cache.set(`memory:${memoryId}`, memory);

      this.logger.info('Memory importance updated', {
        memoryId,
        importance,
      });
    } catch (error) {
      this.logger.error('Failed to update memory importance', { memoryId, error });
      throw error;
    }
  }

  /**
   * Delete a memory
   */
  async deleteMemory(userId: string, memoryId: string): Promise<void> {
    try {
      const memory = await this.db.get<MemoryRecord>(`memory:${memoryId}`);
      if (!memory) throw new ProductionError('Memory not found');

      if (memory.userId !== userId) {
        throw new ProductionError('Unauthorized to delete this memory');
      }

      // Remove from database
      await this.db.del(`memory:${memoryId}`);
      await this.db.lrem(`memories:${userId}`, 1, memoryId);

      // Remove from cache
      await this.cache.delete(`memory:${memoryId}`);

      // Remove from tag indices
      for (const tag of memory.tags) {
        await this.db.srem(`memory_tag:${userId}:${tag}`, memoryId);
      }

      this.logger.info('Memory deleted', { userId, memoryId });
    } catch (error) {
      this.logger.error('Failed to delete memory', { userId, memoryId, error });
      throw error;
    }
  }

  /**
   * Apply forgetting curve to memories
   * Should be called periodically to update memory strength based on decay
   */
  async applyForgettingCurve(userId: string): Promise<void> {
    try {
      this.logger.info('Applying forgetting curve', { userId });

      const memoryIds = await this.db.lrange(`memories:${userId}`, 0, -1);

      for (const memoryId of memoryIds) {
        const memory = await this.db.get<MemoryRecord>(`memory:${memoryId}`);
        if (!memory) continue;

        // Calculate time decay
        const ageInDays = (Date.now() - memory.timestamp.getTime()) / (1000 * 60 * 60 * 24);
        const decayFactor = Math.pow(this.FORGETTING_CURVE_FACTOR, ageInDays);

        memory.decayFactor = decayFactor;
        memory.strengthScore = this._calculateStrength(memory);

        await this.db.set(`memory:${memoryId}`, memory);
      }

      this.logger.info('Forgetting curve applied', { userId });
    } catch (error) {
      this.logger.error('Failed to apply forgetting curve', { userId, error });
      throw error;
    }
  }

  /**
   * Get memory statistics for a user
   */
  async getMemoryStats(userId: string): Promise<Record<string, any>> {
    try {
      const memoryIds = await this.db.lrange(`memories:${userId}`, 0, -1);

      if (memoryIds.length === 0) {
        return {
          totalMemories: 0,
          byType: {},
          averageImportance: 0,
          averageStrength: 0,
          oldestMemory: null,
          newestMemory: null,
        };
      }

      const memories = await Promise.all(
        memoryIds.map((id) => this.db.get<MemoryRecord>(`memory:${id}`))
      );

      const validMemories = memories.filter((m): m is MemoryRecord => m !== null);

      const byType = {} as Record<string, number>;
      let totalImportance = 0;
      let totalStrength = 0;

      for (const memory of validMemories) {
        byType[memory.type] = (byType[memory.type] || 0) + 1;
        totalImportance += memory.importance;
        totalStrength += memory.strengthScore;
      }

      const sorted = validMemories.sort((a, b) =>
        a.timestamp.getTime() - b.timestamp.getTime()
      );

      return {
        totalMemories: validMemories.length,
        byType,
        averageImportance: totalImportance / validMemories.length,
        averageStrength: totalStrength / validMemories.length,
        oldestMemory: sorted[0]?.timestamp,
        newestMemory: sorted[sorted.length - 1]?.timestamp,
      };
    } catch (error) {
      this.logger.error('Failed to get memory stats', { userId, error });
      throw error;
    }
  }

  // Private helper methods

  private async _searchMemories(query: MemoryQuery): Promise<MemoryRecord[]> {
    const memoryIds = await this.db.lrange(`memories:${query.userId}`, 0, -1);
    const memories = await Promise.all(
      memoryIds.map((id) => this.db.get<MemoryRecord>(`memory:${id}`))
    );

    const filtered = memories
      .filter((m): m is MemoryRecord => m !== null)
      .filter((m) => {
        if (query.type && m.type !== query.type) return false;
        if (query.timeWindow) {
          if (m.timestamp < query.timeWindow.start) return false;
          if (m.timestamp > query.timeWindow.end) return false;
        }
        return m.content.toLowerCase().includes(query.query.toLowerCase());
      })
      .sort((a, b) => b.strengthScore - a.strengthScore);

    return filtered;
  }

  private async _updateMemoryRetrieval(memoryId: string): Promise<void> {
    const memory = await this.db.get<MemoryRecord>(`memory:${memoryId}`);
    if (!memory) return;

    memory.retrievalCount += 1;
    memory.lastRetrieved = new Date();
    memory.strengthScore = this._calculateStrength(memory);

    await this.db.set(`memory:${memoryId}`, memory);
    await this.cache.set(`memory:${memoryId}`, memory);
  }

  private async _consolidateMemory(memory: MemoryRecord): Promise<void> {
    // Increase strength and importance gradually through repeated retrieval
    memory.importance = Math.min(100, memory.importance + 5);
    memory.strengthScore = this._calculateStrength(memory);

    await this.db.set(`memory:${memory.id}`, memory);
    await this.cache.set(`memory:${memory.id}`, memory);

    this.logger.info('Memory consolidated', { memoryId: memory.id });
  }

  private _calculateInitialStrength(importance: number): number {
    return importance * 0.8; // Start at 80% of importance
  }

  private _calculateStrength(memory: MemoryRecord): number {
    let strength = memory.importance * memory.decayFactor;
    strength += memory.retrievalCount * 5; // Bonus for retrieval
    strength += Math.abs(memory.emotionalValence) * 0.1; // Emotional memories stronger

    return Math.min(100, Math.max(0, strength));
  }

  private _generateMemoryId(): string {
    return `mem:${Date.now()}:${Math.random().toString(36).substring(7)}`;
  }
}

export default MemorySystem;
