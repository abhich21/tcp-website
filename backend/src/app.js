// tumul901/tcp-website/tcp-website-d66ffaf1bb64fc577ab80a112ef9305a0440dc7s5/backend/src/app.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";

// Route Imports
import categoryRoutes from "./routes/categoryRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();

// --- Global Middleware ---

// Enable CORS
app.use(cors());

// Set various security HTTP headers
app.use(helmet());

// Parse JSON bodies (with a limit to prevent large payloads)
app.use(express.json({ limit: "50kb" }));

// Data sanitization against XSS
app.use(xss());

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
app.use("/api/categories", categoryRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contact", contactLimiter, contactRoutes); // Apply limiter only to this route

export default app;