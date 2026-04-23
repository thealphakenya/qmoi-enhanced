console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.821154 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.237175 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.056799 -->
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-04-20T03:40:00Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/* eslint-env node */
const axios = require("axios");
const logger = require("../logger");

const QMOI_API_URL = process.env.QMOI_API_URL || "https://api.qmoi.ai/v1/qmoi";
const QMOI_API_KEY = process.env.QMOI_API_KEY || "";
const QMOI_TIMEOUT_MS = Number(process.env.QMOI_TIMEOUT_MS) || 30000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const client = axios.create({
  baseURL: QMOI_API_URL,
  timeout: QMOI_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    ...(QMOI_API_KEY ? { Authorization: `Bearer ${QMOI_API_KEY}` } : {}),
  },
});

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function askQmoi(payload) {
  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      const res = await client.post("", payload);
      if (res?.data?.response) {
        return res.data.response;
      }
      if (res?.data?.audio) {
        return Buffer.from(res.data.audio, 'base64');
      }
      if (res?.data?.result) {
        return res.data.result;
      }
      logger.warn("QMOI returned unexpected response", { status: res.status, data: res.data });
      return "🤖 QMOI returned an unexpected response. Please try again.";
    } catch (error) {
      attempt++;
      logger.error(`QMOI request failed (attempt ${attempt})`, { payload, error: error?.message || error });
      if (error?.response?.status === 429) {
        // Rate limited, wait longer
        await sleep(RETRY_DELAY_MS * attempt * 2);
      } else if (error?.response?.status >= 500) {
        // Server error, retry
        await sleep(RETRY_DELAY_MS * attempt);
      } else {
        // Client error, don't retry
        break;
      }
      if (attempt >= MAX_RETRIES) {
        return "⚠️ Sorry, I'm having trouble processing your request after multiple attempts. Please try again later.";
      }
    }
  }
  return "⚠️ Sorry, I'm having trouble processing your request. Please try again shortly.";
}

module.exports = askQmoi;
