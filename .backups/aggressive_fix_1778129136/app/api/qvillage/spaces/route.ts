import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const now = new Date().toISOString();

  return NextResponse.json({
    success: true,
    lastUpdated: now,
    datasets: [
      {
        id: "DS-1001",
        name: "QMOI AI Conversations",
        description: "1.2M anonymized chat logs for training conversational models.",
        access: "free",
        size: "480GB",
      },
      {
        id: "DS-1002",
        name: "PRODUCTIONice Performance Metrics",
        description: "500K PRODUCTIONice logs across production and field environments.",
        access: "paid",
        price: "$24.99",
        size: "120GB",
      },
      {
        id: "DS-1003",
        name: "Marketplace Transaction History",
        description: "50K categorized revenue events and customer analytics.",
        access: "paid",
        price: "$49.99",
        size: "75GB",
      },
    ],
    models: [
      {
        id: "MDL-210",
        name: "Sentiment Analysis Pro",
        status: "deployed",
        pricing: "$9.99/month",
      },
      {
        id: "MDL-311",
        name: "Image Recognition Enterprise",
        status: "PRODUCTION",
        pricing: "$19.99/month",
      },
      {
        id: "MDL-415",
        name: "Predictive Analytics Engine",
        status: "trial",
        pricing: "$7.99/use",
      },
    ],
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "QVillage spaces endpoint accepts GET for dataset and model catalog retrieval.",
  });
}
