console.log("Starting server...");
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";

// For local development
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });

// 🛑 NEW: Export the app instance for Vercel
export default app; // Use export default because you are using ES modules