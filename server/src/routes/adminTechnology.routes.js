// Routes for admin to manage technologies
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

const router = express.Router();

router.get("/", protect, getAllAdminTechnologies);
router.get("/:id", protect, getTechnologyById);
router.post("/create", protect, createTechnology);
router.put("/:id", protect, updateTechnology);
router.delete("/:id", protect, deleteTechnology);
router.delete("/", protect, deleteAllTechnologies);

export default router;
