// tumul901/tcp-website/tcp-website/backend/src/middleware/recaptcha.js
import axios from "axios";

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
const RECAPTCHA_SCORE_THRESHOLD = 0.5;
const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

/**
 * Middleware to verify a Google reCAPTCHA v3 token.
 * If RECAPTCHA_SECRET is not set, this middleware is disabled and calls next().
 */
export const verifyRecaptcha = async (req, res, next) => {
  // 1. Check if reCAPTCHA is enabled
  if (!RECAPTCHA_SECRET) {
    // Silently proceed if not configured
    return next();
  }

  // 2. Get the token from the request body
  const { recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res
      .status(400)
      .json({ error: "reCAPTCHA token is missing." });
  }

  // 3. Verify the token with Google
  try {
    const response = await axios.post(
      RECAPTCHA_VERIFY_URL,
      null, // No body, params are sent as query string
      {
        params: {
          secret: RECAPTCHA_SECRET,
          response: recaptchaToken,
          // remoteip: req.ip (optional, but recommended)
        },
        timeout: 2000, // 2-second timeout
      }
    );

    const { success, score } = response.data;

    // 4. Check success and score
    if (success && score >= RECAPTCHA_SCORE_THRESHOLD) {
      // Verification successful
      return next();
    } else {
      // Verification failed (either not success or low score)
      console.warn(
        `reCAPTCHA verification failed for ${req.ip}. Score: ${score || 'N/A'}`
      );
      return res
        .status(400)
        .json({ error: "reCAPTCHA verification failed. Please try again." });
    }
  } catch (error) {
    // 5. Handle network or other errors
    console.error("Error during reCAPTCHA verification:", error.message);
    // In case of error (e.g., Google is down), we might choose to fail open or closed.
    // Failing closed (rejecting) is safer against spam.
    return res
      .status(500)
      .json({ error: "Error verifying reCAPTCHA. Please try again later." });
  }
};