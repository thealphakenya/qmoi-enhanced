/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextResponse } from "next/server";

// Conditionally import Prisma
let prisma: any = null;
let prismaInitialized = false;

async function getPrismaClient() {
  // Return a mock Prisma client for build compatibility
  // TODO: Replace with real Prisma client when database is configured
  return {
    dataset: {
      findMany: async () => [],
      create: async (data: any) => ({ id: "mock-dataset-id", ...data.data }),
    },
    $disconnect: async () => {},
  };
}

export async function GET() {
  try {
    const prisma = await getPrismaClient();
    // Check if Prisma is available and database is configured
    const isPrismaAvailable =
      prisma &&
      process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes("your_database_url_here");

    if (!isPrismaAvailable) {
      return NextResponse.json({
        datasets: [
          {
            id: "mock-dataset-1",
            name: "Sample Dataset",
            description: "Mock dataset for build time",
            type: "json",
            size: 1024,
            itemCount: 100,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: "active",
            metadata: { format: "json", version: "1.0.0" },
            stats: {
              totalItems: 100,
              processedItems: 100,
              failedItems: 0,
              averageProcessingTime: 50,
            },
          },
        ],
        message: "Using mock data - database not configured",
      });
    } else {
      // Database code temporarily disabled
      // TODO: Re-enable when Prisma is properly configured
      return NextResponse.json({
        datasets: [],
        message: "Database temporarily disabled for build compatibility",
      });
    }
  } catch (error) {
    console.error("Error fetching datasets:", error);
    // Return mock data during build time or when database fails
    return NextResponse.json({
      datasets: [],
      error: "Database connection failed - using mock data",
    });
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

    // Database temporarily disabled - return mock data
    // TODO: Re-enable when Prisma is properly configured
    const mockDataset = {
      id: `dataset-${Date.now()}`,
      name,
      description,
      type,
      size: 0,
      itemCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active",
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
    };

    return NextResponse.json(mockDataset);
  } catch (error) {
    console.error("Error creating dataset:", error);
    return NextResponse.json(
      { error: "Failed to create dataset" },
      { status: 500 }
    );
  }
}
