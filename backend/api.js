// backend/api.js

// Use CommonJS syntax here, as it's the most compatible Vercel entry point
const app = require('./app.js').default; 

// Set environment variables for dotenv manually if needed (already in Vercel settings)

// Export the app
module.exports = app;
