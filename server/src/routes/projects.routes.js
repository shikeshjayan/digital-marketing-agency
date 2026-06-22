import express from "express";
import {
  getAllProjects,
  getProjectById,
  getProjectsByCategory,
  validateCategory,
} from "../controllers/project.controller.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/category/:type", validateCategory, getProjectsByCategory);
router.get("/:id", getProjectById);

export default router;
