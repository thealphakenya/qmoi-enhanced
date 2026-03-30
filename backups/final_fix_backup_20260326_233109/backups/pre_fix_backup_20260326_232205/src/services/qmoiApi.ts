// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { getSessionHeaders } from "./qmoiSession";

async function safeJson(resp: Response) {
  const txt = await resp.text();
  try {
    return JSON.parse(txt);
  } catch (e) {
    return txt;
  }
}

export async function postChat(payload: unknown) {
  const headers = {
    "Content-Type": "application/json",
    ...getSessionHeaders(),
  };
  const resp = await fetch("/api/qmoi/chat", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return safeJson(resp);
}

export async function postModel(payload: unknown) {
  const headers = {
    "Content-Type": "application/json",
    ...getSessionHeaders(),
  };
  const resp = await fetch("/api/qmoi-model", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return safeJson(resp);
}

export async function fetchMemory() {
  const headers = { ...getSessionHeaders() };
  const resp = await fetch("/api/qmoi/memory", { method: "GET", headers });
  return safeJson(resp);
}

export async function syncMemory(body: unknown) {
  const headers = {
    "Content-Type": "application/json",
    ...getSessionHeaders(),
  };
  const resp = await fetch("/api/qmoi/memory", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return safeJson(resp);
}
