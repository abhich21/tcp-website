console.log("Starting server...");
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";


// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}
// Export for Vercel
export default app;
