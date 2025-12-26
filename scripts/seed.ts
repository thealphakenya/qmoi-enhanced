import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: "researcher@qmoi.ai",
      username: "qmoi_researcher",
      name: "QMOI Research Team",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "expert@qmoi.ai",
      username: "performance_expert",
      name: "Performance Expert",
    },
  });

  // Create sample discussions
  await prisma.discussion.create({
    data: {
      title: "Advanced AI Consciousness Discussion",
      content: "Exploring the latest developments in AI consciousness...",
      authorId: user1.id,
      tags: ["AI", "Consciousness"],
      relevanceScore: 0.92,
      replies: 45,
      views: 120,
    },
  });

  await prisma.discussion.create({
    data: {
      title: "Parallel Processing Techniques",
      content: "Best practices for implementing parallel processing...",
      authorId: user2.id,
      tags: ["Parallel", "Performance"],
      relevanceScore: 0.85,
      replies: 23,
      views: 89,
    },
  });

  // Create sample knowledge base entries
  await prisma.knowledgeBaseEntry.create({
    data: {
      title: "Advanced AI Consciousness",
      content:
        "Comprehensive guide to implementing consciousness in AI systems...",
      authorId: user1.id,
      tags: ["AI", "Consciousness"],
      relevanceScore: 0.95,
    },
  });

  await prisma.knowledgeBaseEntry.create({
    data: {
      title: "Parallel Processing Techniques",
      content:
        "Advanced parallel processing methods for superior performance...",
      authorId: user2.id,
      tags: ["Parallel", "Performance"],
      relevanceScore: 0.88,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
