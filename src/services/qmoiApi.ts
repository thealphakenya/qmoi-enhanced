// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import apiClient from '@/api/client';
import { getSessionHeaders } from '@/services/qmoiSession';

async function safeJson(resp: Response): Promise<any> {
  const txt = await resp.text();
  try {
    return JSON.parse(txt);
  } catch (e) {
    return txt;
  }
}

export async function postChat(payload: unknown): Promise<any> {
  const headers = {
    "Content-Type": "application/json",
    ...getSessionHeaders(),
  };
  const resp = await apiClient.get("/api/qmoi/chat", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return safeJson(resp);
}

export async function postModel(payload: unknown): Promise<any> {
  const headers = {
    "Content-Type": "application/json",
    ...getSessionHeaders(),
  };
  const resp = await apiClient.get("/api/qmoi-model", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return safeJson(resp);
}

export async function fetchMemory(): Promise<any> {
  const headers = {
    ...getSessionHeaders(),
  };
  const resp = await apiClient.get("/api/qmoi/memory", { method: "GET", headers });
  return safeJson(resp);
}

export async function syncMemory(body: unknown): Promise<any> {
  const headers = {
    "Content-Type": "application/json",
    ...getSessionHeaders(),
  };
  const resp = await apiClient.get("/api/qmoi/memory", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return safeJson(resp);
}
