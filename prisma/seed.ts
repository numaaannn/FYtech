import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample software products
  const software1 = await prisma.softwareProduct.create({
    data: { name: 'Analytics Suite', description: 'Powerful analytics tools' },
  });
  const software2 = await prisma.softwareProduct.create({
    data: { name: 'CRM Pro', description: 'Customer relationship management' },
  });

  // Create sample subscription plans
  const planBasic = await prisma.subscriptionPlan.create({
    data: { name: 'Basic', price: 19.99, features: 'Core features' },
  });
  const planPro = await prisma.subscriptionPlan.create({
    data: { name: 'Pro', price: 49.99, features: 'Advanced features' },
  });

  // Create sample businesses
  const biz1 = await prisma.business.create({
    data: {
      name: 'Acme Corp',
      ownerName: 'John Doe',
      description: 'Leading provider of widgets',
    },
  });

  const biz2 = await prisma.business.create({
    data: {
      name: 'Globex Inc',
      ownerName: 'Jane Smith',
      description: 'Global logistics solutions',
    },
  });

  // Create subscriptions linking businesses and software
  await prisma.subscription.create({
    data: {
      status: 'Active',
      plan: planBasic.name,
      businessId: biz1.id,
      softwareId: software1.id,
    },
  });

  await prisma.subscription.create({
    data: {
      status: 'Active',
      plan: planPro.name,
      businessId: biz2.id,
      softwareId: software2.id,
    },
  });

  console.log('Seed data inserted');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
