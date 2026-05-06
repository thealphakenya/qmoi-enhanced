import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/db/prisma";
import { aiService } from "../../lib/ai-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Get self-training status and metrics
    const [
      trainingSessions,
      recentFeedback,
      modelMetrics,
      activeTraining
    ] = await Promise.all([
      prisma.systemMetric.findMany({
        where: {
          metricType: 'training',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.systemMetric.findMany({
        where: {
          metricName: 'user_feedback',
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.systemMetric.findMany({
        where: {
          category: 'ai',
          metricName: { in: ['accuracy', 'response_quality', 'learning_rate'] },
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.systemMetric.findFirst({
        where: {
          metricType: 'training',
          metricName: 'training_active',
          value: 1,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Calculate training metrics
    const totalSessions = trainingSessions.filter(m => m.metricName === 'training_session').length;
    const avgAccuracy = modelMetrics
      .filter(m => m.metricName === 'accuracy')
      .reduce((sum, m) => sum + m.value, 0) /
      Math.max(modelMetrics.filter(m => m.metricName === 'accuracy').length, 1);

    const positiveFeedback = recentFeedback.filter(f => f.value >= 4).length;
    const totalFeedback = recentFeedback.length;
    const feedbackScore = totalFeedback > 0 ? (positiveFeedback / totalFeedback) * 100 : 0;

    return NextResponse.json({
      success: true,
      selfTraining: {
        status: activeTraining ? 'active' : 'idle',
        lastTrainingSession: trainingSessions[0]?.createdAt?.toISOString() || null,
        totalSessions,
        avgAccuracy: Math.round(avgAccuracy * 100) / 100,
        feedbackScore: Math.round(feedbackScore * 100) / 100,
        improvementRate: calculateImprovementRate(modelMetrics),
      },
      metrics: {
        sessions: totalSessions,
        feedback: {
          total: totalFeedback,
          positive: positiveFeedback,
          score: Math.round(feedbackScore * 100) / 100,
        },
        performance: {
          accuracy: Math.round(avgAccuracy * 100) / 100,
          quality: modelMetrics.filter(m => m.metricName === 'response_quality')
            .reduce((sum, m) => sum + m.value, 0) /
            Math.max(modelMetrics.filter(m => m.metricName === 'response_quality').length, 1),
        },
      },
      recentActivity: recentFeedback.slice(0, 5).map(f => ({
        type: 'feedback',
        value: f.value,
        timestamp: f.createdAt.toISOString(),
      })),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Self-training status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch self-training status",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, feedback, trainingData } = body;

    if (action === 'submit_feedback' && feedback) {
      // Submit user feedback for model improvement
      const { rating, message, context } = feedback;

      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return NextResponse.json(
          { success: false, error: "Rating must be a number between 1 and 5" },
          { status: 400 }
        );
      }

      await prisma.systemMetric.create({
        data: {
          metricType: 'feedback',
          metricName: 'user_feedback',
          value: rating,
          unit: 'rating',
          category: 'ai',
          subsystem: 'self_training',
          dimensions: JSON.stringify({
            message: message?.substring(0, 100),
            context: context?.substring(0, 50),
          }),
          tags: JSON.stringify(['user_feedback', 'training_data']),
          source: 'user',
          collectedBy: 'self-training-api',
        },
      });

      // Trigger model improvement if rating is low
      if (rating <= 2) {
        await triggerModelImprovement(message, context);
      }

      return NextResponse.json({
        success: true,
        message: "Feedback submitted successfully",
        feedbackId: `feedback_${Date.now()}`,
        improvementTriggered: rating <= 2,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'start_training') {
      // Start a self-training session
      await prisma.systemMetric.create({
        data: {
          metricType: 'training',
          metricName: 'training_active',
          value: 1,
          unit: 'boolean',
          category: 'ai',
          subsystem: 'self_training',
          dimensions: JSON.stringify({
            trainingData: trainingData ? Object.keys(trainingData) : [],
          }),
          tags: JSON.stringify(['training', 'active']),
          source: 'api',
          collectedBy: 'self-training-api',
        },
      });

      // Simulate training process (in real implementation, this would trigger actual ML training)
      setTimeout(async () => {
        try {
          await prisma.systemMetric.create({
            data: {
              metricType: 'training',
              metricName: 'training_session',
              value: 1,
              unit: 'session',
              category: 'ai',
              subsystem: 'self_training',
              dimensions: JSON.stringify({
                duration: 300, // 5 minutes
                dataPoints: trainingData?.length || 0,
              }),
              tags: JSON.stringify(['training', 'completed']),
              source: 'api',
              collectedBy: 'self-training-api',
            },
          });

          // Mark training as inactive
          await prisma.systemMetric.updateMany({
            where: {
              metricType: 'training',
              metricName: 'training_active',
              value: 1,
            },
            data: { value: 0 },
          });
        } catch (error) {
          logger.error('Training completion logging failed:', error);
        }
      }, 1000); // Simulate immediate completion for demo

      return NextResponse.json({
        success: true,
        message: "Self-training session started",
        sessionId: `training_${Date.now()}`,
        estimatedDuration: 300, // 5 minutes
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Use 'submit_feedback' or 'start_training'." },
      { status: 400 }
    );

  } catch (error) {
    logger.error('Self-training POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process self-training action",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

function calculateImprovementRate(metrics: any[]): number {
  // Calculate improvement rate based on accuracy trends
  const accuracyMetrics = metrics
    .filter(m => m.metricName === 'accuracy')
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  if (accuracyMetrics.length < 2) return 0;

  const recent = accuracyMetrics.slice(-5); // Last 5 measurements
  const older = accuracyMetrics.slice(0, 5); // First 5 measurements

  const recentAvg = recent.reduce((sum, m) => sum + m.value, 0) / recent.length;
  const olderAvg = older.reduce((sum, m) => sum + m.value, 0) / older.length;

  return ((recentAvg - olderAvg) / olderAvg) * 100;
}

async function triggerModelImprovement(message: string, context: string) {
  // Trigger model improvement based on negative feedback
  try {
    await prisma.systemMetric.create({
      data: {
        metricType: 'improvement',
        metricName: 'model_improvement_triggered',
        value: 1,
        unit: 'trigger',
        category: 'ai',
        subsystem: 'self_training',
        dimensions: JSON.stringify({
          feedbackMessage: message?.substring(0, 100),
          context: context?.substring(0, 50),
          triggerReason: 'low_user_rating',
        }),
        tags: JSON.stringify(['improvement', 'feedback_driven']),
        source: 'api',
        collectedBy: 'self-training-api',
      },
    });

    // In a real implementation, this would trigger:
    // 1. Analysis of the feedback
    // 2. Model retraining with new data
    // 3. A/B testing of improved model
    // 4. Gradual rollout if improvement is detected

  } catch (error) {
    logger.error('Model improvement trigger failed:', error);
  }
}
