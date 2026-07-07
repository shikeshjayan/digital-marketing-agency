// Routes for admin to manage projects
import express from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  deleteAllProjects,
  getAllAdminProjects,
} from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.js";
import upload, { processImage } from "../config/upload.js";

const router = express.Router();

const projectUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

router.get("/", protect, getAllAdminProjects);
router.post("/create", protect, projectUpload, processImage, createProject);
router.put("/:id", protect, projectUpload, processImage, updateProject);
router.delete("/:id", protect, deleteProject);
router.delete("/", protect, deleteAllProjects);

export default router;
