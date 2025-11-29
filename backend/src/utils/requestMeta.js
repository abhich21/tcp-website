// tumul901/tcp-website/tcp-website/backend/src/utils/requestMeta.js

/**
 * Extracts key metadata (IP, User-Agent) from the request object.
 *
 * @param {import('express').Request} req - The Express request object.
 * @returns {{ ip: string, userAgent: string }}
 */
export const extractRequestMeta = (req) => {
  // Get IP:
  // Check for 'x-forwarded-for' header (common for proxies/load balancers)
  // Fallback to req.ip (provided by Express)
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",").shift()?.trim() ||
    req.ip ||
    "";

  // Get User-Agent
  const userAgent = req.headers["user-agent"] || "";

  return { ip, userAgent };
};