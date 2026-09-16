const HELP_TEXT = [
    "🤖 QMOI WhatsApp commands",
    "/help - show available commands",
    "/health - show bot/API safety status",
    "/finance - open a finance and wallet status conversation",
    "/deals - review deal validation and settlement requirements",
    "/trade - review trading readiness and risk gates",
    "/privacy - show data-handling guidance",
    "",
    "You can also send a normal question, voice note, image, or task for QMOI to process.",
].join("\n");

function getRuntimeStatus() {
    return {
        api_configured: Boolean(process.env.QMOI_API_URL || "http://localhost:5001/qmoi"),
        timeout_ms: Number(process.env.QMOI_API_TIMEOUT_MS || 15000),
    };
}

function commandResult(text) {
    const command = text.trim().split(/\s+/, 1)[0].toLowerCase();
    if (!command.startsWith("/")) return null;

    switch (command) {
        case "/help":
        case "/start":
            return HELP_TEXT;
        case "/health": {
            const status = getRuntimeStatus();
            return [
                "🩺 QMOI bot health",
                `API configured: ${status.api_configured ? "yes" : "no"}`,
                `Request timeout: ${status.timeout_ms}ms`,
                "Real-funds execution: blocked by default",
                "Wallet/deal/trade actions: validation required before execution",
            ].join("\n");
        }
        case "/finance":
            return "💼 Finance mode: send the wallet, revenue, payout, or account question. QMOI will summarize status and required validation; it will not move funds from WhatsApp alone.";
        case "/deals":
            return "🤝 Deal mode: send the deal terms or transaction status. QMOI will check counterparty, amount, route, proof, settlement, and reconciliation requirements.";
        case "/trade":
            return "📊 Trading mode: send a platform, symbol, or readiness question. Live execution remains disabled until account, wallet, risk, and production gates pass.";
        case "/privacy":
            return "🔐 Privacy: do not send passwords, API keys, seed phrases, or private keys. Use approved secret storage and send only the minimum information needed for a status check.";
        default:
            return "❓ Unknown command. Send /help to see supported commands, or send the request without a slash for normal QMOI processing.";
    }
}

module.exports = { commandResult, HELP_TEXT };