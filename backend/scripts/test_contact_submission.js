// tumul901/tcp-website/tcp-website/backend/prisma/test_contact_submission.js

/*
 * =============================================================================
 * Standalone Backend Verification Script for Contact Submission
 * =============================================================================
 *
 * Purpose:
 * This script tests the `handleContactSubmission` controller logic directly,
 * bypassing the Express server, router, and middleware. It verifies:
 * 1. Controller logic (validation, normalization).
 * 2. Prisma database connection and write operation.
 * 3. Correct response format.
 *
 * NOTE: This script will NOT send a real email as long as SMTP
 * environment variables are not set in the shell.
 *
 * How to run:
 * 1. Make sure your .env file has the correct DATABASE_URL.
 * 2. Run from the `backend` directory:
 * node prisma/test_contact_submission.js
 *
 * =============================================================================
 */

import pkg from "@prisma/client";
import { handleContactSubmission } from "../src/controllers/contactController.js";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// --- Mock Data ---
const testSubmission = {
  name: "Test User",
  email: `test-${Date.now()}@example.com`, // Unique email for each run
  phone: "9876543210",
  service: "branding",
  message: "This is a backend test submission from the verification script.",
  honeypot: "",
  // 'recaptchaToken' is not needed here as we are calling the controller directly,
  // bypassing the recaptcha middleware.
};

// --- Mock Request & Response ---
let savedId = null;
let responseStatus = null;
let responseBody = null;

// Mock Express Request object
const mockReq = {
  body: testSubmission,
  headers: {
    "user-agent": "Test-Script/1.0",
    "x-forwarded-for": "127.0.0.1",
  },
  ip: "127.0.0.1",
  get: (headerName) => {
    if (headerName.toLowerCase() === "user-agent") {
      return mockReq.headers["user-agent"];
    }
    return undefined;
  },
};

// Mock Express Response object
const mockRes = {
  status: (code) => {
    responseStatus = code;
    console.log(`[Test] res.status() called with: ${code}`);
    return mockRes; // Enable chaining (e.g., res.status(201).json(...))
  },
  json: (payload) => {
    responseBody = payload;
    console.log("[Test] res.json() called with:", payload);
    if (payload && payload.id) {
      savedId = payload.id;
    }
    return mockRes;
  },
};

// --- Main Test Function ---
async function main() {
  console.log("🚀 Starting contact submission test...");
  console.log("-----------------------------------------");
  console.log("Submitting test data:", testSubmission);
  console.log("-----------------------------------------");

  // Call the controller directly
  await handleContactSubmission(mockReq, mockRes);

  console.log("-----------------------------------------");

  // Check the response
  if (responseStatus === 201 && savedId) {
    console.log(`✅ TEST PASSED: Submission saved successfully.`);
    console.log(`Retrieved submission ID: ${savedId}`);

    // Verify the record in the database
    console.log("\nVerifying record in database...");
    const savedRecord = await prisma.contactMessage.findUnique({
      where: { id: savedId },
    });

    if (savedRecord) {
      console.log("✅ DB record found successfully:");
      console.log(savedRecord);
    } else {
      console.error(
        `❌ TEST FAILED: Record with ID ${savedId} not found in database.`
      );
    }
  } else {
    console.error(`❌ TEST FAILED: Received unexpected response.`);
    console.error(`Status: ${responseStatus}`);
    console.error(`Body:`, responseBody);
  }
}

// --- Run Test ---
main()
  .catch((e) => {
    console.error("❌ An unexpected error occurred during the test:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("\n[Test] Prisma client disconnected.");
    console.log("Test complete. ✨");
  });