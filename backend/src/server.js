console.log("Starting server...");
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
const PORT = process.env.PORT || 5000;
// For local dev
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}
// Export for Vercel
export default app;
