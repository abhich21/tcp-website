//backend/src/controllers/contactController.js
import pkg from "@prisma/client";
import nodemailer from "nodemailer";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// --- Nodemailer Transporter ---
// We create this conditionally, only if all SMTP creds exist.
let transporter;

const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT } = process.env;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "587", 10),
    secure: SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  // Verify connection on startup
  transporter
    .verify()
    .then(() =>
      console.log("✅ Nodemailer transporter connected successfully.")
    )
    .catch((err) =>
      console.error(
        "❌ Nodemailer transporter connection failed:",
        err.message
      )
    );
} else {
  console.warn(
    "⚠️ SMTP environment variables not set. Email sending will be disabled."
  );
}

// --- Validation Helper ---
/**
 * Simple email validation regex.
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// --- Main Controller Function ---
export const handleContactSubmission = async (req, res) => {
  try {
    // 1. Destructure and get all data
    const { name, email, phone, message, honeypot } = req.body;
    let service = req.body.service;
    const ip = req.ip;
    const userAgent = req.get("User-Agent");

    // 2. Spam Protection (Honeypot)
    // This field must be present but empty.
    if (honeypot !== "") {
      // Don't give attackers any info.
      return res.status(400).json({ error: "Invalid request." });
    }

    // 3. Validation (as per requirements)
    if (!name || name.trim().length === 0 || name.length > 100) {
      return res.status(400).json({
        error: "Name is required and must be between 1 and 100 characters.",
      });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "A valid email is required." });
    }
    if (!phone || phone.trim().length === 0) {
      return res.status(400).json({ error: "A phone number is required." });
    }
    if (!message || message.trim().length === 0 || message.length > 5000) {
      return res.status(400).json({
        error: "Message is required and must be between 1 and 5000 characters.",
      });
    }

    // 4. Normalize Data
    const serviceClean =
      !service ||
      service.trim() === "" ||
      service.toLowerCase() === "default"
        ? "other"
        : service.trim();

    const dataToSave = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service: serviceClean,
      message: message.trim(),
      ip,
      userAgent,
    };

    // 5. Save to Database
    const newSubmission = await prisma.contactMessage.create({
      data: dataToSave,
    });

    // 6. Send Email (Fire-and-forget, non-blocking)
    if (transporter && process.env.CONTACT_RECEIVER_EMAIL) {
      const emailHtml = `
        <h1>New Website Contact Submission</h1>
        <p>A new message has been submitted via the website contact form.</p>
        <hr>
        <h3>Details</h3>
        <ul>
          <li><strong>Name:</strong> ${newSubmission.name}</li>
          <li><strong>Email:</strong> ${newSubmission.email}</li>
          <li><strong>Phone:</strong> ${newSubmission.phone}</li>
          <li><strong>Service:</strong> ${newSubmission.service}</li>
        </ul>
        <hr>
        <h3>Message</h3>
        <pre>${newSubmission.message}</pre>
        <hr>
        <p><em>IP Address: ${newSubmission.ip || "N/A"}</em></p>
        <p><em>User Agent: ${newSubmission.userAgent || "N/A"}</em></p>
      `;

      transporter
        .sendMail({
          from: `"Website Bot" <${process.env.SMTP_USER}>`,
          to: process.env.CONTACT_RECEIVER_EMAIL,
          subject: `[Website Contact] New Message from ${newSubmission.name}`,
          html: emailHtml,
        })
        .catch((emailErr) => {
          // IMPORTANT: Log the error but do not fail the request.
          console.error(
            `Failed to send contact email for submission ID ${newSubmission.id}:`,
            emailErr.message
          );
        });
    }

    // 7. Send Success Response
    res.status(201).json({
      ok: true,
      id: newSubmission.id,
    });
  } catch (err) {
    // Handle potential errors
    console.error("Error in handleContactSubmission:", err);

    // Check for Prisma-specific errors (e.g., unique constraint)
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ error: "This submission appears to be a duplicate." });
    }

    res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};