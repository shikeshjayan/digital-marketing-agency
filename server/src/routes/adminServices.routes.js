// Routes for admin to manage services
import express from "express";
import { createService, updateService, deleteService, deleteAllServices, getAllAdminServices } from "../controllers/service.controller.js";
import { protect } from "../middleware/auth.js";
import upload, { processImage } from "../config/upload.js";

const router = express.Router();

router.get("/", protect, getAllAdminServices);
router.post("/create", protect, upload.single("image"), processImage, createService);
router.put("/:id", protect, upload.single("image"), processImage, updateService);
router.delete("/:id", protect, deleteService);
router.delete("/", protect, deleteAllServices);

export default router;
