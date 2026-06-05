// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:14Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 */


const logger = getLogger("api/qmoi/health/stream");

/**
 * GET function
 */
export async function GET(request: NextRequest): Promise<any> {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response("Authentication required", { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await authService.verifyToken(token);

    if (!user) {
      return new Response("Invalid token", { status: 401 });
    }

    // Set up Server-Sent Events
    const responseStream = new ReadableStream({
      start(controller) {
        // Start health monitoring
        qmoiHealthService.startMonitoring();

        // Send initial data
        const sendData = () => {
          try {
            const pulse = qmoiHealthService.getCurrentPulse();
            const emotion = qmoiHealthService.getCurrentEmotion();
            const consciousness = qmoiHealthService.getConsciousnessMetrics();
            const health = qmoiHealthService.getHealthMetrics();
            const systemStatus = qmoiHealthService.getSystemStatus();

            const data = {
              pulse,
              emotion,
              consciousness,
              health,
              systemStatus,
              timestamp: new Date().toISOString(),
            };

            // Send as SSE
            controller.enqueue(
              `data: ${JSON.stringify(data)}\n\n`
            );
          } catch (error) {
            logger.error("SSE data send error", { error });
          }
        };

        // Send initial data
        sendData();

        const interval = setInterval(sendData, 2000); // Update every 2 seconds

        // Handle client disconnect
        request.signal.adprodentListener("abort", () => {
          clearInterval(interval);
          qmoiHealthService.stopMonitoring();
          controller.close();
        });
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
      },
    });
  } catch (error) {
    logger.error("Health SSE error", { error });
    return new Response("Internal server error", { status: 500 });
  }
}