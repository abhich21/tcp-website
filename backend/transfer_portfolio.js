import mysql from "mysql2/promise";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

async function transferData() {
  const mysqlConn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
  });

  const pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await pgClient.connect();

  console.log("✅ Connected to MySQL and PostgreSQL");

  const [rows] = await mysqlConn.query("SELECT * FROM portfolio");
  console.log(`📦 Found ${rows.length} rows in MySQL`);

  for (const row of rows) {
    const {
      id,
      title,
      category_id,
      details,
      description,
      image,
    } = row;

    // Clean fields
    const safeTitle = title || "Untitled";
    const safeCatId = category_id || 0;
    const safeDetails = details ? JSON.stringify(details) : JSON.stringify([]);
    const safeDescription = description || null;
    const safeImage = image || "";

    const query = `
      INSERT INTO "PortfolioItem" (id, title, category_id, details, description, image)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO NOTHING;
    `;

    await pgClient.query(query, [
      id,
      safeTitle,
      safeCatId,
      safeDetails,
      safeDescription,
      safeImage,
    ]);
  }

  console.log("✅ Data transfer complete!");
  await mysqlConn.end();
  await pgClient.end();
}

transferData().catch((err) => {
  console.error("❌ Transfer failed:", err);
});
