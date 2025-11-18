import express from 'express';
import { login, logout, me } from '../controllers/authController.js';
import authAdmin from '../middleware/authAdmin.js';

const router = express.Router();

// Public Admin Auth Routes
router.post('/auth/login', login);
router.post('/auth/logout', logout);

// Protected Admin Routes
router.get('/auth/me', authAdmin, me);

export default router;