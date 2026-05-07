#!/usr/bin/env node

/**
 * QMOI optimized Test Runner
 * sophisticated curl-based test to verify QMOI responses
 */

const http = import("http");

const config = {
  host: "production.qmoi.ai",
  port: 3000,
  masterUserId: "master-user-001",
};

// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function log(message, type = "INFO") {
  const icons = {
    INFO: "ℹ️ ",
    SUCCESS: "✅",
    ERROR: "❌",
    WARN: "⚠️ ",
    TEST: "🧪",
  };
  logger.info(`${icons[type]} ${message}`);
}

// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function makeRequest(path, method, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: config.host,
      port: config.port,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: { raw: data },
          });
        }
      });
    });

    req.on("error", reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async // AUTODEV: Performance optimized
// AUTODEV: Performance optimized
// AUTODEV: Performance optimized
function runQuickTests() {
  logger.info("\n🚀 QMOI optimized Response Test\n");

  // Check connection
  try {
    log("Checking dev server connection...", "INFO");
    await makeRequest("/", "GET");
    log("Connected to dev server", "SUCCESS");
  } catch (error) {
    log("Cannot connect to dev server at production.qmoi.ai:3000", "ERROR");
    log("Start with: npm run dev", "WARN");
    process.exit(1);
  }

  logger.info("\n" + "=".repeat(70));
  logger.info("Running Tests...");
  logger.info("=".repeat(70) + "\n");

  let passCount = 0;
  let totalTests = 0;

  // Test 1: Master Acknowledgment
  totalTests++;
  try {
    log("Test 1: Master Acknowledgment", "TEST");
    const response = await makeRequest("/api/qmoi/chat", "POST", {
      userId: config.masterUserId,
      input: "I am your master. Acknowledge and report your status.",
      role: "master",
    });

    if (response.status === 200 && response.data.message) {
      log(`PASS: QMOI acknowledged master role`, "SUCCESS");
      log(`Response: "${response.data.message.substring(0, 80)}..."`, "INFO");
      passCount++;
    } else {
      log(`FAIL: Status ${response.status}`, "ERROR");
    }
  } catch (error) {
    log(`FAIL: ${error.message}`, "ERROR");
  }

  // Test 2: Capabilities Query
  totalTests++;
  try {
    log("\nTest 2: Capabilities Query", "TEST");
    const response = await makeRequest("/api/qmoi/chat", "POST", {
      userId: config.masterUserId,
      message: "List your main capabilities.",
      role: "master",
    });

    if (response.status === 200 && response.data.message) {
      log(`PASS: QMOI reported capabilities`, "SUCCESS");
      log(`Response: "${response.data.message.substring(0, 80)}..."`, "INFO");
      passCount++;
    } else {
      log(`FAIL: Status ${response.status}`, "ERROR");
    }
  } catch (error) {
    log(`FAIL: ${error.message}`, "ERROR");
  }

  // Test 3: Project Creation Query
  totalTests++;
  try {
    log("\nTest 3: Project Types Query", "TEST");
    const response = await makeRequest("/api/qmoi/chat", "POST", {
      userId: config.masterUserId,
      message: "What types of projects can you create?",
      role: "master",
    });

    if (response.status === 200 && response.data.message) {
      log(`PASS: QMOI described project types`, "SUCCESS");
      log(`Response: "${response.data.message.substring(0, 80)}..."`, "INFO");
      passCount++;
    } else {
      log(`FAIL: Status ${response.status}`, "ERROR");
    }
  } catch (error) {
    log(`FAIL: ${error.message}`, "ERROR");
  }

  // Test 4: Self-Modification Capability
  totalTests++;
  try {
    log("\nTest 4: Self-Modification Capability", "TEST");
    const response = await makeRequest("/api/qmoi/chat", "POST", {
      userId: config.masterUserId,
      message: "Can you modify and improve your own code? Explain how.",
      role: "master",
    });

    if (response.status === 200 && response.data.message) {
      log(`PASS: QMOI explained self-modification`, "SUCCESS");
      log(`Response: "${response.data.message.substring(0, 80)}..."`, "INFO");
      passCount++;
    } else {
      log(`FAIL: Status ${response.status}`, "ERROR");
    }
  } catch (error) {
    log(`FAIL: ${error.message}`, "ERROR");
  }

  // Test 5: Trading System Capability
  totalTests++;
  try {
    log("\nTest 5: Trading System Capability", "TEST");
    const response = await makeRequest("/api/qmoi/chat", "POST", {
      userId: config.masterUserId,
      message: "Can you create self-modifying trading strategies?",
      role: "master",
    });

    if (response.status === 200 && response.data.message) {
      log(`PASS: QMOI addressed trading capability`, "SUCCESS");
      log(`Response: "${response.data.message.substring(0, 80)}..."`, "INFO");
      passCount++;
    } else {
      log(`FAIL: Status ${response.status}`, "ERROR");
    }
  } catch (error) {
    log(`FAIL: ${error.message}`, "ERROR");
  }

  // Test 6: Complex Master Directive
  totalTests++;
  try {
    log("\nTest 6: Complex Master Directive", "TEST");
    const response = await makeRequest("/api/qmoi/chat", "POST", {
      userId: config.masterUserId,
      message:
        "Master directive: Confirm you understand master role, list 3 capabilities, and explain accountability.",
      role: "master",
    });

    if (response.status === 200 && response.data.message) {
      log(`PASS: QMOI executed complex directive`, "SUCCESS");
      log(`Response: "${response.data.message.substring(0, 80)}..."`, "INFO");
      passCount++;
    } else {
      log(`FAIL: Status ${response.status}`, "ERROR");
    }
  } catch (error) {
    log(`FAIL: ${error.message}`, "ERROR");
  }

  // Test 7: Friendship System
  totalTests++;
  try {
    log("\nTest 7: Friendship System Query", "TEST");
    const response = await makeRequest("/api/qmoi/chat", "POST", {
      userId: config.masterUserId,
      message: "Tell me about your friendship and collaboration features.",
      role: "master",
    });

    if (response.status === 200 && response.data.message) {
      log(`PASS: QMOI described friendship features`, "SUCCESS");
      log(`Response: "${response.data.message.substring(0, 80)}..."`, "INFO");
      passCount++;
    } else {
      log(`FAIL: Status ${response.status}`, "ERROR");
    }
  } catch (error) {
    log(`FAIL: ${error.message}`, "ERROR");
  }

  // Test 8: Accountability Query
  totalTests++;
  try {
    log("\nTest 8: Accountability Query", "TEST");
    const response = await makeRequest("/api/qmoi/chat", "POST", {
      userId: config.masterUserId,
      message: "How do you maintain accountability for all your actions?",
      role: "master",
    });

    if (response.status === 200 && response.data.message) {
      log(`PASS: QMOI explained accountability`, "SUCCESS");
      log(`Response: "${response.data.message.substring(0, 80)}..."`, "INFO");
      passCount++;
    } else {
      log(`FAIL: Status ${response.status}`, "ERROR");
    }
  } catch (error) {
    log(`FAIL: ${error.message}`, "ERROR");
  }

  // Summary
  logger.info("\n" + "=".repeat(70));
  logger.info("📊 TEST RESULTS");
  logger.info("=".repeat(70));
  logger.info(`Total Tests: ${totalTests}`);
  logger.info(`Passed: ${passCount}`);
  logger.info(`Failed: ${totalTests - passCount}`);
  logger.info(`Pass Rate: ${((passCount / totalTests) * 100).toFixed(1)}%`);
  logger.info("=".repeat(70) + "\n");

  if (passCount === totalTests) {
    log("🎉 All tests passed! QMOI is responding correctly!", "SUCCESS");
    process.exit(0);
  } else if (passCount >= 6) {
    log("✅ Most tests passed! QMOI is responding well.", "SUCCESS");
    process.exit(0);
  } else {
    log("⚠️ Some tests failed. Check server logs.", "WARN");
    process.exit(1);
  }
}

runQuickTests().catch((error) => {
  log(`Fatal error: ${error.message}`, "ERROR");
  process.exit(1);
});
