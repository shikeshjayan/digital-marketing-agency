// Routes for admin to manage technologies (with icon upload)
import express from "express";
import {
  createTechnology,
  updateTechnology,
  deleteTechnology,
  deleteAllTechnologies,
  getAllAdminTechnologies,
  getTechnologyById,
} from "../controllers/technology.controller.js";
import { protect } from "../middleware/auth.js";
import upload, { processImage } from "../config/upload.js";

const router = express.Router();

router.get("/", protect, getAllAdminTechnologies);
router.get("/:id", protect, getTechnologyById);
router.post("/create", protect, upload.single("icon"), processImage, createTechnology);
router.put("/:id", protect, upload.single("icon"), processImage, updateTechnology);
router.delete("/:id", protect, deleteTechnology);
router.delete("/", protect, deleteAllTechnologies);

export default router;
