import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Connecting to database...");
    const categories = await prisma.category.findMany();
    console.log("Categories found in DB:", categories);
    console.log("Count:", categories.length);
  } catch (e) {
    console.error("Error querying Prisma:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
