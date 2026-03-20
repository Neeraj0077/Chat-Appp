// import express from "express";
// import { login, signup, logout, home, checkAuth, updateProfile } from "../controllers/auth.controller.js"
// import { protectRoute } from "../middlewares/auth.midddleware.js";

// const router = express.Router();

// router.get("/home", home);

// router.post("/signup", signup);

// router.post("/login", login);

// router.post("/updateProfile", protectRoute, updateProfile);

// router.post("/logout", logout);

// router.get("/check", protectRoute, checkAuth);

// export default router;

import express from "express";
import { login, signup, logout, home, checkAuth, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.midddleware.js";

const router = express.Router();

router.get("/home", home);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile); // ← PUT not POST, hyphen not camelCase
router.get("/check", protectRoute, checkAuth);

export default router;

