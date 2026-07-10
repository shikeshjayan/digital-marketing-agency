// Routes for admin to manage industries (with icon upload)
import express from "express";
import {
  createIndustry,
  updateIndustry,
  deleteIndustry,
  deleteAllIndustries,
  getAllAdminIndustries,
  getIndustryById,
} from "../controllers/industry.controller.js";
import { protect } from "../middleware/auth.js";
import upload, { processImage } from "../config/upload.js";

const router = express.Router();

router.get("/", protect, getAllAdminIndustries);
router.get("/:id", protect, getIndustryById);
router.post("/create", protect, upload.single("icon"), processImage, createIndustry);
router.put("/:id", protect, upload.single("icon"), processImage, updateIndustry);
router.delete("/:id", protect, deleteIndustry);
router.delete("/", protect, deleteAllIndustries);

export default router;
