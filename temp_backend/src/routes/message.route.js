import express from 'express';
import { protectRoute } from '../middlewares/auth.midddleware.js';
import { getUsersForSidebar } from '../controllers/message.controller.js';
import { getMessages } from '../controllers/message.controller.js';
import { sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
export default router;

