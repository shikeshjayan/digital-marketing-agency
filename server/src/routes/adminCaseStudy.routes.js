import express from "express";
import {
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  deleteAllCaseStudies,
  getAllAdminCaseStudies,
  getCaseStudyById,
} from "../controllers/caseStudy.controller.js";
import { protect } from "../middleware/auth.js";
import upload, { processImage } from "../config/upload.js";

const router = express.Router();

const caseStudyUpload = upload.fields([
  { name: "hero_image", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

router.get("/", protect, getAllAdminCaseStudies);
router.get("/:id", protect, getCaseStudyById);
router.post("/create", protect, caseStudyUpload, processImage, createCaseStudy);
router.put("/:id", protect, caseStudyUpload, processImage, updateCaseStudy);
router.delete("/:id", protect, deleteCaseStudy);
router.delete("/", protect, deleteAllCaseStudies);

export default router;
