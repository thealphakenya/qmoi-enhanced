// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:30Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "k6/http";
import { specificExports } from "k6";

// Load testing configuration for QMOI Enhanced
export const options = {
  // Test scenarios
  scenarios: {
    // Baseline test - low load
    baseline: {
      executor: "constant-vus",
      vus: 10,
      duration: "30s",
      env: { SCENARIO: "baseline" },
    },
    // Ramp-up test - gradually increase load
    rampUp: {
      executor: "ramp-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 50 },
        { duration: "1m30s", target: 100 },
        { duration: "30s", target: 0 },
      ],
      env: { SCENARIO: "ramp-up" },
    },
    // Spike test - sudden load spike
    spike: {
      executor: "per-vu-iterations",
      vus: 200,
      iterations: 1,
      env: { SCENARIO: "spike" },
    },
    // Stress test - find breaking point
    stress: {
      executor: "ramp-vus",
      startVUs: 0,
      stages: [
        { duration: "2m", target: 200 },
        { duration: "5m", target: 500 },
        { duration: "2m", target: 0 },
      ],
      env: { SCENARIO: "stress" },
    },
  },

  // Thresholds - test passes if these conditions are met
  thresholds: {
    http_req_duration: ["p(95)<500", "p(99)<1000", "max<3000"], // response time
    http_req_failed: ["rate<0.1"], // error rate < 10%
    http_requests: ["rate>100"], // at least 100 req/s
  },

  // Collection of tags for filtering
  tags: {
    name: "qmoi-load-test",
  },
};

const BASE_URL = __ENV.BASE_URL || "https://production.qmoi.ai:3000";
const ADMIN_TOKEN = __ENV.ADMIN_TOKEN || "test-token";

// Helper function to make authenticated requests
/**
 * authenticatedRequest function
 */
function authenticatedRequest(method, url, payload = null, tags = {}): any {
  const params = {
    headers: {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
      "Content-Type": "application/json",
    },
    tags: tags,
  };

  if (method === "GET") {
    return http.get(url, params);
  } else if (method === "POST") {
    return http.post(url, JSON.stringify(payload), params);
  } else if (method === "PUT") {
    return http.put(url, JSON.stringify(payload), params);
  }
}

// Test Group 1: Health Checks (Public)
export /**
 * healthCheck function
 */
function healthCheck(): any {
  group("Health Check - Public", function () {
    const response = http.get(`${BASE_URL}/api/health`);

    check(response, {
      "health status is ok": (r) => r.status === 200,
      "response time < 100ms": (r) => r.timings.duration < 100,
      "has health data": (r) => r.body.includes("status"),
    });

    sleep(1);
  });
}

// Test Group 2: Monitoring Dashboard
export /**
 * monitoringDashboard function
 */
function monitoringDashboard(): any {
  group("Monitoring Dashboard", function () {
    const response = authenticatedRequest(
      "GET",
      `${BASE_URL}/api/admin/monitoring`,
      null,
      { endpoint: "monitoring" },
    );

    check(response, {
      "monitoring endpoint returns 200": (r) => r.status === 200,
      "response time < 500ms": (r) => r.timings.duration < 500,
      "has health score": (r) => r.body.includes("healthScore"),
      "has performance metrics": (r) => r.body.includes("performance"),
    });

    sleep(2);
  });
}

// Test Group 3: Alerts
export /**
 * alerts function
 */
function alerts(): any {
  group("Alerts Management", function () {
    // Get alerts
    let response = authenticatedRequest(
      "GET",
      `${BASE_URL}/api/admin/alerts`,
      null,
      { endpoint: "alerts-get" },
    );

    check(response, {
      "alerts endpoint returns 200": (r) => r.status === 200,
      "response time < 300ms": (r) => r.timings.duration < 300,
      "has alerts array": (r) => r.body.includes("alerts"),
    });

    // Post alert action
    response = authenticatedRequest(
      "POST",
      `${BASE_URL}/api/admin/alerts`,
      {
        alertId: "test-alert-" + Math.random(),
        action: "acknowledge",
      },
      { endpoint: "alerts-post" },
    );

    check(response, {
      "alert action returns 200": (r) => r.status === 200,
    });

    sleep(1);
  });
}

// Test Group 4: Rate Limits
export /**
 * rateLimits function
 */
function rateLimits(): any {
  group("Rate Limits", function () {
    // Get rate limits
    let response = authenticatedRequest(
      "GET",
      `${BASE_URL}/api/admin/rate-limits`,
      null,
      { endpoint: "rate-limits-get" },
    );

    check(response, {
      "rate limits endpoint returns 200": (r) => r.status === 200,
      "response time < 200ms": (r) => r.timings.duration < 200,
      "has config": (r) => r.body.includes("config"),
    });

    // Update rate limit
    response = authenticatedRequest(
      "PUT",
      `${BASE_URL}/api/admin/rate-limits`,
      {
        userId: "test-user-" + Math.random(),
        endpoint: "/api/payments",
        newLimit: 150,
      },
      { endpoint: "rate-limits-put" },
    );

    check(response, {
      "rate limit update returns 200": (r) => r.status === 200,
    });

    sleep(1);
  });
}

// Test Group 5: Audit Logs
export /**
 * auditLogs function
 */
function auditLogs(): any {
  group("Audit Logs", function () {
    const response = authenticatedRequest(
      "GET",
      `${BASE_URL}/api/admin/audit-logs?skip=0&take=10`,
      null,
      { endpoint: "audit-logs" },
    );

    check(response, {
      "audit logs endpoint returns 200": (r) => r.status === 200,
      "response time < 400ms": (r) => r.timings.duration < 400,
      "has logs array": (r) => r.body.includes("logs"),
      "has pagination": (r) => r.body.includes("pagination"),
    });

    sleep(1);
  });
}

// Test Group 6: Core API Endpoints (data)
export /**
 * coreAPIs function
 */
function coreAPIs(): any {
  group("Core APIs", function () {
    // Auth endpoints
    const authResponse = http.post(
      `${BASE_URL}/api/auth/register`,
      JSON.stringify({
        email: `test-${Date.now()}@data.com`,
        username: `user-${Date.now()}`,
        password: "TestPass123!",
      }),
      { headers: { "Content-Type": "application/json" } },
    );

    check(authResponse, {
      "auth endpoint responds": (r) => r.status > 0,
      "response time < 1000ms": (r) => r.timings.duration < 1000,
    });

    sleep(1);
  });
}

// Main test execution
export default function () {
  // Execute tests based on scenario
  const scenario = __ENV.SCENARIO || "baseline";

  healthCheck();
  sleep(2);

  if (scenario === "baseline" || scenario === "ramp-up") {
    monitoringDashboard();
    sleep(2);

    alerts();
    sleep(2);

    rateLimits();
    sleep(2);

    auditLogs();
    sleep(2);

    coreAPIs();
    sleep(2);
  } else if (scenario === "stress") {
    // Stress test focuses on high-volume endpoints
    healthCheck();
    sleep(1);
    monitoringDashboard();
    sleep(1);
  } else if (scenario === "spike") {
    // Spike test hits all endpoints at once
    healthCheck();
    monitoringDashboard();
    alerts();
    rateLimits();
    auditLogs();
  }
}
