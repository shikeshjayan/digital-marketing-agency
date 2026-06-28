// Routes for admin authentication and profile management
import express from "express";
import { registerAdmin, loginAdmin, getAdminProfile, logoutAdmin, updateAdminProfile } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.js";
import upload, { processImage } from "../config/upload.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", protect, getAdminProfile);
// Update name, email, photo (file upload), and/or password
router.put("/profile", protect, upload.single("photo"), processImage, updateAdminProfile);
router.post("/logout", protect, logoutAdmin);


export default router;
