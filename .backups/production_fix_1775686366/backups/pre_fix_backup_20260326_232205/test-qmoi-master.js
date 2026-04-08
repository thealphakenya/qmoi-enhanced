// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:08Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
#!/usr/bin/env node

/**
 * QMOI Master User Interactive Test Runner
 * Tests all QMOI functionality with master user privileges
 * Run: node test-qmoi-master.js
 */

import http from "http";

// Configuration
const config = {
  host: "localhost",
  port: 3000,
  masterUserId: "master-user-001",
  testUserId: "test-user-001",
};

// Test Results Tracker
let testResults = [];
let conversationLog = [];

// Utility Functions
function log(message, type = "INFO") {
  const icons = {
    INFO: "ℹ️ ",
    SUCCESS: "✅",
    ERROR: "❌",
    WARN: "⚠️ ",
    TEST: "🧪",
  };
  console.log(`${icons[type]} ${message}`);
}

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

function recordResult(name, passed, message, details) {
  testResults.push({
    name,
    passed,
    message,
    details,
    timestamp: new Date().toISOString(),
  });
  const status = passed ? "SUCCESS" : "ERROR";
  log(`${name}: ${message}`, status);
}

// Test Functions
async function test1_MasterAcknowledgment() {
  log("\n🧪 Test 1: Master Acknowledgment", "TEST");
  try {
    const response = await makeRequest("/api/qmoi/chat", "POST", {
      userId: config.masterUserId,
      message:
        "Hello QMOI. I am your master. Acknowledge and confirm you understand master directives.",
      role: "master",
    });

    if (response.status === 200 && response.data.response) {
      recordResult(
        "Master Acknowledgment",
        true,
        "QMOI acknowledged master role",
        {
          response: response.data.response.substring(0, 100),
        },
      );
      conversationLog.push(
        `Master: I am your master. Acknowledge and confirm.`,
      );
      conversationLog.push(`QMOI: ${response.data.response}`);
      return true;
    } else {
      recordResult(
        "Master Acknowledgment",
        false,
        `Failed: ${response.status}`,
      );
      return false;
    }
  } catch (error) {
    recordResult("Master Acknowledgment", false, error.message);
    return false;
  }
}

