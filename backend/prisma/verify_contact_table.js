// tumul901/tcp-website/tcp-website/backend/prisma/verify_contact_table.js
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  console.log(
    "Attempting to connect to the database and find ContactMessage table..."
  );
  
  // Try to count records. This will fail if the table or model doesn't exist.
  const count = await prisma.contactMessage.count();
  
  console.log(`✅ Success! Found 'ContactMessage' table.`);
  console.log(`Current record count: ${count}`);
}

main()
  .catch((e) => {
    console.error("❌ Error verifying ContactMessage table:");
    console.error(e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Disconnected from database.");
  });