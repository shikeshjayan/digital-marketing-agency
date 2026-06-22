import express from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  getAllAdminProjects,
} from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAllAdminProjects);
router.post("/create", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
