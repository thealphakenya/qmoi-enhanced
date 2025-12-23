import { getSessionHeaders } from "./qmoiSession";

async function safeJson(resp: Response) {
  const txt = await resp.text();
  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
}

export async function postChat(payload: any) {
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

export async function postModel(payload: any) {
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

export async function syncMemory(body: any) {
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
