import express from 'express';
import authAdmin from '../middleware/authAdmin.js';
import { getDashboardStats } from '../controllers/statsController.js';

const router = express.Router();

// All routes are protected
router.use(authAdmin);

// Get dashboard statistics
router.get('/', getDashboardStats);

export default router;
