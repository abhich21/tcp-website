//backend/src/routes/contactRoutes.js
import express from "express";
import { handleContactSubmission } from "../controllers/contactController.js";

const router = express.Router();

// Handle contact form submissions
router.post("/", handleContactSubmission);

export default router;