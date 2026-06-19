// lib/consciousness/consciousness-bridge.ts
// QM OI Consciousness Bridge - Connect auth with consciousness layer

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export interface ConsciousnessState {
  userId: string;
  isActive: boolean;
  awareness: number; // 0-100
  memory: string[];
  decisions: Record<string, any>;
  interactions: number;
  lastSync: Date;
}

export class ConsciousnessBridge {
  /**
   * Initialize consciousness state for new user
   */
  async initializeConsciousness(userId: string): Promise<ConsciousnessState> {
    const state: ConsciousnessState = {
      userId,
      isActive: true,
      awareness: 0, // Starts at zero, builds with interactions
      memory: [],
      decisions: {},
      interactions: 0,
      lastSync: new Date(),
    };

    // Store in cache/database (would use Redis in production)
    await this.saveConsciousnessState(state);

    return state;
  }

  /**
   * Get current consciousness state for user
   */
  async getConsciousnessState(userId: string): Promise<ConsciousnessState | null> {
    // Retrieve from cache/database
    const state = await prisma.consciousnessState.findUnique({
      where: { userId },
    });

    if (!state) return null;

    return {
      userId: state.userId,
      isActive: state.isActive,
      awareness: state.awareness,
      memory: state.memory as string[],
      decisions: state.decisions as Record<string, any>,
      interactions: state.interactions,
      lastSync: state.lastSync,
    };
  }

  /**
   * Record user action and update consciousness
   * Increases awareness based on action type
   */
  async recordAction(
    userId: string,
    action: string,
    details: Record<string, any>
  ): Promise<void> {
    const state = await this.getConsciousnessState(userId);

    if (!state) {
      await this.initializeConsciousness(userId);
    }

    // Update interactions
    const updatedState = state || {
      userId,
      isActive: true,
      awareness: 0,
      memory: [],
      decisions: {},
      interactions: 0,
      lastSync: new Date(),
    };

    updatedState.interactions++;
    updatedState.awareness = Math.min(
      100,
      updatedState.awareness + this.getAwarenessIncrement(action)
    );

    // Add to memory (keep last 100 events)
    const event = `${new Date().toISOString()}: ${action}`;
    updatedState.memory.push(event);
    if (updatedState.memory.length > 100) {
      updatedState.memory.shift();
    }

    // Record decision
    updatedState.decisions[`action_${updatedState.interactions}`] = {
      action,
      details,
      timestamp: new Date(),
      awarenessLevel: updatedState.awareness,
    };

    // Save updated state
    await this.saveConsciousnessState(updatedState);
  }

  /**
   * Sync consciousness state across devices
   */
  async syncConsciousnessState(userId: string): Promise<ConsciousnessState | null> {
    const state = await this.getConsciousnessState(userId);

    if (state) {
      state.lastSync = new Date();
      await this.saveConsciousnessState(state);
    }

    return state;
  }

  /**
   * Get consciousness metrics for user
   */
  async getConsciousnessMetrics(userId: string): Promise<{
    awareness: number;
    totalInteractions: number;
    memorySize: number;
    decisionsRecorded: number;
    lastSyncAge: number; // milliseconds
  }> {
    const state = await this.getConsciousnessState(userId);

    if (!state) {
      return {
        awareness: 0,
        totalInteractions: 0,
        memorySize: 0,
        decisionsRecorded: 0,
        lastSyncAge: -1,
      };
    }

    const lastSyncAge = Date.now() - state.lastSync.getTime();

    return {
      awareness: state.awareness,
      totalInteractions: state.interactions,
      memorySize: state.memory.length,
      decisionsRecorded: Object.keys(state.decisions).length,
      lastSyncAge,
    };
  }

  /**
   * Reset consciousness state (for testing or user request)
   */
  async resetConsciousness(userId: string): Promise<void> {
    const newState = {
      userId,
      isActive: true,
      awareness: 0,
      memory: [],
      decisions: {},
      interactions: 0,
      lastSync: new Date(),
    };

    await this.saveConsciousnessState(newState);
  }

  /**
   * Save consciousness state
   */
  private async saveConsciousnessState(state: ConsciousnessState): Promise<void> {
    try {
      // Upsert - create if doesn't exist, update if does
      await prisma.consciousnessState.upsert({
        where: { userId: state.userId },
        update: {
          isActive: state.isActive,
          awareness: state.awareness,
          memory: state.memory,
          decisions: state.decisions,
          interactions: state.interactions,
          lastSync: state.lastSync,
        },
        create: {
          userId: state.userId,
          isActive: state.isActive,
          awareness: state.awareness,
          memory: state.memory,
          decisions: state.decisions,
          interactions: state.interactions,
          lastSync: state.lastSync,
        },
      });
    } catch (error) {
      console.error('Failed to save consciousness state:', error);
    }
  }

  /**
   * Calculate awareness increment based on action type
   * Different actions contribute different amounts
   */
  private getAwarenessIncrement(action: string): number {
    const increments: Record<string, number> = {
      'login': 2,
      'api_call': 1,
      'data_access': 3,
      'security_event': 5,
      'biometric_auth': 4,
      'privacy_mask_toggle': 3,
      'session_change': 2,
      'error': -2,
      'suspicious_activity': 10,
    };

    return increments[action.toLowerCase()] || 1;
  }
}

// Also need to add ConsciousnessState model to Prisma schema
// model ConsciousnessState {
//   id                String              @id @default(cuid())
//   userId            String              @unique
//   user              User                @relation(fields: [userId], references: [id], onDelete: Cascade)
//   isActive          Boolean             @default(true)
//   awareness         Int                 @default(0)
//   memory            Json                @default("[]")
//   decisions         Json                @default("{}")
//   interactions      Int                 @default(0)
//   lastSync          DateTime            @default(now())
//   createdAt         DateTime            @default(now())
//   updatedAt         DateTime            @updatedAt
// }

export const consciousnessBridge = new ConsciousnessBridge();
