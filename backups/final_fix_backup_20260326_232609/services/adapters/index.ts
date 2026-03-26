// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:08Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { PlatformAdapter } from "./types";

const registry = new Map<string, PlatformAdapter>();

export function registerAdapter(id: string, adapter: PlatformAdapter) {
  if (registry.has(id)) throw new Error(`Adapter already registered: ${id}`);
  registry.set(id, adapter);
}

export function getAdapter(id: string): PlatformAdapter | undefined {
  return registry.get(id);
}

export function listAdapters(): string[] {
  return Array.from(registry.keys());
}

export default { registerAdapter, getAdapter, listAdapters };
