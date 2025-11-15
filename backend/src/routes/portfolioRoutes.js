import express from "express";
import { uploadToS3 } from "../utils/s3Upload.js";
import {
  createPortfolioItem,
  getAllPortfolioItems,
  getPortfolioItemById,
  updatePortfolioItem,
  deletePortfolioItem,
} from "../controllers/portfolioController.js";

const router = express.Router();

const handleUpload = (req, res, next) => {
  const type = req.query.type || req.body.type;

  // Support uploading multiple fields
  const fields = [
    { name: "image", maxCount: 1 }, // main image
    { name: "file", maxCount: 1 },  // pdf file
    { name: "files", maxCount: 25 } // details images
  ];

  return uploadToS3.fields(fields)(req, res, next);
};

// CREATE
router.post("/", handleUpload, createPortfolioItem);

// READ
router.get("/", getAllPortfolioItems);
router.get("/:id", getPortfolioItemById);

// UPDATE
router.put("/:id", handleUpload, updatePortfolioItem);

// DELETE
router.delete("/:id", deletePortfolioItem);

export default router;
