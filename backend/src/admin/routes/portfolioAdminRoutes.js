import express from 'express';
import { uploadToS3 } from '../../utils/s3Upload.js';
import authAdmin from '../middleware/authAdmin.js';
import {
  createPortfolioItemAdmin,
  getAllPortfolioItemsAdmin,
  getPortfolioItemByIdAdmin,
  updatePortfolioItemAdmin,
  deletePortfolioItemAdmin,
  archivePortfolioItemAdmin,
  unarchivePortfolioItemAdmin,
  permanentDeletePortfolioItemAdmin
} from '../controllers/portfolioAdminController.js';

const router = express.Router();

// Configure Multer fields
const uploadFields = uploadToS3.fields([
  { name: 'image', maxCount: 1 },
  { name: 'files', maxCount: 10 },
]);

// --- Routes ---

// Create
router.post(
  '/',
  authAdmin,
  uploadFields,
  createPortfolioItemAdmin
);

// Read All
router.get(
  '/',
  authAdmin,
  getAllPortfolioItemsAdmin
);

// Read One
router.get(
  '/:id',
  authAdmin,
  getPortfolioItemByIdAdmin
);

// Update
router.put(
  '/:id',
  authAdmin,
  uploadFields,
  updatePortfolioItemAdmin
);

// Archive (Soft Delete)
router.put(
  '/:id/archive',
  authAdmin,
  archivePortfolioItemAdmin
);

// Unarchive (Restore)
router.put(
  '/:id/unarchive',
  authAdmin,
  unarchivePortfolioItemAdmin
);

// Standard Delete (Likely redundant if using Archive/Permanent, but kept for API compatibility)
router.delete(
  '/:id',
  authAdmin,
  deletePortfolioItemAdmin
);

// Permanent Delete (Hard Delete)
router.delete(
  '/:id/permanent',
  authAdmin,
  permanentDeletePortfolioItemAdmin
);

export default router;