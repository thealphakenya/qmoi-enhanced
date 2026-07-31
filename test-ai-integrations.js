#!/usr/bin/env node

// Test script for QMOI AI integrations
const fetch = require("node-fetch");

async function testQMOIChat() {
  try {
    console.log("Testing QMOI Chat API...");

    const response = await fetch("http://localhost:3000/api/qmoi/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello, how are you today?" }],
        sessionId: "test-session",
        userId: "test-user",
      }),
    });

    const data = await response.json();
    console.log("Chat API Response:", JSON.stringify(data, null, 2));

    if (data.message && !data.message.includes("QMOI Evolved Response")) {
      console.log("✅ AI integration working - real responses detected");
    } else {
      console.log("❌ Still using placeholder responses");
    }
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

async function testQVillage() {
  try {
    console.log("Testing QVillage API...");

    const response = await fetch("http://localhost:3000/api/qvillage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "explore",
        userId: "test-user",
      }),
    });

    const data = await response.json();
    console.log("QVillage API Response:", JSON.stringify(data, null, 2));

    if (data.ai_powered) {
      console.log("✅ QVillage AI integration working");
    } else {
      console.log("❌ QVillage not AI-powered");
    }
  } catch (error) {
    console.error("QVillage test failed:", error.message);
  }
}

async function testQMOIModel() {
  try {
    console.log("Testing QMOI Model API...");

    const response = await fetch(
      "http://localhost:3000/api/qmoi-model?allStats=true",
    );
    const data = await response.json();
    console.log("Model API Response:", JSON.stringify(data, null, 2));

    if (data.ai_provider === "openai" || data.ai_powered) {
      console.log("✅ Model API AI integration working");
    } else {
      console.log("❌ Model API not AI-powered");
    }
  } catch (error) {
    console.error("Model test failed:", error.message);
  }
}

async function runTests() {
  console.log("🚀 Starting QMOI AI Integration Tests...\n");

  await testQMOIChat();
  console.log("");

  await testQVillage();
  console.log("");

  await testQMOIModel();
  console.log("");

  console.log("🏁 Tests completed!");
}

runTests().catch(console.error);

// AUTOFIXED by Ollama at 2026-07-26T18:54:41.375210Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:34.415065Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:06.628879Z

// AUTOFIXED by Ollama at 2026-07-26T19:39:17.634922Z
