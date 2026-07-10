// Public routes - visitors can view published projects
import express from "express";
import {
  getAllProjects,
  getProjectById,
  getProjectBySlug,
} from "../controllers/project.controller.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/slug/:slug", getProjectBySlug);
router.get("/:id", getProjectById);

export default router;
