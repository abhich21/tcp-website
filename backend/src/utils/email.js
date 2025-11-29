// tumul901/tcp-website/tcp-website-d66ffaf1bb64fc577ab80a112ef9305a0440dc75/backend/src/utils/email.js
import nodemailer from "nodemailer";

// --- Nodemailer Transporter ---
// We create this conditionally, only if all SMTP creds exist.
let transporter;

const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT, SMTP_SECURE } = process.env;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "587", 10),
    secure: SMTP_SECURE === "true" || SMTP_PORT === "465", // true for 465, false for other ports
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

/**
 * Sends a formatted contact email notification.
 * Logs errors to the console instead of throwing.
 *
 * @param {object} data - The submission data
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.phone
 * @param {string} data.service
 * @param {string} data.message
 * @param {string} [data.ip]
 * @param {string} [data.userAgent]
 */
export const sendContactEmail = async (data) => {
  const { name, email, phone, service, message, ip, userAgent } = data;

  if (!transporter || !process.env.CONTACT_RECEIVER_EMAIL) {
    console.error(
      "Email sending is disabled or CONTACT_RECEIVER_EMAIL is not set."
    );
    return;
  }

  const emailHtml = `
    <h1>New Website Contact Submission</h1>
    <p>A new message has been submitted via the website contact form.</p>
    <hr>
    <h3>Details</h3>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Phone:</strong> ${phone}</li>
      <li><strong>Service:</strong> ${service}</li>
    </ul>
    <hr>
    <h3>Message</h3>
    <pre style="white-space: pre-wrap; font-family: sans-serif;">${message}</pre>
    <hr>
    <p><small>IP Address: ${ip || "N/A"}</small></p>
    <p><small>User Agent: ${userAgent || "N/A"}</small></p>
  `;

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Website Bot'}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: `[Website Contact] New Message from ${name}`,
      html: emailHtml,
    });
  } catch (emailErr) {
    // IMPORTANT: Log the error but do not fail the request.
    console.error(
      `Failed to send contact email for submission from ${email}:`,
      emailErr.message
    );
  }
};