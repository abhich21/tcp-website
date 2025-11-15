// prisma/seed.js
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "All" },
    { name: "Event Design" },
    { name: "3D, Anamorphic, CGI & VFX" },
    { name: "Animation" },
    { name: "Event Content" },
    { name: "Games" },
    { name: "Home Look" },
    { name: "Presentation Design" },
    { name: "About Us" },
    { name: "Brochure" },
    { name: "Team Building & Simulations" },
  ];

  // Clear old categories (optional)
  await prisma.category.deleteMany();

  // Insert new ones
  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  console.log("✅ Categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
