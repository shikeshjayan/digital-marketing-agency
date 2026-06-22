import express from "express";
import { registerAdmin, loginAdmin, getAdminProfile, logoutAdmin } from "../controllers/admin.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", protect, getAdminProfile);
router.post("/logout", protect, logoutAdmin);


export default router;
