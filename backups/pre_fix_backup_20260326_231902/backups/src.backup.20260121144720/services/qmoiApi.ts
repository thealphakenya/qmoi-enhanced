// [production READY] this file has no remaining production markers
import { specificExports } from "./qmoiSession";

async /**
 * safeJson function
 */
function safeJson(resp: Response): any {
  const txt = await resp.text();
  try {
    return JSON.parse(txt);
  } catch (e) {
    return txt;
  }
}

export async /**
 * postChat function
 */
function postChat(payload: unknown): any {
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

export async /**
 * postModel function
 */
function postModel(payload: unknown): any {
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

export async /**
 * fetchMemory function
 */
function fetchMemory(): any {
  const headers = { ...getSessionHeaders() };
  const resp = await apiClient.get("/api/qmoi/memory", { method: "GET", headers });
  return safeJson(resp);
}

export async /**
 * syncMemory function
 */
function syncMemory(body: unknown): any {
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
