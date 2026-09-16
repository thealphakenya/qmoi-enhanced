/* eslint-env node */
const axios = require("axios");

const QMOI_API_URL = process.env.QMOI_API_URL || "http://localhost:5001/qmoi";
const QMOI_API_TIMEOUT_MS = Number(process.env.QMOI_API_TIMEOUT_MS || 15000);

function normalizePrompt(prompt) {
    if (typeof prompt !== "string" || !prompt.trim()) {
        throw new TypeError("QMOI prompt must be a non-empty string");
    }
    return prompt.trim().slice(0, 8000);
}

async function askQmoi(prompt) {
    try {
        const res = await axios.post(QMOI_API_URL, { prompt: normalizePrompt(prompt) }, {
            timeout: QMOI_API_TIMEOUT_MS,
            headers: { "content-type": "application/json" },
        });
        return res.data?.response || res.data?.answer || "🤖 Qmoi has no answer yet.";
    } catch (err) {
        console.error("QMOI Error:", err.message);
        if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
            return "⏳ QMOI is taking longer than expected. Please try again shortly.";
        }
        return "⚠️ QMOI is temporarily unavailable. Your message was not processed.";
    }
}

function getQmoiRuntimeStatus() {
    return {
        api_configured: Boolean(QMOI_API_URL),
        api_url: QMOI_API_URL.replace(/\/[^/]*$/, "/…"),
        timeout_ms: QMOI_API_TIMEOUT_MS,
        real_funds_execution: false,
        note: "Wallet, deal, and trading actions require separately validated integrations and explicit production gates.",
    };
}

module.exports = askQmoi;
module.exports.getQmoiRuntimeStatus = getQmoiRuntimeStatus;
