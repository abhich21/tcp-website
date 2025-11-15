import "dotenv/config";
import { execSync } from "child_process";

console.log("Loaded DB URL:", process.env.DATABASE_URL);
execSync("npx prisma generate --schema=./prisma/schema.prisma", { stdio: "inherit" });
