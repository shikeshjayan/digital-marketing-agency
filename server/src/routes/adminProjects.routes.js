// Routes for admin to manage projects
import express from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  deleteAllProjects,
  getAllAdminProjects,
  getProjectCategories,
} from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.js";
import upload, { processImage } from "../config/upload.js";

const router = express.Router();

router.get("/", protect, getAllAdminProjects);
router.get("/categories", protect, getProjectCategories);
router.post("/create", protect, upload.single("image"), processImage, createProject);
router.put("/:id", protect, upload.single("image"), processImage, updateProject);
router.delete("/:id", protect, deleteProject);
router.delete("/", protect, deleteAllProjects);

export default router;
