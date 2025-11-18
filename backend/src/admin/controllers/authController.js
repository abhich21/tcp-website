import { generateSessionToken, verifySessionToken } from '../utils/session.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const envUsername = process.env.ADMIN_USERNAME;
    const envPassword = process.env.ADMIN_PASSWORD;

    // Safety check for server config
    if (!envUsername || !envPassword) {
      console.error('CRITICAL: ADMIN_USERNAME or ADMIN_PASSWORD not set in .env');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Verify credentials
    if (username !== envUsername || password !== envPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate session
    const token = generateSessionToken({ username });
    if (!token) {
      return res.status(500).json({ message: 'Error generating session' });
    }

    // Set secure session cookie
    res.cookie('admin_session', token, {
      httpOnly: true,
      secure: true, // Requires HTTPS (or localhost in some browsers)
      sameSite: 'strict',
      path: '/'
      // No maxAge: expires on browser close
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('admin_session', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });
    return res.json({ success: true });
  } catch (error) {
    console.error('Admin logout error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const me = async (req, res) => {
  try {
    // req.cookies requires cookie-parser middleware to be active
    const token = req.cookies?.admin_session;

    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    const decoded = verifySessionToken(token);

    if (!decoded) {
      return res.status(401).json({ authenticated: false });
    }

    // Valid session
    return res.json({
      authenticated: true,
      user: { username: decoded.username }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};