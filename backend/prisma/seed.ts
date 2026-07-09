import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'System Administrator' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER', description: 'Standard User' },
  });

  // 2. Seed Languages
  const enLang = await prisma.language.upsert({
    where: { code: 'en' },
    update: {},
    create: { code: 'en', name: 'English' },
  });

  const jaLang = await prisma.language.upsert({
    where: { code: 'ja' },
    update: {},
    create: { code: 'ja', name: 'Japanese' },
  });

  // 3. Seed Organization & Team
  const org = await prisma.organization.upsert({
    where: { domain: 'linguaverse.ai' },
    update: {},
    create: {
      name: 'LinguaVerse Inc.',
      domain: 'linguaverse.ai',
    },
  });

  const team = await prisma.team.create({
    data: {
      name: 'Engineering',
      organizationId: org.id,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
