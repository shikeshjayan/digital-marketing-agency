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

router.get("/enquiries", protect, getAdminEnquiries);
router.patch("/enquiries/status/:id", protect, updateEnquiryStatus);
router.delete("/enquiries/remove/:id", protect, deleteEnquiry);
router.delete("/enquiries", protect, deleteAllEnquiries);

export default router;
