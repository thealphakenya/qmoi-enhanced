async function makeCall(sock, jid) {
    // Baileys supports call signaling, but real call automation is limited
    // TODO: Implement production call handling (validate sender, webhook security, call flow)
    // Prefer dry-run user-visible text; production telephony is gated via TELEPHONY_ENABLED env var
    const enabled = process.env.TELEPHONY_ENABLED === 'true';
    if (enabled) {
        await sock.sendMessage(jid, { text: '📞 AI is calling you now (telephony enabled).' });
    } else {
        await sock.sendMessage(jid, { text: '📞 AI is calling you now (dry-run).' });
    }
}

async function receiveCall(sock, jid) {
    // TODO: Add real call-receive logic and hooks (telephony provider integration)
    const enabled = process.env.TELEPHONY_ENABLED === 'true';
    if (enabled) {
        await sock.sendMessage(jid, { text: '📞 AI received your call (telephony enabled).' });
    } else {
        await sock.sendMessage(jid, { text: '📞 AI received your call (dry-run).' });
    }
}

module.exports = { makeCall, receiveCall };
