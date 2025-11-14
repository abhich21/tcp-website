import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";


const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/portfolio", portfolioRoutes);

export default app;
