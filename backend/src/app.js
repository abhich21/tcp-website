import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";

import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

// Route Imports
import categoryRoutes from "./routes/categoryRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminAuthRoutes from "./admin/routes/authRoutes.js";
import portfolioAdminRoutes from "./admin/routes/portfolioAdminRoutes.js";
import messagesRoutes from "./admin/routes/messagesRoutes.js";
import auditLogsRoutes from "./admin/routes/auditLogsRoutes.js";
import statsRoutes from "./admin/routes/statsRoutes.js";
import categoryAdminRoutes from "./admin/routes/categoryAdminRoutes.js";

const app = express();

// --- Global Middleware ---

// Enable CORS
app.use(cors());

// Set various security HTTP headers
app.use(helmet());

// Parse JSON bodies (with a limit to prevent large payloads)
app.use(express.json({ limit: "50kb" }));

// Parse Cookie header
app.use(cookieParser());

// --- Rate Limiter for Contact Form ---
// This prevents spam and brute-force attacks on the contact endpoint
const contactLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000), // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX || 10), // Limit each IP to 10 requests per window
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// --- Routes ---
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/portfolio", portfolioAdminRoutes);
app.use("/api/admin/messages", messagesRoutes);
app.use("/api/admin/audit-logs", auditLogsRoutes);
app.use("/api/admin/stats", statsRoutes);
app.use("/api/admin/categories", categoryAdminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);

export default app;