import { Router } from "express";
import {
  getAllAdminFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  deleteAllFAQs,
} from "../controllers/faq.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", getAllAdminFAQs);
router.post("/create", createFAQ);
router.put("/:id", updateFAQ);
router.delete("/:id", deleteFAQ);
router.delete("/", deleteAllFAQs);

export default router;