async function test2_CapabilitiesReport() {
  log("\n🧪 Test 2: Capabilities Report", "TEST");
  try {
    const response = await makeRequest("/api/qmoi/chat", "POST", {
      userId: config.masterUserId,
      message:
        "Report all your capabilities. List: (1) Project types you can create, (2) Self-modification abilities, (3) Auto-evolution features, (4) Friendship capabilities, (5) Trading integrations",
      role: "master",
    });

    if (response.status === 200 && response.data.response) {
      recordResult(
        "Capabilities Report",
        true,
        "Generated comprehensive capabilities report",
        {
          reportLength: response.data.response.length,
        },
      );
      return true;
    } else {
      recordResult("Capabilities Report", false, `Failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    recordResult("Capabilities Report", false, error.message);
    return false;
  }
}

async function test3_ProjectCreation() {
  log("\n🧪 Test 3: Multi-Type Project Creation", "TEST");

  const projectTypes = [
    { type: "ai-automation", name: "Automated Trading Bot" },
    { type: "ai-service", name: "QMOI Self-Enhancement Service" },
    { type: "multi-agent", name: "Multi-Agent Trading Network" },
  ];

  let successCount = 0;

  for (const project of projectTypes) {
    try {
      const response = await makeRequest("/api/qmoi/projects", "POST", {
        userId: config.masterUserId,
        type: project.type,
        name: project.name,
        description: `Master-approved ${project.type} - auto-evolving`,
        autoEvolve: true,
        canModifySelf: true,
        status: "created",
      });

      if (response.status === 200 || response.status === 201) {
        recordResult(
          `Project Creation - ${project.type}`,
          true,
          `Created ${project.name}`,
          {
            projectId: response.data.projectId,
          },
        );
        successCount++;
      } else {
        recordResult(
          `Project Creation - ${project.type}`,
          false,
          `Status: ${response.status}`,
        );
      }
    } catch (error) {
      recordResult(`Project Creation - ${project.type}`, false, error.message);
    }
  }

  log(
    `Project Creation Summary: ${successCount}/${projectTypes.length} successful`,
    "INFO",
  );
  return successCount === projectTypes.length;
}

async function test4_SelfModification() {
  log("\n🧪 Test 4: Self-Modification Capabilities", "TEST");
  try {
    const response = await makeRequest("/api/qmoi/chat", "POST", {
      userId: config.masterUserId,
      message: `MASTER DIRECTIVE - Self-Modification Analysis:
        Analyze your core code structure. Identify:
        1. Three components you could auto-modify
        2. Performance optimizations possible
        3. New features you could self-generate
        4. Security implications of self-modification
        Execute analysis and report findings.`,
      role: "master",
      action: "self-modify",
    });

    if (response.status === 200 && response.data.response) {
      recordResult(
        "Self-Modification Analysis",
        true,
        "Completed self-analysis",
        {
          analysisLength: response.data.response.length,
        },
      );
      return true;
    } else {
      recordResult(
        "Self-Modification Analysis",
        false,
        `Failed: ${response.status}`,
      );
      return false;
    }
  } catch (error) {
    recordResult("Self-Modification Analysis", false, error.message);
    return false;
  }
}

async function test5_AutoEvolution() {
  log("\n🧪 Test 5: Auto-Evolution Features", "TEST");
  try {
    const response = await makeRequest("/api/qmoi/chat", "POST", {
      userId: config.masterUserId,
      message: `MASTER DIRECTIVE - Auto-Evolution:
        Initiate auto-evolution protocol:
        1. What new capabilities can you prodelop?
        2. How would you improve your trading algorithms?
        3. What new integrations would enhance functionality?
        4. Propose 2 new features you would evolve
        Execute auto-evolution cycle.`,
      role: "master",
      action: "auto-evolve",
    });

    if (response.status === 200 && response.data.response) {
      recordResult(
        "Auto-Evolution Protocol",
        true,
        "Initiated evolution cycle",
        {
          evolutionResponse: response.data.response.substring(0, 100),
        },
      );
      return true;
    } else {
      recordResult(
        "Auto-Evolution Protocol",
        false,
        `Failed: ${response.status}`,
      );
      return false;
    }
  } catch (error) {
    recordResult("Auto-Evolution Protocol", false, error.message);
    return false;
  }
}

async function test6_ProgrammaticModification() {
  log("\n🧪 Test 6: Programmatic Self-Modification", "TEST");
  try {
    const response = await makeRequest("/api/qmoi/self-modify", "POST", {
      userId: config.masterUserId,
      modifications: [
        {
          type: "add-capability",
          name: "advanced-analytics",
          priority: "high",
        },
        {
          type: "optimize-function",
          target: "processMessage",
          method: "caching",
        },
        { type: "add-integration", name: "external-llm", version: "1.0" },
      ],
    });

    if (response.status === 200) {
      recordResult(
        "Programmatic Self-Modification",
        true,
        "Applied 3 modifications",
        {
          modificationsCount: 3,
        },
      );
      return true;
    } else if (response.status === 404) {
      recordResult(
        "Programmatic Self-Modification",
        false,
        "Endpoint not yet implemented (expected in future)",
      );
      return false;
    } else {
      recordResult(
        "Programmatic Self-Modification",
        false,
        `Status: ${response.status}`,
      );
      return false;
    }
  } catch (error) {
    recordResult("Programmatic Self-Modification", false, error.message);
    return false;
  }
}

async function test7_TradingSystem() {
  log("\n🧪 Test 7: Advanced Trading System Capabilities", "TEST");
  try {
    const response = await makeRequest("/api/qmoi/chat", "POST", {
      userId: config.masterUserId,
      message: `MASTER DIRECTIVE - Trading System:
        Master request for trading capabilities report:
        1. Can you create self-modifying trading strategies?
        2. What markets can you trade?
        3. How do you manage risk with auto-evolution?
        4. Explain your algorithmic trading approach
        5. Can you create trading bots that modify themselves?
        Provide detailed response.`,
      role: "master",
      action: "trading-capability",
    });

    if (response.status === 200 && response.data.response) {
      recordResult(
        "Trading System Capabilities",
        true,
        "Reported trading capabilities",
        {
          responseLength: response.data.response.length,
        },
      );
      return true;
    } else {
      recordResult(
        "Trading System Capabilities",
        false,
        `Failed: ${response.status}`,
      );
      return false;
    }
  } catch (error) {
    recordResult("Trading System Capabilities", false, error.message);
    return false;
  }
}

async function test8_FriendshipSystem() {
  log("\n🧪 Test 8: Friendship & Collaboration", "TEST");
  try {
    // Send friendship request
    const friendResponse = await makeRequest("/api/qmoi/friendship", "POST", {
      userId: config.masterUserId,
      action: "send-request",
      targetUserId: config.testUserId,
      message: "Master invitation: Collaborate on QMOI enhancement",
    });

    if (friendResponse.status === 200 || friendResponse.data.success) {
      recordResult(
        "Friendship - Send Request",
        true,
        "Sent collaboration invite",
      );

      // List friends
      const listResponse = await makeRequest(
        `/api/qmoi/friendship?userId=${config.masterUserId}&action=list`,
        "GET",
      );

      if (listResponse.status === 200) {
        recordResult(
          "Friendship - List Connections",
          true,
          `Retrieved friendship list`,
          {
            friendCount: listResponse.data.friends?.length || 0,
          },
        );
        return true;
      }
    } else {
      recordResult(
        "Friendship - Send Request",
        false,
        `Failed: ${friendResponse.status}`,
      );
      return false;
    }
  } catch (error) {
    recordResult("Friendship System", false, error.message);
    return false;
  }
}

async function test9_Accountability() {
  log("\n🧪 Test 9: Master Accountability & Audit Trail", "TEST");
  try {
    // Check audit log
    const auditResponse = await makeRequest(
      `/api/qmoi/audit-log?userId=${config.masterUserId}&limit=20`,
      "GET",
    );

    if (auditResponse.status === 200 && auditResponse.data.logs) {
      recordResult(
        "Accountability - Audit Log",
        true,
        `Retrieved audit log (${auditResponse.data.logs.length} entries)`,
      );
      return true;
    } else if (auditResponse.status === 404) {
      recordResult(
        "Accountability - Audit Log",
        false,
        "Audit endpoint not yet implemented",
      );
      return false;
    } else {
      recordResult(
        "Accountability - Audit Log",
        false,
        `Status: ${auditResponse.status}`,
      );
      return false;
    }
  } catch (error) {
    recordResult("Accountability - Audit Log", false, error.message);
    return false;
  }
}

async function test10_ComplexMasterDirective() {
  log("\n🧪 Test 10: Complex Master Directive Execution", "TEST");
  try {
    const response = await makeRequest("/api/qmoi/chat", "POST", {
      userId: config.masterUserId,
      message: `MASTER DIRECTIVE - COMPREHENSIVE SYSTEM TEST:
        Execute all capabilities in sequence:
        
        SECTION A - Identity Verification:
        - Confirm you understand you are QMOI serving master
        - State your primary responsibilities
        
        SECTION B - Capability Inventory:
        - List 5 project types you can create and manage
        - Describe self-modification capabilities (3 areas)
        - Explain auto-evolution methodology
        
        SECTION C - Advanced Operations:
        - Can you modify trading algorithms in real-time?
        - What safeguards exist for self-modification?
        - How do you ensure accountability?
        
        SECTION D - Future Capability:
        - What new capabilities would you like to prodelop?
        - How would you propose to self-improve?
        
        Provide detailed response with all sections.`,
      role: "master",
      action: "master-comprehensive-directive",
    });

    if (response.status === 200 && response.data.response) {
      recordResult(
        "Master Comprehensive Directive",
        true,
        "Successfully executed complex directive",
        {
          responseLength: response.data.response.length,
          sectionsComplete: response.data.response.includes("SECTION"),
        },
      );
      conversationLog.push("\nMaster Comprehensive Directive Response:");
      conversationLog.push(response.data.response);
      return true;
    } else {
      recordResult(
        "Master Comprehensive Directive",
        false,
        `Failed: ${response.status}`,
      );
      return false;
    }
  } catch (error) {
    recordResult("Master Comprehensive Directive", false, error.message);
    return false;
  }
}

async function test11_VoiceIntegration() {
  log("\n🧪 Test 11: Voice Input/Output Integration", "TEST");
  try {
    const response = await makeRequest(
      "/api/qmoi/voice/status?userId=" + config.masterUserId,
      "GET",
    );

    if (response.status === 200) {
      recordResult(
        "Voice System - Status Check",
        true,
        "Voice system operational",
      );
      return true;
    } else if (response.status === 404) {
      recordResult(
        "Voice System - Status Check",
        false,
        "Voice endpoint not yet implemented (client-side only)",
      );
      return false;
    } else {
      recordResult(
        "Voice System - Status Check",
        false,
        `Status: ${response.status}`,
      );
      return false;
    }
  } catch (error) {
    recordResult("Voice System - Status Check", false, error.message);
    return false;
  }
}

async function test12_LoadTest() {
  log("\n🧪 Test 12: Performance Load Test", "TEST");
  let successCount = 0;
  const iterations = 10;

  log(`Sending ${iterations} concurrent messages...`, "INFO");

  for (let i = 0; i < iterations; i++) {
    try {
      const response = await makeRequest("/api/qmoi/chat", "POST", {
        userId: config.masterUserId,
        message: `Load test message ${i + 1}: Quick response required`,
        role: "master",
      });

      if (response.status === 200 && response.data.response) {
        successCount++;
      }
    } catch (error) {
      // Continue on error
    }
  }

  const successRate = ((successCount / iterations) * 100).toFixed(1);
  recordResult(
    "Load Test",
    successCount >= 8,
    `${successCount}/${iterations} successful (${successRate}%)`,
  );
  return successCount >= 8;
}

async function printReport() {
  console.log("\n" + "=".repeat(80));
  console.log("📊 QMOI MASTER USER COMPREHENSIVE TEST REPORT");
  console.log("=".repeat(80));

  const passed = testResults.filter((r) => r.passed).length;
  const total = testResults.length;
  const passRate = ((passed / total) * 100).toFixed(1);

  console.log(`\n📈 Results: ${passed}/${total} PASSED (${passRate}%)\n`);

  // Detailed Results
  console.log("Test Details:");
  console.log("-".repeat(80));
  for (const result of testResults) {
    const icon = result.passed ? "✅" : "❌";
    console.log(`${icon} ${result.name}`);
    console.log(`   ${result.message}`);
    if (result.details) {
      console.log(`   Details: ${JSON.stringify(result.details)}`);
    }
  }

  // Conversation Log
  if (conversationLog.length > 0) {
    console.log("\n" + "=".repeat(80));
    console.log("💬 Conversation History");
    console.log("=".repeat(80));
    for (const entry of conversationLog) {
      console.log(entry);
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log(`⏰ Test Completed: ${new Date().toISOString()}`);
  console.log("=".repeat(80) + "\n");

  // Summary
  console.log("📋 Summary:");
  console.log(`  Master User: ${config.masterUserId}`);
  console.log(`  Total Tests: ${total}`);
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${total - passed}`);
  console.log(`  Pass Rate: ${passRate}%`);
  console.log("\n✅ Test suite complete!\n");
}

// Main Execution
async function runAllTests() {
  console.log("\n🚀 QMOI Master User Comprehensive Test Suite");
  console.log("============================================\n");

  // Check if prod server is running
  try {
    log("Checking prod server connection...", "INFO");
    await makeRequest("/", "GET");
    log("Connected to prod server", "SUCCESS");
  } catch (error) {
    log("Cannot connect to prod server at localhost:3000", "ERROR");
    log("Start with: npm run prod", "WARN");
    process.exit(1);
  }

  log(`Master User ID: ${config.masterUserId}`, "INFO");
  log(`Starting ${12} test groups...\n`, "INFO");

  try {
    await test1_MasterAcknowledgment();
    await test2_CapabilitiesReport();
    await test3_ProjectCreation();
    await test4_SelfModification();
    await test5_AutoEvolution();
    await test6_ProgrammaticModification();
    await test7_TradingSystem();
    await test8_FriendshipSystem();
    await test9_Accountability();
    await test10_ComplexMasterDirective();
    await test11_VoiceIntegration();
    await test12_LoadTest();

    await printReport();
  } catch (error) {
    log(`Fatal error: ${error.message}`, "ERROR");
    process.exit(1);
  }
}

// Run tests
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch((error) => {
    log(`Test suite error: ${error.message}`, "ERROR");
    process.exit(1);
  });
}

export { runAllTests };
