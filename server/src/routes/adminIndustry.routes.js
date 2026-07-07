// Routes for admin to manage industries
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

const router = express.Router();

router.get("/", protect, getAllAdminIndustries);
router.get("/:id", protect, getIndustryById);
router.post("/create", protect, createIndustry);
router.put("/:id", protect, updateIndustry);
router.delete("/:id", protect, deleteIndustry);
router.delete("/", protect, deleteAllIndustries);

export default router;
