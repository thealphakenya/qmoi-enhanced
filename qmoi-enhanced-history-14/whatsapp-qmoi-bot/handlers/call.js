async function makeCall(sock, jid) {
  // If a CALL_PROVIDER_URL is configured, POST a call request there (production)
  const providerUrl = process.env.CALL_PROVIDER_URL;
  if (providerUrl) {
    try {
      const resp = await fetch(providerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jid, action: "makeCall" }),
      });
      if (resp.ok) {
        await sock.sendMessage(jid, {
          text: "📞 AI is initiating a call for you.",
        });
        return;
      }
      // fall through to simulated message on failure
    } catch (e) {
      // ignore and fall back to simulated message
    }
  }

  // Fallback: simulated call message
  await sock.sendMessage(jid, {
    text: "📞 AI is calling you now (simulated).",
  });
}

async function receiveCall(sock, jid) {
  const providerUrl = process.env.CALL_PROVIDER_URL;
  if (providerUrl) {
    try {
      const resp = await fetch(providerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jid, action: "receiveCall" }),
      });
      if (resp.ok) {
        await sock.sendMessage(jid, { text: "📞 AI acknowledged your call." });
        return;
      }
    } catch (e) {
      // ignore and fall back
    }
  }

  await sock.sendMessage(jid, {
    text: "📞 AI received your call (simulated).",
  });
}

module.exports = { makeCall, receiveCall };
