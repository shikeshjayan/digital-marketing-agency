// Routes for admin to manage contact enquiries
import express from "express";
import {
  getAdminEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  deleteAllEnquiries,
} from "../controllers/contact.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAdminEnquiries);
router.patch("/:id/status", protect, updateEnquiryStatus);
router.delete("/:id", protect, deleteEnquiry);
router.delete("/", protect, deleteAllEnquiries);

export default router;
