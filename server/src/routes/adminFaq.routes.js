import express from "express";
import {
  getAllAdminFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  deleteAllFAQs,
} from "../controllers/faq.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAllAdminFAQs);
router.post("/create", protect, createFAQ);
router.put("/:id", protect, updateFAQ);
router.delete("/:id", protect, deleteFAQ);
router.delete("/", protect, deleteAllFAQs);

export default router;
