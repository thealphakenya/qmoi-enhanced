import { NextResponse } from "next/server";
import { PrismaClient, Dataset } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get datasets from database
    const datasets = await prisma.dataset.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      datasets: datasets.map((dataset: Dataset) => ({
        id: dataset.id,
        name: dataset.name,
        description: dataset.description,
        type: dataset.type,
        size: dataset.size,
        itemCount: dataset.itemCount,
        createdAt: dataset.createdAt.toISOString(),
        updatedAt: dataset.updatedAt.toISOString(),
        status: dataset.status,
        metadata: dataset.metadata,
        stats: dataset.stats,
      })),
    });
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return NextResponse.json(
      { error: "Failed to fetch datasets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, type, metadata } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      );
    }

    // Create dataset in database
    const dataset = await prisma.dataset.create({
      data: {
        name,
        description,
        type,
        metadata: {
          format: "json",
          version: "1.0.0",
          tags: [],
          ...metadata,
        },
        stats: {
          totalItems: 0,
          processedItems: 0,
          failedItems: 0,
          averageProcessingTime: 0,
        },
      },
    });

    return NextResponse.json({
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
      type: dataset.type,
      size: dataset.size,
      itemCount: dataset.itemCount,
      createdAt: dataset.createdAt.toISOString(),
      updatedAt: dataset.updatedAt.toISOString(),
      status: dataset.status,
      metadata: dataset.metadata,
      stats: dataset.stats,
    });
  } catch (error) {
    console.error("Error creating dataset:", error);
    return NextResponse.json(
      { error: "Failed to create dataset" },
      { status: 500 }
    );
  }
}
