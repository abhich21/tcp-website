import express from 'express';
import authAdmin from '../middleware/authAdmin.js';
import { getAllMessages, deleteMessage } from '../controllers/messagesController.js';

const router = express.Router();

// All routes are protected
router.use(authAdmin);

// Get all messages
router.get('/', getAllMessages);

// Delete a message
router.delete('/:id', deleteMessage);

export default router;
