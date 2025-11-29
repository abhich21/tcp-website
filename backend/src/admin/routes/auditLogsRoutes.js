import express from 'express';
import authAdmin from '../middleware/authAdmin.js';
import { getAllAuditLogs } from '../controllers/auditLogsController.js';

const router = express.Router();

// All routes are protected
router.use(authAdmin);

// Get all audit logs
router.get('/', getAllAuditLogs);

export default router;
