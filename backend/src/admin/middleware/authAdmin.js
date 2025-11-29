import { verifySessionToken } from '../utils/session.js';

/**
 * Middleware to protect admin routes.
 * Checks for a valid 'admin_session' cookie and verifies the HMAC signature.
 */
const authAdmin = async (req, res, next) => {
  try {
    // req.cookies requires 'cookie-parser' middleware to be configured in app.js
    const token = req.cookies?.admin_session;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No session provided' });
    }

    const decoded = verifySessionToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized: Invalid session' });
    }

    // Attach admin info to request object for downstream controllers
    req.admin = decoded;
    
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default authAdmin;