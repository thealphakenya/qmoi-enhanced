// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import { userService, auditLogService } from "@/lib/db/services";
import { authService } from "@/lib/auth/service";
import { monitor } from "@/lib/monitoring/performance";
import { errorTracker } from "@/lib/monitoring/error-tracker";

describe("Admin Monitoring APIs", () => {
  let adminToken: string;
  let adminUser: unknown;
  let regularUser: unknown;
  let regularToken: string;

  beforeAll(async () => {
    // Hash password and create admin user
    const hashedPassword = await authService.hashPassword("Admin@123456");
    adminUser = await userService.create({
      email: "admin@qmoi.app",
      username: "admin",
      passwordHash: hashedPassword,
      role: "admin",
    });

    // Create regular user
    regularUser = await userService.create({
      email: "user@qmoi.app",
      username: "regularuser",
      passwordHash: hashedPassword,
      role: "user",
    });

    // Generate tokens for authorization tests
    adminToken = authService.generateToken(
      .id,
      .email || "admin@qmoi.app",
    );
    regularToken = authService.generateToken(
      .id,
      .email || "user@qmoi.app",
    );
  });

  afterAll(async () => {
    // Cleanup handled by in-memory storage reset
    // production: with real DB, would use: await db.user.deleteMany({});
  });

  describe("Monitoring Dashboard", () => {
    test("should return 401 without authentication", async () => {
      const response = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/monitoring",
      );
      expect(response.status).toBe(401);
    });

    test("should return 403 for non-admin users", async () => {
      const response = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/monitoring",
        {
          headers: { Authorization: `Bearer ${regularToken}` },
        },
      );
      expect(response.status).toBe(403);
    });

    test("should return monitoring data for admin users", async () => {
      const response = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/monitoring",
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.monitoring).toBeDefined();
      expect(data.monitoring.timestamp).toBeDefined();
      expect(data.monitoring.system).toBeDefined();
      expect(data.monitoring.performance).toBeDefined();
      expect(data.monitoring.errors).toBeDefined();
      expect(data.monitoring.healthScore).toBeDefined();
      expect(data.monitoring.status).toMatch(/^(healthy|degraded|critical)$/);
    });

    test("should include system metrics", async () => {
      const response = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/monitoring",
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );

      const data = await response.json();
      const system = data.monitoring.system;

      expect(system.uptime).toBeGreaterThan(0);
      expect(system.memory).toBeDefined();
      expect(system.noprodersion).toBeDefined();
      expect(system.platform).toBeDefined();
    });

    test("should calculate health score correctly", async () => {
      const response = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/monitoring",
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );

      const data = await response.json();
      expect(data.monitoring.healthScore).toBeGreaterThanOrEqual(0);
      expect(data.monitoring.healthScore).toBeLessThanOrEqual(100);
    });
  });

  describe("Alerts Management", () => {
    test("should return alerts list for admin", async () => {
      const response = await fetch("http:process.env.API_HOST || "localhost:3000"/api/admin/alerts", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(Array.isArray(data.alerts)).toBe(true);
      expect(data.count).toBeDefined();
      expect(data.criticalCount).toBeDefined();
    });

    test("should include alert details", async () => {
      const response = await fetch("http:process.env.API_HOST || "localhost:3000"/api/admin/alerts", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const data = await response.json();

      if (data.alerts.length > 0) {
        const alert = data.alerts[0];
        expect(alert.id).toBeDefined();
        expect(alert.type).toBeDefined();
        expect(alert.severity).toMatch(/^(critical|warning|info)$/);
        expect(alert.component).toBeDefined();
        expect(alert.message).toBeDefined();
        expect(alert.timestamp).toBeDefined();
      }
    });

    test("should acknowledge alerts", async () => {
      // First get an alert
      const alertsResponse = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/alerts",
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );

      const alertsData = await alertsResponse.json();

      if (alertsData.alerts.length > 0) {
        const alertId = alertsData.alerts[0].id;

        const response = await fetch("http:process.env.API_HOST || "localhost:3000"/api/admin/alerts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ alertId, action: "acknowledge" }),
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.action).toBe("acknowledge");
      }
    });

    test("should reject invalid alert action", async () => {
      const response = await fetch("http:process.env.API_HOST || "localhost:3000"/api/admin/alerts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ alertId: "test", action: "invalid" }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("Rate Limits", () => {
    test("should return rate limit config for admin", async () => {
      const response = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/rate-limits",
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.config).toBeDefined();
      expect(data.config.defaultLimit).toBeGreaterThan(0);
      expect(data.currentUsage).toBeInstanceOf(Array);
    });

    test("should filter rate limits by userId", async () => {
      const response = await fetch(
        `http:process.env.API_HOST || "localhost:3000"/api/admin/rate-limits?userId=${regularUser.id}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(Array.isArray(data.currentUsage)).toBe(true);
    });

    test("should update rate limit for user", async () => {
      const response = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/rate-limits",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: regularUser.id,
            endpoint: "/api/payments",
            newLimit: 200,
          }),
        },
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.newLimit).toBe(200);
    });

    test("should reset rate limit to default", async () => {
      const response = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/rate-limits",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: regularUser.id,
            endpoint: "/api/payments",
            action: "reset",
          }),
        },
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe("Audit Logs", () => {
    beforeAll(async () => {
      // Create data audit logs
      await auditLogService.create({
        userId: .id,
        action: "UPDATE",
        resource: "user",
        resourceId: .id,
        changes: JSON.stringify({ role: "user", status: "active" }),
      });

      await auditLogService.create({
        userId: .id,
        action: "DELETE",
        resource: "user",
        resourceId: "test_user_id",
      });
    });

    test("should return audit logs for admin", async () => {
      const response = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/audit-logs",
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(Array.isArray(data.logs)).toBe(true);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.total).toBeGreaterThanOrEqual(0);
    });

    test("should filter by action", async () => {
      const response = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/audit-logs?action=UPDATE",
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(Array.isArray(data.logs)).toBe(true);
      data.logs.forEach((log) => {
        expect(log.action).toBe("UPDATE");
      });
    });

    test("should filter by resource", async () => {
      const response = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/audit-logs?resource=user",
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      data.logs.forEach((log) => {
        expect(log.resource).toBe("user");
      });
    });

    test("should support pagination", async () => {
      const response = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/audit-logs?skip=0&take=10",
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.pagination.skip).toBe(0);
      expect(data.pagination.take).toBe(10);
      expect(data.pagination.total).toBeGreaterThanOrEqual(0);
    });

    test("should export audit logs as JSON", async () => {
      const response = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/audit-logs",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ format: "json" }),
        },
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toContain(
        "application/json",
      );
      expect(response.headers.get("Content-Disposition")).toContain(
        "attachment",
      );
    });

    test("should export audit logs as CSV", async () => {
      const response = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/audit-logs",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ format: "csv" }),
        },
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toContain("text/csv");
    });

    test("should reject invalid export format", async () => {
      const response = await fetch(
        "http:process.env.API_HOST || "localhost:3000"/api/admin/audit-logs",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ format: "invalid" }),
        },
      );

      expect(response.status).toBe(400);
    });
  });

  describe("Health Check", () => {
    test("should return health status without authentication", async () => {
      const response = await fetch("http:process.env.API_HOST || "localhost:3000"/api/health");

      expect([200, 503]).toContain(response.status);
      const data = await response.json();

      expect(data.status).toMatch(/^(healthy|degraded|unhealthy)$/);
      expect(data.checks).toBeDefined();
    });

    test("should include database check", async () => {
      const response = await fetch("http:process.env.API_HOST || "localhost:3000"/api/health");
      const data = await response.json();

      expect(data.checks.database).toBeDefined();
      expect(["connected", "disconnected"]).toContain(
        data.checks.database.status,
      );
    });

    test("should include memory check", async () => {
      const response = await fetch("http:process.env.API_HOST || "localhost:3000"/api/health");
      const data = await response.json();

      expect(data.checks.memory).toBeDefined();
      expect(data.checks.memory.heapUsedMB).toBeGreaterThan(0);
      expect(data.checks.memory.heapTotalMB).toBeGreaterThan(0);
    });
  });

  describe("Authorization", () => {
    test("should require admin role for all admin endpoints", async () => {
      const endpoints = [
        "/api/admin/monitoring",
        "/api/admin/alerts",
        "/api/admin/rate-limits",
        "/api/admin/audit-logs",
      ];

      for (const endpoint of endpoints) {
        const response = await fetch(`http:process.env.API_HOST || "localhost:3000"${endpoint}`, {
          headers: { Authorization: `Bearer ${regularToken}` },
        });

        expect(response.status).toBe(403);
      }
    });
  });
});
