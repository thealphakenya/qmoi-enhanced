// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-04-02T04:06:00Z
// Evolution features: lion mode, api auto mode, voice/avatar integration

import { POST as avatarsPOST } from "../../app/api/qmoi/avatars/route";
import { POST as voicesPOST } from "../../app/api/qmoi/voice-profiles/route";

describe("/api/qmoi/avatars and /api/qmoi/voice-profiles auto endpoints", () => {
  it("returns lion auto avatar", async () => {
    const request = new Request("http://test/api/qmoi/avatars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "auto" }),
    });

    const response = await avatarsPOST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.avatar?.id).toBe("lion");
  });

  it("returns lion-roar auto voice", async () => {
    const request = new Request("http://test/api/qmoi/voice-profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "auto" }),
    });

    const response = await voicesPOST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.voice?.id).toBe("lion-roar");
  });

  it("returns error for invalid action on avatars", async () => {
    const request = new Request("http://test/api/qmoi/avatars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "invalid-action" }),
    });

    const response = await avatarsPOST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body._error).toBe("Invalid action");
  });

  it("returns error for invalid action on voice profiles", async () => {
    const request = new Request("http://test/api/qmoi/voice-profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "invalid-action" }),
    });

    const response = await voicesPOST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body._error).toBe("Invalid action");
  });
});
