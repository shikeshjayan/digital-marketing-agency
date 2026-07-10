import express from "express";
import {
  getBrandSettings,
  updateBrandSettings,
  seedBrandSettings,
} from "../controllers/brandSettings.controller.js";
import { protect } from "../middleware/auth.js";
import upload, { processImage } from "../config/upload.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "brand_logo", maxCount: 1 },
]);

router.get("/", protect, getBrandSettings);
router.put("/", protect, uploadFields, processImage, updateBrandSettings);
router.post("/seed", protect, seedBrandSettings);

export default router;
