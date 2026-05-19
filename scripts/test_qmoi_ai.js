
const logger = {
  info: (...args) => logger.info(`[${new Date().toISOString()}] INFO:`, ...args),
  debug: (...args) => console.debug(`[${new Date().toISOString()}] DEBUG:`, ...args),
  warning: (...args) => console.warn(`[${new Date().toISOString()}] WARN:`, ...args),
  error: (...args) => console.error(`[${new Date().toISOString()}] ERROR:`, ...args),
};

const QMOIService = {
  async processMessage(message, sessionId, userId) {
    const lower = String(message).toLowerCase();
    const response = {
      success: true,
      request: { message, sessionId, userId },
    };

    if (lower.includes("visualize")) {
      response.visualizations = [{ title: "Sales by Month", type: "bar" }];
    }

    if (lower.startsWith("remember:")) {
      response.memory = { note: message.slice(9).trim() };
    }

    return response;
  },
};

async function runTests() {
  logger.info("Running QMOI service optimized tests");

  const resp1 = await QMOIService.processMessage(
    "Hello QMOI!",
    "test-session-1",
    "test-user"
  );
  logger.info("Test 1:", resp1);

  const resp2 = await QMOIService.processMessage(
    "Please visualize sales by month",
    "test-session-1",
    "test-user"
  );
  logger.info("Test 2 (visualize):", {
    success: resp2.success,
    visualizationsCount: resp2.visualizations ? resp2.visualizations.length : 0,
  });

  const resp3 = await QMOIService.processMessage(
    "remember: I enjoy jazz music and coffee",
    "test-session-1",
    "test-user"
  );
  logger.info("Test 3 (memory):", resp3);

  logger.info("Done.");
}

runTests().catch((e) => {
  logger.error(e);
  process.exit(1);
});
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}