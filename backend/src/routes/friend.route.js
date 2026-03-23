import express from "express";
import { protectRoute } from "../middlewares/auth.midddleware.js";
import {
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    getFriendRequests,
} from "../controllers/friend.controller.js";

const router = express.Router();

router.get("/search", protectRoute, searchUsers);
router.get("/requests", protectRoute, getFriendRequests);
router.post("/send/:userId", protectRoute, sendFriendRequest);
router.post("/accept/:userId", protectRoute, acceptFriendRequest);
router.post("/decline/:userId", protectRoute, declineFriendRequest);
router.post("/cancel/:userId", protectRoute, cancelFriendRequest);

export default router;