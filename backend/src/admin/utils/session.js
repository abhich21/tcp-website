import crypto from 'crypto';

// Ensure the secret is loaded. In a real app, you might want to throw an error to prevent startup.
const getSecret = () => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    console.error('⚠️ CRITICAL WARNING: ADMIN_SESSION_SECRET is not defined in .env. Admin authentication will fail.');
  }
  return secret || '';
};

/**
 * Generates a signed session token using HMAC-SHA256.
 * Format: base64(payload) + "." + hmacSignature
 * * @param {Object} payload - The data to encode in the session (e.g., { role: 'admin' }).
 * @returns {string|null} - The signed token string, or null if no secret is configured.
 */
export const generateSessionToken = (payload) => {
  const secret = getSecret();
  if (!secret) return null;

  try {
    // 1. Convert payload to JSON and then to Base64
    const payloadStr = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadStr).toString('base64');

    // 2. Create HMAC signature of the Base64 payload
    const signature = crypto
      .createHmac('sha256', secret)
      .update(base64Payload)
      .digest('hex');

    // 3. Combine them
    return `${base64Payload}.${signature}`;
  } catch (error) {
    console.error('Error generating session token:', error);
    return null;
  }
};

/**
 * Verifies a signed session token.
 * * @param {string} token - The token string to verify.
 * @returns {Object|null} - The decoded payload if valid, otherwise null.
 */
export const verifySessionToken = (token) => {
  const secret = getSecret();
  if (!secret || !token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [base64Payload, originalSignature] = parts;

  // 1. Recompute the signature based on the payload part
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(base64Payload)
    .digest('hex');

  // 2. Securely compare the signatures (constant-time to prevent timing attacks)
  const originalBuffer = Buffer.from(originalSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  // Check length match first to prevent timingSafeEqual error
  if (originalBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(originalBuffer, expectedBuffer)) {
    return null; // Signature mismatch
  }

  // 3. Decode payload
  try {
    const payloadStr = Buffer.from(base64Payload, 'base64').toString('utf-8');
    return JSON.parse(payloadStr);
  } catch (error) {
    console.error('Error decoding session payload:', error);
    return null;
  }
};