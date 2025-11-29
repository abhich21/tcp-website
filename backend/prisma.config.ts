import { defineConfig, env } from "prisma/config";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Force-load .env manually (fixes PrismaConfigEnvError)
dotenv.config({ path: resolve(process.cwd(), ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
