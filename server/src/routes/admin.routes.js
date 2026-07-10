// Routes for admin authentication and profile management
import express from "express";
import { registerAdmin, loginAdmin, getAdminProfile, logoutAdmin, updateAdminProfile, forgotPassword, verifyOTP, checkAdminExists, checkEmailExists } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.js";
import { registerRules, loginRules, forgotPasswordRules, resetPasswordRules, validateRequest } from "../middleware/validators.js";
import upload, { processImage } from "../config/upload.js";

const router = express.Router();

router.get("/check", checkAdminExists);
router.post("/check-email", checkEmailExists);
router.post("/register", registerRules, validateRequest, registerAdmin);
router.post("/login", loginRules, validateRequest, loginAdmin);
router.get("/profile", protect, getAdminProfile);
// Update name, email, photo (file upload), and/or password
router.put("/profile", protect, upload.single("photo"), processImage, updateAdminProfile);
router.post("/logout", protect, logoutAdmin);

// Forgot password - OTP based (public, no auth required)
router.post("/forgot-password", forgotPasswordRules, validateRequest, forgotPassword);
router.post("/verify-otp", resetPasswordRules, validateRequest, verifyOTP);

export default router;
