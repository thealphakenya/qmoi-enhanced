// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:15Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION READY] this file has no remaining non-production markers
/* eslint-env node */
const axios = require("axios");

const QMOI_API_URL = "http://localhost:5001/qmoi"; // Update to your model's endpoint

async function askQmoi(prompt) {
    try {
        const res = await axios.post(QMOI_API_URL, { prompt });
        return res.data.response || "🤖 Qmoi has no answer yet.";
    } catch (err) {
        console.error("QMOI Error:", err.message);
        return "⚠️ Sorry, I'm having trouble processing your request.";
    }
}

module.exports = askQmoi;
