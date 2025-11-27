import express from "express";
import authAdmin from "../middleware/authAdmin.js";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryAdminController.js";

const router = express.Router();

// Protect all routes with admin authentication
router.use(authAdmin);

// Routes
router.get("/", getAllCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
