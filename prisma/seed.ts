import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Create Master User
    const masterHash = await bcrypt.hash('MasterPass123!', 12);
    const master = await prisma.user.upsert({
      where: { email: 'master@qmo.ai' },
      update: {},
      create: {
        email: 'master@qmo.ai',
        username: 'master_qmoi',
        name: 'Master Administrator',
        role: 'Master',
        authProfile: {
          create: {
            passwordHash: masterHash,
            isActive: true,
            lastLogin: new Date(),
          },
        },
      },
    });
    console.log('✅ Master user created:', master.email);

    // Create Sister User
    const sisterHash = await bcrypt.hash('SisterPass123!', 12);
    const sister = await prisma.user.upsert({
      where: { email: 'sister@qmo.ai' },
      update: {},
      create: {
        email: 'sister@qmo.ai',
        username: 'sister_qmoi',
        name: 'Sister Operator',
        role: 'Sister',
        authProfile: {
          create: {
            passwordHash: sisterHash,
            isActive: true,
            lastLogin: new Date(),
          },
        },
      },
    });
    console.log('✅ Sister user created:', sister.email);

    // Create Demo User
    const demoHash = await bcrypt.hash('demo', 12);
    const demo = await prisma.user.upsert({
      where: { email: 'demo@qmo.ai' },
      update: {},
      create: {
        email: 'demo@qmo.ai',
        username: 'demo_user',
        name: 'Demo User',
        role: 'User',
        authProfile: {
          create: {
            passwordHash: demoHash,
            isActive: true,
            lastLogin: new Date(),
          },
        },
      },
    });
    console.log('✅ Demo user created:', demo.email);

    // Create Test User
    const testHash = await bcrypt.hash('TestUser123!', 12);
    const user = await prisma.user.upsert({
      where: { email: 'user@qmo.ai' },
      update: {},
      create: {
        email: 'user@qmo.ai',
        username: 'test_user',
        name: 'Test User Account',
        role: 'User',
        authProfile: {
          create: {
            passwordHash: testHash,
            isActive: true,
            lastLogin: new Date(),
          },
        },
      },
    });
    console.log('✅ Test user created:', user.email);

    console.log('');
    console.log('🎉 Database seed completed successfully!');
    console.log('');
    console.log('📝 Demo Credentials:');
    console.log('  Master - Email: master@qmo.ai, Password: MasterPass123!');
    console.log('  Sister - Email: sister@qmo.ai, Password: SisterPass123!');
    console.log('  Demo   - Email: demo@qmo.ai, Password: demo');
    console.log('  User   - Email: user@qmo.ai, Password: TestUser123!');
    console.log('');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
